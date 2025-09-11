import express from "express";
import { createApplication, getApplicationsByJob, getApplicationsByUser } from "../controllers/application.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Apply for a job
router.post("/", auth, createApplication);

// Get all applications for a job (company use-case)
router.get("/job/:jobId", auth, getApplicationsByJob);

// Get all applications by a user (applicant use-case)
router.get("/user/:userId", auth, getApplicationsByUser);

export default router;
