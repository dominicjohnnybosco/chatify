import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // check if the fields are empty
        if ( !username || !email || !password ) {
            return res.status(400).json({ message: 'All Fields are required'})
        }

        // check for password length
        if ( password.length < 6 ) {
            return res.status(400).json({ message: 'Password must be at least 6 charanters'});
        }

        // check if email is valid: using regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if ( !emailRegex.test(email) ) {
            return res.status(400).json({ message: 'Invalid Email Provided'});
        }

        // check if the user already existed
        const existingUser = await User.findOne({ email });
        if ( existingUser ) {
            return res.status(400).json({ message: "Email Already Exists"});
        }

        // if user not found then hash password
        const saltRounds = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({
            username, 
            email,
            password: hashedPassword
        });

        if ( newUser ) {
            const savedUser = await newUser.save();
            // generate token for new user
            generateToken(savedUser._id, res);

            res.status(201).json({ message: 'User Account Created Successfully'});
        } else {
            res.status(400).json({ message: 'Invalid User Data'});
        }
    } catch (error) {
        console.log('Error While Creating Account in register controller:', error);
        res.status(500).json({ message: 'Internal Server Error'});
    }
}
