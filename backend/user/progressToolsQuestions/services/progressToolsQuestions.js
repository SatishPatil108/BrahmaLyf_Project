import connection from "../../../database/database.js";

// Check if user already submitted tools response for today
export const checkUserAlreadySubmittedToolsService = (
  userId,
  courseId,
  weekNo,
  dayNo,
) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT id, user_response, status
      FROM bm.user_tools_progress
      WHERE user_id = $1
        AND course_id = $2
        AND week_no = $3
        AND day_no = $4
      LIMIT 1;
    `;

    connection.query(
      query,
      [userId, courseId, weekNo, dayNo],
      (err, result) => {
        if (err) return reject(err);

        if (result.rows.length) {
          return resolve({
            alreadySubmitted: true,
            data: result.rows[0],
          });
        }

        return resolve({ alreadySubmitted: false });
      },
    );
  });
};

// Fetch tools questions with options using active week from cron state
export const getToolsQuestionsService = async (courseId) => {
  try {
    courseId = parseInt(courseId, 10);

    if (isNaN(courseId)) {
      throw new Error("Invalid courseId");
    }

    // STEP 1: Get active week from tools cron state
    const stateQuery = `
      SELECT week_no 
      FROM bm.tools_cron_state 
      WHERE course_id = $1
    `;

    const stateResult = await connection.query(stateQuery, [courseId]);

    const activeWeekNo =
      stateResult.rows.length > 0 ? stateResult.rows[0].week_no : 1;

    // STEP 2: Fetch tools questions for that week
    const query = `
      SELECT 
      q.id AS question_id,
      q.tools_question AS question_text,
      q.day_no
      FROM bm.progress_tools q
      WHERE q.week_no = $1 
      AND q.course_id = $2
      AND q.status = 1
      ORDER BY q.day_no, q.id;
    `;

    const result = await connection.query(query, [activeWeekNo, courseId]);
    const rows = result.rows;

    if (!rows.length) {
      console.warn(
        `[SERVICE] No tools questions found for Course ${courseId} — Week ${activeWeekNo}`,
      );
      return -1;
    }

    // STEP 3: Format data grouped by day — no options mapping needed
    const daysMap = {};

    rows.forEach((row) => {
      if (!daysMap[row.day_no]) {
        daysMap[row.day_no] = [];
      }

      daysMap[row.day_no].push({
        id: row.question_id,
        question_text: row.question_text,
      });
    });

    const formattedData = Object.entries(daysMap).map(
      ([day_no, questions]) => ({
        day_no: parseInt(day_no),
        questions,
      }),
    );

    return {
      week_no: activeWeekNo,
      total_days: formattedData.length,
      data: formattedData,
    };
  } catch (err) {
    console.error("Error fetching tools questions:", err);
    throw err;
  }
};

// Get user's previously submitted tools responses
export const getUserToolsResponseService = (userId, courseId) => {
  return new Promise((resolve, reject) => {
    if (!userId || !courseId) {
      return reject(new Error("userId and courseId are required"));
    }

    const query = `
      SELECT 
        id,
        user_id,
        course_id,
        week_no,
        day_no,
        user_response
      FROM bm.user_tools_progress
      WHERE user_id = $1
        AND course_id = $2
      ORDER BY week_no, day_no
    `;

    connection.query(query, [userId, courseId], (err, result) => {
      if (err) return reject(err);

      const rows = result.rows || [];

      const formattedData = rows.map((row) => {
        let parsed = row.user_response || {};

        if (typeof parsed === "string") {
          try {
            parsed = JSON.parse(parsed);
          } catch {
            parsed = {};
          }
        }

        // Tools = plain text answers only, no optionId or multipleAnswers
        const answers = Object.keys(parsed).map((qId) => ({
          questionId: Number(qId),
          textAnswer: parsed[qId],
        }));

        return {
          id: row.id,
          user_id: row.user_id,
          course_id: row.course_id,
          week_no: row.week_no,
          day_no: row.day_no,
          answers,
        };
      });

      resolve(formattedData);
    });
  });
};

// Submit user tools response for a given weekNo, dayNo, courseId
export const postUserToolsResponseService = (
  userId,
  courseId,
  dayNo,
  weekNo,
  answers,
) => {
  return new Promise((resolve, reject) => {
    // answers is an array from the controller
    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return reject(new Error("Answers cannot be empty"));
    }

    // Convert array to object: { questionId: textAnswer }
    const answersMap = answers.reduce((acc, { questionId, textAnswer }) => {
      acc[questionId] = textAnswer;
      return acc;
    }, {});

    const query = `
      INSERT INTO bm.user_tools_progress (
        user_id,
        course_id,
        week_no,
        day_no,
        progress_date,
        user_response,
        status,
        created_on,
        updated_on
      )
      VALUES ($1, $2, $3, $4, NOW(), $5::jsonb, 1, NOW(),NOW())
      ON CONFLICT (user_id, course_id, week_no, day_no)
      DO UPDATE SET
        user_response = bm.user_tools_progress.user_response || EXCLUDED.user_response
      RETURNING *
    `;

    connection.query(
      query,
      [userId, courseId, weekNo, dayNo, JSON.stringify(answersMap)],
      (err, result) => {
        if (err) return reject(err);
        resolve(result.rows?.[0] || null);
      },
    );
  });
};

export const updateUserToolsResponseService = async (
  userId,
  courseId,
  weekNo,
  dayNo,
  questionId,
  textAnswer,
) => {
  try {
    const selectQuery = `
      SELECT *
      FROM bm.user_tools_progress
      WHERE user_id = $1
        AND course_id = $2
        AND week_no = $3
        AND day_no = $4
    `;

    const existingResult = await connection.query(selectQuery, [
      userId,
      courseId,
      weekNo,
      dayNo,
    ]);

    if (existingResult.rows.length === 0) {
      return -1;
    }

    const existingRow = existingResult.rows[0];

    let userResponse = existingRow.user_response || {};

    // Update answer
    userResponse[questionId] = textAnswer;

    const updateQuery = `
      UPDATE bm.user_tools_progress
      SET user_response = $1::jsonb,
          updated_on = NOW()
      WHERE user_id = $2
        AND course_id = $3
        AND week_no = $4
        AND day_no = $5
      RETURNING *
    `;

    const { rows } = await connection.query(updateQuery, [
      JSON.stringify(userResponse),
      userId,
      courseId,
      weekNo,
      dayNo,
    ]);

    return rows[0];
  } catch (err) {
    console.error("updateUserToolsResponseService error:", err);
    return -1;
  }
};
