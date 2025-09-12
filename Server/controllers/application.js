import Application from "../models/application.js";
import Job from "../models/job.js";
import User from "../models/user.js";

export const createApplication = async (req, res) => {
  const { jobId, coverLetter, resume } = req.body;

  try {
    // ensure job exists
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // applicant comes from JWT
    const applicantId = req.user.id;
    const user = await User.findById(applicantId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const newApplication = new Application({
      jobId,
      applicantId,
      applicantName: user.name,     // pulled from User
      applicantEmail: user.email,   // pulled from User
      coverLetter,
      resume,
    });

    await newApplication.save();
    res.status(201).json(newApplication);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all applications for a job (company side)
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

// Get all applications submitted by a user (applicant side)
export const getApplicationsByUser = async (req, res) => {
  try {
    const applications = await Application.find({ applicantId: req.params.userId })
      .populate("jobId", "jobTitle jobCategory location") // show job details
      .sort({ appliedAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
