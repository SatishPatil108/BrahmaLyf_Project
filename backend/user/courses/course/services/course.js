import connection from "../../../../database/database.js";

export const getCourseByIdService = (courseId) => {
	return new Promise((resolve, reject) => {
		const query = `
			SELECT
				c.id AS course_id,
				c.course_name,
				c.target_audience,
				c.learning_outcomes,
				c.curriculum_description,
				c.duration,
				c.coach_id,
				c.created_on,
				c.status
			FROM bm.courses c
			WHERE c.id = $1 AND c.status = 1
		`;
		connection.query(query, [courseId], (err, result) => {
			if (err) return reject(err);
			if (result.rows.length === 0) return resolve(-1);
			resolve(result.rows[0]);
		});
	});
};
export const isUserAlreadyEnrolledService = (userId, courseId) => {
	return new Promise((resolve, reject) => {
		const query = `
			SELECT id
			FROM bm.course_enrollments
			WHERE user_id = $1
			AND course_id = $2
			AND status = 1
		`;
		connection.query(query, [userId, courseId], (err, result) => {
			if (err) return reject(err);
			if (result.rows.length > 0) return resolve(-2);
			resolve(result.rows);
		});
	});
};

export const enrollInCourseService = (userId, courseId, enrolledOn, status) => {
	return new Promise((resolve, reject) => {
		const query = `
			WITH ins AS (
				INSERT INTO bm.course_enrollments (
					user_id, course_id, enrolled_on, status
				)
				VALUES ($1, $2, $3, $4)
				RETURNING *
			)
			SELECT 
				ins.id AS enrollment_id,
				u.name AS user_name,
				c.course_name,
				ins.enrolled_on,
				ins.status
			FROM ins
			JOIN bm.users u ON ins.user_id = u.id
			JOIN bm.courses c ON ins.course_id = c.id
		`;
		connection.query(query, [userId, courseId, enrolledOn, status], (err, result) => {
			if (err) return reject(err);
			if (result.rows.length === 0) return resolve(-1);
			resolve(result.rows[0]);
		});
	});
};

export const getMyCoursesService = (userId, pageNo, pageSize) => {
  return new Promise((resolve, reject) => {
    pageNo = parseInt(pageNo, 10);
    pageSize = parseInt(pageSize, 10);
    if (!pageNo || pageNo < 1) pageNo = 1;
    if (!pageSize || pageSize < 1) pageSize = 10;
    const offset = (pageNo - 1) * pageSize;
    const countQuery = `
      SELECT COUNT(*) AS total
      FROM bm.courses c
      INNER JOIN bm.course_enrollments ce
        ON c.id = ce.course_id
      WHERE c.status = 1
      AND ce.user_id = $1
    `;
    connection.query(countQuery, [userId], (err, countResult) => {
      if (err) return reject(err);
      const totalRecords = parseInt(countResult.rows[0].total, 10);
      const totalPages = Math.ceil(totalRecords / pageSize);
      const dataQuery = `
        SELECT
          c.id AS course_id,
          c.course_name,
          c.duration,
          c.coach_id,
          c.created_on,
          ce.enrolled_on,
          c.status
        FROM bm.courses c
        INNER JOIN bm.course_enrollments ce
          ON c.id = ce.course_id
        WHERE c.status = 1
        AND ce.user_id = $1
        ORDER BY c.id ASC
        LIMIT $2 OFFSET $3
      `;
      connection.query(dataQuery, [userId, pageSize, offset], (err, dataResult) => {
        if (err) return reject(err);
        return resolve({
          current_page: pageNo,
          page_size: pageSize,
          total_records: totalRecords,
          total_pages: totalPages,
          has_next_page: pageNo < totalPages,
          has_prev_page: pageNo > 1,
          courses: dataResult.rows
        });
      });
    });
  });
};

export const courseFeedbackService = (
	enrollmentId,
	userId,
	courseId,
	rating,
	comments,
	createdOn,
	status
) => {
	return new Promise((resolve, reject) => {
		const query = `
			INSERT INTO bm.course_feedbacks (
				enrollment_id, user_id, course_id, rating,
				comments, created_on, status
			)
			VALUES ($1, $2, $3, $4, $5, $6, $7)
			RETURNING *
		`;
		connection.query(
			query,
			[enrollmentId, userId, courseId, rating, comments, createdOn, status],
			(err, result) => {
				if (err) return reject(err);
				if (result.rows.length === 0) return resolve(-1);
				resolve(result.rows[0]);
			}
		);
	});
};

