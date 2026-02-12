import connection from '../../../../database/database.js';

export const getAllCoachesService = (pageNo, pageSize) => {
  return new Promise((resolve, reject) => {
    pageNo = parseInt(pageNo, 10);
    pageSize = parseInt(pageSize, 10);
    if (!pageNo || pageNo < 1) pageNo = 1;
    if (!pageSize || pageSize < 1) pageSize = 10;
    const offset = (pageNo - 1) * pageSize;
    const countQuery = `
      SELECT COUNT(*) AS total
      FROM bm.coaches
      WHERE status = 1
    `;
    connection.query(countQuery, (err, countResult) => {
      if (err) return reject(err);
      const totalRecords = parseInt(countResult.rows[0].total, 10);
      const totalPages = Math.ceil(totalRecords / pageSize);
      const dataQuery = `
        SELECT
          c.id AS coach_id,
          c.name,
          c.email,
          c.contact_number,
          c.profile_image AS profile_image_url,
          c.professional_title,
          c.bio,
          c.domain_id,
          c.subdomain_id,
          c.experience,
          c.created_on,
          c.status
        FROM bm.coaches c
        WHERE c.status = 1
        ORDER BY c.id ASC
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
          coaches: dataResult.rows
        });
      });
    });
  });
};

export const getCoachByIdService = (coachId) => {
	return new Promise((resolve, reject) => {
		const query = `
			SELECT
				c.id AS coach_id,
				c.name,
				c.email,
				c.contact_number,
				c.profile_image AS profile_image_url,
				c.professional_title,
				c.bio,
				c.domain_id,
				c.subdomain_id,
				c.experience,
				c.created_on,
				c.status
			FROM bm.coaches c
			WHERE c.id = $1
			AND c.status = 1
		`;
		connection.query(query, [coachId], (err, result) => {
			if (err) return reject(err);
			if (result.rows.length === 0) return resolve(-1);
			resolve(result.rows[0]);
		});
	});
};