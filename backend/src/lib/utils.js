import jwt from 'jsonwebtoken';

export const generateToken = ( userId, res ) => {
    // Create jwt for the user
    const token = jwt.sign(
        {
            userId,
        }, 
        process.env.JWT_SECRET,
        { 
            expiresIn: process.env.JWT_EXPIRATION
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