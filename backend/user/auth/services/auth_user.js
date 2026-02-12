import connection from "../../../database/database.js";

export const getUserDetailsService = (email, client = null) => {
	return new Promise((resolve, reject) => {
		const query = `
			SELECT
				u.id AS user_id,
				u.name,
				u.email,
				u.contact_number,
				u.dob,
				u.gender,
				u.profile_picture_url,
				u.created_on as created_at,
				up.password
			FROM bm.users u
			LEFT JOIN bm.user_passwords up
			ON u.id = up.user_id
			WHERE u.email = $1
		`;

		const db = client || connection;

		db.query(query, [email], (err, result) => {
			if (err) return reject(err);
			if (result.rows.length === 0) return resolve(null);
			resolve(result.rows[0]);
		});
	});
};

export const getUserByIdService = (userId, client = null) => {
	return new Promise((resolve, reject) => {
		const query = `
			SELECT
				u.id AS user_id,
				u.email,
				up.password
			FROM bm.users u
			LEFT JOIN bm.user_passwords up
			ON u.id = up.user_id
			WHERE u.id = $1
			AND u.status = 1
		`;

		const db = client || connection;

		db.query(query, [userId], (err, result) => {
			if (err) return reject(err);
			if (result.rows.length === 0) return resolve(null);
			resolve(result.rows[0]);
		});
	});
};

export const updatePasswordService = (userId, newPassword, client = null) => {
	return new Promise((resolve, reject) => {
		const query = `
			UPDATE bm.user_passwords
			SET password = $2
			WHERE user_id = $1
		`;

		const db = client || connection;

		db.query(query, [userId, newPassword], (err) => {
			if (err) return reject(err);
			resolve(true);
		});
	});
};

export const getUserDetailsByIdService = async (userId, client = connection) => {
	try {
		const query = `
		SELECT
				u.id AS user_id,
				u.name,
				u.email,
				u.contact_number,
				u.dob,
				u.gender,
				u.profile_picture_url
				FROM bm.users u
			WHERE u.id = $1
		`;

		const db = client;
		const result = await db.query(query, [userId]);

		if (result.rows.length === 0) return null;

		return result.rows[0];

	} catch (err) {
		console.error("DB Error:", err);
		return -1; // consistent with your reject(-1)
	}
};

export const updateProfileService = async (
	userId,
	name,
	contact_number,
	dob,
	gender,
	email,
	profilePictureUrl,
	client = connection
) => {
	try {
		const query = `
			UPDATE bm.users
			SET 
				name = $1,
				contact_number = $2,
				dob = $3,
				gender = $4,
				email = $5,
				profile_picture_url = $6,
				updated_at = NOW()
			WHERE id = $7
		`;

		const db = client;
		const result = await db.query(query, [
			name,
			contact_number,
			dob,
			gender,
			email,
			profilePictureUrl,
			userId
		]);

		// result.rowCount = number of rows updated
		if (result.rowCount === 1) return true;
		return false;

	} catch (err) {
		console.error("DB Error:", err);
		return -1; // your style
	}
};

export const saveUserOtpService = async (
	userId,
	otp,
	expiresAt,
	email,
	client = connection
) => {
	try {
		const query = `
            INSERT INTO bm.user_otps (user_id, email, otp, expires_at)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (user_id) 
            DO UPDATE SET 
                email = EXCLUDED.email,
                otp = EXCLUDED.otp,
                expires_at = EXCLUDED.expires_at,
                updated_at = NOW()
        `;

		await client.query(query, [userId, email, otp, expiresAt]);

		return true;

	} catch (err) {
		console.error("saveUserOtpService Error:", err);
		return -1;
	}
};


export const getOtpByUserIdService = async (userId, client = connection) => {
	try {
		const query = `
            SELECT 
                otp,
                expires_at,
                email
            FROM bm.user_otps
            WHERE user_id = $1
            LIMIT 1
        `;

		const result = await client.query(query, [userId]);

		if (result.rows.length === 0) return null;

		return result.rows[0]; // { otp, expires_at, email }

	} catch (err) {
		console.error("getOtpByUserIdService Error:", err);
		return -1;
	}
};

export const clearOtpService = async (userId, client = connection) => {
	try {
		const query = `
            DELETE FROM bm.user_otps
            WHERE user_id = $1
        `;

		await client.query(query, [userId]);

		return true;

	} catch (err) {
		console.error("clearOtpService Error:", err);
		return -1;
	}
};
