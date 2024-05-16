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
        const user = await User.findById(id).populate(
            {
                path: "contents",
                options: { sort: { createdAt: -1 } }
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




export const requestArtist = async (req, res, next) => {
    const { id } = req.params;

    try {

        const checkUser = await User.findById(id);

        if (checkUser.artistRequest === true) {
            return res.status(409).send({ message: "You already requested to be an artist." });
        }

        const user = await User.findByIdAndUpdate(id,
            { artistRequest: true },
            { new: true } // Return the updated document
        )

        return res.status(200).json({ message: "Your request has been sent!" });

    } catch (error) {
        console.log(error);
        next(error);
    }
}


export const approveArtist = async (req, res, next) => {
    const { id } = req.params;

    try {
        const user = await User.findByIdAndUpdate(id,
            {
                artistRequest: false,
                role: "artist"
            },
            { new: true } // Return the updated document
        )

        return res.status(200).json({ message: "The user is now an Artist." });

    } catch (error) {
        console.log(error);
        next(error);
    }
}


export const declineArtist = async (req, res, next) => {
    const { id } = req.params;

    try {
        const user = await User.findByIdAndUpdate(id,
            {
                artistRequest: false
            },
            { new: true } // Return the updated document
        )

        return res.status(200).json({ message: "User request has been declined." });

    } catch (error) {
        console.log(error);
        next(error);
    }
}



export const showArtistList = async (req, res, next) => {
    try {
        const user = await User.find({ artistRequest: true }).sort({ createdAt: -1 });

        return res.status(200).json(user);

    } catch (error) {
        console.log(error);
        next(error);
    }
}


