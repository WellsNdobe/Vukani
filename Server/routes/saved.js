import express from 'express';
import { getSavedJobs, saveJob, removeSavedJob } from '../controllers/saved.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/:userId', auth, getSavedJobs);
router.post('/save', auth, saveJob);
router.delete('/remove', auth, removeSavedJob);

export default router;
