import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const token = req.cookies["access-token"];

    if (!token)
        return res.status(401).send({ success: false, message: "Please login to access this route" });

    const decodedData = jwt.verify(token, process.env.JWT);

    req.user = decodedData;

    next();
};

