import cron from "node-cron";
import connection from "../database";

// Runs every Monday at midnight IST
cron.schedule(
  "0 0 * * 1",
  async () => {
    console.log("[CRON] Running weekly Tracking Questions cron...");

    let outerClient;

    try {
      outerClient = await connection.connect();

      // Step 1: Get all distinct active course_ids
      const coursesResult = await outerClient.query(`
      SELECT DISTINCT course_id
      FROM bm.progress_tracking_questions
      WHERE status = 1
    `);

      outerClient.release();
      outerClient = null;

      if (coursesResult.rowCount === 0) {
        console.warn("[CRON] No active courses found.");
        return;
      }

      // Step 2: Process each course with its own client
      for (const { course_id } of coursesResult.rows) {
        const client = await connection.connect();

        try {
          await client.query("BEGIN");

          // Step 3: Get current cron state for this course
          const stateResult = await client.query(
            `SELECT week_no FROM bm.questions_cron_state WHERE course_id = $1`,
            [course_id],
          );

          // Step 4: Determine next week_no
          const next_week_no =
            stateResult.rowCount > 0 ? stateResult.rows[0].week_no + 1 : 1;

          // Step 5: Check all 7 days exist for the next week
          const questionsResult = await client.query(
            `SELECT day_no
           FROM bm.progress_tracking_questions
           WHERE course_id = $1
           AND week_no = $2
           AND status = 1
           ORDER BY day_no`,
            [course_id, next_week_no],
          );

          const availableDays = questionsResult.rows.map((r) => r.day_no);
          const missingDays = [1, 2, 3, 4, 5, 6, 7].filter(
            (d) => !availableDays.includes(d),
          );

          if (missingDays.length > 0) {
            console.warn(
              `[CRON] ⚠️ Course ${course_id} — Week ${next_week_no} missing days: ${missingDays.join(", ")}. Skipping.`,
            );
            await client.query("ROLLBACK");
            continue;
          }

          // Step 6: Update cron state — store week_no, reset day to 1
          await client.query(
            `INSERT INTO bm.questions_cron_state (course_id, week_no, day_no, updated_on)
           VALUES ($1, $2, 1, NOW())
           ON CONFLICT (course_id) DO UPDATE
           SET
             week_no    = EXCLUDED.week_no,
             day_no     = 1,
             updated_on = NOW()`,
            [course_id, next_week_no],
          );

          await client.query("COMMIT");

          console.log(
            `[CRON] ✅ Course ${course_id} — Week ${next_week_no} activated (Days: ${availableDays.join(", ")})`,
          );
        } catch (error) {
          await client.query("ROLLBACK");
          console.error(`[CRON] ❌ Course ${course_id} failed:`, error.message);
        } finally {
          client.release(); // always release per-course client
        }
      }
    } catch (error) {
      console.error("[CRON] ❌ Fatal error:", error.message);
      if (outerClient) outerClient.release();
    }
  },
  {
    timezone: "Asia/Kolkata", // ✅ Ensures it fires Monday midnight IST
  },
);
