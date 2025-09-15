//These are controllers for handling saved jobs in the application
import SavedJob from '../models/Saved.js';

export const getSavedJobs = async (req, res) => {
    try {
        const savedJobs = await SavedJob.find({ userId: req.params.userId }).populate('jobId');
        res.status(200).json(savedJobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const saveJob = async (req, res) => {
    const { userId, jobId } = req.body;
    try {
        const existing = await SavedJob.findOne({ userId, jobId });
        if (existing) {
            return res.status(400).json({ message: 'Job already saved' });
        }
        const newSavedJob = new SavedJob({ userId, jobId });
        await newSavedJob.save();
        res.status(201).json(newSavedJob);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const removeSavedJob = async (req, res) => {
    const { userId, jobId } = req.body;
    try {
        const deleted = await SavedJob.findOneAndDelete({ userId, jobId });
        if (!deleted) {
            return res.status(404).json({ message: 'Saved job not found' });
        }
        res.status(200).json({ message: 'Job removed from saved list' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};