import connection from "../../../../database/database.js";

const runQuery = (client, text, params = []) => {
  if (client && typeof client.query === "function") {
    try {
      const result = client.query(text, params);
      if (result && typeof result.then === "function") {
        return result;
      }
    } catch (err) {
      console.error(err)
    }
  }
  return new Promise((resolve, reject) => {
    client.query(text, params, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const runTransaction = async (client, queries = []) => {
  try {
    await runQuery(client, "BEGIN");
    const results = [];
    for (const q of queries) {
      const r = await runQuery(client, q.text, q.params || []);
      results.push(r);
    }
    await runQuery(client, "COMMIT");
    return results;
  } catch (err) {
    try {
      await runQuery(client, "ROLLBACK");
    } catch (rbErr) {
      console.error("rollback error:", rbErr);
    }
    throw err;
  }
};

const handleNoRows = (result) => {
  if (!result || !result.rows || result.rows.length === 0) return true;
  return false;
};

export const postCourseService = async (
  courseName,
  targetedAudience,
  learningOutcomes,
  curriculumDescription,
  duration,
  coachId,
  createdOn,
  status,
  client = connection
) => {
  const text = `
    INSERT INTO bm.courses (
      course_name,
      target_audience,
      learning_outcomes,
      curriculum_description,
      duration,
      coach_id,
      created_on,
      status
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING
      id AS course_id,
      course_name,
      target_audience,
      learning_outcomes,
      curriculum_description,
      duration,
      coach_id,
      created_on,
      status
  `;
  try {
    const result = await runQuery(client, text, [
      courseName,
      targetedAudience,
      learningOutcomes,
      curriculumDescription,
      duration,
      coachId,
      createdOn,
      status,
    ]);
    if (handleNoRows(result)) return -1;
    return result.rows[0];
  } catch (err) {
    console.error("postCourse error:", err);
    throw err;
  }
};
export const postCourseVideoService = async (
  domainId,
  subdomainId,
  coachId,
  courseId,
  title,
  description,
  videoUrl,
  thumbnailUrl,
  createdOn,
  status,
  client = connection
) => {
  const text = `
    INSERT INTO bm.course_videos (
      domain_id,
      subdomain_id,
      coach_id,
      course_id,
      title,
      description,
      video_url,
      thumbnail_url,
      created_on,
      status
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    RETURNING
      id,
      domain_id,
      subdomain_id,
      coach_id,
      course_id,
      title,
      description,
      video_url,
      thumbnail_url,
      created_on,
      status
  `;
  try {
    const result = await runQuery(client, text, [
      domainId,
      subdomainId,
      coachId,
      courseId,
      title,
      description,
      videoUrl,
      thumbnailUrl,
      createdOn,
      status,
    ]);
    if (handleNoRows(result)) return -1;
    return result.rows[0];
  } catch (err) {
    console.error("postVideo error:", err);
    throw err;
  }
};

export const postCurriculumVideoService = async (
  courseId,
  curriculumOutlineId,
  videoUrl,
  thumbnailUrl,
  createdOn,
  status,
  client = connection
) => {
  const text = `
    INSERT INTO bm.curriculum_videos (
      course_id,
      curriculum_outline_id,
      video_url,
      thumbnail_url,
      created_on,
      status
    ) VALUES ($1,$2,$3,$4,$5,$6)
    RETURNING
      id,
      course_id,
      curriculum_outline_id,
      video_url,
      thumbnail_url,
      created_on,
      status
  `;
  try {
    const result = await runQuery(client, text, [
      courseId,
      curriculumOutlineId,
      videoUrl,
      thumbnailUrl,
      createdOn,
      status,
    ]);
    if (handleNoRows(result)) return -1;
    return result.rows[0];
  } catch (err) {
    console.error("postCourseVideo error:", err);
    throw err;
  }
};

export const getAllCoursesService = async (pageNo, pageSize) => {
  try {
    pageNo = parseInt(pageNo, 10);
    pageSize = parseInt(pageSize, 10);
    if (!pageNo || pageNo < 1) pageNo = 1;
    if (!pageSize || pageSize < 1) pageSize = 10;
    const offset = (pageNo - 1) * pageSize;
    const countQuery = `
      SELECT COUNT(*) AS total
      FROM bm.courses
      WHERE status = 1
    `;
    const countResult = await runQuery(connection, countQuery);
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
        c.created_on,
        c.status
      FROM bm.courses c
      WHERE c.status = 1
      ORDER BY c.id ASC
      LIMIT $1 OFFSET $2
    `;
    const dataResult = await runQuery(connection, dataQuery, [pageSize, offset]);
    return {
      current_page: pageNo,
      page_size: pageSize,
      total_records: totalRecords,
      total_pages: totalPages,
      has_next_page: pageNo < totalPages,
      has_prev_page: pageNo > 1,
      courses: dataResult.rows
    };
  } catch (err) {
    console.error("getAllCourses error:", err);
    throw err;
  }
};

export const getCourseByIdService = async (courseId) => {
  const text = `
    SELECT
      c.id AS course_id,
      c.course_name,
      c.target_audience,
      c.learning_outcomes,
      c.curriculum_description,
      c.duration,
      c.coach_id,
      c.created_on,
      c.status,
      COALESCE(
        json_agg(
          json_build_object(
            'id', co.id,
            'header_type', co.header_type,
            'sequence_no', co.sequence_no,
            'title', co.title,
            'description', co.description,
            'created_on', co.created_on,
            'status', co.status
          )
        ) FILTER (WHERE co.id IS NOT NULL),
        '[]'
      ) AS curriculum_outline,
      COALESCE(
        (
          SELECT json_agg(
            json_build_object(
              'id', cv.id,
              'curriculum_outline_id', cv.curriculum_outline_id,
              'video_url', cv.video_url,
              'thumbnail_url', cv.thumbnail_url,
              'created_on', cv.created_on,
              'status', cv.status
            )
          )
          FROM bm.curriculum_videos cv
          WHERE cv.course_id = c.id
            AND cv.status = 1
        ),
        '[]'
      ) AS videos,
      COALESCE(
        (
          SELECT json_build_object(
            'id', v.id,
            'domain_id', v.domain_id,
            'subdomain_id', v.subdomain_id,
            'coach_id', v.coach_id,
            'title', v.title,
            'description', v.description,
            'video_url', v.video_url,
            'thumbnail_url', v.thumbnail_url,
            'created_on', v.created_on,
            'status', v.status,
            'course_id', v.course_id
          )
          FROM bm.course_videos v
          WHERE v.course_id = c.id
            AND v.status = 1
          LIMIT 1
        ),
        '{}'
      ) AS intro_video
    FROM bm.courses c
    LEFT JOIN bm.curriculum_outlines co
      ON c.id = co.course_id AND co.status = 1
    WHERE c.id = $1 AND c.status = 1
    GROUP BY
      c.id,
      c.course_name,
      c.target_audience,
      c.learning_outcomes,
      c.curriculum_description,
      c.duration,
      c.coach_id,
      c.created_on,
      c.status
  `;
  try {
    const result = await runQuery(connection, text, [courseId]);
    if (handleNoRows(result)) return -1;
    return result.rows[0];
  } catch (err) {
    console.error("getCourseById error:", err);
    throw err;
  }
};

export const getIntroVideoByVideoIdService = async (videoId, client = connection) => {
  const text = `
    SELECT
      id,
      thumbnail_url as video_thumbnail_url
    FROM bm.course_videos
    WHERE id = $1 AND status = 1
  `;
  try {
    const result = await runQuery(client, text, [videoId]);
    if (handleNoRows(result)) return -1;
    return result.rows[0];
  } catch (err) {
    console.error("getIntroVideoByVideoId error:", err);
    throw err;
  }
};

export const getCourseVideoByVideoIdService = async (videoId) => {
  const text = `
    SELECT
      id,
      thumbnail_url
    FROM bm.curriculum_videos
    WHERE id = $1 AND status = 1
  `;
  try {
    const result = await runQuery(connection, text, [videoId]);
    if (handleNoRows(result)) return -1;
    return result.rows[0];
  } catch (err) {
    console.error("getCourseVideoByVideoId error:", err);
    throw err;
  }
};

export const postCurriculumOutlineService = async (
  courseId,
  headerType,
  title,
  description,
  sequenceNo,
  createdOn,
  status,
  client = connection
) => {
  const text = `
    INSERT INTO bm.curriculum_outlines (
      course_id,
      header_type,
      title,
      description,
      sequence_no,
      created_on,
      status
    ) VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING
      id,
      course_id,
      header_type,
      sequence_no,
      title,
      description,
      created_on,
      status
  `;
  try {
    const result = await runQuery(client, text, [
      courseId,
      headerType,
      title,
      description,
      sequenceNo,
      createdOn,
      status,
    ]);
    if (handleNoRows(result)) return -1;
    return result.rows[0];
  } catch (err) {
    console.error("postCurriculumOutline error:", err);
    throw err;
  }
};

export const updateCourseService = async (
  courseId,
  courseName,
  targetedAudience,
  learningOutcomes,
  curriculumDescription,
  duration,
  coachId,
  updatedOn,
  client = connection
) => {
  const text = `
    UPDATE bm.courses
    SET
      course_name = $2,
      target_audience = $3,
      learning_outcomes = $4,
      curriculum_description = $5,
      duration = $6,
      coach_id = $7,
      created_on = $8
    WHERE id = $1 AND status = 1
    RETURNING *
  `;
  try {
    const result = await runQuery(client, text, [
      courseId,
      courseName,
      targetedAudience,
      learningOutcomes,
      curriculumDescription,
      duration,
      coachId,
      updatedOn,
    ]);
    if (handleNoRows(result)) return -1;
    return result.rows[0];
  } catch (err) {
    console.error("updateCourse error:", err);
    throw err;
  }
};

export const updateCurriculumOutlineService = async (
  courseId,
  id,
  headerType,
  title,
  description,
  sequenceNo,
  updatedOn,
  status
) => {
  const text = `
    UPDATE bm.curriculum_outlines
    SET
      header_type = $3,
      title = $4,
      description = $5,
      sequence_no = $6,
      created_on = $7,
      status = $8
    WHERE course_id = $1 AND id = $2 AND status = 1
    RETURNING *
  `;
  try {
    const result = await runQuery(connection, text, [
      courseId,
      id,
      headerType,
      title,
      description,
      sequenceNo,
      updatedOn,
      status,
    ]);
    if (handleNoRows(result)) return -1;
    return result.rows[0];
  } catch (err) {
    console.error("updateCurriculumOutline error:", err);
    throw err;
  }
};

export const updateCurriculumOutlineAndRelatedVideoService = async (
  curriculumId,
  headerType,
  sequenceNo,
  title,
  description,
  videoId,
  videoUrl,
  video_thumbnail_url,
  updatedOn
) => {
  const queries = [
    {
      text: `
        UPDATE bm.curriculum_outlines
        SET header_type = $2, title = $3, description = $4, sequence_no = $5, created_on = $6
        WHERE id = $1 AND status = 1
        RETURNING *
      `,
      params: [curriculumId, headerType, title, description, sequenceNo, updatedOn],
    },
    {
      text: `
        UPDATE bm.curriculum_videos
        SET video_url = $2, thumbnail_url = $3, created_on = $4
        WHERE id = $1 AND status = 1
        RETURNING *
      `,
      params: [videoId, videoUrl, video_thumbnail_url, updatedOn],
    },
  ];

  try {
    const results = await runTransaction(connection, queries);
    return results.map((r) => (r && r.rows ? r.rows[0] : null));
  } catch (err) {
    console.error("updateCurriculumOutlineAndRelatedVideo error:", err);
    throw err;
  }
};

export const updateCourseVideoService = async (
  courseId,
  id,
  curriculumOutlineId,
  videoUrl,
  thumbnailUrl,
  updatedOn,
  status
) => {
  const text = `
    UPDATE bm.curriculum_videos
    SET
      curriculum_outline_id = $3,
      video_url = $4,
      thumbnail_url = $5,
      created_on = $6,
      status = $7
    WHERE course_id = $1 AND id = $2 AND status = 1
    RETURNING *
  `;
  try {
    const result = await runQuery(connection, text, [
      courseId,
      id,
      curriculumOutlineId,
      videoUrl,
      thumbnailUrl,
      updatedOn,
      status,
    ]);
    if (handleNoRows(result)) return -1;
    return result.rows[0];
  } catch (err) {
    console.error("updateCourseVideo error:", err);
    throw err;
  }
};

export const updateVideoService = async (
  videoId,
  domainId,
  subdomainId,
  coachId,
  videoTitle,
  videoDescription,
  videoUrl,
  videoThumbnailUrl,
  updatedOn,
  courseId,
  client = connection
) => {
  const text = `
    UPDATE bm.course_videos
    SET
      domain_id = $2,
      subdomain_id = $3,
      coach_id = $4,
      title = $5,
      description = $6,
      video_url = $7,
      thumbnail_url = $8,
      created_on = $9,
      course_id = $10
    WHERE id = $1
    RETURNING *
  `;
  try {
    const result = await runQuery(client, text, [
      videoId,
      domainId,
      subdomainId,
      coachId,
      videoTitle,
      videoDescription,
      videoUrl,
      videoThumbnailUrl,
      updatedOn,
      courseId,
    ]);
    if (handleNoRows(result)) return -1;
    return result.rows[0];
  } catch (err) {
    console.error("updateVideo error:", err);
    throw err;
  }
};

export const deleteCourseService = async (courseId) => {
  const queries = [
    { text: `UPDATE bm.courses SET status = 0 WHERE id = $1 AND status = 1`, params: [courseId] },
    { text: `UPDATE bm.course_videos SET status = 0 WHERE course_id = $1 AND status = 1`, params: [courseId] },
    { text: `UPDATE bm.curriculum_outlines SET status = 0 WHERE course_id = $1 AND status = 1`, params: [courseId] },
    { text: `UPDATE bm.curriculum_videos SET status = 0 WHERE course_id = $1 AND status = 1`, params: [courseId] },
  ];

  try {
    const results = await runTransaction(connection, queries);
    // sum of rowCount from each result
    return results.reduce((sum, r) => sum + (r && r.rowCount ? r.rowCount : 0), 0);
  } catch (err) {
    console.error("deleteCourse error:", err);
    throw err;
  }
};

export const getVideoThumbnailsByCourseIdService = async (courseId) => {
  const text = `
    SELECT thumbnail_url, 'videos' AS source
    FROM bm.course_videos
    WHERE course_id = $1 AND status = 1
    UNION ALL
    SELECT thumbnail_url, 'course_videos' AS source
    FROM bm.curriculum_videos
    WHERE course_id = $1 AND status = 1
  `;
  try {
    const result = await runQuery(connection, text, [courseId]);
    if (handleNoRows(result)) return -1;
    return result.rows;
  } catch (err) {
    console.error("getVideoThumbnailsByCourseId error:", err);
    throw err;
  }
};

export const deleteCurriculumOutlineService = async (courseId, curriculumId) => {
  try {
    const videoThumbQuery = `
      SELECT thumbnail_url
      FROM bm.curriculum_videos
      WHERE course_id = $1 AND curriculum_outline_id = $2 AND status = 1
      LIMIT 1;
    `;
    const videoThumbResult = await connection.query(
      videoThumbQuery,
      [courseId, curriculumId]
    );
    const video_thumbnail = videoThumbResult.rows[0]?.thumbnail_url || null;
    const queries = [
      {
        text: `
          UPDATE bm.curriculum_videos
          SET status = 0
          WHERE course_id = $1 AND curriculum_outline_id = $2 AND status = 1
        `,
        params: [courseId, curriculumId],
      },
      {
        text: `
          UPDATE bm.curriculum_outlines
          SET status = 0
          WHERE course_id = $1 AND id = $2 AND status = 1
        `,
        params: [courseId, curriculumId],
      },
    ];
    const results = await runTransaction(connection, queries);
    const status = results.reduce(
      (sum, r) => sum + (r?.rowCount || 0),
      0
    );
    return {
      status,
      video_thumbnail
    };
  } catch (err) {
    console.error("deleteCurriculumOutline error:", err);
    throw err;
  }
};