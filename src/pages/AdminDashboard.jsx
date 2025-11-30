import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";

export default function AdminDashboard() {
  // Scholarship form state
  const [title, setTitle] = useState("");
  const [cgpaReq, setCgpaReq] = useState("");
  const [lastDate, setLastDate] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  // Applications state
  const [applications, setApplications] = useState([]);
  const [scholarships, setScholarships] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);

  const handleAddScholarship = async (e) => {
    e.preventDefault();
    setMessage("⏳ Adding scholarship...");

    try {
      await addDoc(collection(db, "scholarships"), {
        title,
        cgpaReq: Number(cgpaReq),
        lastDate,
        description,
        createdAt: new Date(),
      });

      setMessage("🎉 Scholarship added successfully!");
      setTitle("");
      setCgpaReq("");
      setLastDate("");
      setDescription("");

      // refresh scholarships list after adding new one
      fetchScholarships();
    } catch (error) {
      console.error(error);
      setMessage("❌ Error saving scholarship.");
    }
  };

  // Fetch scholarships + applications on load
  useEffect(() => {
    fetchScholarships();
    fetchApplications();
  }, []);

  const fetchScholarships = async () => {
    const snap = await getDocs(collection(db, "scholarships"));
    const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    setScholarships(list);
  };

  const fetchApplications = async () => {
    setLoadingApps(true);
    const snap = await getDocs(collection(db, "applications"));
    const list = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
    setApplications(list);
    setLoadingApps(false);
  };

  const getScholarshipTitle = (schId) => {
    const found = scholarships.find((s) => s.id === schId);
    return found ? found.title : schId;
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      const ref = doc(db, "applications", appId);
      await updateDoc(ref, { status: newStatus });
      // update UI
      setApplications((prev) =>
        prev.map((app) =>
          app.id === appId ? { ...app, status: newStatus } : app
        )
      );
    } catch (err) {
      console.error(err);
      alert("Error updating status");
    }
  };

  return (
    <div style={{ maxWidth: "900px", margin: "40px auto", fontFamily: "Arial" }}>
      <h1>Admin Panel</h1>

      {/* --- ADD SCHOLARSHIP SECTION --- */}
      <section style={{ marginBottom: "40px" }}>
        <h2>Add Scholarship</h2>

        <form onSubmit={handleAddScholarship}>
          <label>Scholarship Title:</label>
          <input
            type="text"
            value={title}
            required
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />

          <label>Minimum CGPA Required:</label>
          <input
            type="number"
            value={cgpaReq}
            required
            step="0.01"
            onChange={(e) => setCgpaReq(e.target.value)}
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />

          <label>Last Date:</label>
          <input
            type="date"
            value={lastDate}
            required
            onChange={(e) => setLastDate(e.target.value)}
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />

          <label>Description:</label>
          <textarea
            value={description}
            required
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />

          <button
            style={{
              width: "100%",
              padding: "12px",
              background: "black",
              color: "white",
              cursor: "pointer",
              borderRadius: "4px",
            }}
          >
            Add Scholarship
          </button>
        </form>

        {message && (
          <p style={{ marginTop: "20px", fontWeight: "bold" }}>{message}</p>
        )}
      </section>

      {/* --- APPLICATIONS SECTION --- */}
      <section>
        <h2>Scholarship Applications</h2>

        {loadingApps && <p>Loading applications...</p>}

        {!loadingApps && applications.length === 0 && (
          <p>No applications yet.</p>
        )}

        {!loadingApps &&
          applications.map((app) => (
            <div
              key={app.id}
              style={{
                border: "1px solid #ddd",
                padding: "15px",
                borderRadius: "6px",
                marginBottom: "12px",
                background: "#f9f9f9",
              }}
            >
              <p>
                <strong>Student Email:</strong> {app.studentEmail}
              </p>
              <p>
                <strong>Scholarship:</strong>{" "}
                {getScholarshipTitle(app.scholarshipId)}
              </p>
              <p>
                <strong>Status:</strong> {app.status}
              </p>
              <div style={{ marginTop: "8px" }}>
                <button
                  onClick={() => handleStatusChange(app.id, "Approved")}
                  style={{
                    padding: "6px 10px",
                    marginRight: "8px",
                    background: "green",
                    color: "white",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Approve
                </button>
                <button
                  onClick={() => handleStatusChange(app.id, "Rejected")}
                  style={{
                    padding: "6px 10px",
                    background: "red",
                    color: "white",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
      </section>
    </div>
  );
}