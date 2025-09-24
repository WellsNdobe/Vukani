import { useState } from "react";
import "./newjob.css"; // Import the CSS file

export default function NewJob() {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    console.log({ title, company });
    alert("Job submitted!");
  };

  return (
    <div className="new-job-container">
      <h1>Create New Job</h1>
      <form onSubmit={handleSubmit} className="new-job-form">
        <div className="form-group">
          <label>Job Title</label>
          <input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Company</label>
          <input 
            value={company} 
            onChange={(e) => setCompany(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" className="submit-button">Add Job</button>
      </form>
    </div>
  );
}