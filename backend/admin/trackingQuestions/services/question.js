import connection from "../../../database/database.js";

export const getProgressTrackingQuestionService = (questionId) => {
  return new Promise((resolve, reject) => {
    const query = `
            SELECT *
            FROM bm.progress_tracking_questions
            WHERE id = $1
              AND status = 1
            LIMIT 1;
        `;
    connection.query(query, [questionId], (err, result) => {
      if (err) return reject(err);
      resolve(result.rows?.[0] || null);
    });
  });
};

export const getAllProgressTrackingQuestionsService = (week_no, day_no) => {
  return new Promise((resolve, reject) => {
    // Validate week_no and day_no
    week_no = parseInt(week_no, 10);
    day_no = parseInt(day_no, 10);

    if (!week_no || week_no < 1) return reject({ message: "Invalid week_no" });
    if (!day_no || day_no < 1) return reject({ message: "Invalid day_no" });

    //  Count query — total questions for this week/day group
    const countQuery = `
      SELECT COUNT(*) AS total_questions
      FROM bm.progress_tracking_questions
      WHERE status = 1
        AND week_no = $1
        AND day_no = $2
    `;

    connection.query(countQuery, [week_no, day_no], (err, countResult) => {
      if (err) return reject(err);

      const totalQuestions = parseInt(countResult.rows[0].total_questions, 10);

      //  Data query
      const dataQuery = `
        SELECT
          q.id AS question_id,
          q.question_text,
          q.option_type,
          q.week_no,
          q.day_no,
          q.course_id
        FROM bm.progress_tracking_questions q
        WHERE q.status = 1
          AND q.week_no = $1
          AND q.day_no = $2
        ORDER BY q.id ASC
      `;

      connection.query(dataQuery, [week_no, day_no], (err, dataResult) => {
        if (err) return reject(err);

        return resolve({
          week_no,
          day_no,
          total_questions: totalQuestions,
          questions: dataResult.rows || [],
        });
      });
    });
  });
};

export const postProgressTrackingQuestionService = (
  question_text,
  option_type,
  week_no,
  day_no,
  course_id 
) => {
  return new Promise((resolve, reject) => {
    const query = `
            INSERT INTO bm.progress_tracking_questions (
                question_text,
                option_type,
                week_no,
                day_no,
                course_id,
                status,
                created_on,
                updated_on
            )
            VALUES ($1, $2, $3, $4, $5, 1, NOW(), NOW())
            RETURNING *;
        `;
    connection.query(
      query,
      [question_text, option_type, week_no, day_no, course_id],
      (err, result) => {
        if (err) return reject(err);
        resolve(result.rows?.[0] || null);
      },
    );
  });
};

export const updateProgressTrackingQuestionService = (
  question_id,
  question_text,
  option_type,
  week_no,
  day_no,
) => {
  return new Promise((resolve, reject) => {
    const query = `
            UPDATE bm.progress_tracking_questions
            SET
                question_text = $1,
                option_type = $2,
                week_no = $3,
                day_no = $4,
                updated_on = NOW()
            WHERE id = $5
              AND status = 1
            RETURNING *;
        `;
    const values = [question_text, option_type, week_no, day_no, question_id];

    connection.query(query, values, (err, result) => {
      if (err) return reject(err);
      resolve(result.rows?.[0] || null);
    });
  });
};

export const deleteProgressTrackingQuestionService = (questionId) => {
  return new Promise((resolve, reject) => {
    const query = `
            UPDATE bm.progress_tracking_questions
            SET 
                status = 0,
                updated_on = NOW()
            WHERE id = $1
            RETURNING *;
        `;
    connection.query(query, [questionId], (err, result) => {
      if (err) return reject(err);
      resolve(result.rows?.[0] || null);
    });
  });
};
