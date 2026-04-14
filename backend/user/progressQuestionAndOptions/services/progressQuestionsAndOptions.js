import connection from "../../../database/database.js";

export const checkUserAlreadySubmittedService = (
  userId,
  courseId,
  weekNo,
  dayNo,
) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT id, form_data, status
      FROM bm.user_progress
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

export const getQuestionsWithOptionsService = (courseId) => {
  return new Promise((resolve, reject) => {
    courseId = parseInt(courseId, 10);

    if (isNaN(courseId)) {
      return reject(new Error("Invalid courseId"));
    }

    const stateQuery = `
      SELECT week_no
      FROM bm.questions_cron_state
      WHERE course_id = $1
      LIMIT 1
    `;

    connection.query(stateQuery, [courseId], (stateErr, stateResult) => {
      if (stateErr) {
        console.error("Error fetching cron state:", stateErr);
        return reject(stateErr);
      }

      if (stateResult.rows.length === 0) {
        console.warn(`[SERVICE] No cron state found for course ${courseId}`);
        return resolve(-1);
      }

      const activeWeekNo = parseInt(stateResult.rows[0].week_no, 10);

      if (isNaN(activeWeekNo)) {
        console.error(`[SERVICE] Invalid week_no in DB for course ${courseId}`);
        return resolve(-1);
      }

      // ✅ Fix — always fetch week 1
      const targetWeekNo = 1;

      if (targetWeekNo < 1) {
        console.warn(
          `[SERVICE] No previous week available for course ${courseId}`,
        );
        return resolve(-1);
      }

      const query = `
        SELECT 
          q.id AS question_id,
          q.question_text,
          q.option_type,
          q.day_no,
          o.id AS option_id,
          o.options AS option_text,
          o.option_order
        FROM bm.progress_tracking_questions q
        LEFT JOIN bm.progress_tracking_options o 
          ON q.id = o.question_id
        WHERE q.week_no = $1 
          AND q.day_no BETWEEN 1 AND 7   -- ✅ All 7 days
          AND q.course_id = $2
          AND q.status = 1
        ORDER BY q.day_no, q.id, o.option_order;
      `;

      connection.query(query, [targetWeekNo, courseId], (err, result) => {
        if (err) {
          console.error("Error fetching questions:", err);
          return reject(err);
        }

        const rows = result.rows;

        if (!rows.length) {
          console.warn(
            `[SERVICE] No questions found for Course ${courseId} — Week ${targetWeekNo}`,
          );
          return resolve(-1);
        }

        // ✅ Group by day_no first, then by question
        const daysMap = {};

        rows.forEach((row) => {
          if (!daysMap[row.day_no]) {
            daysMap[row.day_no] = {};
          }

          if (!daysMap[row.day_no][row.question_id]) {
            daysMap[row.day_no][row.question_id] = {
              id: row.question_id,
              question_text: row.question_text,
              option_type: row.option_type,
              options: [],
            };
          }

          if (row.option_id) {
            daysMap[row.day_no][row.question_id].options.push({
              id: row.option_id,
              text: row.option_text,
              order: row.option_order,
            });
          }
        });

        // ✅ Format: array of { day_no, questions[] }
        const formattedData = Object.entries(daysMap).map(
          ([day_no, questionsMap]) => ({
            day_no: parseInt(day_no),
            questions: Object.values(questionsMap),
          }),
        );

        return resolve({
          week_no: targetWeekNo,
          total_days: formattedData.length,
          data: formattedData,
        });
      });
    });
  });
};

// submit user response for a given weekNo, dayNo, courseId
export const postUserResponseService = (
  userId,
  courseId,
  dayNo,
  weekNo,
  answers,
) => {
  return new Promise((resolve, reject) => {
    if (!answers || Object.keys(answers).length === 0) {
      return reject(new Error("Answers cannot be empty"));
    }

    const query = `
      INSERT INTO bm.user_progress (
        user_id,
        course_id,
        week_no,
        day_no,
        progress_date,
        form_data,
        status,
        created_on
      )
      VALUES ($1, $2, $3, $4, NOW(), $5::jsonb, 1, NOW())
      ON CONFLICT (user_id, course_id, week_no, day_no)
      DO UPDATE SET
        form_data = bm.user_progress.form_data || EXCLUDED.form_data
      RETURNING *
    `;

    connection.query(
      query,
      [userId, courseId, weekNo, dayNo, JSON.stringify(answers)],
      (err, result) => {
        if (err) return reject(err);
        resolve(result.rows?.[0] || null);
      },
    );
  });
};
