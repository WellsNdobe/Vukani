import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  applicantId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // If you have user accounts
  applicantName: { type: String, required: true }, // fallback if no auth system yet
  applicantEmail: { type: String, required: true },
  coverLetter: { type: String },
  resume: { type: String }, // could be a URL to uploaded file
  status: { type: String, enum: ["Pending", "Reviewed", "Accepted", "Rejected"], default: "Pending" },
  appliedAt: { type: Date, default: Date.now }
});

const Application = mongoose.model("Application", applicationSchema);
export default Application;
