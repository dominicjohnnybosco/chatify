import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        required: [true, 'Username Field is Required'],
    },

    email: {
        type: String,
        unique: true,
        trim: true,
        required: [true, 'Email Field is Required'],
    },

    password: {
        type: String,
        min: [6, 'Password Should Not Be Less Than 6 Characters'],
        required: [true, 'Password Field is Required'],
    },

    profilePic: {
        type: String,
        default: "",
    }
}, {
    timestamps: true,
    versionKey: false,
});


const User = mongoose.model('User', userSchema);

export default User;
