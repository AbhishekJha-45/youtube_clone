import { Router } from "express";
import {
  deleteFromCloudinary,
  deleteVideo,
  getAllVideosOfCurrentUser,
  getVideoById,
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
router.route("/get-video").get(getVideoById);
router.route("/delete-from-cloudinary").post(deleteFromCloudinary);

export default router;
