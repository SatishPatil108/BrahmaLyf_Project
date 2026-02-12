import {
	error,
	HTTP_BAD_REQUEST,
	APP_RESPONSE_CODE_ERROR,
	success,
	HTTP_CREATED,
	APP_RESPONSE_CODE_SUCCESS,
	HTTP_OK,
	HTTP_INTERNAL_SERVER_ERROR
} from "../../../../response/response.js";
import {
	COURSE_ADDED_SUCCESS,
	NO_RECORD_FOUND,
	ALL_COURSES_LIST,
	COURSE_DETAILS_FETCHED_SUCCESS,
	COURSE_CURRICULUM_ADDED_FAILED,
	COURSE_CURRICULUM_ADDED_SUCCESS,
	COURSE_UPDATED_SUCCESS,
	SOMETHING_WENT_WRONG,
	COURSE_DELETED_FAILED,
	COURSE_DELETED_SUCCESS,
	CURRICULUM_OUTLINE_DELETED_SUCCESS,
	CURRICULUM_OUTLINE_DELETED_FAILED,
	COURSE_CURRICULUM_UPDATE_FAILED,
	COURSE_CURRICULUM_UPDATE_SUCCESS
} from "../messages/course.js";
import {
	postCourseService,
	postCourseVideoService,
	postCurriculumOutlineService,
	postCurriculumVideoService,
	updateCourseService,
	updateVideoService,
	updateCurriculumOutlineAndRelatedVideoService,
	getCourseVideoByVideoIdService,
	getAllCoursesService,
	getCourseByIdService,
	getIntroVideoByVideoIdService,
	getVideoThumbnailsByCourseIdService,
	deleteCourseService,
	deleteCurriculumOutlineService
} from "../services/course.js";
import { runTransaction } from "../../../../database/transaction.js";
import removeFiles from "../../../../utils/removeFiles.js";
import saveUploadedFile from "../../../../utils/uploadFile.js";

export const postCourseModel = async (req, res) => {
  try {
    const createdOn = new Date();
    const status = 1;

    const result = await runTransaction(async (client) => {

      const postCourseResponse = await postCourseService(
        req.body.courseName,
        req.body.targetedAudience,
        req.body.learningOutcome,
        req.body.curriculumDesc,
        `${req.body.courseDurationHours}h ${req.body.courseDurationMinutes}m`,
        req.body.coachId,
        createdOn,
        status,
        client
      );

      if (postCourseResponse === -1) throw new Error("Course insert failed");

      const courseId = postCourseResponse.course_id;

      const safeCourseName = req.body.courseName.replace(/[^a-zA-Z0-9-_]/g, "_");
      const mainThumbFile = req.files.find(f => f.fieldname === "videoThumbnail");

      const mainThumbnailPath = mainThumbFile
        ? saveUploadedFile(mainThumbFile, "video-thumbnails/main", safeCourseName)
        : null;

      const postVideoResponse = await postCourseVideoService(
        req.body.domain,
        req.body.subdomain,
        req.body.coachId,
        courseId,
        req.body.videoTitle,
        req.body.videoDesc || null,
        req.body.videoUrl,
        mainThumbnailPath,
        createdOn,
        status,
        client
      );

      if (postVideoResponse === -1) throw new Error("Video insert failed");

      const curriculums = req.body.curriculums;

      for (let i = 0; i < curriculums.length; i++) {
        const curriculum = curriculums[i];

        const safeCurriculumTitle = curriculum.title.replace(/[^a-zA-Z0-9-_]/g, "_");

        const possibleFields = [
          `curriculums[${i}][thumbnail_file]`,
          `curriculums.${i}.thumbnail_file`,
          `curriculums[${i}].thumbnail_file`,
          `curriculums.${i}[thumbnail_file]`
        ];

        const curriculumThumbFile = req.files.find(f =>
          possibleFields.includes(f.fieldname)
        );

        const curriculumThumbPath = curriculumThumbFile
          ? saveUploadedFile(curriculumThumbFile, "video-thumbnails/curriculum", safeCurriculumTitle)
          : null;

        const outline = await postCurriculumOutlineService(
          courseId,
          curriculum.header_type,
          curriculum.title,
          curriculum.description,
          curriculum.sequence_no,
          createdOn,
          status,
          client
        );

        if (outline === -1) throw new Error("Curriculum insert failed");

        const courseVideo = await postCurriculumVideoService(
          courseId,
          outline.id,
          curriculum.video_url,
          curriculumThumbPath,
          createdOn,
          status,
          client
        );

        if (courseVideo === -1) throw new Error("Curriculum video insert failed");
      }

      return postCourseResponse;
    });

    return success(
      res,
      HTTP_CREATED,
      APP_RESPONSE_CODE_SUCCESS,
      COURSE_ADDED_SUCCESS,
      result
    );

  } catch (err) {
    console.error("POST COURSE FAILED:", err);
    return error(
      res,
      HTTP_INTERNAL_SERVER_ERROR,
      APP_RESPONSE_CODE_ERROR,
      "Transaction failed",
      null
    );
  }
};

