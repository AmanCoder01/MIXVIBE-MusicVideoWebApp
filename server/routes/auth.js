import express from "express";
import { google, logout, sendotp, signin, signup } from "../controllers/auth.controller.js";

const router = express.Router();


//generate opt
router.post("/sendotp", sendotp);

//create a user
router.post("/signup", signup);


//signin
router.post("/signin", signin);


//google signin
router.post("/google", google);


//logout
router.get('/logout', logout);


export default router;