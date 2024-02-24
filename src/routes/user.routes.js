import { Router } from "express";
import {
  changeCurrentUserPassword,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
const router = Router();
//get routes
router
  .route("/register")
  .get((_, res) => res.json({ message: "Register route" }));
router.route("/login").get((_, res) => res.json({ message: "Login route" }));
router.route("/logout").get((_, res) => res.json({ message: "Logout route" }));
//post routes
router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);
router.route("/login").post(loginUser);
//secured routes
router.route("/logout").post(verifyJwt, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJwt, changeCurrentUserPassword);

export default router;
