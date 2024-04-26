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