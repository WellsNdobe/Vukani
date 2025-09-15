//Routes for handling saved jobs in the application
import express from 'express';
import { getSavedJobs, saveJob, removeSavedJob } from '../controllers/Saved.js';
import auth from '../middleware/auth.js';   

const router = express.Router();

router.get('/:userId', auth, getSavedJobs);
router.post('/save', auth, saveJob);
router.delete('/remove', auth, removeSavedJob);