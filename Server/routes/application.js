import express from "express";
import { createApplication, getApplicationsByJob, getApplicationsByUser } from "../controllers/applicationController.js";

const router = express.Router();

// Apply for a job
router.post("/", createApplication);

// Get all applications for a job (company use-case)
router.get("/job/:jobId", getApplicationsByJob);

// Get all applications by a user (applicant use-case)
router.get("/user/:userId", getApplicationsByUser);

export default router;
