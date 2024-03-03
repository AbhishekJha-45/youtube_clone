import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
  createVideoLike,
  deleteVideoLike,
  createCommentLike,
  deleteCommentLike,
  createTweetLike,
  deleteTweetLike,
  getAllLikes,
  getVideoLikes,
  getCommentLikes,
  getTweetLikes,
} from "../controllers/like.controller.js";
const router = Router();
router.use(verifyJwt);
// sending data to the server|| modify data on the server
router.route("/create-video-like").post(createVideoLike);
router.route("/delete-video-like").post(deleteVideoLike);
router.route("/create-comment-like").post(createCommentLike);
router.route("/delete-comment-like").post(deleteCommentLike);
router.route("/create-tweet-like").post(createTweetLike);
router.route("/delete-tweet-like").post(deleteTweetLike);
// getting data from the server
router.route("/get-all-likes").post(getAllLikes);
router.route("/get-video-likes").post(getVideoLikes);
router.route("/get-comment-likes").post(getCommentLikes);
router.route("/get-tweet-likes").post(getTweetLikes);

export default router;
