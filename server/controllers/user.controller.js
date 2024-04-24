import { User } from "../models/user.model.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

const cookieOptions = {
    maxAge: 3 * 24 * 60 * 60 * 1000,
    sameSite: "none",
    httpOnly: true,
    secure: true,
};





export const signUp = async (req, res) => {

    // Destructure the request body to get name, email, and password.
    const { name, email, password } = req.body;

    // Check if all required fields are present.
    if (!name || !email || !password) {
        return res.status(200).json({
            success: false,
            message: "All fields are required!"
        });
    };

    // Check if the email is already in use.
    const existedUser = await User.findOne({ email });
    if (existedUser) {
        return res.status(200).json({
            success: false,
            message: "Email has been used"
        });
    }

    // Create a new user from the request data and save it to the database.
    try {
        const user = await User.create({
            name,
            email: email.toLowerCase(), // Convert email to lowercase before saving.
            password
        });

        return res.status(200).json({
            success: true,
            message: "Registered Successfully!"
        });

    } catch (error) {
        console.log('Signup error', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Function to handle user login
export const login = async (req, res) => {
    // Destructure email and password from request body
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
        // If not, return an error message
        return res.status(200).json({
            success: false,
            message: "All fields are required!"
        })
    }

    // Find user by email
    const user = await User.findOne({ email })

    // If user is not found, return an error message
    if (!user) {
        return res.status(200).json({
            success: false,
            message: 'User not found.'
        })
    }

    // Check if the provided password is correct
    const isValidPassword = await user.isPasswordCorrect(password)
    if (!isValidPassword) {
        // If not, return an error message
        return res.status(200).json({ success: false, message: "Invalid Email or Password." })
    }

    try {

        const { password: pass, ...rest } = user._doc;

        // Generate a JSON Web Token (JWT) using user ID and a secret key
        const cookieOptions = {
            maxAge: 3 * 24 * 60 * 60 * 1000,
            sameSite: "none",
            httpOnly: true,
            secure: true,
        };

        // Return user data, token, and success message
        const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, "Sorknesfnieb");

        return res.status(200).cookie("access-token", token, cookieOptions).json({
            success: true,
            rest,
            message: `Welcome Back ${user.name}`,
        });
    } catch (err) {
        // Log any errors during token generation
        console.log('Login error', err);

        // Return an error message and error details
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
};



export const google = async (req, res) => {
    const { name, email, googlePhotoUrl } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user) {
            const { password: pass, ...rest } = user._doc;

            // Return user data, token, and success message
            const token = jwt.sign({ userId: user._id }, "Sorknesfnieb");

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
                profilePicture: googlePhotoUrl
            })

            const { password: pass, ...rest } = newUser._doc;



            // Return user data, token, and success message
            const token = jwt.sign({ userId: newUser._id }, "Sorknesfnieb");

            return res.status(200).cookie("access-token", token, cookieOptions).json({
                success: true,
                rest,
                message: `Registered Successfully, ${newUser.name}`,
            });
        }
    } catch (err) {
        // console.log(err);
        return res.status(500).json({
            success: false,
            message: "Something  went wrong",
            data: err.message
        });
    }
}



export const updateProfile = async (req, res) => {
    const { name, password } = req.body;

    if (req.params.id !== req.userId) {
        return res.status(200).json({
            succes: false,
            message: "You are not authorized"
        });
    }

    if (!password) {
        return res.status(200).json({
            success: false,
            message: "All fields are required!"
        })
    }

    const hashedPasword = await bcrypt.hash(password, 10);

    try {
        const user = await User.findByIdAndUpdate(req.userId, { name, password: hashedPasword }, { new: true });
        const { password: pass, ...rest } = user._doc;
        return res.status(200).json({
            success: true,
            message: "Profile Updated",
            rest
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            err
        })
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

