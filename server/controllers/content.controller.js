import { User } from "../models/user.model.js";
import { Content } from "../models/content.model.js";



export const createContent = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(401).send({ message: 'User not found ' });

        if (user.isAdmin !== true) {
            return res.status(403).send({ message: 'You are not admin.' });
        }

        // Create a new content

        const content = await Content.create({
            creator: user.id,
            name: req.body.name,
            desc: req.body.desc,
            img: req.body.img,
            tags: req.body.tags,
            type: req.body.type,
            category: req.body.category,
            file: req.body.file
        });

        //save the content to the user
        await User.findByIdAndUpdate(user.id, {
            $push: { contents: content.id },
        }, { new: true });

        res.status(200).json({ message: `${req.body.type} added successfully...`, data: content });
    } catch (err) {
        next(err);
    }
};






export const getContents = async (req, res, next) => {
    try {
        // Get all content from the database
        const content = await Content.find({ type: "audio" }).populate("creator", "name img");
        return res.status(200).json(content);
    } catch (err) {
        next(err);
    }
};



export const getContentById = async (req, res, next) => {
    try {
        // Get the podcasts from the database
        const content = await Content.findById(req.params.id).populate("creator", "name img");
        return res.status(200).json(content);
    } catch (err) {
        next(err);
    }
};



export const addView = async (req, res, next) => {
    try {
        await Content.findByIdAndUpdate(req.params.id, {
            $inc: { views: 1 },
        });
        res.status(200).json("The view has been increased.");
    } catch (err) {
        next(err);
    }
};




export const mostpopular = async (req, res, next) => {
    try {
        const content = await Content.find({ type: "audio" }).sort({ views: -1 }).populate("creator", "name img");
        res.status(200).json(content);
    } catch (err) {
        next(err);
    }
};


export const mostpopularVideos = async (req, res, next) => {
    try {
        const content = await Content.find({ type: "video" }).sort({ views: -1 }).populate("creator", "name img");
        res.status(200).json(content);
    } catch (err) {
        next(err);
    }
};