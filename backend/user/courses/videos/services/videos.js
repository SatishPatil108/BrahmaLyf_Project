import connection from '../../../../database/database.js';

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
      WHERE 
        v.status = 1
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
        WHERE 
          v.status = 1
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
          videos: dataResult.rows
        });
      });
    });
  });
};

export const getVideosBySubdomainIdService = (pageNo, pageSize, subdomainId, coachId) => {
  return new Promise((resolve, reject) => {
    pageNo = parseInt(pageNo, 10);
    pageSize = parseInt(pageSize, 10);
    if (!pageNo || pageNo < 1) pageNo = 1;
    if (!pageSize || pageSize < 1) pageSize = 10;
    const offset = (pageNo - 1) * pageSize;
    const isSubdomain = subdomainId !== "0";
    const countQuery = isSubdomain
      ? `
        SELECT COUNT(*) AS total
        FROM bm.course_videos v
        INNER JOIN bm.coaches c ON v.coach_id = c.id
        WHERE v.subdomain_id = $1
        AND v.status = 1
        AND c.status = 1
      `
      : `
        SELECT COUNT(*) AS total
        FROM bm.course_videos v
        INNER JOIN bm.coaches c ON v.coach_id = c.id
        WHERE v.coach_id = $1
        AND v.status = 1
        AND c.status = 1
      `;
    const param1 = isSubdomain ? subdomainId : coachId;
    connection.query(countQuery, [param1], (err, countResult) => {
      if (err) return reject(err);
      const totalRecords = parseInt(countResult.rows[0].total, 10);
      const totalPages = Math.ceil(totalRecords / pageSize);
      const dataQuery = isSubdomain
        ? `
      SELECT
        v.id AS video_id,
        v.course_id,
        cr.course_name,
        v.title,
        v.description,
        v.thumbnail_url,
        c.name AS coach_name,
        c.profile_image AS coach_profile_image
      FROM bm.course_videos v
      INNER JOIN bm.coaches c 
        ON v.coach_id = c.id
      INNER JOIN bm.courses cr
        ON cr.id = v.course_id
      WHERE v.subdomain_id = $1
        AND v.status = 1
        AND c.status = 1
      ORDER BY v.id ASC
      LIMIT $2 OFFSET $3;
    `
        : `
      SELECT
        v.id AS video_id,
        v.course_id,
        cr.course_name,
        v.title,
        v.description,
        v.thumbnail_url,
        c.name AS coach_name,
        c.profile_image AS coach_profile_image
      FROM bm.course_videos v
      INNER JOIN bm.coaches c 
        ON v.coach_id = c.id
      INNER JOIN bm.courses cr
        ON cr.id = v.course_id
      WHERE v.coach_id = $1
        AND v.status = 1
        AND c.status = 1
      ORDER BY v.id ASC
      LIMIT $2 OFFSET $3;
    `;
      connection.query(dataQuery, [param1, pageSize, offset], (err, dataResult) => {
        if (err) return reject(err);
        return resolve({
          current_page: pageNo,
          page_size: pageSize,
          total_records: totalRecords,
          total_pages: totalPages,
          has_next_page: pageNo < totalPages,
          has_prev_page: pageNo > 1,
          videos: dataResult.rows
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
				v.course_id,
				c.name AS coach_name,
				c.profile_image AS profile_image,
				c.professional_title,
				c.bio,
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
			WHERE 
				v.id = $1
				AND v.status = 1
				AND c.status = 1
				AND s.status = 1
				AND d.status = 1
		`;
    connection.query(query, [videoId], (err, result) => {
      if (err) return reject(err);
      if (result.rows.length === 0) return resolve(-1);
      resolve(result.rows[0]);
    });
  });
};

export const getMyCourseVideosService = (courseId) => {
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

    connection.query(query, [courseId], (err, courseResult) => {
      if (err) return reject(err);
      if (courseResult.rows.length === 0) return resolve(-1);

      const courseDetails = courseResult.rows[0];

      // Get modules for this course
      const modulesQuery = `
        SELECT
          co.id,
          co.header_type,
          co.sequence_no,
          co.title,
          co.description,
          cv.video_url,
          cv.thumbnail_url
        FROM bm.curriculum_outlines co
        LEFT JOIN bm.curriculum_videos cv 
          ON co.id = cv.curriculum_outline_id 
          AND cv.status = 1
        WHERE 
          co.course_id = $1
          AND co.status = 1
        ORDER BY co.sequence_no ASC;
      `;

      connection.query(modulesQuery, [courseId], (err, modulesResult) => {
        if (err) return reject(err);

        const modules = modulesResult.rows.map(module => ({
          id: module.id,
          header_type: module.header_type,
          sequence_no: module.sequence_no,
          title: module.title,
          // description: module.description,
          // video_url: module.video_url,
          // thumbnail_url: module.thumbnail_url
        }));

        // Construct response
        const response = {
          ...courseDetails,
          modules: modules
        };

        resolve(response);
      });
    });
  });
};
export const getModuleService = (moduleId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT
        co.id,
        co.header_type,
        co.sequence_no,
        co.title,
        co.description,
        co.course_id,
        cv.video_url,
        cv.thumbnail_url,
        (
          SELECT id 
          FROM bm.curriculum_outlines 
          WHERE sequence_no < co.sequence_no 
          AND course_id = co.course_id 
          AND status = 1
          ORDER BY sequence_no DESC 
          LIMIT 1
        ) AS prev_module_id,
        (
          SELECT id 
          FROM bm.curriculum_outlines 
          WHERE sequence_no > co.sequence_no 
          AND course_id = co.course_id 
          AND status = 1
          ORDER BY sequence_no ASC 
          LIMIT 1
        ) AS next_module_id
      FROM bm.curriculum_outlines co
      LEFT JOIN bm.curriculum_videos cv 
        ON co.id = cv.curriculum_outline_id 
        AND cv.status = 1
      WHERE co.id = $1 AND co.status = 1
      LIMIT 1;
    `;

    connection.query(query, [moduleId], (err, result) => {
      if (err) return reject(err);
      if (result.rows.length === 0) return resolve(-1);

      const moduleData = result.rows[0];

      const response = {
        id: moduleData.id,
        header_type: moduleData.header_type,
        sequence_no: moduleData.sequence_no,
        title: moduleData.title,
        description: moduleData.description,
        course_id: moduleData.course_id,
        video_url: moduleData.video_url,
        thumbnail_url: moduleData.thumbnail_url,
        video_title: moduleData.video_title,
        video_description: moduleData.video_description,
        has_prev_module: moduleData.prev_module_id !== null,
        has_next_module: moduleData.next_module_id !== null,
        prev_module_id: moduleData.prev_module_id,
        next_module_id: moduleData.next_module_id
      };

      resolve(response);
    });
  });
};