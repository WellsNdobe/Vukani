import Job from "../models/job.js";

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
    const { id } = req.params; // from URL, e.g. /jobs/:id

    const job = await Job.findOne({ id }); // searching by schema's "id", not _id

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



export const createJob = async(req, res) => {

    const job = req.body;
    const newJob = new Job(job);

    try{
       await newJob.save();
        res.status(201).json(newJob);
    }

    catch(error){
        res.status(409).json({ message: error.message });
    }
 
}

export const updateJob = (req, res) => {
    res.send('Update a job');
}

export const deleteJob = (req, res) => {
    res.send('Delete a job');
}