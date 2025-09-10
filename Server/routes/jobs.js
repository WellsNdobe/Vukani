
import express from 'express';

const router = express.Router();

import { createJob, getJobs } from '../controllers/jobs.js';

router.get('/', getJobs);
router.post('/createJob', createJob);


export default router;