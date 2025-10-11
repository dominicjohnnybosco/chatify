import jwt from 'jsonwebtoken';

export const generateToken = ( userId, res ) => {
    // check if the JWT_SECRET is set
    const { JWT_SECRET, JWT_EXPIRATION } = process.env;
    if ( !JWT_SECRET ) {
        throw new Error("JWT_SECRET is not configured");
    }

    // Create jwt for the user
    const token = jwt.sign(
        {
            userId,
        }, 
        JWT_SECRET,
        { 
            expiresIn: JWT_EXPIRATION
        }
    );

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 *60 * 1000, // 7days in Milliseconds
        httpOnly: true, // Prevent XSS attacks
        sameSite: "strict", // CSRF attacts
        secure: process.env.NODE_ENV === "development" ? false : true,
    });

    return token;
};