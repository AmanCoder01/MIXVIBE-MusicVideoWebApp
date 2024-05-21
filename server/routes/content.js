import express from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { addView, createContent, deleteRecentPostById, favoritContent, getByArtistName, getByCategory, mostpopularSongs, mostpopularVideos, search } from "../controllers/content.controller.js";


const router = express.Router();

router.post("/create", verifyToken, createContent);  // checked
router.post("/favorite", verifyToken, favoritContent);  //checked
router.post("/addview/:id", addView);  //checked
router.get("/mostpopularsong", mostpopularSongs);     // checked
router.get("/mostpopularvideo", mostpopularVideos); // checked
router.get("/category/:category", getByCategory);  //checked
router.get("/artist/:name", getByArtistName);  //checked
router.delete("/delete/:id", verifyToken, deleteRecentPostById); //checked



// router.get("/random", random)
// router.get("/tags", getByTag)
router.get("/search", search);

export default router;