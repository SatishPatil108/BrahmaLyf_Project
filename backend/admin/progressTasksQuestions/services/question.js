import connection from "../../../database/database.js";

export const getProgressTasksQuestionService = (questionId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        q.*,
        o.options
      FROM bm.progress_practice_questions q
      LEFT JOIN bm.progress_practice_options o 
        ON o.question_id = q.id
      WHERE q.id = $1
        AND q.status = 1
      LIMIT 1;
    `;
    connection.query(query, [questionId], (err, result) => {
      if (err) return reject(err);
      resolve(result.rows?.[0] || null);
    });
  });
};

export const getAllProgressTasksQuestionsService = (
  course_id,
  week_no,
  day_no,
) => {
  return new Promise((resolve, reject) => {
    // Validate inputs
    course_id = parseInt(course_id, 10);
    week_no = parseInt(week_no, 10);
    day_no = parseInt(day_no, 10);

    if (!course_id || course_id < 1) {
      return reject({ message: "Invalid course_id" });
    }

    if (!week_no || week_no < 1) {
      return reject({ message: "Invalid week_no" });
    }

    if (!day_no || day_no < 1) {
      return reject({ message: "Invalid day_no" });
    }

    // Count query — total questions for this course/week/day
    const countQuery = `
      SELECT COUNT(*) AS total_questions
      FROM bm.progress_practice_questions
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

        const totalQuestions = parseInt(
          countResult.rows[0].total_questions,
          10,
        );

        // Data query
        const dataQuery = `
          SELECT
            q.id AS question_id,
            q.question_text,
            q.option_type,
            q.week_no,
            q.day_no,
            q.course_id,
            o.options
          FROM bm.progress_practice_questions q
          LEFT JOIN bm.progress_practice_options o
            ON o.question_id = q.id
          WHERE q.status = 1
            AND q.course_id = $1
            AND q.week_no = $2
            AND q.day_no = $3
          ORDER BY q.id ASC
        `;

        connection.query(
          dataQuery,
          [course_id, week_no, day_no],
          (err, dataResult) => {
            if (err) return reject(err);

            return resolve({
              course_id,
              week_no,
              day_no,
              total_questions: totalQuestions,
              questions: dataResult.rows || [],
            });
          },
        );
      },
    );
  });
};

