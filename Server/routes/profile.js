// routes/profileRoutes.js
import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  countSavedJobs,
  countApplications
} from "../controllers/profile.js";

const router = express.Router();

// Get user profile
router.get("/:id", getUserProfile);

// Update user profile
router.put("/:id", updateUserProfile);

// Count saved jobs
router.get("/:userId/saved-jobs/count", countSavedJobs);

// Count applications
router.get("/:userId/applications/count", countApplications);

export default router;
