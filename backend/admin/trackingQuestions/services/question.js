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
        const query = `
            SELECT
                q.id AS question_id,
                q.question_text,
                q.answer_type,
                q.week_no,
                q.day_no
            FROM bm.progress_tracking_questions q
            WHERE q.status = 1
              AND q.week_no = $1
              AND q.day_no = $2
            ORDER BY q.id ASC
        `;
        connection.query(query, [week_no, day_no], (err, result) => {
            if (err) return reject(err);
            if (!result.rows.length) return resolve(-1);
            resolve(result.rows);
        });
    });
};


export const postProgressTrackingQuestionService = (question_text, answer_type, week_no, day_no) => {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO bm.progress_tracking_questions (
                question_text,
                answer_type,
                week_no,
                day_no,
                status,
                created_on,
                updated_on
            )
            VALUES ($1, $2, $3, $4, 1, NOW(), NOW())
            RETURNING *;
        `;
        connection.query(query,
            [
                question_text,
                answer_type,
                week_no,
                day_no,
            ],
            (err, result) => {
                if (err) return reject(err);
                resolve(result.rows?.[0] || null);
            }
        );
    });
};

export const updateProgressTrackingQuestionService = (question_id, question_text, answer_type, week_no, day_no) => {
    return new Promise((resolve, reject) => {
        const query = `
            UPDATE bm.progress_tracking_questions
            SET
                question_text = $1,
                answer_type = $2,
                week_no = $3,
                day_no = $4,
                updated_on = NOW()
            WHERE id = $5
              AND status = 1
            RETURNING *;
        `;
        const values = [
            question_text,
            answer_type,
            week_no,
            day_no,
            question_id
        ];

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
