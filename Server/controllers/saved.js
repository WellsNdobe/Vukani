import SavedJob from '../models/saved.js';

export const getSavedJobs = async (req, res) => {
  try {
    if (req.params.userId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const savedJobs = await SavedJob.find({ userId: req.user.id }).populate('jobId');
    res.status(200).json(savedJobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const saveJob = async (req, res) => {
  const { userId, jobId } = req.body;

  try {
    if (userId && userId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const existing = await SavedJob.findOne({ userId: req.user.id, jobId });
    if (existing) {
      return res.status(400).json({ message: 'Job already saved' });
    }

    const newSavedJob = new SavedJob({ userId: req.user.id, jobId });
    await newSavedJob.save();

    res.status(201).json(newSavedJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeSavedJob = async (req, res) => {
  const { userId, jobId } = req.body;

  try {
    if (userId && userId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const deleted = await SavedJob.findOneAndDelete({ userId: req.user.id, jobId });
    if (!deleted) {
      return res.status(404).json({ message: 'Saved job not found' });
    }

    res.status(200).json({ message: 'Job removed from saved list' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
