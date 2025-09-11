import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true }, // company login/communication
  password: { type: String, required: true }, // hashed password
  logo: { type: String }, // URL for company logo
  description: { type: String }, // short bio about the company
  location: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Company = mongoose.model("Company", companySchema);
export default Company;
