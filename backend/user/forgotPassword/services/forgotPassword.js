import connection from "../../../database/database.js";

export const getUserIdByEmailService = async (email, client = connection) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT u.id AS user_id
            FROM bm.users u
            WHERE u.email = $1
            AND u.status = 1
        `;

        const db = client || connection;

        db.query(query, [email], (err, result) => {
            if (err) return reject(err);
            if (result.rows.length === 0) return resolve(null);

            resolve(result.rows[0]); // <-- FIXED
        });
    });
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

    } catch (error) {
        console.error("saveUserOtpService Error:", error);
        return -1;
    }
};

export const getOtpByEmailService = async (email, client = connection) => {
    try {
        const query = `
            SELECT 
                otp,
                expires_at,
                user_id
            FROM bm.user_otps
            WHERE email = $1
            LIMIT 1
        `;

        const result = await client.query(query, [email]);
        if (result.rows.length === 0) return null;

        return result.rows[0];

    } catch (err) {
        console.error("getOtpByEmailService Error:", err);
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
