import express from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { addView, createContent, getContentById, getContents, mostpopular, mostpopularVideos } from "../controllers/content.controller.js";


const router = express.Router();

//create a podcast
router.post("/create", verifyToken, createContent);

//get all podcasts
router.get("/get", getContents);


//get podcast by id
router.get("/get/:id", getContentById)

//add episode to a 
// router.post("/episode",verifyToken, addepisodes);

//favorit/unfavorit podcast
// router.post("/favorit",verifyToken,favoritPodcast); 

//add view
router.post("/addview/:id", addView);


//searches
router.get("/mostpopular", mostpopular)
router.get("/mostpopularvideo", mostpopularVideos)
// router.get("/random", random)
// router.get("/tags", getByTag)
// router.get("/category", getByCategory)
// router.get("/search", search)





export default router;