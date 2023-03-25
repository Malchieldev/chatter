import express from "express";
import { getUser, changeDescription, currentUser } from "../controllers/user";

const router = express.Router();
router.route("/").get(currentUser);
router.route("/:userId").get(getUser);
router.route("/description").put(changeDescription);

export default router;
