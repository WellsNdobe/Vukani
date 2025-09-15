import Job from "../models/job.js";
import Company from "../models/company.js";

export const getJobs = async (req, res) => {

    try{
        const jobs = await Job.find();
        res.status(200).json(jobs);
    }

    catch(error){
        res.status(404).json({ message: error.message });
    }
    
}

export const getJobById = async (req, res) => {
  try {
   const job = await Job.findById(req.params.id);
 // searching by schema's "id", not _id

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const createJob = async (req, res) => {
  const { jobTitle, jobType, jobCategory, location, description, salary, jobImage, companyLogo } = req.body;

  try {
    // Ensure request is authenticated
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const companyId = req.user.id;

    // Ensure company exists
    const company = await Company.findById(companyId);
    if (!company) return res.status(404).json({ message: "Company not found" });

    const newJob = new Job({
      id: Date.now().toString(), // generate unique string ID
      companyLogo: company.logo || companyLogo,
      jobTitle,
      postedBy: companyId, // ✅ required field filled from JWT
      jobType,
      jobCategory,
      location,
      timestamp: new Date().toISOString(),
      description,
      jobImage,
      salary,
    });

    await newJob.save();
    res.status(201).json(newJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateJob = (req, res) => {
    res.send('Update a job');
}

export const deleteJob = (req, res) => {
    res.send('Delete a job');
}