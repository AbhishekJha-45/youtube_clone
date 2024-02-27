import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { APiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
const options = {
  httpOnly: true,
  secure: true,
};
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    // console.log("accessToken", accessToken);
    // console.log("refreshToken", refreshToken);
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Failed to generate access or refresh tokens");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }
  const avatarLocalPath = req.files?.avatar[0]?.path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadToCloudinary(avatarLocalPath);
  const coverImage = await uploadToCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new APiResponse(200, createdUser, "User registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  try {
    const { username, password, email } = req.body;
    if (!(username || email)) {
      throw new ApiError(400, "Username or email is required");
    }

    const isExistingUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (!isExistingUser) {
      throw new ApiError(404, "User not found");
    }

    const isPasswordValid = await isExistingUser.isPasswordCorrect(password);
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid password");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      isExistingUser._id
    );
    const loggedInUser = await User.findById(isExistingUser._id).select(
      "-password -refreshToken"
    );
    return res
      .status(200)
      .cookie("refreshToken", refreshToken, options)
      .cookie("accessToken", accessToken, options)
      .json(
        new APiResponse(200, "User logged in Successfully", {
          user: loggedInUser,
          accessToken,
          refreshToken,
        })
      );
  } catch (error) {
    throw new ApiError(500, "Failed to login user :(");
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: { refreshToken: 1 },
    },
    { new: true }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("refreshToken", options)
    .clearCookie("accessToken", options)
    .json(new APiResponse(200, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  try {
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err) => {
        if (err) {
          throw new ApiError(401, "Invalid refresh token");
        }
      }
    );

    const user = await User.findById(decodedToken._id);
    if (!user) {
      throw new ApiError(401, "invalid refresh token");
    }

    if (incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id
    );
    return res
      .status(200)
      .cookie("refreshToken", refreshToken, options)
      .cookie("accessToken", accessToken, options)
      .json(
        new APiResponse(
          200,
          { accessToken, refreshToken },
          "Access Token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const changeCurrentUserPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!(oldPassword || newPassword)) {
    throw new ApiError(400, "Old password and new password are required");
  }
  const user = await User.findById(req.user._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new APiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new APiResponse(200, req.user, "Current user fetched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;
  if (!(fullName || email)) {
    throw new ApiError(400, "Full name and email are required");
  }
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { fullName, email },
    },
    { new: true }
  ).select("-password");
  if (!user) {
    throw new ApiError(500, "Failed to update user details");
  }
  return res
    .status(200)
    .json(new APiResponse(200, user, "Account details updated successfully"));
});
const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.avatar[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }
  const avatar = await uploadToCloudinary(avatarLocalPath);
  if (!avatar.url) {
    throw new ApiError(400, "Error while uploading avatar file");
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: { avatar: avatar.url },
    },
    { new: true }
  ).select("-password");
  if (!user) {
    throw new ApiError(500, "Failed to update user avatar");
  }
  return res
    .status(200)
    .json(new APiResponse(200, user, "User avatar updated successfully"));
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.coverImage[0]?.path;
  if (!coverImageLocalPath) {
    throw new ApiError(400, "Cover image file is required");
  }
  const coverImage = await uploadToCloudinary(coverImageLocalPath);
  if (!coverImage.url) {
    throw new ApiError(400, "Error while uploading cover image file");
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: { coverImage: coverImage.url },
    },
    { new: true }
  ).select("-password");
  if (!user) {
    throw new ApiError(500, "Failed to update user cover image");
  }
  return res
    .status(200)
    .json(new APiResponse(200, user, "User cover image updated successfully"));
});
//aggregation pipelines usage below
const getUserChannelProfile = asyncHandler(async (req, res) => {
  try {
    const { username } = req.params;
    if (!username?.trim()) {
      throw new ApiError(400, "Username is required");
    }
    const channel = await User.aggregate([
      //matched user by username
      { $match: username?.toLowerCase() },
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "channel",
          as: "subscribers",
        },
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "subscriber",
          as: "subscribedTo",
        },
      },
      {
        $addFields: {
          //calculated subscribers count and channels subscribed to count
          subscribersCount: { $size: "$subscribers" },
          channelsSubscribedToCount: { $size: "$subscribedTo" },
          isSubscribed: {
            $cond: {
              if: { $in: [req.user?._id, "$subscribers.subscriber"] },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $project: {
          subscribers: 1,
          subscribedTo: 1,
          subscribersCount: 1,
          channelsSubscribedToCount: 1,
          isSubscribed: 1,
          avatar: 1,
          coverImage: 1,
          email: 1,
          fullName: 1,
          username: 1,
        },
      },
    ]);
    if (!channel) {
      throw new ApiError(404, "Channel not found");
    }
    console.log("from user controller userprofile", channel);
    return res
      .status(200)
      .json(
        new APiResponse(200, channel[0], "User profile fetched successfully")
      );
  } catch (error) {
    throw new ApiError(500, "Failed to get user channel profile");
  }
});
const getWatchHistory = asyncHandler(async (req, res) => {
  try {
    const user = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.user._id),
        },
      },
      {
        $lookup: {
          from: "videos",
          localField: "watchHistory",
          foreignField: "_id",
          as: "watchHistory",
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                  {
                    $project: {
                      fullName: 1,
                      username: 1,
                      avatar: 1,
                    },
                  },
                ],
              },
            },
            {
              $addFields: {
                owner: {
                  $first: "$owner",
                },
              },
            },
          ],
        },
      },
    ]);

    if (!user || user.length === 0) {
      return res
        .status(404)
        .json(new APiResponse(404, null, "Channel not found"));
    }

    return res
      .status(200)
      .json(
        new APiResponse(
          200,
          user[0].watchHistory,
          "User watch history fetched successfully"
        )
      );
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .json(new APiResponse(500, null, "Failed to get user watch history"));
  }
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentUserPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
};
