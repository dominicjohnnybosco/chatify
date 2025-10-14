import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import { ENV } from "../lib/env.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";


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

            // Send Welcome Message to User
            try {
                await sendWelcomeEmail(savedUser.email, savedUser.username, ENV.CLIENT_URL);
            } catch (error) {
                console.log('Failed to send welcome email:', error);
            }
        } else {
            res.status(400).json({ message: 'Invalid User Data'});
        }
    } catch (error) {
        console.log('Error While Creating Account in register controller:', error);
        res.status(500).json({ message: 'Internal Server Error'});
    }
};


export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // check if fields are empty
        if ( !email || !password) {
            return res.status(400).json({ message: 'All Fields are required'});
        };

        // check if the user exists
        const user = await User.findOne({email});
        if ( !user ) {
            return res.status(400).json({ message: 'Invalid Credentials'}); 
        };

        // check the provided password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if ( !isPasswordCorrect ) {
            return res.status(400).json({ message: 'Invalid Credentials'});
        };

        // if user credentials are correct then generate token for the user
        generateToken(user._id, res);

        res.status(200).json({ message: 'Successfully logged in'});

    } catch (error) {
        console.error('Error in Login Controller:', error);
        res.status(500).json({ message: 'Internal Server Error'});
    }
};


export const logout = (_, res) => {
    res.cookie("jwt","",{maxAge:0});
    res.status(200).json({ message: 'Successfully Logged out'});
}


export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        // check if there is profilePic
        if ( !profilePic ) {
            return res.status(400).json({ message: 'Profile Pic is required'});
        }

        // get authenticated user
        const userId = req.user._id;

        // upload the profile pic to cloudinary
        const uploadResponse = await cloudinary.uploader.upload(profilePic);

        // update the profilePic in the database
        const updatedProfilePic = await User.findByIdAndUpdate(userId, {profilePic:uploadResponse.secure_url}, { new:true});

        res.status(200).json({ message: 'User Profile Picture Updated Successfully'});
    } catch (error) {
        console.error('Error Updating User Profile Picture:', error);
        res.status(500).json({ message: 'Internal Server Error'});
    }
}