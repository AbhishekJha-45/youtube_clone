import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
  createNewTweet,
  deleteTweet,
} from "../controllers/tweet.controller.js";
const router = Router();
router.use(verifyJwt);

router.route("/create-tweet").post(createNewTweet);
router.route("/delete-tweet").post(deleteTweet);
export default router;
