import connection from "../../../database/database.js";

const runQuery = (query, params = []) => {
	return new Promise((resolve, reject) => {
		connection.query(query, params, (err, result) => {
			if (err) {
				console.error("DB Error:", err);
				return reject(err);
			}
			return resolve(result);
		});
	});
};

export const postFaqService = async (question, answer, status) => {
	const query = `
		INSERT INTO bm.faqs (
			question,
			answer,
			status
		)
		VALUES ($1, $2, $3)
		RETURNING
			id,
			question,
			answer,
			status
	`;
	try {
		const result = await runQuery(query, [question, answer, status]);
		return result.rows.length ? result.rows[0] : -1;
	} catch (err) {
		throw err;
	}
};

export const getFaqService = async (pageNo, pageSize) => {
  try {
    pageNo = parseInt(pageNo, 10);
    pageSize = parseInt(pageSize, 10);
    if (!pageNo || pageNo < 1) pageNo = 1;
    if (!pageSize || pageSize < 1) pageSize = 10;
    const offset = (pageNo - 1) * pageSize;
    const countQuery = `
      SELECT COUNT(*) AS total
      FROM bm.faqs
      WHERE status = 1
    `;
    const countResult = await runQuery(countQuery);
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
      LIMIT $1 OFFSET $2
    `;
    const dataResult = await runQuery(dataQuery, [pageSize, offset]);
    return {
      current_page: pageNo,
      page_size: pageSize,
      total_records: totalRecords,
      total_pages: totalPages,
      has_next_page: pageNo < totalPages,
      has_prev_page: pageNo > 1,
      faqs: dataResult.rows
    };
  } catch (err) {
    console.error("getFaq error:", err);
    throw err;
  }
};

export const updateFaqService = async (faqId, question, answer, status) => {
	const query = `
		UPDATE bm.faqs
		SET
			question = $2,
			answer = $3,
			status = $4
		WHERE
			id = $1 AND status = 1
		RETURNING
			id,
			question,
			answer,
			status
	`;
	try {
		const result = await runQuery(query, [faqId, question, answer, status]);
		return result.rows.length ? result.rows[0] : -1;
	} catch (err) {
		throw err;
	}
};

export const deleteFaqService = async (faqId) => {
	const query = `
		UPDATE bm.faqs
		SET status = 0
		WHERE id = $1
		RETURNING id
	`;
	try {
		const result = await runQuery(query, [faqId]);
		return result.rows.length ? result.rows[0] : -1;
	} catch (err) {
		throw err;
	}
};