export const postProgressTasksQuestionService = (
  question_text,
  option_type,
  week_no,
  day_no,
  course_id,
  options = [],
) => {
  return new Promise((resolve, reject) => {
    // 1. Insert the question first
    const questionQuery = `
      INSERT INTO bm.progress_practice_questions (
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
      questionQuery,
      [question_text, option_type, week_no, day_no, course_id],
      async (err, result) => {
        if (err) return reject(err);

        const question = result.rows?.[0] || null;
        if (!question) return resolve(null);

        const question_id = question.id;

        // 2. Insert options only for Radio (2), Dropdown (3), Multiple Select (4)
        if ([2, 3, 4].includes(Number(option_type)) && Array.isArray(options)) {
          const filteredOptions = options.filter((o) => o.trim() !== "");

          if (filteredOptions.length === 0) {
            return resolve({ ...question, options: [] });
          }

          try {
            const optionQuery = `
            INSERT INTO bm.progress_practice_options (
            question_id,
            options,
            option_order,
            status,
            created_on,
            updated_on
          )
          VALUES ($1, $2, $3, 1, NOW(), NOW())
          RETURNING *;
         `;

            // Single insert — pass the whole array as $2
            await new Promise((res, rej) => {
              connection.query(
                optionQuery,
                [question_id, filteredOptions, 1],
                (optErr, optResult) => {
                  if (optErr) return rej(optErr);
                  res(optResult.rows?.[0] || null);
                },
              );
            });

            resolve({ ...question, options: filteredOptions });
          } catch (optionErr) {
            console.error("Error inserting options:", optionErr);
            reject(optionErr);
          }
        } else {
          resolve({ ...question, options: [] });
        }
      },
    );
  });
};

export const updateProgressTasksQuestionService = (
  question_id,
  question_text,
  option_type,
  week_no,
  day_no,
  course_id,
  options = [],
) => {
  return new Promise((resolve, reject) => {
    // 1. Update the question
    const questionQuery = `
      UPDATE bm.progress_practice_questions
      SET
        question_text = $1,
        option_type   = $2,
        week_no       = $3,
        day_no        = $4,
        course_id     = $5,
        updated_on    = NOW()
      WHERE id = $6
      RETURNING *;
    `;

    connection.query(
      questionQuery,
      [question_text, option_type, week_no, day_no, course_id, question_id],
      async (err, result) => {
        if (err) return reject(err);

        const question = result.rows?.[0] || null;
        if (!question) return resolve(null);

        // 2. Handle options for Radio (2), Dropdown (3), Multiple Select (4)
        if ([2, 3, 4].includes(Number(option_type))) {
          const filteredOptions = Array.isArray(options)
            ? options.filter((o) => o.trim() !== "")
            : [];

          try {
            // 3. Delete old options first
            await new Promise((res, rej) => {
              connection.query(
                `DELETE FROM bm.progress_practice_options WHERE question_id = $1`,
                [question_id],
                (delErr) => {
                  if (delErr) return rej(delErr);
                  res();
                },
              );
            });

            // 4. Insert new options in parallel

            if (filteredOptions.length > 0) {
              await new Promise((res, rej) => {
                const optionQuery = `
                 INSERT INTO bm.progress_practice_options (
                 question_id,
                 options,
                 option_order,
                 status,
                 created_on,
                 updated_on
             )
              VALUES ($1, $2, $3, 1, NOW(), NOW())
              RETURNING *;
             `;
                connection.query(
                  optionQuery,
                  [question_id, filteredOptions, 1],
                  (optErr, optResult) => {
                    if (optErr) return rej(optErr);
                    res(optResult.rows?.[0] || null);
                  },
                );
              });
            }

            resolve({ ...question, options: filteredOptions });
          } catch (optionErr) {
            console.error("Error updating options:", optionErr);
            reject(optionErr);
          }
        } else {
          // 5. If switched to Text (1) or Rating (5), delete any existing options
          connection.query(
            `DELETE FROM bm.progress_practice_options WHERE question_id = $1`,
            [question_id],
            (delErr) => {
              if (delErr) return reject(delErr);
              resolve({ ...question, options: [] });
            },
          );
        }
      },
    );
  });
};

export const deleteProgressTasksQuestionService = (questionId) => {
  return new Promise((resolve, reject) => {
    const query = `
            UPDATE bm.progress_practice_questions
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

// service files for themes and completed message

export const getProgressPracticeMessageService = (messageId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        *
      FROM bm.progress_practice_themes
      WHERE id = $1
        AND status = 1
      LIMIT 1;
    `;

    connection.query(query, [messageId], (err, result) => {
      if (err) {
        console.error("Error fetching progress message:", err);
        return reject(err);
      }
      resolve(result.rows?.[0] || null);
    });
  });
};

// Get All Progress Practice Messages
export const getAllProgressPracticeMessagesService = (course_id, week_no) => {
  return new Promise((resolve, reject) => {
    course_id = parseInt(course_id, 10);
    week_no = parseInt(week_no, 10);

    if (!course_id || course_id < 1) {
      return reject({ message: "Invalid course_id" });
    }

    if (!week_no || week_no < 1) {
      return reject({ message: "Invalid week_no" });
    }

    const dataQuery = `
        SELECT
          q.id AS theme_id,
          q.week_no,
          q.course_id,
          q.themes,
          q.weekly_target,
          q.outcomes,
          q.outcome_order
        FROM bm.progress_practice_themes q
        WHERE q.status = 1
          AND q.course_id = $1
          AND q.week_no = $2
        ORDER BY q.outcome_order ASC, q.id ASC
      `;

    connection.query(dataQuery, [course_id, week_no], (err, dataResult) => {
      if (err) return reject(err);

      resolve({
        course_id,
        week_no,
        themes: dataResult.rows || [],
      });
    });
  });
};

// Create Progress Practice Message
export const postProgressPracticeMessageService = (
  week_no,
  course_id,
  themes,
  weekly_target,
  outcomes,
  outcome_order = 1,
) => {
  return new Promise((resolve, reject) => {
    const messageQuery = `
      INSERT INTO bm.progress_practice_themes (
        week_no,
        course_id,
        themes,
        weekly_target,
        outcomes,
        outcome_order,
        created_on,
        updated_on,
        status
      )
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW(), 1)
      RETURNING *;
    `;

    connection.query(
      messageQuery,
      [week_no, course_id, themes, weekly_target, outcomes, outcome_order],
      (err, result) => {
        if (err) return reject(err);
        resolve(result.rows?.[0] || null);
      },
    );
  });
};

// Update Progress Practice Message
export const updateProgressPracticeMessageService = (
  theme_id,
  week_no,
  course_id,
  themes,
  weekly_target,
  outcomes,
  outcome_order = 1,
) => {
  return new Promise((resolve, reject) => {
    const messageQuery = `
      UPDATE bm.progress_practice_themes
      SET
        week_no = $2,
        course_id = $3,
        themes = $4,
        weekly_target = $5,
        outcomes = $6,
        outcome_order = $7,
        updated_on = NOW()
      WHERE id = $1
      RETURNING *;
    `;

    connection.query(
      messageQuery,
      [
        theme_id,
        week_no,
        course_id,
        themes,
        weekly_target,
        outcomes,
        outcome_order,
      ],
      (err, result) => {
        if (err) return reject(err);
        resolve(result.rows?.[0] || null);
      },
    );
  });
};

export const deleteProgressPracticeMessageService = (themeId) => {
  return new Promise((resolve, reject) => {
    const query = `
            UPDATE bm.progress_practice_themes
            SET 
                status = 0,
                updated_on = NOW()
            WHERE id = $1
            RETURNING *;
        `;
    connection.query(query, [themeId], (err, result) => {
      if (err) return reject(err);
      resolve(result.rows?.[0] || null);
    });
  });
};

// services for completed message
export const getCompletedMessageService = (messageId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        *
      FROM bm.completion_messages
      WHERE id = $1
        AND status = 1
      LIMIT 1;
    `;

    connection.query(query, [messageId], (err, result) => {
      if (err) {
        console.error("Error fetching progress message:", err);
        return reject(err);
      }
      resolve(result.rows?.[0] || null);
    });
  });
};

