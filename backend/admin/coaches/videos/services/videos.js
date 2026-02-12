import connection from "../../../../database/database.js";

export const getAllVideosService = (pageNo, pageSize) => {
  return new Promise((resolve, reject) => {
    pageNo = parseInt(pageNo, 10);
    pageSize = parseInt(pageSize, 10);
    if (!pageNo || pageNo < 1) pageNo = 1;
    if (!pageSize || pageSize < 1) pageSize = 10;
    const offset = (pageNo - 1) * pageSize;
    const countQuery = `
      SELECT COUNT(*) AS total
      FROM bm.course_videos v
      INNER JOIN bm.domains d ON v.domain_id = d.id
      INNER JOIN bm.subdomains s ON v.subdomain_id = s.id
      INNER JOIN bm.coaches c ON v.coach_id = c.id
      WHERE v.status = 1
        AND c.status = 1
        AND s.status = 1
        AND d.status = 1
    `;
    connection.query(countQuery, (err, countResult) => {
      if (err) return reject(err);
      const totalRecords = parseInt(countResult.rows[0].total, 10);
      const totalPages = Math.ceil(totalRecords / pageSize);
      const dataQuery = `
        SELECT
          v.id AS video_id,
          v.domain_id,
          d.domain_name,
          v.subdomain_id,
          s.subdomain_name,
          v.coach_id,
          c.name AS coach_name,
          v.course_id,
          v.title,
          v.description,
          v.video_url,
          v.thumbnail_url,
          v.created_on,
          v.status
        FROM bm.course_videos v
        INNER JOIN bm.domains d ON v.domain_id = d.id
        INNER JOIN bm.subdomains s ON v.subdomain_id = s.id
        INNER JOIN bm.coaches c ON v.coach_id = c.id
        WHERE v.status = 1
          AND c.status = 1
          AND s.status = 1
          AND d.status = 1
        ORDER BY v.id ASC
        LIMIT $1 OFFSET $2
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
          videos: dataResult.rows || []
        });
      });
    });
  });
};

export const getVideoByIdService = (videoId) => {
	return new Promise((resolve, reject) => {
		const query = `
			SELECT
				v.id AS video_id,
				v.domain_id,
				d.domain_name,
				v.subdomain_id,
				s.subdomain_name,
				v.coach_id,
				c.name AS coach_name,
				v.course_id,
				v.title,
				v.description,
				v.video_url,
				v.thumbnail_url,
				v.created_on,
				v.status
			FROM bm.course_videos v
			INNER JOIN bm.domains d ON v.domain_id = d.id
			INNER JOIN bm.subdomains s ON v.subdomain_id = s.id
			INNER JOIN bm.coaches c ON v.coach_id = c.id
			WHERE v.id = $1
			  AND v.status = 1
			  AND c.status = 1
			  AND s.status = 1
			  AND d.status = 1
		`;
		connection.query(query, [videoId], (err, result) => {
			if (err) return reject(err);
			if (result.rows.length === 0) return resolve(-1);
			return resolve(result.rows[0]);
		});
	});
};

export const getAllCourseVideosService = (pageNo, pageSize) => {
  return new Promise((resolve, reject) => {
    pageNo = parseInt(pageNo, 10);
    pageSize = parseInt(pageSize, 10);
    if (!pageNo || pageNo < 1) pageNo = 1;
    if (!pageSize || pageSize < 1) pageSize = 10;
    const offset = (pageNo - 1) * pageSize;
    const countQuery = `
      SELECT COUNT(*) AS total
      FROM bm.curriculum_videos cv
      INNER JOIN bm.curriculum_outlines co
        ON cv.curriculum_outline_id = co.id
      WHERE cv.status = 1
        AND co.status = 1
    `;
    connection.query(countQuery, (err, countResult) => {
      if (err) return reject(err);
      const totalRecords = parseInt(countResult.rows[0].total, 10);
      const totalPages = Math.ceil(totalRecords / pageSize);
      const dataQuery = `
        SELECT
          cv.id,
          cv.course_id,
          cv.video_url,
          cv.thumbnail_url,
          co.header_type,
          co.sequence_no,
          co.title,
          co.description
        FROM bm.curriculum_videos cv
        INNER JOIN bm.curriculum_outlines co
          ON cv.curriculum_outline_id = co.id
        WHERE cv.status = 1
          AND co.status = 1
        ORDER BY cv.id ASC
        LIMIT $1 OFFSET $2
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
          course_videos: dataResult.rows
        });
      });
    });
  });
};