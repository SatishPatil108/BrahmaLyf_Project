import connection from "../../../database/database.js";

// period config
const periodConfig = {
	"7d": { interval_length: "7 days", granularity: "day", generate_interval: "1 day" },
	"15d": { interval_length: "15 days", granularity: "day", generate_interval: "1 day" },
	"1m": { interval_length: "1 month", granularity: "day", generate_interval: "1 day" },
	"3m": { interval_length: "3 months", granularity: "week", generate_interval: "1 week" },
	"6m": { interval_length: "6 months", granularity: "month", generate_interval: "1 month" },
	"1y": { interval_length: "1 year", granularity: "month", generate_interval: "1 month" },
	"5y": { interval_length: "5 years", granularity: "month", generate_interval: "1 month" }
};

// get dashboard data
export const getDashboardDataService = () => {
	return new Promise((resolve, reject) => {
		const query = `
			SELECT 
				(SELECT COUNT(*) FROM bm.courses WHERE status = 1) AS total_courses,
				(SELECT COUNT(*) FROM bm.coaches WHERE status = 1) AS total_coaches,
				(SELECT COUNT(*) FROM bm.users WHERE status = 1) AS total_users,
				(SELECT COUNT(*) FROM bm.domains WHERE status = 1) AS total_domains,
				(
					SELECT COUNT(*) FROM bm.users 
					WHERE status = 1 
					AND DATE_TRUNC('month', created_on) = DATE_TRUNC('month', CURRENT_DATE)
				) AS active_users_month,
				(
					SELECT COUNT(*) FROM bm.users 
					WHERE status = 1 
					AND DATE_TRUNC('week', created_on) = DATE_TRUNC('week', CURRENT_DATE)
				) AS new_signups_week,
				(
					SELECT json_agg(row_to_json(t))
					FROM (
						SELECT c.id AS course_id, c.course_name, COUNT(e.id) AS total_enrollments
						FROM bm.course_enrollments e
						JOIN bm.courses c ON c.id = e.course_id
						WHERE e.status = 1
						GROUP BY c.id, c.course_name
						ORDER BY total_enrollments DESC
						LIMIT 5
					) t
				) AS top_courses;
		`;

		connection.query(query, (err, result) => {
			if (err) return reject(err);
			if (!result.rows.length) return resolve(-1);
			resolve(result.rows[0]);
		});
	});
};

// get user counts
export const getUserCountsService = async (period) => {
	if (!period || !periodConfig[period]) {
		throw new Error(
			"Invalid or missing period parameter. Allowed: 7d, 15d, 1m, 3m, 6m, 1y, 5y."
		);
	}

	const { interval_length, granularity, generate_interval } = periodConfig[period];

	const query = `
WITH time_bounds AS (
	SELECT
		date_trunc($1, NOW()) - ($2)::interval AS start_date,
		date_trunc($1, NOW()) AS end_date
),
time_periods AS (
	SELECT generate_series(
		(SELECT start_date FROM time_bounds),
		(SELECT end_date FROM time_bounds),
		($3)::interval
	) AS period_start
)
SELECT
	t.period_start::date AS period_start_date,
	CASE
		WHEN $1 = 'day' THEN to_char(t.period_start, 'Dy')
		WHEN $1 = 'week' THEN
			to_char(t.period_start, 'YYYY-MM-DD') || ' to ' ||
			to_char(t.period_start + INTERVAL '6 days', 'YYYY-MM-DD')
		WHEN $1 = 'month' THEN to_char(t.period_start, 'YYYY-MM')
	END AS period_name,
	COUNT(u.id) AS user_count
FROM time_periods t
LEFT JOIN bm.users u
	ON u.status = 1
	AND u.created_on >= t.period_start
	AND u.created_on < t.period_start + ($3)::interval
GROUP BY t.period_start
ORDER BY t.period_start;
`;

	const result = await connection.query(query, [
		granularity,
		interval_length,
		generate_interval
	]);

	return {
		period,
		data: result.rows || []
	};
};