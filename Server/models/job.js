import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  jobTitle: { type: String, required: true },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
  jobType: { type: String, enum: ["Full-time", "Part-time", "Contract", "Internship"] },
  jobCategory: { type: String, required: true },
  location: { type: String },
  description: { type: String },
  jobImage: { type: String },
  salary: { type: String },
  timestamp: { type: Date, default: Date.now }
});

const Job = mongoose.model("Job", jobSchema);
export default Job;
