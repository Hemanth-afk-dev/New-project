// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("⏳ Checking credentials...");

    try {
      const q = query(
        collection(db, "students"),
        where("email", "==", email),
        where("password", "==", password)
      );

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const userData = snapshot.docs[0].data();
        localStorage.setItem("loggedUser", JSON.stringify(userData));

        setMessage("🎉 Login successful!");
        // 🔥 go to Student Dashboard immediately
        navigate("/student");
      } else {
        setMessage("❌ Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("❌ Something went wrong. Try again.");
    }
  };

  const isSuccess = message.startsWith("🎉");

  return (
    <div className="page-wrapper">
      <div className="card card-narrow">
        <h1 className="card-title">Student Login</h1>
        <p className="card-subtitle">
          Login with your registered email and password.
        </p>

        <form onSubmit={handleLogin}>
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
            className="btn btn-success"
            style={{ width: "100%", marginTop: "6px" }}
          >
            Login
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