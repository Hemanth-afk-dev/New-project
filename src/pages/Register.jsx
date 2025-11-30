// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cgpa, setCgpa] = useState("");
  const [year, setYear] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("⏳ Registering student...");

    try {
      await addDoc(collection(db, "students"), {
        name,
        email,
        cgpa: Number(cgpa),
        year,
        password,
        createdAt: new Date(),
      });

      setMessage("🎉 Student registered successfully! Redirecting to login...");
      setName("");
      setEmail("");
      setCgpa("");
      setYear("");
      setPassword("");

      // 🔥 Go to login page after 1 second
      setTimeout(() => navigate("/login"), 1000);
    } catch (error) {
      console.error(error);
      setMessage("❌ Error saving data. Try again.");
    }
  };

  const isSuccess = message.startsWith("🎉");

  return (
    <div className="page-wrapper">
      <div className="card card-narrow">
        <h1 className="card-title">Student Registration</h1>
        <p className="card-subtitle">
          Create your account to apply for scholarships.
        </p>

        <form onSubmit={handleRegister}>
          <div className="field">
            <label>Full Name</label>
            <input
              type="text"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="field">
            <label>CGPA</label>
            <input
              type="number"
              step="0.01"
              value={cgpa}
              required
              onChange={(e) => setCgpa(e.target.value)}
            />
          </div>

          <div className="field">
            <label>Year of Study</label>
            <input
              type="text"
              value={year}
              placeholder="Example: 2nd Year"
              required
              onChange={(e) => setYear(e.target.value)}
            />
          </div>

          <div className="field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", marginTop: "6px" }}
          >
            Register
          </button>
        </form>

        {message && (
          <p
            className={`message ${
              isSuccess ? "message-success" : "message-error"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}