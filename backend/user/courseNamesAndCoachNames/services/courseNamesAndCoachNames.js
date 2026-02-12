import connection from "../../../database/database.js";

// ====================== SERVICE: Get Course & Coach Names ======================
export const getCourseNamesAndCoachNamesService = () => {
    return new Promise((resolve, reject) => {
        const courseQuery = `SELECT course_name FROM bm.courses WHERE status = 1`;
        const coachQuery = `SELECT name FROM bm.coaches WHERE status = 1`;
        Promise.all([runQuery(courseQuery), runQuery(coachQuery)])
            .then(([courseRows, coachRows]) => {
                if (!courseRows.length && !coachRows.length) {
                    return resolve(-1);
                }
                resolve({
                    course_names: courseRows.map(r => r.course_name),
                    coach_names: coachRows.map(r => r.name)
                });
            })
            .catch(err => {
                console.error("Error fetching course or coach names:", err);
                reject(err); // real error, not -1
            });
    });
};

// ====================== HELPER: SQL Runner ======================
const runQuery = (query) => {
    return new Promise((resolve, reject) => {
        connection.query(query, (err, result) => {
            if (err) return reject(err);
            resolve(result.rows);
        });
    });
};