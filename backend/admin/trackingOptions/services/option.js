import connection from "../../../database/database.js";

export const getProgressTrackingOptionService = (optionId) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT *
            FROM bm.progress_tracking_options
            WHERE id = $1
              AND status = 1
            LIMIT 1;
        `;
        connection.query(query, [optionId], (err, result) => {
            if (err) return reject(err);
            resolve(result.rows?.[0] || null);
        });
    });
};

export const getAllProgressTrackingOptionsService = () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT
                o.id AS option_id,
                o.option_text
            FROM bm.progress_tracking_options o
            WHERE o.status = 1
            ORDER BY o.id ASC
        `;
        connection.query(query, (err, result) => {
            if (err) return reject(err);
            if (!result.rows.length) return resolve(-1);
            resolve(result.rows);
        });
    });
};

export const postProgressTrackingOptionService = (question_id, option_text) => {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO bm.progress_tracking_options (
                question_id,
                option_text
            )
            VALUES ($1, $2)
            RETURNING *;
        `;
        connection.query(query,
            [
                question_id,
                option_text
            ],
            (err, result) => {
                if (err) return reject(err);
                resolve(result.rows?.[0] || null);
            }
        );
    });
};

export const updateProgressTrackingOptionService = (
    optionId,
    question_id,
    option_text
) => {
    return new Promise((resolve, reject) => {
        const query = `
            UPDATE bm.progress_tracking_options
            SET 
                question_id = $1,
                option_text = $2,
                updated_on = NOW()
            WHERE id = $3
              AND status = 1
            RETURNING *;
        `;
        const values = [
            question_id,
            option_text,
            optionId
        ];

        connection.query(query, values, (err, result) => {
            if (err) return reject(err);
            resolve(result.rows?.[0] || null);
        });
    });
};

export const deleteProgressTrackingOptionService = (optionId) => {
    return new Promise((resolve, reject) => {
        const query = `
            UPDATE bm.progress_tracking_options
            SET 
                status = 0,
                updated_on = NOW()
            WHERE id = $1
            RETURNING *;
        `;
        connection.query(query, [optionId], (err, result) => {
            if (err) return reject(err);
            resolve(result.rows?.[0] || null);
        });
    });
};