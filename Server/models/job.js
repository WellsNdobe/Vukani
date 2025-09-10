// models/job.js
import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  companyLogo: { type: String, default: null },
  jobTitle: { type: String, required: true },
  companyName: { type: String, required: true },
  location: { type: String },
  timestamp: { type: String }, // could be Date if you want real timestamps
  description: { type: String },
  jobImage: { type: String },
  salary: { type: String },
  // we won’t store onApply functions in DB, they belong in frontend
});

const Job = mongoose.model("Job", jobSchema);

export default Job;

