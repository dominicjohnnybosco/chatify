import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

// controller function to get all the contacts
export const getAllContacts = async (req, res) => {
    try {
        // get the logged in user id
        const loggedInUserId = req.user._id;
        // get all users in the database except the logged in user
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId }}).select("-password");
        // check for filteredUsers
        if ( !filteredUsers ) {
            return res.status(200).json({ message: "No Contacts Found, Invite your friends to join"});
        }
        res.status(200).json({ filteredUsers });
    } catch (error) {
        console.log("Error in Getting All Contact:", error);
        res.status(500).json({ message: "Internal Server Error"});
    }
}

// controller function to get messages between two users using the message id
export const getMessagesByUserId = async (req, res) => {
    try {
        // get authenticated id of the two users
        const myId = req.user._id; // this is the logged in user's Id   
        const { id:userToChatId } = req.params; // this is the id of the second user

        // Get All the messages between them
        const messages = await Message.find({ 
            $or: [
                {senderId: myId, receiverId: userToChatId},
                {senderId: userToChatId, receiverId: myId},
            ],
        });
        // check if no message exists between these users
        if ( !messages ) {
            return res.status(200).json({ message: "No Messages Yet, Start by saying Hi or Hello"});
        }
        res.status(200).json({messages})
    } catch (error) {
        console.log("Error Getting Message By User Id:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


// controller function for sending messages
export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id:receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if ( image ) {
            // Upload base64 image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        // create new message
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        await newMessage.save();

        res.status(201).json({ newMessage });
    } catch (error) {
        console.log("Error Trying to send message:", error);
        res.status(500).json({ message: "Internal Server Error"});
    }
}


// controller function to get a chat partner
export const getChatPartners = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        // find all messages where the logge-in user is either sender or receiver
        const messages = await Message.find({
            $or: [
                { senderId: loggedInUserId },
                { receiverId: loggedInUserId },
            ]
        });
        
        // find the users of those messages above
        const chatPartnerIds = [
            ...new Set(messages.map((msg) => 
                msg.senderId.toString() === loggedInUserId.toString() 
                    ? msg.receiverId.toString() 
                    : msg.senderId.toString()
                )
            ),
        ];
        
        const chatPartners = await User.find({ _id: {$in:chatPartnerIds}}).select("-password");
        res.status(200).json({ chatPartners });
    } catch (error) {
        console.log("Error Getting Chat Partner:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}