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

export const getQuestionsWithOptionsService = (weekNo, dayNo, courseId) => {
  return new Promise((resolve, reject) => {
    weekNo = parseInt(weekNo, 10);
    dayNo = parseInt(dayNo, 10);
    courseId = parseInt(courseId, 10);

    const query = `
      SELECT 
        q.id AS question_id,
        q.question_text,
        q.option_type,
        o.id AS option_id,
        o.options AS option_text,
        o.option_order
      FROM bm.progress_tracking_questions q
      LEFT JOIN bm.progress_tracking_options o 
        ON q.id = o.question_id
      WHERE q.week_no = $1 
        AND q.day_no = $2
        AND q.course_id = $3
        AND q.status = 1
      ORDER BY q.id, o.option_order;
    `;

    connection.query(query, [weekNo, dayNo, courseId], (err, result) => {
      if (err) {
        console.error("Error fetching questions:", err);
        return reject(err);
      }

      const rows = result.rows;

      if (!rows.length) {
        return resolve(-1);
      }

      // Convert flat → nested
      const questionsMap = {};

      rows.forEach((row) => {
        if (!questionsMap[row.question_id]) {
          questionsMap[row.question_id] = {
            id: row.question_id,
            question_text: row.question_text,
            option_type: row.option_type,
            options: [],
          };
        }

        if (row.option_id) {
          questionsMap[row.question_id].options.push({
            id: row.option_id,
            text: row.option_text,
            order: row.option_order,
          });
        }
      });

      const formattedData = Object.values(questionsMap);

      return resolve({
        weekNo,
        dayNo,
        total_questions: formattedData.length,
        questions: formattedData,
      });
    });
  });
};

// fetch next progress (week/day) for user
export const getNextUserProgressService = async (
  userId,
  courseId,
  currentWeekNo,
  currentDayNo,
) => {
  try {
    // Check current day is actually completed
    const current = await UserProgress.findOne({
      where: {
        user_id: userId,
        course_id: courseId,
        week_no: currentWeekNo,
        day_no: currentDayNo,
        status: "completed",
      },
    });

    if (!current) return -1; // Current day not completed yet

    // Determine next day/week
    const DAYS_PER_WEEK = 7; // adjust to your course structure

    let nextDayNo = currentDayNo + 1;
    let nextWeekNo = currentWeekNo;

    if (nextDayNo > DAYS_PER_WEEK) {
      nextDayNo = 1;
      nextWeekNo = currentWeekNo + 1;
    }

    // Fetch next day's questions
    const nextQuestions = await CourseQuestion.findAll({
      where: { course_id: courseId, week_no: nextWeekNo, day_no: nextDayNo },
    });

    if (!nextQuestions.length)
      return { completed: true, message: "Course fully completed!" };

    return {
      weekNo: nextWeekNo,
      dayNo: nextDayNo,
      questions: nextQuestions,
    };
  } catch (err) {
    console.error("getNextUserProgressService error:", err);
    return -1;
  }
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
      VALUES ($1, $2, $3, $4, NOW(), $5, 1, NOW())
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
