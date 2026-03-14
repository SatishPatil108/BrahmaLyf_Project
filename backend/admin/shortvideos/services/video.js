import connection from "../../../database/database.js";

export const getShortVideoService = (shortVideoId) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT *
            FROM bm.daily_shorts
            WHERE id = $1
              AND status = 1
            LIMIT 1;
        `;
        connection.query(query, [shortVideoId], (err, result) => {
            if (err) return reject(err);
            resolve(result.rows?.[0] || null);
        });
    });
};


export const getShortVideosService = (pageNo, pageSize) => {
    return new Promise((resolve, reject) => {
        pageNo = parseInt(pageNo, 10);
        pageSize = parseInt(pageSize, 10);
        if (!pageNo || pageNo < 1) pageNo = 1;
        if (!pageSize || pageSize < 1) pageSize = 10;
        const offset = (pageNo - 1) * pageSize;
        const listQuery = `
      SELECT *
      FROM bm.daily_shorts
      WHERE status = 1
      ORDER BY id DESC
      LIMIT $1 OFFSET $2;
    `;
        const countQuery = `
      SELECT COUNT(*) AS total
      FROM bm.daily_shorts
      WHERE status = 1;
    `;
        connection.query(listQuery, [pageSize, offset], (err, listResult) => {
            if (err) return reject(err);
            connection.query(countQuery, [], (err, countResult) => {
                if (err) return reject(err);
                const totalRecords = parseInt(countResult.rows[0].total, 10);
                const totalPages = Math.ceil(totalRecords / pageSize);
                resolve({
                    current_page: pageNo,
                    page_size: pageSize,
                    total_records: totalRecords,
                    total_pages: totalPages,
                    has_next_page: pageNo < totalPages,
                    has_prev_page: pageNo > 1,
                    videos: listResult.rows || []
                });
            });
        });
    });
};

export const postShortVideoService = (
    video_title,
    video_description,
    domain_id,
    video_thumbnail,
    video_file
) => {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO bm.daily_shorts (
                video_title,
                video_description,
                domain_id,
                video_thumbnail,
                video_file
            )
        
        VALUES ($1,$2,$3,$4,$5)
        RETURNING *;
        `;
        connection.query(query,
            [
                video_title,
                video_description,
                domain_id,
                video_thumbnail,
                video_file
            ],
            (err, result) => {
                if (err) return reject(err);
                resolve(result.rows?.[0] || null);
            }
        );
    });
};

export const updateShortVideoService = (
    shortVideoId,
    video_title,
    video_description,
    domain_id,
    video_thumbnail,
    video_file
) => {
    return new Promise((resolve, reject) => {
        const query = `
            UPDATE bm.daily_shorts
            SET 
                video_title = $1,
                video_description = $2,
                domain_id = $3,
                video_thumbnail = $4,
                video_file = $5,
                updated_on = NOW()
            WHERE id = $6
              AND status = 1
            RETURNING *;
        `;
        const values = [
            video_title,
            video_description,
            domain_id,
            video_thumbnail,
            video_file,
            shortVideoId
        ];

        connection.query(query, values, (err, result) => {
            if (err) return reject(err);
            resolve(result.rows?.[0] || null);
        });
    });
};

export const deleteShortVideoService = (shortVideoId) => {
    return new Promise((resolve, reject) => {
        const query = `
            UPDATE bm.daily_shorts
            SET 
                status = 0,
                updated_on = NOW()
            WHERE id = $1
            RETURNING *;
        `;
        connection.query(query, [shortVideoId], (err, result) => {
            if (err) return reject(err);
            resolve(result.rows?.[0] || null);
        });
    });
};