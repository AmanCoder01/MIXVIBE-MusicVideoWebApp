import { Content } from "../models/content.model.js";
import { User } from "../models/user.model.js";




export const getUserData = async (req, res, next) => {

    const { id } = req.params;

    if (id !== req.user.id) {
        return res.status(401).send({ message: 'Unauthorized' });
    }

    try {
        const content = await Content.find({ creator: id }).sort('-createdAt');
        if (!content) return res.status(404).send({ message: 'No data' });

        return res.status(200).send(content);

    } catch (error) {
        next(error);
    }

}



export const profileData = async (req, res, next) => {

    if (!req.user.id) {
        return res.status(403).send({ message: "You are not logged in!" })
    }
    try {
        const user = await User.findById(req.user.id).populate({
            path: "contents",
            populate: {
                path: "creator",
                select: "name img",
            }
        }
        ).populate(
            {
                path: "favorites",
                populate: {
                    path: "creator",
                    select: "name img",
                }
            }
        );
        return res.status(200).json(user);
    } catch (err) {
        console.log(err)
        next(err);
    }
}



export const deleteRecentPostById = async (req, res, next) => {

    const { id } = req.params;

    if (!req.user.id) {
        return res.status(401).send({ message: 'Unauthorized' });
    }

    try {
        const contents = await Content.findByIdAndDelete(id);
        if (!contents) return res.status(404).send({ message: 'No data' });

        const updatedUser = await User.findByIdAndUpdate(req.user.id, {
            $pull: { contents: id },
        }, { new: true });

        return res.status(200).send({ message: "Content deleted !" });

    } catch (error) {
        next(error);
    }

}