import { googleAuth, signin, signup } from "../controllers/auth.js";
import express from "express";

const router = express.Router();

router.get("/googleAuth", googleAuth);
router.post("/signin", signin);
router.post("/signup", signup);

export default router;
