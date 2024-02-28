import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { APiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
const createVideoLike = asyncHandler(async (req, res) => {
  try {
    // get video id from request body
    const { videoId } = req.body;
    if (!videoId) {
      return res
        .status(400)
        .json(new APiResponse(400, "Video id is required", null));
    }
    // get user id from request object
    const userId = req.user._id;
    if (!userId) {
      return res.status(400).json(new APiResponse(400, "User id is required"));
    }
    // check if user has already liked the video
    const like = await Like.findOne({ video: videoId, likedBy: userId });
    // if user has already liked the video, return error
    if (like) {
      return res
        .status(400)
        .json({ message: "You have already liked this video" });
    }
    // create new like
    const newLike = await Like.create({ video: videoId, likedBy: userId });
    // return success response
    return res.status(201).json(new APiResponse(201, "Like created", newLike));
  } catch (error) {
    return res.status(500).json(new ApiError(500, error.message));
  }
});

const deleteVideoLike = asyncHandler(async (req, res) => {
  // get video id from request body
  const { videoId } = req.body;
  if (!videoId) {
    throw new ApiError(400, "Video id is required");
  }
  // get user id from request object
  const userId = req.user._id;
  // check if user has already liked the video
  const like = await Like.findOne({ video: videoId, likedBy: userId });
  // if user has not liked the video, return error
  if (!like) {
    return res
      .status(400)
      .json(new ApiError(400, "You have not liked this video"));
  }
  // delete like
  await Like.findByIdAndDelete(like._id);
  // return success response
  return res
    .status(200)
    .json(new APiResponse(200, "Like deleted successfully", null));
});

const createCommentLike = asyncHandler(async (req, res) => {
  try {
    const { commentId } = req.body;
    if (!commentId) {
      const error = new ApiError(400, "Comment id is required");
      return res.status(400).json({
        data: null,
        success: false,
        errors: [{ message: error.message }],
      });
    }
    const userId = req.user._id;
    const like = await Like.findOne({ comment: commentId, likedBy: userId });
    if (like) {
      const error = new ApiError(400, "You have already liked this comment");
      return res.status(400).json({
        data: null,
        success: false,
        errors: [{ message: error.message }],
      });
    }
    const newLike = await Like.create({ comment: commentId, likedBy: userId });
    return res.status(201).json(new APiResponse(201, "Like created", newLike));
  } catch (error) {
    return res.status(500).json(new ApiError(500, error.message));
  }
});

const deleteCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.body;
  if (!commentId) {
    const error = new ApiError(400, "Comment id is required");
    return res.status(400).json({
      data: null,
      success: false,
      errors: [{ message: error.message }],
    });
  }
  const userId = req.user._id;
  const like = await Like.findOne({ comment: commentId, likedBy: userId });
  if (!like) {
    const error = new ApiError(400, "You have not liked this comment");
    return res.status(400).json({
      data: null,
      success: false,
      errors: [{ message: error.message }],
    });
  }
  await Like.findByIdAndDelete(like._id);
  return res
    .status(200)
    .json(new APiResponse(200, "Like deleted successfully", null));
});
const createTweetLike = asyncHandler(async (req, res) => {
  try {
    const { tweetId } = req.body;
    if (!tweetId) {
      const error = new ApiError(400, "Tweet id is required");
      return res.status(400).json({
        data: null,
        success: false,
        errors: [{ message: error.message }],
      });
    }
    const userId = req.user._id;
    const like = await Like.findOne({ tweet: tweetId, likedBy: userId });
    if (like) {
      const error = new ApiError(400, "You have already liked this tweet");
      return res.status(400).json({
        data: null,
        success: false,
        errors: [{ message: error.message }],
      });
    }
    const newLike = await Like.create({ tweet: tweetId, likedBy: userId });
    return res
      .status(201)
      .json(new APiResponse(201, "Like created successfully", newLike));
  } catch (error) {
    return res.status(500).json(new ApiError(500, error.message));
  }
});
const deleteTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.body;
  if (!tweetId) {
    const error = new ApiError(400, "Tweet id is required");
    return res.status(400).json({
      data: null,
      success: false,
      errors: [{ message: error.message }],
    });
  }
  const userId = req.user._id;
  const like = await Like.findOne({ tweet: tweetId, likedBy: userId });
  if (!like) {
    const error = new ApiError(400, "You have not liked this tweet");
    return res.status(400).json({
      data: null,
      success: false,
      errors: [{ message: error.message }],
    });
  }
  await Like.findByIdAndDelete(like._id);
  return res
    .status(200)
    .json(new APiResponse(200, "Like deleted successfully", null));
});
export {
  createVideoLike,
  deleteVideoLike,
  createCommentLike,
  deleteCommentLike,
  createTweetLike,
  deleteTweetLike,
};
