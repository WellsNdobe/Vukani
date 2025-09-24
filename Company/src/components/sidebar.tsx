import { NavLink } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h2>Job Tracker</h2>
      <nav>
        <NavLink to="/" end>Dashboard</NavLink>
        <NavLink to="/new-job">New Job</NavLink>
      </nav>
    </div>
  );
}
