import express from "express";
import { getUserData } from "../controllers/profile.controller.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";

const router = express.Router();


router.get("/:id", verifyToken, getUserData);


export default router;
