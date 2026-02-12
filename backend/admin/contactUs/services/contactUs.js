import connection from "../../../database/database.js";

export const postReplyService = (queryId, reply_subject, reply_message) => {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE bm.contact_us
      SET 
        reply_subject = $1,
        reply_message = $2,
        replied_on = NOW()
      WHERE id = $3
      RETURNING *;
    `;

    connection.query(sql, [reply_subject, reply_message, queryId], (err, result) => {
      if (err) return reject(err);
      const resultRow = {...result.rows[0],
        created_on: toIST(result.rows[0].created_on),
        replied_on: toIST(result.rows[0].replied_on)
      };
      resolve(resultRow);
    });
  });
};

// Convert UTC → IST function
const toIST = (date) => {
  if (!date) return null;
  return new Date(date).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
};

// proper pagination
export const getQueriesService = (pageNo, pageSize) => {
  return new Promise((resolve, reject) => {
    pageNo = parseInt(pageNo, 10);
    pageSize = parseInt(pageSize, 10);
    if (!pageNo || pageNo < 1) pageNo = 1;
    if (!pageSize || pageSize < 1) pageSize = 10;

    const offset = (pageNo - 1) * pageSize;

    const listQuery = `
      SELECT *
      FROM bm.contact_us
      WHERE status = 1
      ORDER BY created_on DESC
      LIMIT $1 OFFSET $2;
    `;

    const countQuery = `
      SELECT COUNT(*) AS total
      FROM bm.contact_us
      WHERE status = 1;
    `;

   

    connection.query(listQuery, [pageSize, offset], (err, listResult) => {
      if (err) return reject(err);

      // Convert dates to IST for each row
      const formattedRows = listResult.rows.map((row) => ({
        ...row,
        created_on: toIST(row.created_on),
        replied_on: toIST(row.replied_on)
      }));

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
          inquiries: formattedRows
        });
      });
    });
  });
};

export const getQueryService = (queryId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT *
      FROM bm.contact_us
      WHERE id = $1 AND status = 1;
    `;
    connection.query(sql, [queryId], (err, result) => {
      if (err) return reject(err);
      resolve(result.rows?.[0] || null);
    });
  });
};

// soft delete status = 0
export const deleteQueryService = () => { };