export const postCurriculumOutlineModel = async (req, res) => {
  try {
    const result = await runTransaction(async (client) => {

      const courseId = req.params.courseId;
      const { header_type, sequence_no, title, description, video_url } = req.body;

      if (!courseId || !header_type || !title) {
        throw new Error("Missing required fields");
      }

      const createdOn = new Date();
      const status = 1;

      const safeTitle = title.replace(/[^a-zA-Z0-9-_]/g, "_");

      const thumbnailUrl = req.file
        ? saveUploadedFile(req.file, "video-thumbnails/curriculum", safeTitle)
        : null;

      const outlineResponse = await postCurriculumOutlineService(
        courseId,
        header_type,
        title,
        description,
        sequence_no,
        createdOn,
        status,
        client
      );

      if (!outlineResponse || outlineResponse === -1)
        throw new Error("Error adding curriculum");

      const videoResponse = await postCurriculumVideoService(
        courseId,
        outlineResponse.id,
        video_url,
        thumbnailUrl,
        createdOn,
        status,
        client
      );

      if (!videoResponse || videoResponse === -1)
        throw new Error("Error adding curriculum video");

      return { curriculum: outlineResponse, video: videoResponse };
    });

    return success(
      res,
      HTTP_CREATED,
      APP_RESPONSE_CODE_SUCCESS,
      COURSE_CURRICULUM_ADDED_SUCCESS,
      result
    );

  } catch (err) {
    console.error("postCurriculumOutline failed:", err);
    return error(
      res,
      HTTP_BAD_REQUEST,
      APP_RESPONSE_CODE_ERROR,
      COURSE_CURRICULUM_ADDED_FAILED,
      null
    );
  }
};

export const updateCourseModel = async (req, res) => {
  try {
    const result = await runTransaction(async (client) => {

      const courseId = req.params.courseId;
      const now = new Date();

      const updateCourseResponse = await updateCourseService(
        courseId,
        req.body.course_name,
        req.body.target_audience,
        req.body.learning_outcomes,
        req.body.curriculum_description,
        req.body.duration,
        req.body.coach_id,
        now,
        client
      );

      if (updateCourseResponse === -1)
        throw new Error("Error updating course");

      const existingIntroVideo = await getIntroVideoByVideoIdService(
        req.body.video_id,
        client
      );

      if (existingIntroVideo === -1)
        throw new Error("Error fetching intro video");

      let videoThumbnailUrl = existingIntroVideo.video_thumbnail_url;

      if (req.file) {
        const safeCourseName = req.body.course_name.replace(/[^a-zA-Z0-9-_]/g, "_");

        videoThumbnailUrl = saveUploadedFile(
          req.file,
          "video-thumbnails/main",
          safeCourseName
        );

        if (existingIntroVideo.video_thumbnail_url) {
          await removeFiles([existingIntroVideo.video_thumbnail_url]);
        }
      }

      const updateVideoResponse = await updateVideoService(
        req.body.video_id,
        req.body.domain_id,
        req.body.subdomain_id,
        req.body.coach_id,
        req.body.title,
        req.body.description,
        req.body.video_url,
        videoThumbnailUrl,
        now,
        courseId,
        client
      );

      if (updateVideoResponse === -1)
        throw new Error("Error updating intro video");

      return {
        course: updateCourseResponse,
        video: updateVideoResponse
      };
    });

    return success(
      res,
      HTTP_OK,
      APP_RESPONSE_CODE_SUCCESS,
      COURSE_UPDATED_SUCCESS,
      result
    );

  } catch (err) {
    console.error("updateCourseModel failed:", err);
    return error(
      res,
      HTTP_INTERNAL_SERVER_ERROR,
      APP_RESPONSE_CODE_ERROR,
      SOMETHING_WENT_WRONG,
      null
    );
  }
};

