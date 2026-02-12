import connection from "../../../database/database.js";

export const getDashboardDataService = () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                (SELECT COUNT(*) FROM bm.courses WHERE status = 1) AS total_courses,
                (SELECT COUNT(*) FROM bm.coaches WHERE status = 1) AS total_coaches,
                (SELECT COUNT(*) FROM bm.users WHERE status = 1) AS total_users,
                (SELECT COUNT(*) FROM bm.course_videos WHERE status = 1) AS total_videos,

                (
                    SELECT json_agg(thumbnail_url) 
                    FROM (
                        SELECT thumbnail_url 
                        FROM bm.course_videos 
                        WHERE status = 1 
                        ORDER BY created_on DESC 
                        LIMIT 10
                    ) AS t
                ) AS video_thumbnails,

                (
                    SELECT json_agg(
                        json_build_object(
                            'coach_id', id,
                            'coach_name', name,
                            'coach_profile_image', profile_image
                        )
                    )
                    FROM (
                        SELECT id, name, profile_image
                        FROM bm.coaches
                        WHERE status = 1
                        ORDER BY created_on DESC
                        LIMIT 10
                    ) AS t
                ) AS coaches;
        `;
        connection.query(query, (err, result) => {
            if (err) {
                console.error("Dashboard query error:", err);
                return reject(err);
            }
            if (!result.rows.length) return resolve(-1);
            resolve(result.rows[0]);
        });
    });
};

export const getFaqService = (pageNo, pageSize) => {
  return new Promise((resolve, reject) => {
    pageNo = parseInt(pageNo, 10);
    pageSize = parseInt(pageSize, 10);
    if (!pageNo || pageNo < 1) pageNo = 1;
    if (!pageSize || pageSize < 1) pageSize = 10;
    const offset = (pageNo - 1) * pageSize;
    const countQuery = `
      SELECT COUNT(*) AS total
      FROM bm.faqs
      WHERE status = 1;
    `;
    connection.query(countQuery, (err, countResult) => {
      if (err) return reject(err);
      const totalRecords = parseInt(countResult.rows[0].total, 10);
      const totalPages = Math.ceil(totalRecords / pageSize);
      const dataQuery = `
        SELECT 
          id,
          question,
          answer,
          status
        FROM bm.faqs
        WHERE status = 1
        ORDER BY id ASC
        LIMIT $1 OFFSET $2;
      `;
      connection.query(dataQuery, [pageSize, offset], (err, dataResult) => {
        if (err) return reject(err);
        return resolve({
          current_page: pageNo,
          page_size: pageSize,
          total_records: totalRecords,
          total_pages: totalPages,
          has_next_page: pageNo < totalPages,
          has_prev_page: pageNo > 1,
          faqs: dataResult.rows
        });
      });
    });
  });
};