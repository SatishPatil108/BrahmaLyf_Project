import connection from "../../../database/database.js";

export const postContactUsService = (userId, name, email, message) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO bm.contact_us (
        user_id,
        name,
        email,
        message,
        created_on
      )
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING *;
    `;

    connection.query(query, [userId, name, email, message], (err, result) => {
      if (err) return reject(err);
      resolve(result.rows?.[0] || null);
    });
  });
};
export const postSubscribeToNewsletterService = (userId, email) => {
  return new Promise((resolve, reject) => {

    // 1️⃣ Check if email exists
    const checkQuery = `
      SELECT id, status
      FROM bm.news_letter_emails
      WHERE email = $1
      LIMIT 1;
    `;

    connection.query(checkQuery, [email], (checkErr, checkRes) => {
      if (checkErr) return reject(checkErr);

      // 🔹 CASE 1: Email exists
      if (checkRes.rowCount > 0) {
        const { id, status } = checkRes.rows[0];

        // ✅ Already active
        if (status === 1) {
          return resolve({
            alreadySubscribed: true,
            message: "Email already subscribed",
          });
        }

        // 🔁 Reactivate (status = 0 → 1)
        const reactivateQuery = `
          UPDATE bm.news_letter_emails
          SET
            status = 1,
            active_on = NOW(),
            deactive_on = NULL,
            user_id = $1
          WHERE id = $2
          RETURNING *;
        `;

        return connection.query(
          reactivateQuery,
          [userId, id],
          (updateErr, updateRes) => {
            if (updateErr) return reject(updateErr);

            resolve({
              reactivated: true,
              data: updateRes.rows[0],
            });
          }
        );
      }

      // 🆕 CASE 2: Email does NOT exist → Insert
      const insertQuery = `
        INSERT INTO bm.news_letter_emails (
          user_id,
          email,
          status,
          active_on,
          deactive_on
        )
        VALUES ($1, $2, 1, NOW(), NULL)
        RETURNING *;
      `;

      connection.query(insertQuery, [userId, email], (insertErr, insertRes) => {
        if (insertErr) return reject(insertErr);

        resolve({
          subscribed: true,
          data: insertRes.rows[0],
        });
      });
    });
  });
};
