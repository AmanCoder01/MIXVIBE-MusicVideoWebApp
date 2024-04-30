import express from "express";
import { approveArtist, declineArtist, profileData, requestArtist, showArtistList } from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

router.get("/artistsRequest", showArtistList);
router.post("/sendrequest/:id", requestArtist);
router.post("/approverequest/:id", approveArtist);
router.post("/declinerequest/:id", declineArtist);
router.get("/:id", verifyToken, profileData);


export default router;
