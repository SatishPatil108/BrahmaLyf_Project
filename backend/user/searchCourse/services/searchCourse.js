import connection from "../../../database/database.js";

export const getCoursesService = (searchText = "") => {
  return new Promise((resolve, reject) => {

    const sql = `
      SELECT id,course_name
      FROM bm.courses
      WHERE course_name ILIKE $1
      ORDER BY 
        CASE 
          WHEN course_name ILIKE ($2 || '%') THEN 1
          ELSE 2
        END,
        course_name ASC
    `;

    const params = [`%${searchText}%`, searchText];

    connection.query(sql, params, (err, coursesResult) => {
      if (err) return reject(err);

      const sql2 = `
        SELECT id,title
        FROM bm.curriculum_outlines
        WHERE title ILIKE $1
      `;

      connection.query(sql2, [`%${searchText}%`], (err, videosResult) => {
        if (err) return reject(err);

        resolve({
          courses: coursesResult.rows,
          videos: videosResult.rows
        });
      });
    });
  });
};