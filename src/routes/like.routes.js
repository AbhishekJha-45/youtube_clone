import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
  createVideoLike,
  deleteVideoLike,
  createCommentLike,
  deleteCommentLike,
  createTweetLike,
  deleteTweetLike,
} from "../controllers/like.controller.js";
const router = Router();
router.use(verifyJwt);
router.route("/create-video-like").post(createVideoLike);
router.route("/delete-video-like").post(deleteVideoLike);
router.route("/create-comment-like").post(createCommentLike);
router.route("/delete-comment-like").post(deleteCommentLike);
router.route("/create-tweet-like").post(createTweetLike);
router.route("/delete-tweet-like").post(deleteTweetLike);

export default router;
