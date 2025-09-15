//Controllers for handling messages in the application
import Message from '../models/messages.js';
import User from '../models/user.js';

// Send a message from one user to another
export const sendMessage = async (req, res) => {
    const { receiverId, content } = req.body;
    const senderId = req.user.id; // Extract sender ID from authenticated user
    try {
        // Validate users
        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);
        if (!sender || !receiver) {
            return res.status(404).json({ message: 'Sender or receiver not found' });
        }
        // Create and save the message
        const newMessage = new Message({ sender: senderId, receiver: receiverId, content });
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMessagesBetweenUsers = async (req, res) => {
    const { userId1, userId2 } = req.params;
    try {
        // Validate users
        const user1 = await User.findById(userId1);
        const user2 = await User.findById(userId2);
        if (!user1 || !user2) {
            return res.status(404).json({ message: 'One or both users not found' });
        }
        // Fetch messages between the two users
        const messages = await Message.find({
            $or: [
                { sender: userId1, receiver: userId2 },
                { sender: userId2, receiver: userId1 }
            ]
        }).sort({ timestamp: 1 });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
