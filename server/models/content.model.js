import mongoose from "mongoose";

const contentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    artist: {
        type: String,
        required: true,
    },
    img: {
        type: String,
        default: "",
    },
    file: {
        type: String,
        default: "",
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    type: {
        type: String,
        default: "audio",
    },
    category: {
        type: String,
        default: "Hindi",
    },
    views: {
        type: Number,
        default: 0,
    }
},
    {
        timestamps: true,
    }
);

export const Content = mongoose.model("Content", contentSchema);