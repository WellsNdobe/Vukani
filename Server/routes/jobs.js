
import express from 'express';
import auth from "../middleware/auth.js";

const router = express.Router();

import { createJob, getJobs, getJobById } from '../controllers/jobs.js';

router.get('/', getJobs);
router.post('/createJob', auth, createJob);
router.get("/:id", getJobById);

export default router;