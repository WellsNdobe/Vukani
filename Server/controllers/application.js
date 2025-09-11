import Application from "../models/application.js";
import Job from "../models/job.js";
import User from "../models/user.js";

export const createApplication = async (req, res) => {
  const { jobId, applicantId, coverLetter, resume } = req.body;

  try {
    // Ensure job exists
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // Ensure applicant exists
    const user = await User.findById(applicantId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const newApplication = new Application({
      jobId,
      applicantId,
      applicantName: user.name,
      applicantEmail: user.email,
      coverLetter,
      resume,
    });

    await newApplication.save();
    res.status(201).json(newApplication);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get applications for a specific job
export const getApplicationsByJob = async (req, res) => {
  try {
    const applications = await Application.find({ jobId: req.params.jobId })
      .populate("applicantId", "name email") // show applicant details
      .sort({ appliedAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get applications by a specific user
export const getApplicationsByUser = async (req, res) => {
  try {
    const applications = await Application.find({ applicantId: req.params.userId })
      .populate("jobId", "jobTitle companyName location") // show job details
      .sort({ appliedAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