export const updateCurriculumOutlineModel = async (req, res) => {
	try {
		const curriculumId = req.params.curriculumId;
		const { header_type, sequence_no, title, description, video_id, video_url } = req.body;

		const updatedOn = new Date();

		// ------------------------------------------------------
		// 1. FETCH EXISTING VIDEO (to get old thumbnail path)
		// ------------------------------------------------------
		const existingVideo = await getCourseVideoByVideoIdService(video_id);
		if (!existingVideo || existingVideo === -1) {
			return error(
				res,
				HTTP_BAD_REQUEST,
				APP_RESPONSE_CODE_ERROR,
				SOMETHING_WENT_WRONG,
				null
			);
		}

		// ------------------------------------------------------
		// 2. SAVE NEW THUMBNAIL (optional)
		// ------------------------------------------------------
		let videoThumbnailUrl = existingVideo.thumbnail_url;

		if (req.file) {
			// sanitize title for filename
			const safeTitle = title.replace(/[^a-zA-Z0-9-_]/g, "_");

			// save new file
			videoThumbnailUrl = saveUploadedFile(
				req.file,
				"video-thumbnails/curriculum",
				safeTitle
			);

			// delete old thumbnail
			if (existingVideo.thumbnail_url) {
				await removeFiles([existingVideo.thumbnail_url]);
			}
		}

		// ------------------------------------------------------
		// 3. UPDATE CURRICULUM OUTLINE + RELATED VIDEO
		// ------------------------------------------------------
		const result = await updateCurriculumOutlineAndRelatedVideoService(
			curriculumId,
			header_type,
			sequence_no,
			title,
			description,
			video_id,
			video_url,
			videoThumbnailUrl,
			updatedOn
		);

		if (!result || result === -1) {
			return error(
				res,
				HTTP_BAD_REQUEST,
				APP_RESPONSE_CODE_ERROR,
				COURSE_CURRICULUM_UPDATE_FAILED,
				null
			);
		}

		// result[0] => updated curriculum
		// result[1] => updated video

		return success(
			res,
			HTTP_OK,
			APP_RESPONSE_CODE_SUCCESS,
			COURSE_CURRICULUM_UPDATE_SUCCESS,
			{ curriculum: result[0], video: result[1] }
		);

	} catch (err) {
		console.error("Error updating curriculum outline:", err);
		return error(
			res,
			HTTP_INTERNAL_SERVER_ERROR,
			APP_RESPONSE_CODE_ERROR,
			SOMETHING_WENT_WRONG,
			null
		);
	}
};

export const getAllCoursesModel = async (req, res) => {
	const { pageNo, pageSize } = req.params;
	const allCoursesResponse = await getAllCoursesService(pageNo, pageSize);
	if (allCoursesResponse == -1) {
		return error(res, HTTP_OK, APP_RESPONSE_CODE_ERROR, NO_RECORD_FOUND, null);
	}
	return success(res, HTTP_OK, APP_RESPONSE_CODE_SUCCESS, ALL_COURSES_LIST, allCoursesResponse);
};

export const getCourseByIdModel = async (req, res) => {
	try {
		const courseId = req.params.courseId;
		const getCourseByIdResponse = await getCourseByIdService(courseId);
		if (getCourseByIdResponse == -1) {
			return error(res, HTTP_OK, APP_RESPONSE_CODE_ERROR, NO_RECORD_FOUND, null);
		}
		return success(res, HTTP_OK, APP_RESPONSE_CODE_SUCCESS, COURSE_DETAILS_FETCHED_SUCCESS, getCourseByIdResponse);
	} catch (err) {
		console.error(err);
		return error(res, HTTP_OK, APP_RESPONSE_CODE_ERROR, NO_RECORD_FOUND, null);
	}
};


export const deleteCourseModel = async (req, res) => {
	const courseId = req.params.courseId;
	const videoThumbnails = await getVideoThumbnailsByCourseIdService(courseId);
	if (videoThumbnails != -1) {
		await removeFiles(videoThumbnails.map(item => item.thumbnail_url));
	}
	const deleteCourseResponse = await deleteCourseService(courseId);
	if (deleteCourseResponse == -1) {
		return error(res, HTTP_BAD_REQUEST, APP_RESPONSE_CODE_ERROR, COURSE_DELETED_FAILED, null);
	}
	return success(
		res,
		HTTP_OK,
		APP_RESPONSE_CODE_SUCCESS,
		COURSE_DELETED_SUCCESS,
		{ course_id: courseId }
	);
};

export const deleteCurriculumOutlineModel = async (req, res) => {
	const { courseId, curriculumId } = req.params;
	const result = await deleteCurriculumOutlineService(courseId, curriculumId);
	if (result.status === 0) {
		return error(res, HTTP_BAD_REQUEST, APP_RESPONSE_CODE_ERROR, CURRICULUM_OUTLINE_DELETED_FAILED, null);
	}
	if (result.video_thumbnail) {
		removeFiles([result.video_thumbnail]);
	}
	return success(
		res,
		HTTP_OK,
		APP_RESPONSE_CODE_SUCCESS,
		CURRICULUM_OUTLINE_DELETED_SUCCESS,
		result
	);
};