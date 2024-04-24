import otpGenerator from 'otp-generator';
import { User } from "../models/user.model.js"
import { createError } from "../middlewares/error.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OTP } from '../models/OTP.model.js';

const cookieOptions = {
    maxAge: 3 * 24 * 60 * 60 * 1000,
    sameSite: "none",
    httpOnly: true,
    secure: true,
};



// Send OTP For Email Verification
export const sendotp = async (req, res, next) => {
    const { name, email, password } = req.body;

    // console.log(name, email, password);

    if (!name || !email || !password) {
        return res.status(401).send({
            success: false,
            message: "All Fields are required"
        })
    }

    try {
        // Check if user is already present
        const checkUserPresent = await User.findOne({ email });

        if (checkUserPresent) {
            return res.status(401).send({
                success: false,
                message: `User is Already Registered`,
            });
        }

        let otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });

        const result = await OTP.findOne({ otp: otp });

        // console.log("OTP", otp);

        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
            });
        }

        const otpPayload = { email, otp };
        const otpBody = await OTP.create(otpPayload);

        res.status(200).json({
            success: true,
            message: `OTP Sent Successfully`,
            otp,
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};



export const signup = async (req, res, next) => {
    const { name, email, password, otp } = req.body;


    if (!name || !email || !password || !otp) {
        return res.status(401).send({
            success: false,
            message: "All Fields are required"
        })
    }

    try {
        // Check if the email is in use
        const existingUser = await User.findOne({ email }).exec();
        if (existingUser) {
            return res.status(409).send({
                message: "Email is already in use."
            });
        }

        const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1); // get the most recent on
        // console.log(recentOtp);

        if (recentOtp.length == 0) {
            return res.status(400).send({
                success: false,
                message: "Otp not found",
            });
        } else if (otp !== recentOtp[0].otp) {
            return res.status(401).send({
                success: false,
                message: "Invalid OTP"
            });
        }
        const user = await User.create({
            name,
            email,
            password,
            img: `https://api.dicebear.com/5.x/initials/svg?seed=${name}`,
        })

        return res.status(200).json({
            success: true,
            message: "Registered Successfully!"
        });
    } catch (err) {
        console.log(err);
        next(err);
    }
}




export const signin = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return next(createError(201, "User not found"));
        }

        if (user.googleSignIn) {

            return next(createError(201, "Entered email is Signed Up with google account. Please SignIn with google."));
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return next(createError(201, "Wrong password"));
        }

        const { password: pass, ...rest } = user._doc;

        // create jwt token
        const token = jwt.sign({ id: user._id }, process.env.JWT);

        return res.status(200).cookie("access-token", token, cookieOptions).json({
            success: true,
            rest,
            message: `Welcome Back ${user.name}`,
        });

    } catch (err) {
        console.log(err);
        next(err);
    }
}




export const google = async (req, res, next) => {
    const { name, email, googlePhotoUrl } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user) {
            const { password: pass, ...rest } = user._doc;

            // Return user data, token, and success message
            const token = jwt.sign({ id: user._id }, process.env.JWT);

            return res.status(200).cookie("access-token", token, cookieOptions).json({
                success: true,
                rest,
                message: `Welcome Back ${user.name}`,
            });
        } else {
            const password = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);

            const newUser = await User.create({
                name,
                email,
                password,
                img: googlePhotoUrl,
                googleSignIn: true
            })

            const { password: pass, ...rest } = newUser._doc;


            // Return user data, token, and success message
            const token = jwt.sign({ id: newUser._id }, process.env.JWT);

            return res.status(200).cookie("access-token", token, cookieOptions).json({
                success: true,
                rest,
                message: `Registered Successfully, ${newUser.name}`,
            });
        }
    } catch (err) {
        console.log(err);
        next(err);
    }
}







export const logout = async (req, res) => {
    return res
        .status(200)
        .cookie("access-token", "", { ...cookieOptions, maxAge: 0 })
        .json({
            success: true,
            message: "Logged out successfully",
        });
};

