import express from "express";
import { searchChats, getChats } from "../controllers/chat";

const router = express.Router();
router.route("/").get(getChats);
router.route("/:userId").get(searchChats);

export default router;
