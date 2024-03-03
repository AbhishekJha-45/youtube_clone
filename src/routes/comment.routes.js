import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
  createComment,
  deleteComment,
} from "../controllers/comment.controller.js";
const router = Router();
router.use(verifyJwt);
//post routes
router.route("/create-comment").post(createComment);
router.route("/delete-comment").delete(deleteComment);
export default router;
