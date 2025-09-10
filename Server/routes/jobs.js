
import express from 'express';

const router = express.Router();

import { createJob, getJobs, getJobById } from '../controllers/jobs.js';

router.get('/', getJobs);
router.post('/createJob', createJob);
router.get("/:id", getJobById);




export default router;