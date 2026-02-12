import connection from "../../../database/database.js";

// get admin details by email
export const getAdminDetailsService = (email) => {
	return new Promise((resolve, reject) => {
		const query = `
			SELECT
				a.id AS admin_id,
				a.name,
				a.email,
				ap.password
			FROM bm.admins a
			LEFT JOIN bm.admin_passwords ap
			ON a.id = ap.admin_id
			WHERE a.email = $1 AND ap.status = 1
		`;

		connection.query(query, [email], (err, result) => {
			if (err) return reject(err);
			if (!result.rows.length) return resolve(null);
			resolve(result.rows[0]);
		});
	});
};

// get admin by id
export const getAdminByIdService = (adminId) => {
	return new Promise((resolve, reject) => {
		const query = `
			SELECT
				a.id AS admin_id,
				a.email,
				ap.password
			FROM bm.admins a
			LEFT JOIN bm.admin_passwords ap
			ON a.id = ap.admin_id
			WHERE a.id = $1 AND ap.status = 1
		`;

		connection.query(query, [adminId], (err, result) => {
			if (err) return reject(err);
			if (!result.rows.length) return resolve(null);
			resolve(result.rows[0]);
		});
	});
};

// deactivate old password
export const deactivateOldPasswordService = (adminId) => {
	return new Promise((resolve, reject) => {
		const query = `
			UPDATE bm.admin_passwords
			SET status = 0
			WHERE admin_id = $1 AND status = 1
		`;

		connection.query(query, [adminId], (err) => {
			if (err) return reject(err);
			resolve(true);
		});
	});
};

// insert new password
export const insertNewPasswordService = (adminId, newPassword) => {
	return new Promise((resolve, reject) => {
		const query = `
			INSERT INTO bm.admin_passwords (admin_id, password, status)
			VALUES ($1, $2, 1)
		`;

		connection.query(query, [adminId, newPassword], (err) => {
			if (err) return reject(err);
			resolve(true);
		});
	});
};

export const saveOtpService=()=>{};
export const getOtpByAdminIdService=()=>{};
export const clearOtpService=()=>{};	 
export const updateAdminPasswordService=()=>{};	 