import connection from "../../../database/database.js";

export const getNoteService = (userId, noteId) => {
  return new Promise((resolve, reject) => {
    const query = `
            SELECT *
            FROM bm.user_notes
            WHERE id = $1
            AND user_id = $2 
            AND status = 1
            LIMIT 1;
        `;
    connection.query(query, [userId, noteId], (err, result) => {
      if (err) return reject(err);
      resolve(result.rows?.[0] || null);
    });
  });
};

export const getNotesService = (userId, pageNo, pageSize) => {
  return new Promise((resolve, reject) => {
    pageNo = parseInt(pageNo, 10);
    pageSize = parseInt(pageSize, 10);

    if (!pageNo || pageNo < 1) pageNo = 1;
    if (!pageSize || pageSize < 1) pageSize = 10;

    const offset = (pageNo - 1) * pageSize;

    const listQuery = `
      SELECT *
      FROM bm.user_notes
      WHERE status = 1
      AND user_id = $3  
      ORDER BY id DESC
      LIMIT $1 OFFSET $2;
    `;
    
    const countQuery = `
    SELECT COUNT(*) AS total
    FROM bm.user_notes
    WHERE status = 1
    AND user_id = $1
    `;

    connection.query(
      listQuery,
      [pageSize, offset, userId],
      (err, listResult) => {
        if (err) return reject(err);

        connection.query(countQuery, [userId], (err, countResult) => {
          if (err) return reject(err);

          const totalRecords = parseInt(countResult.rows[0].total, 10);
          const totalPages = Math.ceil(totalRecords / pageSize);

          resolve({
            user_id: userId,
            current_page: pageNo,
            page_size: pageSize,
            total_records: totalRecords,
            total_pages: totalPages,
            has_next_page: pageNo < totalPages,
            has_prev_page: pageNo > 1,
            notes: listResult.rows || [],
          });
        });
      },
    );
  });
};

export const postNoteService = (user_note, userId) => {
  return new Promise((resolve, reject) => {
    if (!user_note?.trim()) {
      return reject(new Error("Note cannot be empty"));
    }

    const query = `
      INSERT INTO bm.user_notes (
        user_note,
        status,
        created_on,
        user_id
      )
      VALUES ($1, 1, NOW(), $2)
      RETURNING id, user_note, status, created_on, user_id
    `;

    connection.query(query, [user_note, userId], (err, result) => {
      if (err) return reject(err);
      resolve(result.rows?.[0] || null);
    });
  });
};

export const updateNoteService = (noteId, user_note, userId) => {
  return new Promise((resolve, reject) => {
    if (!user_note?.trim()) {
      return reject(new Error("Note cannot be empty"));
    }

    const query = `
      UPDATE bm.user_notes
      SET 
        user_note = $2,
        updated_on = NOW()
      WHERE id = $1
        AND user_id = $3   -- 🔥 security fix
        AND status = 1
      RETURNING *;
    `;

    connection.query(query, [noteId, user_note, userId], (err, result) => {
      if (err) return reject(err);
      resolve(result.rows?.[0] || null);
    });
  });
};

export const deleteNoteService = (noteId, userId) => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE bm.user_notes
      SET 
        status = 0,
        updated_on = NOW()
      WHERE id = $1
        AND user_id = $2   -- 🔥 security fix
      RETURNING *;
    `;

    connection.query(query, [noteId, userId], (err, result) => {
      if (err) return reject(err);
      resolve(result.rows?.[0] || null);
    });
  });
};
