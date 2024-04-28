import { Content } from "../models/content.model.js";
import { User } from "../models/user.model.js";



export const profileData = async (req, res, next) => {

    if (!req.user.id) {
        return res.status(403).send({ message: "You are not logged in!" })
    }

    const { id } = req.params;

    if (id !== req.user.id) {
        return res.status(401).send({ message: 'Unauthorized' });
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


