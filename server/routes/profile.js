import express from "express";
import { deleteRecentPostById, getUserData, profileData } from "../controllers/profile.controller.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";

const router = express.Router();


router.get("/:id", verifyToken, getUserData);
router.delete("/delete/:id", verifyToken, deleteRecentPostById);
router.get("/", verifyToken, profileData);


export default router;
