import { asyncHandler } from "../utils/asyncHandler.js";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { APiResponse } from "../utils/ApiResponse.js";
const createComment = asyncHandler(async (req, res) => {
  try {
    const { videoId, comment } = req.body;
    if (!videoId) {
      throw new ApiError(400, "Video id is required");
    }
    const userId = req.user._id;
    const createdComment = await Comment.create({
      video: videoId,
      content: comment,
      owner: userId,
    });
    if (!createdComment) {
      throw new ApiError(500, "Failed to create comment");
    }
    return res
      .status(201)
      .json(new APiResponse(201, "Comment created", createdComment));
  } catch (error) {
    return res.status(500).json(new ApiError(500, error.message));
  }
});

const deleteComment = asyncHandler(async (req, res) => {
  //get comment id
  // check if the comment exists for the comment id provided
  //if true findanddelete
  //send response

  try {
    const { commentId } = req.body;
    if (!commentId) {
      throw new ApiError(400, "Comment id is required");
    }
    const userId = req.user._id;
    const comment = await Comment.findOne({ _id: commentId, owner: userId });
    if (!comment || comment.length === 0) {
      const error = new ApiError(
        404,
        "Comment not found or you are not the owner of the comment"
      );
      return res.status(400).json({
        data: null,
        success: false,
        errors: [{ message: error.message }],
      });
    }
    await Comment.findByIdAndDelete(comment._id);
    return res
      .status(200)
      .json(new APiResponse(200, "Comment deleted successfully", null));
  } catch (err) {
    const error = new ApiError(400, "error deleting comment");
    return res.status(400).json({
      data: null,
      success: false,
      errors: [{ message: error.message }],
    });
  }
});

export { createComment, deleteComment };
