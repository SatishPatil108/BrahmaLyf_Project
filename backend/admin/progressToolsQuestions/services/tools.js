import connection from "../../../database/database.js";

// ✅ Get single tool
export const getProgressToolsQuestionService = (toolsQuestionId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT *
      FROM bm.progress_tools
      WHERE id = $1
        AND status = 1
      LIMIT 1;
    `;

    connection.query(query, [toolsQuestionId], (err, result) => {
      if (err) return reject(err);
      resolve(result.rows?.[0] || null);
    });
  });
};

// ✅ Get all tools (by week/day)
export const getAllProgressToolsQuestionsService = (
  course_id,
  week_no,
  day_no,
) => {
  return new Promise((resolve, reject) => {
    // Convert to integers
    course_id = parseInt(course_id, 10);
    week_no = parseInt(week_no, 10);
    day_no = parseInt(day_no, 10);

    // Validate inputs
    if (!course_id || course_id < 1) {
      return reject({ message: "Invalid course_id" });
    }

    if (!week_no || week_no < 1) {
      return reject({ message: "Invalid week_no" });
    }

    if (!day_no || day_no < 1) {
      return reject({ message: "Invalid day_no" });
    }

    // Count total tools for this course/week/day
    const countQuery = `
      SELECT COUNT(*) AS total_tools
      FROM bm.progress_tools
      WHERE status = 1
        AND course_id = $1
        AND week_no = $2
        AND day_no = $3
    `;

    connection.query(
      countQuery,
      [course_id, week_no, day_no],
      (err, countResult) => {
        if (err) return reject(err);

        const totalTools = parseInt(countResult.rows[0].total_tools, 10);

        // Fetch tool questions
        const dataQuery = `
          SELECT
            id AS tools_question_id,
            tools_question,
            week_no,
            day_no,
            course_id
          FROM bm.progress_tools
          WHERE status = 1
            AND course_id = $1
            AND week_no = $2
            AND day_no = $3
          ORDER BY id ASC;
        `;

        connection.query(
          dataQuery,
          [course_id, week_no, day_no],
          (err, dataResult) => {
            if (err) return reject(err);

            resolve({
              course_id,
              week_no,
              day_no,
              total_tools: totalTools,
              tools: dataResult.rows || [],
            });
          },
        );
      },
    );
  });
};

// ✅ Create tool (NO options logic)
export const postProgressToolsQuestionService = (
  tools_question,
  week_no,
  day_no,
  course_id,
) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO bm.progress_tools (
        tools_question,
        week_no,
        day_no,
        course_id,
        status,
        created_on,
        updated_on
      )
      VALUES ($1, $2, $3, $4, 1, NOW(), NOW())
      RETURNING *;
    `;

    connection.query(
      query,
      [tools_question, week_no, day_no, course_id],
      (err, result) => {
        if (err) return reject(err);
        resolve(result.rows?.[0] || null);
      },
    );
  });
};

// ✅ Update tool
export const updateProgressToolsQuestionService = (
  tools_question_id,
  tools_question,
  week_no,
  day_no,
  course_id,
) => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE bm.progress_tools
      SET
        tools_question = $1,
        week_no        = $2,
        day_no         = $3,
        course_id      = $4,
        updated_on     = NOW()
      WHERE id = $5
      RETURNING *;
    `;

    connection.query(
      query,
      [tools_question, week_no, day_no, course_id, tools_question_id],
      (err, result) => {
        if (err) return reject(err);
        resolve(result.rows?.[0] || null);
      },
    );
  });
};

// ✅ Soft delete
export const deleteProgressToolsQuestionService = (toolsQuestionId) => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE bm.progress_tools
      SET 
        status = 0,
        updated_on = NOW()
      WHERE id = $1
      RETURNING *;
    `;

    connection.query(query, [toolsQuestionId], (err, result) => {
      if (err) return reject(err);
      resolve(result.rows?.[0] || null);
    });
  });
};
