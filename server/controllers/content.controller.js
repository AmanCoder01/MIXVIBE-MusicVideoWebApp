import { User } from "../models/user.model.js";
import { Content } from "../models/content.model.js";
import { createError } from "../middlewares/error.js";



export const createContent = async (req, res, next) => {
    if (!req.user.id) {
        return res.status(401).send({ message: 'Unauthorized' });
    }

    const { name, artist, img, type, category, file } = req.body;

    if (!name || !artist || !img || !type || !category || !file) {
        return res.status(401).send({ message: 'Please fill all the fields' });
    }

    if (typeof file !== "string") {
        return res.status(401).send({ message: 'Please wait few seconds !' });
    }

    try {
        const user = await User.findById(req.user.id);

        if (!user) return res.status(401).send({ message: 'User not found ' });

        if (user.role !== "user") {
            const content = await Content.create({
                creator: user.id,
                name: name,
                artist: artist,
                img: img,
                type: type,
                category: category,
                file: file
            });

            //save the content to the user
            await User.findByIdAndUpdate(user.id, {
                $push: { contents: content.id },
            }, { new: true });

            res.status(200).json({ message: `${type === "audio" ? "Song" : "Video"} added successfully...`, data: content });

        } else {
            return res.status(403).send({ message: 'You are not allowed to upload content.' });
        }

    } catch (err) {
        next(err);
    }
};



export const mostpopularSongs = async (req, res, next) => {
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






export const getByCategory = async (req, res, next) => {
    try {
        const { category } = req.params;

        const content = await Content.find({
            category: { $regex: category, $options: "i" },
        }).populate("creator", "name img");
        return res.status(200).json(content);
    } catch (err) {
        next(err);
    }
};


export const getByArtistName = async (req, res, next) => {
    try {
        const { name } = req.params;

        const content = await Content.find({
            artist: { $regex: name, $options: "i" },
        }).populate("creator", "name img");

        return res.status(200).json(content);
    } catch (err) {
        console.log(err);
        next(err);
    }
};




export const favoritContent = async (req, res, next) => {

    if (!req.user.id) {
        return res.status(401).send('User not logged in');
    }

    const user = await User.findById(req.user.id);

    const content = await Content.findById(req.body.id);


    if (user.id === content.creator.toString()) {
        return next(createError(403, "You can't favorit your own content!"));
    }

    let found = false;


    // Check if the content is already in the user's favorits
    await Promise.all(user.favorites.map(async (item) => {
        if (req.body.id == item) {
            //remove from favorite
            found = true;
            // console.log("this")
            await User.findByIdAndUpdate(user.id, {
                $pull: { favorites: req.body.id },

            }, { new: true })
            res.status(200).json({ like: false, message: "Removed from favorite" });
        }
    }));





    if (!found) {
        await User.findByIdAndUpdate(user.id, {
            $push: { favorites: req.body.id },

        }, { new: true });
        res.status(200).json({ like: true, message: "Added to favorite" });
    }
}



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





export const deleteRecentPostById = async (req, res, next) => {

    const { id } = req.params;

    if (!req.user.id) {
        return res.status(401).send({ message: 'Unauthorized' });
    }

    try {

        const user = await User.findById(req.user.id);
        if (!user) return res.status(401).send({ message: 'User not found ' });

        if (user.role === "admin" || user.role === "artist") {
            const contents = await Content.findByIdAndDelete(id);
            if (!contents) return res.status(404).send({ message: 'No data' });

            const updatedUser = await User.findByIdAndUpdate(req.user.id, {
                $pull: { contents: id },
            }, { new: true });

            return res.status(200).send({ message: "Content deleted !" });
        } else {
            return res.status(403).send({ message: 'You are not allowed to delete content.' });

        }


    } catch (error) {
        next(error);
    }

}



export const search = async (req, res, next) => {
    const query = req.query.q;
    try {
        const content = await Content.find({
            name: { $regex: query, $options: "i" },
        }).populate("creator", "name img").limit(40);
        res.status(200).json(content);
    } catch (err) {
        next(err);
    }
};