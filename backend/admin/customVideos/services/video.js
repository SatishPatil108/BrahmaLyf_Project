import connection from "../../../database/database.js";

export const getCustomVideoService = (customVideoId) => {
  return new Promise((resolve, reject) => {
    const query = `
            SELECT *
            FROM bm.custom_videos
            WHERE id = $1
              AND status = 1
            LIMIT 1;
        `;
    connection.query(query, [customVideoId], (err, result) => {
      if (err) return reject(err);
      resolve(result.rows?.[0] || null);
    });
  });
};

export const getAllCustomVideosService = (pageNo, pageSize) => {
  return new Promise((resolve, reject) => {
    pageNo = parseInt(pageNo, 10);
    pageSize = parseInt(pageSize, 10);
    if (!pageNo || pageNo < 1) pageNo = 1;
    if (!pageSize || pageSize < 1) pageSize = 10;
    const offset = (pageNo - 1) * pageSize;
    const listQuery = `
      SELECT *
      FROM bm.custom_videos
      WHERE status = 1
      ORDER BY id DESC
      LIMIT $1 OFFSET $2;
    `;
    const countQuery = `
      SELECT COUNT(*) AS total
      FROM bm.custom_videos
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
          videos: listResult.rows || [],
        });
      });
    });
  });
};

export const postCustomVideoService = (
  video_title,
  category_id,
  video_thumbnail,
  video_file,
) => {
  return new Promise((resolve, reject) => {
    const query = `
            INSERT INTO bm.custom_videos (
                video_title,
                category_id,
                video_thumbnail,
                video_file
            )        
        VALUES ($1,$2,$3,$4)
        RETURNING *;
        `;
    connection.query(
      query,
      [video_title, category_id, video_thumbnail, video_file],
      (err, result) => {
        if (err) return reject(err);
        resolve(result.rows?.[0] || null);
      },
    );
  });
};

export const updateCustomVideoService = (
  customVideoId,
  video_title,
  category_id,
  video_thumbnail,
  video_file,
) => {
  return new Promise((resolve, reject) => {
    const query = `
            UPDATE bm.custom_videos
            SET 
                video_title = $1,
                category_id = $2,
                video_thumbnail = $3,
                video_file = $4,
                updated_on = NOW()
            WHERE id = $5
              AND status = 1
            RETURNING *;
        `;
    const values = [
      video_title,
      category_id,
      video_thumbnail,
      video_file,
      customVideoId,
    ];

    connection.query(query, values, (err, result) => {
      if (err) return reject(err);
      resolve(result.rows?.[0] || null);
    });
  });
};

export const deleteCustomVideoService = (customVideoId) => {
  return new Promise((resolve, reject) => {
    const query = `
            UPDATE bm.custom_videos
            SET 
                status = 0,
                updated_on = NOW()
            WHERE id = $1
            RETURNING *;
        `;
    connection.query(query, [customVideoId], (err, result) => {
      if (err) return reject(err);
      resolve(result.rows?.[0] || null);
    });
  });
};