// Get All Completed Messages
export const getAllCompletedMessagesService = (course_id, week_no, day_no) => {
  return new Promise((resolve, reject) => {
    course_id = parseInt(course_id, 10);
    week_no = parseInt(week_no, 10);
    day_no = parseInt(day_no, 10);

    if (!course_id || course_id < 1)
      return reject({ message: "Invalid course_id" });
    if (!week_no || week_no < 1) return reject({ message: "Invalid week_no" });
    if (!day_no || day_no < 1) return reject({ message: "Invalid day_no" });

    const dataQuery = `
      SELECT
        q.id AS message_id,
        q.course_id,
        q.week_no,
        q.day_no,
        q.short_intro,
        q.completed_message
      FROM bm.completion_messages q
      WHERE q.status = 1
        AND q.course_id = $1
        AND q.week_no = $2
        AND q.day_no = $3
      ORDER BY q.id ASC
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
          messages: dataResult.rows || [],
        });
      },
    );
  });
};

// Create Completed Message
export const postCompletedMessageService = (
  course_id,
  week_no,
  day_no,
  short_intro,
  completed_message,
) => {
  return new Promise((resolve, reject) => {
    const messageQuery = `
      INSERT INTO bm.completion_messages (
        course_id,
        week_no,
        day_no,
        short_intro,
        completed_message,
        created_on,
        updated_on,
        status
      )
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW(), 1)
      RETURNING *;
    `;

    connection.query(
      messageQuery,
      [course_id, week_no, day_no, short_intro, completed_message],
      (err, result) => {
        if (err) return reject(err);
        resolve(result.rows?.[0] || null);
      },
    );
  });
};

// Update Completed Message
export const updateCompletedMessageService = (
  message_id,
  course_id,
  week_no,
  day_no,
  short_intro,
  completed_message,
) => {
  return new Promise((resolve, reject) => {
    const messageQuery = `
      UPDATE bm.completion_messages
      SET
        course_id = $2,
        week_no = $3,
        day_no = $4,
        short_intro = $5,
        completed_message = $6,
        updated_on = NOW()
      WHERE id = $1
      RETURNING *;
    `;

    connection.query(
      messageQuery,
      [message_id, course_id, week_no, day_no, short_intro, completed_message],
      (err, result) => {
        if (err) return reject(err);
        resolve(result.rows?.[0] || null);
      },
    );
  });
};

export const deleteCompletedMessageService = (messageId) => {
  return new Promise((resolve, reject) => {
    const query = `
            UPDATE bm.completion_messages
            SET 
                status = 0,
                updated_on = NOW()
            WHERE id = $1
            RETURNING *;
        `;
    connection.query(query, [messageId], (err, result) => {
      if (err) return reject(err);
      resolve(result.rows?.[0] || null);
    });
  });
};
