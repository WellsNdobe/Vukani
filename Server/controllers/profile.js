//Controllers for hndling profile-related operations
import User from '../models/user.js';
import SavedJob from '../models/Saved.js';

// Get user profile by ID
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password'); // Exclude password
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Update user profile
export const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const countSavedJobs = async (req, res) => {
    try {
        const count = await SavedJob.countDocuments({ userId: req.params.userId });
        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const countApplications = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const count = user.applications ? user.applications.length : 0;
        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};