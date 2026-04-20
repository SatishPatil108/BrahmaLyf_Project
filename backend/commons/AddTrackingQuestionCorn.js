import cron from "node-cron";
import pool from "../database/database.js";

// Runs every Monday at midnight IST
cron.schedule("0 0 * * 1", async () => {
  console.log("[CRON] Running weekly Tracking Questions cron...");

  try {
    const coursesResult = await pool.query(`
      SELECT DISTINCT course_id
      FROM bm.progress_tracking_questions
      WHERE status = 1
    `);

    if (coursesResult.rowCount === 0) {
      console.warn("[CRON] No active courses found.");
      return;
    }

    for (const { course_id } of coursesResult.rows) {
      const client = await pool.connect();

      try {
        await client.query("BEGIN");

        const stateResult = await client.query(
          `SELECT week_no FROM bm.questions_cron_state WHERE course_id = $1`,
          [course_id],
        );

        const maxWeekResult = await client.query(
          `SELECT MAX(week_no) as max_week
           FROM bm.progress_tracking_questions
           WHERE course_id = $1 AND status = 1`,
          [course_id],
        );

        const maxWeek = maxWeekResult.rows[0].max_week || 1;

        let next_week_no =
          stateResult.rowCount > 0 ? stateResult.rows[0].week_no + 1 : 1;

        if (next_week_no > maxWeek) next_week_no = 1;

        const questionsResult = await client.query(
          `SELECT day_no
           FROM bm.progress_tracking_questions
           WHERE course_id = $1
           AND week_no = $2
           AND status = 1`,
          [course_id, next_week_no],
        );

        const availableDays = questionsResult.rows.map((r) => r.day_no);
        const missingDays = [1, 2, 3, 4, 5, 6, 7].filter(
          (d) => !availableDays.includes(d),
        );

        if (missingDays.length > 0) {
          console.warn(
            `[CRON] Course ${course_id} — Week ${next_week_no} missing days: ${missingDays}`,
          );
          await client.query("ROLLBACK");
          continue;
        }

        await client.query(
          `INSERT INTO bm.questions_cron_state (course_id, week_no, day_no, updated_on)
           VALUES ($1, $2, 1, NOW())
           ON CONFLICT (course_id) DO UPDATE
           SET week_no = EXCLUDED.week_no,
               day_no = 1,
               updated_on = NOW()`,
          [course_id, next_week_no],
        );

        await client.query("COMMIT");
      } catch (err) {
        await client.query("ROLLBACK");
        console.error(`[CRON] ❌ Course ${course_id}:`, err.message);
      } finally {
        client.release();
      }
    }
  } catch (err) {
    console.error("[CRON] ❌ Fatal error:", err.message);
  }
});
