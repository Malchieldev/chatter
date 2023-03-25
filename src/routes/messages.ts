import express from "express";
import {
  sendMessage,
  getMessages,
  deleteMessage,
} from "../controllers/message";

const router = express.Router();
router.route("/").get(getMessages);
router.route("/").post(sendMessage);
router.route("/").delete(deleteMessage);

export default router;