export const getCourseFeedbacksByCourseIdService = (courseId, pageNo, pageSize) => {
  return new Promise((resolve, reject) => {
    pageNo = parseInt(pageNo, 10);
    pageSize = parseInt(pageSize, 10);
    if (!pageNo || pageNo < 1) pageNo = 1;
    if (!pageSize || pageSize < 1) pageSize = 10;
    const offset = (pageNo - 1) * pageSize;
    const countQuery = `
      SELECT COUNT(*) AS total
      FROM bm.course_feedbacks
      WHERE course_id = $1 AND status = 1
    `;
    connection.query(countQuery, [courseId], (err, countResult) => {
      if (err) return reject(err);
      const totalRecords = parseInt(countResult.rows[0].total, 10);
      const totalPages = Math.ceil(totalRecords / pageSize);
      const dataQuery = `
        SELECT
          cf.id AS feedback_id,
          cf.rating,
          cf.comments,
          cf.created_on,
          u.name AS user_name,
          u.profile_picture_url
        FROM bm.course_feedbacks cf
        INNER JOIN bm.users u ON cf.user_id = u.id
        WHERE cf.course_id = $1 AND cf.status = 1
        ORDER BY cf.created_on DESC
        LIMIT $2 OFFSET $3
      `;
      connection.query(dataQuery, [courseId, pageSize, offset], (err, dataResult) => {
        if (err) return reject(err);
        return resolve({
          current_page: pageNo,
          page_size: pageSize,
          total_records: totalRecords,
          total_pages: totalPages,
          has_next_page: pageNo < totalPages,
          has_prev_page: pageNo > 1,
          feedbacks: dataResult.rows
        });
      });
    });
  });
};

export const getCourseFeedbacksService = (pageNo, pageSize) => {
  return new Promise((resolve, reject) => {
    pageNo = parseInt(pageNo, 10);
    pageSize = parseInt(pageSize, 10);
    if (!pageNo || pageNo < 1) pageNo = 1;
    if (!pageSize || pageSize < 1) pageSize = 10;
    const offset = (pageNo - 1) * pageSize;
    const countQuery = `
      SELECT COUNT(*) AS total
      FROM bm.course_feedbacks
      WHERE status = 1
    `;
    connection.query(countQuery, (err, countResult) => {
      if (err) return reject(err);
      const totalRecords = parseInt(countResult.rows[0].total, 10);
      const totalPages = Math.ceil(totalRecords / pageSize);
      const dataQuery = `
        SELECT
          cf.id AS feedback_id,
          cf.rating,
          cf.comments,
          cf.created_on,
          u.name AS user_name,
          u.profile_picture_url
        FROM bm.course_feedbacks cf
        INNER JOIN bm.users u ON cf.user_id = u.id
        WHERE cf.status = 1
        ORDER BY cf.created_on DESC
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
          feedbacks: dataResult.rows
        });
      });
    });
  });
};

export const searchCourseService = (pageNo, pageSize, whereClause = "") => {
  return new Promise((resolve, reject) => {
    pageNo = parseInt(pageNo, 10);
    pageSize = parseInt(pageSize, 10);
    if (!pageNo || pageNo < 1) pageNo = 1;
    if (!pageSize || pageSize < 1) pageSize = 10;
    const offset = (pageNo - 1) * pageSize;
    const safeWhere = whereClause?.trim() ? ` ${whereClause}` : "";
    const countQuery = `
      SELECT COUNT(*) AS total
      FROM bm.courses c
      INNER JOIN bm.coaches co ON c.coach_id = co.id
      WHERE co.status = 1 AND c.status = 1
      ${safeWhere}
    `;
    connection.query(countQuery, (err, countResult) => {
      if (err) return reject(err);
      const totalRecords = parseInt(countResult.rows[0].total, 10);
      const totalPages = Math.ceil(totalRecords / pageSize);
      const dataQuery = `
        SELECT
          c.id AS course_id,
          c.course_name,
          c.target_audience,
          c.learning_outcomes,
          c.curriculum_description,
          c.duration,
          c.coach_id,
          co.name AS coach_name
        FROM bm.courses c
        INNER JOIN bm.coaches co ON c.coach_id = co.id
        WHERE co.status = 1 AND c.status = 1
        ${safeWhere}
        ORDER BY c.created_on ASC
        LIMIT $1 OFFSET $2
      `;
      connection.query(dataQuery, [pageSize, offset], (err, dataResult) => {
        if (err) return reject(err);
        resolve({
          current_page: pageNo,
          page_size: pageSize,
          total_records: totalRecords,
          total_pages: totalPages,
          has_next_page: pageNo < totalPages,
          has_prev_page: pageNo > 1,
          courses: dataResult.rows
        });
      });
    });
  });
};