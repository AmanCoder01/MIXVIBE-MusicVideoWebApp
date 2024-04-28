import express from "express";
import { profileData } from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";

const router = express.Router();


router.get("/:id", verifyToken, profileData);


export default router;
