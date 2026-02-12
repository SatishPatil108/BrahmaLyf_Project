import connection from "../../../database/database.js";

export const existingUserService = (email, contactNumber, client = null) => {
	return new Promise((resolve, reject) => {
		const query = `
			SELECT id 
			FROM bm.users 
			WHERE email = $1 OR contact_number = $2
		`;

		const db = client || connection;

		db.query(query, [email, contactNumber], (err, result) => {
			if (err) return reject(err);
			resolve(result.rows.length > 0);
		});
	});
};

export const userRegistrationService = (
	name,
	email,
	contactNumber,
	dob,
	gender,
	profilePictureUrl,
	createdOn,
	status,
	client = null
) => {
	return new Promise((resolve, reject) => {
		const query = `
			INSERT INTO bm.users (
				name, 
				email, 
				contact_number, 
				dob, 
				gender, 
				profile_picture_url, 
				created_on, 
				status
			)
			VALUES (
				$1, $2, $3, $4, $5, $6, $7, $8
			)
			RETURNING 
				id, 
				name, 
				email, 
				contact_number, 
				dob, 
				gender, 
				profile_picture_url, 
				created_on,
				status
		`;

		const values = [
			name,
			email,
			contactNumber || 0,
			dob,
			gender,
			profilePictureUrl,
			createdOn,
			status
		];

		const db = client || connection;

		db.query(query, values, (err, result) => {
			if (err) return reject(err);
			resolve(result.rows[0]);
		});
	});
};

export const userRegistrationPasswordService = (userId, password, status, client = null) => {
	return new Promise((resolve, reject) => {
		const query = `
			INSERT INTO bm.user_passwords (
				user_id, 
				password,
				status
			)
			VALUES ($1, $2, $3)
		`;

		const values = [userId, password, status];
		const db = client || connection;

		db.query(query, values, (err) => {
			if (err) return reject(err);
			resolve(true);
		});
	});
};