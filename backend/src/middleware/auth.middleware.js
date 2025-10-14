import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { ENV } from '../lib/env.js';

export const protectedRoute = async (req, res, next) => {
    try {
        // get the token from cookies
        const token = req.cookies.jwt;
        // check if token exists
        if ( !token ) {
            return res.status(401).json({ message: 'Unauthorized Action - No Token Provided'});
        }

        // if token exists let's decode it
        const decoded = jwt.verify(token, ENV.JWT_SECRET);

        // check if token is valid
        if ( !decoded ) {
            return res.status(401).json({ message: 'Unauthorized Action - Invalid Token Provided'});
        }

        // check if the token is for the user
        const user = await User.findById(decoded.userId).select("-password");

        if ( !user ) {
            return res.status(404).json({ message: 'User Not Found'});
        }

        // add the user to req
        req.user = user;
        next();

    } catch (error) {
        console.error("Error in protectedRoute middleware:", error);
        res.status(500).json({ message: 'Internal Server Error'});
    }
}