import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

const verifyJWT = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken;

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized. Please login first."
            });
        }

        const decodedToken = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await User.findById(decodedToken._id)
            .select("-password");

        if (!user) {
            return res.status(401).json({
                message: "Invalid access token"
            });
        }

        req.user = user;

        next();

    } catch (error) {

        return res.status(401).json({
            message: "Invalid or expired token"
        });

    }
};

export default verifyJWT;