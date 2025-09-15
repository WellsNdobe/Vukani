//This is a model for saved jobs in the database
import mongoose from 'mongoose';
import jobSchema from '../Job.js';

const savedJobSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    job: { type: jobSchema, required: true }, // Embed the entire job document
    savedAt: { type: Date, default: Date.now }
});

const SavedJob = mongoose.model('SavedJob', savedJobSchema);

export default SavedJob;