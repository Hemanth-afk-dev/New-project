import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="app-container">
      <div className="main-card">
        <h1
          style={{
            fontSize: "40px",
            marginTop: 0,
            marginBottom: "10px",
            color: "#7DD3FC",
            textShadow: "0 0 18px rgba(56,189,248,0.9)",
          }}
        >
           Scholarship Portal
        </h1>

        <p style={{ marginTop: 0, marginBottom: "24px", color: "#E5E7EB" }}>
          Apply for scholarships, track applications, and manage approvals.
        </p>

        {/* Action Buttons */}
        <div
          style={{
            marginTop: "8px",
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <Link to="/register">
            <button className="btn btn-primary">🧑‍🎓 Student Register</button>
          </Link>

          <Link to="/login">
            <button className="btn btn-success">🔑 Student Login</button>
          </Link>

          <Link to="/admin">
            <button className="btn btn-secondary">🛠 Admin Panel</button>
          </Link>
        </div>

        {/* Features */}
        <h2 style={{ marginTop: "32px", color: "#93C5FD" }}>⚡ Key Features</h2>
        <ul style={{ paddingLeft: "18px", marginTop: "10px" }}>
          <li>✔ Student registration with CGPA and year of study</li>
          <li>✔ Secure student login using email and password</li>
          <li>✔ Scholarships listed with eligibility and last date</li>
          <li>✔ Online application submission by eligible students</li>
          <li>✔ Admin review panel to approve or reject applications</li>
          <li>✔ Students can track status: Pending / Approved / Rejected</li>
        </ul>
      </div>

      <div className="footer">
        © 2025 <span>Scholarship Portal</span> • Powered by React ⚛️ & Firebase
        
      </div>
    </div>
  );
}