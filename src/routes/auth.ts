import express from "express";
import { googleLogin, login, getTestUsers } from "../controllers/auth";

const router = express.Router();
router.route("/test-users").get(getTestUsers);
router.route("/login").get(login);
router.route("/google/login").get(googleLogin);

export default router;
