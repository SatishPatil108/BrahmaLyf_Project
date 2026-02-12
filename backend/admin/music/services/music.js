import connection from "../../../database/database.js";

export const getMusicService = (musicId) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT *
            FROM bm.musics
            WHERE id = $1
              AND status = 1
            LIMIT 1;
        `;
        connection.query(query, [musicId], (err, result) => {
            if (err) return reject(err);
            resolve(result.rows?.[0] || null);
        });
    });
};

export const getMusicsService = (pageNo, pageSize) => {
  return new Promise((resolve, reject) => {
    pageNo = parseInt(pageNo, 10);
    pageSize = parseInt(pageSize, 10);
    if (!pageNo || pageNo < 1) pageNo = 1;
    if (!pageSize || pageSize < 1) pageSize = 10;
    const offset = (pageNo - 1) * pageSize;
    const listQuery = `
      SELECT *
      FROM bm.musics
      WHERE status = 1
      ORDER BY id DESC
      LIMIT $1 OFFSET $2;
    `;
    const countQuery = `
      SELECT COUNT(*) AS total
      FROM bm.musics
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
          audios: listResult.rows || []
        });
      });
    });
  });
};

export const postMusicService = (
    music_title,
    music_description,
    music_duration,
    music_thumbnail,
    music_file
) => {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO bm.musics (
                music_title,
                music_description,
                music_duration,
                music_thumbnail,
                music_file
            )
            VALUES ($1, $2, $3, $4,$5)
            RETURNING *;
        `;
        connection.query(query,
            [music_title, music_description,music_duration, music_thumbnail, music_file],
            (err, result) => {
                if (err) return reject(err);
                resolve(result.rows?.[0] || null);
            }
        );
    });
};

export const updateMusicService = (
    musicId,
    music_title,
    music_description,
    music_duration,
    music_thumbnail,
    music_file
) => {
    return new Promise((resolve, reject) => {
        const query = `
            UPDATE bm.musics
            SET 
                music_title = $1,
                music_description = $2,
                music_duration=$3,
                music_thumbnail = $4,
                music_file = $5,
                updated_on = NOW()
            WHERE id = $6
              AND status = 1
            RETURNING *;
        `;
        const values = [
            music_title,
            music_description,
            music_duration,
            music_thumbnail,
            music_file,
            musicId
        ];
        connection.query(query, values, (err, result) => {
            if (err) return reject(err);
            resolve(result.rows?.[0] || null);
        });
    });
};

export const deleteMusicService = (musicId) => {
    return new Promise((resolve, reject) => {
        const query = `
            UPDATE bm.musics
            SET 
                status = 0,
                updated_on = NOW()
            WHERE id = $1
            RETURNING *;
        `;
        connection.query(query, [musicId], (err, result) => {
            if (err) return reject(err);
            resolve(result.rows?.[0] || null);
        });
    });
};