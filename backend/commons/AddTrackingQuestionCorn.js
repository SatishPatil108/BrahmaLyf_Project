import cron from "node-cron";
import pool from "../database/database.js";

export const runTrackingQuestionsCronForCourse = async (courseId) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Get current cron state for this course
    const stateResult = await client.query(
      `SELECT week_no
       FROM bm.questions_cron_state
       WHERE course_id = $1`,
      [courseId],
    );

    // Get maximum available week
    const maxWeekResult = await client.query(
      `SELECT MAX(week_no) AS max_week
       FROM bm.progress_practice_questions
       WHERE course_id = $1
         AND status = 1`,
      [courseId],
    );

    const maxWeek = maxWeekResult.rows[0].max_week || 1;

    // If no state exists, initialize with week 1
    // Otherwise move to next week
    let next_week_no =
      stateResult.rowCount > 0 ? stateResult.rows[0].week_no + 1 : 1;

    // Reset to week 1 after last week
    if (next_week_no > maxWeek) {
      next_week_no = 1;
    }

    // Validate all 7 days exist
    const questionsResult = await client.query(
      `SELECT day_no
       FROM bm.progress_practice_questions
       WHERE course_id = $1
         AND week_no = $2
         AND status = 1`,
      [courseId, next_week_no],
    );

    const availableDays = questionsResult.rows.map((r) => r.day_no);

    const missingDays = [1, 2, 3, 4, 5, 6, 7].filter(
      (day) => !availableDays.includes(day),
    );

    if (missingDays.length > 0) {
      throw new Error(
        `Week ${next_week_no} missing days: ${missingDays.join(", ")}`,
      );
    }

    // Insert or update cron state
    await client.query(
      `INSERT INTO bm.questions_cron_state
        (course_id, week_no, day_no, updated_on)
       VALUES ($1, $2, 1, NOW())
       ON CONFLICT (course_id)
       DO UPDATE SET
         week_no = EXCLUDED.week_no,
         day_no = 1,
         updated_on = NOW()`,
      [courseId, next_week_no],
    );

    await client.query("COMMIT");

    return {
      course_id: courseId,
      week_no: next_week_no,
      day_no: 1,
    };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

// "*/5 * * * *" for testing every 5 min and weekly "0 0 * * 1"
/**   Weekly cron - runs every Monday at 12:00 AM IST **/
cron.schedule("0 0 * * 1", async () => {
  console.log("[CRON] Running weekly Tracking Questions cron...");

  try {
    const coursesResult = await pool.query(`
      SELECT DISTINCT course_id
      FROM bm.progress_practice_questions
      WHERE status = 1
    `);

    if (coursesResult.rowCount === 0) {
      console.warn("[CRON] No active courses found.");
      return;
    }

    for (const { course_id } of coursesResult.rows) {
      try {
        await runTrackingQuestionsCronForCourse(course_id);
        console.log(`[CRON] Successfully updated Course ${course_id}`);
      } catch (err) {
        console.error(`[CRON] Course ${course_id}: ${err.message}`);
      }
    }
  } catch (err) {
    console.error("[CRON] Fatal error:", err.message);
  }
});

export default runTrackingQuestionsCronForCourse;
