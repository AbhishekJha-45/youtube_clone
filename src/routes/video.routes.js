import { Router } from "express";
import {
  deleteVideo,
  getAllVideosOfCurrentUser,
  getOneVideo,
  uploadVideo,
} from "../controllers/video.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();
router.use(verifyJwt);
router.route("/upload").post(
  upload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  uploadVideo
);

router.route("/get-all-videos").get(getAllVideosOfCurrentUser);
router.route("/delete-video").post(deleteVideo);
router.route("/get-video").get(getOneVideo);

export default router;
