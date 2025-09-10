import e from 'express';
import express from 'express';

const router = express.Router();

import { createJob, getJobs } from '../controllers/jobs.js';

router.get('/', getJobs);
router.get('/', createJob);

export default router;