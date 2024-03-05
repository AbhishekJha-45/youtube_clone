import { Tweet } from "../models/tweet.model.js";
import { APiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
const createNewTweet = asyncHandler(async (req, res) => {
  try {
    // get tweet content from request body
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: "Tweet content is required" });
    }
    // get user id from request object
    const userId = req.user._id;
    if (!userId) {
      return res.status(400).json({ message: "User id is required" });
    }
    // create new tweet
    const newTweet = await Tweet.create({ content, owner: userId });
    if (!newTweet || newTweet.length === 0) {
      return res
        .status(400)
        .json(new APiResponse(400, "Failed to create tweet", null));
    }
    // return success response
    return res.status(201).json(newTweet);
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Failed to create tweet" });
  }
});

const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.body;
  if (!tweetId) {
    return res.status(400).json(new APiResponse(400, "Tweet id is required"));
  }
  const userId = req.user._id;
  const tweet = await Tweet.findOne({ _id: tweetId, owner: userId });
  if (!tweet || tweet.length === 0) {
    return res.status(400).json(new APiResponse(400, "Tweet not found"));
  }
  await Tweet.findByIdAndDelete(tweetId);
  return res
    .status(200)
    .json(new APiResponse(200, "Tweet deleted successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const tweets = await Tweet.find({ owner: userId });
    if (!tweets || tweets.length === 0) {
      return res.status(400).json(new APiResponse(400, "No tweets found"));
    }
    return res.status(200).json(tweets);
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, error.message || "Failed to get tweets"));
  }
});
export { createNewTweet, deleteTweet ,getUserTweets};
