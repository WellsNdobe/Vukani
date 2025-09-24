import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "./dashboard.css";

const data = [
  { month: "Jan", applied: 4, interviews: 1 },
  { month: "Feb", applied: 7, interviews: 3 },
  { month: "Mar", applied: 5, interviews: 2 },
  { month: "Apr", applied: 9, interviews: 4 },
];

export default function Dashboard() {
  // Calculate totals for stats cards
  const totalApplied = data.reduce((sum, item) => sum + item.applied, 0);
  const totalInterviews = data.reduce((sum, item) => sum + item.interviews, 0);
  const interviewRate = ((totalInterviews / totalApplied) * 100).toFixed(1);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Job Applications Overview</h1>
      </div>
      
      <div className="dashboard-content">
        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{totalApplied}</div>
            <div className="stat-label">Total Applications</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{totalInterviews}</div>
            <div className="stat-label">Total Interviews</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{interviewRate}%</div>
            <div className="stat-label">Interview Rate</div>
          </div>
        </div>

        {/* Chart */}
        <div className="chart-container">
          <h3 className="chart-title">Monthly Applications & Interviews</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="applied" 
                stroke="#3498db" 
                strokeWidth={3}
                dot={{ fill: '#3498db', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, fill: '#2980b9' }}
              />
              <Line 
                type="monotone" 
                dataKey="interviews" 
                stroke="#2ecc71" 
                strokeWidth={3}
                dot={{ fill: '#2ecc71', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, fill: '#27ae60' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}