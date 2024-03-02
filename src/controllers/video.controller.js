import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

const uploadVideo = asyncHandler(async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!(title || description)) {
      const error = new ApiError(400, "Title and description are required");
      return res.status(400).json({
        data: null,
        success: false,
        errors: [{ message: error.message }],
      });
    }
    const videoFilePath = req.files?.videoFile[0]?.path;
    const thumbnailPath = req.files?.thumbnail[0]?.path;
    if (!(videoFilePath || thumbnailPath)) {
      const error = new ApiError(400, "Video and thumbnail are required");
      return res.status(400).json({
        data: null,
        success: false,
        errors: [{ message: error.message }],
      });
    }
    const videoFile = await uploadToCloudinary(videoFilePath);
    const thumbnail = await uploadToCloudinary(thumbnailPath);
    if (!(videoFile || thumbnail)) {
      const error = new ApiError(500, "Video upload failed");
      return res.status(500).json({
        data: null,
        success: false,
        errors: [{ message: error.message }],
      });
    }
    const video = await Video.create({
      title,
      description,
      uploadedBy: req.user._id,
      videoFile: videoFile.url,
      thumbnail: thumbnail.url,
      owner: req.user._id,
      duration: videoFile.duration,
    });
    if (!video) {
      const error = new ApiError(500, "Video upload failed");
      return res.status(500).json({
        data: null,
        success: false,
        errors: [{ message: error.message }],
      });
    }
    return res
      .status(201)
      .json({ message: "Video uploaded successfully", video });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

const getAllVideosOfCurrentUser = asyncHandler(async (req, res) => {
  try {
    const owner = req.user._id;
    const videos = await Video.find({ owner });
    if (!videos || videos.length === 0) {
      throw new ApiError(404, "No videos found for the current user");
    }
    return res.status(200).json(videos);
  } catch (error) {
    throw new ApiError(500, "Failed to fetch videos");
  }
});
const getOneVideo = asyncHandler(async (req, res) => {
  try {
    const { videoId } = req.body;
    if (!videoId) {
      throw new ApiError(400, "Video id is required");
    }
    const video = await Video.findOne({ _id: videoId });
    if (!video || video.length === 0) {
      throw new ApiError(404, "Video not found");
    }
    return res.status(200).json(video);
  } catch (error) {
    throw new ApiError(500, "Failed to get video");
  }
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.body;
  if (!videoId) {
    throw new ApiError(400, "Video id is required");
  }
  const video = await Video.findByIdAndDelete(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  return res.status(200).json({
    message: "Video deleted successfully",
    status: 200,
    success: true,
  });
});
export { uploadVideo, getAllVideosOfCurrentUser, deleteVideo, getOneVideo };
