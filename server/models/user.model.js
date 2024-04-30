import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: false,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        default: "",
    },
    img: {
        type: String,
        default: "",
    },
    googleSignIn: {
        type: Boolean,
        required: true,
        default: false,
    },
    contents: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Content",
        default: [],
    },
    favorites: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Content",
        default: [],
    },
    role: {
        type: String,
        enum: ["user", "admin", "artist"],
        default: "user"
    },
    artistRequest: {
        type: Boolean,
        default: false
    }
},
    { timestamps: true }
)

// Hash the password before saving the user to the database
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
})


export const User = mongoose.model("User", userSchema)