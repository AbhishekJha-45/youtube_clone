import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { Video } from "../models/video.model.js";
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
    const video = await Video.create({
      title,
      description,
      uploadedBy: req.user._id,
      videoFile: req.file?.path,
      thumbnail: req.file?.path,
      duration: 0,
    });
    return res
      .status(201)
      .json({ message: "Video uploaded successfully", video });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
