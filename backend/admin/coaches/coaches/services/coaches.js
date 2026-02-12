import connection from "../../../../database/database.js";

export const postCoachService = (
	name,
	email,
	contactNumber,
	professionalTitle,
	bio,
	domainId,
	subdomainId,
	experience,
	profileImage,
	createdOn,
	status
) => {
	return new Promise((resolve, reject) => {
		const query = `
			INSERT INTO bm.coaches(
				name,
				email,
				contact_number,
				professional_title,
				bio,
				domain_id,
				subdomain_id,
				experience,
				profile_image,
				created_on,
				status
			)
			VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
			RETURNING
				id,
				name,
				email,
				contact_number,
				domain_id,
				professional_title,
				bio,
				subdomain_id,
				experience,
				profile_image AS profile_image_url,
				created_on,
				status
		`;
		connection.query(
			query,
			[
				name,
				email,
				contactNumber,
				professionalTitle,
				bio,
				domainId,
				subdomainId,
				experience,
				profileImage,
				createdOn,
				status
			],
			(err, result) => {
				if (err) return reject(err);
				if (!result.rows.length) return resolve(-1);
				resolve(result.rows[0]);
			}
		);
	});
};

export const getCoachService = (pageNo, pageSize) => {
	return new Promise((resolve, reject) => {
		pageNo = parseInt(pageNo, 10);
		pageSize = parseInt(pageSize, 10);
		const offset = (pageNo - 1) * pageSize;
		const totalQuery = `SELECT COUNT(*) AS total FROM bm.coaches WHERE status = 1`;
		const dataQuery = `
			SELECT
				c.id AS coach_id,
				c.name,
				c.email,
				c.contact_number,
				c.professional_title,
				c.bio,
				c.domain_id,
				c.subdomain_id,
				c.experience,
				c.profile_image AS profile_image_url,
				c.created_on,
				c.status
			FROM bm.coaches c
			WHERE c.status = 1
			ORDER BY c.id ASC
			LIMIT $1 OFFSET $2
		`;
		connection.query(totalQuery, (err, totalResult) => {
			if (err) return reject(err);
			const totalRecords = parseInt(totalResult.rows[0].total, 10);
			if (totalRecords === 0) return resolve(-1);
			connection.query(dataQuery, [pageSize, offset], (err, dataResult) => {
				if (err) return reject(err);
				const totalPages = Math.ceil(totalRecords / pageSize);
				resolve({
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
				id AS coach_id,
				name,
				email,
				contact_number,
				professional_title,
				bio,
				domain_id,
				subdomain_id,
				experience,
				profile_image AS profile_image_url,
				created_on,
				status
			FROM bm.coaches
			WHERE id = $1
		`;
		connection.query(query, [coachId], (err, result) => {
			if (err) return reject(err);
			if (!result.rows.length) return resolve(-1);
			resolve(result.rows[0]);
		});
	});
};

export const updateCoachService = (
	coachId,
	name,
	email,
	contactNumber,
	professionalTitle,
	bio,
	domainId,
	subdomainId,
	experience,
	filePath,
	createdOn,
	status
) => {
	return new Promise((resolve, reject) => {
		const query = `
			UPDATE bm.coaches
			SET
				name = $2,
				email = $3,
				contact_number = $4,
				professional_title = $5,
				bio = $6,
				domain_id = $7,
				subdomain_id = $8,
				experience = $9,
				profile_image = $10,
				created_on = $11,
				status = $12
			WHERE id = $1 AND status = 1
			RETURNING
				id,
				name,
				email,
				contact_number,
				professional_title,
				bio,
				domain_id,
				subdomain_id,
				experience,
				profile_image AS profile_image_url,
				created_on,
				status
		`;
		connection.query(
			query,
			[
				coachId,
				name,
				email,
				contactNumber,
				professionalTitle,
				bio,
				domainId,
				subdomainId,
				experience,
				filePath,
				createdOn,
				status
			],
			(err, result) => {
				if (err) return reject(err);
				if (!result.rows.length) return resolve(-1);
				resolve(result.rows[0]);
			}
		);
	});
};

export const deleteCoachService = (coachId) => {
	return new Promise(async (resolve, reject) => {
		try {
			const selectQuery = `
				SELECT profile_image
				FROM bm.coaches
				WHERE id = $1 AND status = 1
			`;
			const selectResult = await connection.query(selectQuery, [coachId]);
			if (selectResult.rows.length === 0) {
				return resolve(-1);  // no record found
			}
			const profile_image = selectResult.rows[0].profile_image;
			const deleteQuery = `
				UPDATE bm.coaches
				SET status = 0
				WHERE id = $1 AND status = 1
			`;
			const deleteResult = await connection.query(deleteQuery, [coachId]);
			if (deleteResult.rowCount === 0) {
				return resolve(-1);
			}
			resolve({
				status: deleteResult.rowCount,
				profile_image
			});
		} catch (err) {
			reject(err);
		}
	});
};

export const getAllCoachesService = () => {
	return new Promise((resolve, reject) => {
		const query = `
			SELECT
				c.id AS coach_id,
				c.name
			FROM bm.coaches c
			WHERE c.status = 1
			ORDER BY c.id ASC
		`;
		connection.query(query, (err, result) => {
			if (err) return reject(err);
			if (!result.rows.length) return resolve(-1);
			resolve(result.rows);
		});
	});
};