// src/pages/StudentDashboard.jsx
import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
} from "firebase/firestore";

export default function StudentDashboard() {
  const [user, setUser] = useState(null);
  const [scholarships, setScholarships] = useState([]);
  const [appliedList, setAppliedList] = useState([]);
  const [myApplications, setMyApplications] = useState([]);

  // Load logged-in user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("loggedUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Once user is set, fetch scholarships + applied list + my applications
  useEffect(() => {
    if (user) {
      fetchScholarships();
      fetchAppliedScholarships();
      fetchMyApplications();
    }
  }, [user]);

  const fetchScholarships = async () => {
    const snapshot = await getDocs(collection(db, "scholarships"));
    setScholarships(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const fetchAppliedScholarships = async () => {
    const q = query(
      collection(db, "applications"),
      where("studentEmail", "==", user.email)
    );
    const snap = await getDocs(q);
    setAppliedList(snap.docs.map((doc) => doc.data().scholarshipId));
  };

  const fetchMyApplications = async () => {
    const q = query(
      collection(db, "applications"),
      where("studentEmail", "==", user.email)
    );
    const snap = await getDocs(q);
    setMyApplications(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const applyForScholarship = async (sch) => {
    if (appliedList.includes(sch.id)) return;

    await addDoc(collection(db, "applications"), {
      studentEmail: user.email,
      scholarshipId: sch.id,
      status: "Pending",
      appliedAt: new Date(),
    });

    setAppliedList([...appliedList, sch.id]);
    alert(`🎉 Applied successfully for ${sch.title}`);

    // refresh applications list for status table
    fetchMyApplications();
  };

  const logout = () => {
    localStorage.removeItem("loggedUser");
    window.location.href = "/login";
  };

  if (!user) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "40px" }}>
        ⚠ No user logged in
      </h2>
    );
  }

  return (
    <div style={{ maxWidth: "900px", margin: "40px auto", fontFamily: "Arial" }}>
      <h1>👋 Welcome, {user.name}</h1>

      {/* Profile section */}
      <div style={{ marginTop: "20px", marginBottom: "30px" }}>
        <h3>Your Profile</h3>
        <div
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            borderRadius: "6px",
          }}
        >
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>CGPA:</strong> {user.cgpa}
          </p>
          <p>
            <strong>Year:</strong> {user.year}
          </p>
        </div>
      </div>

      {/* Scholarships list */}
      <h2>Available Scholarships 🎓</h2>

      {scholarships.length === 0 && <p>No scholarships available yet.</p>}

      {scholarships.map((sch) => {
        const alreadyApplied = appliedList.includes(sch.id);
        const eligible = Number(user.cgpa) >= Number(sch.cgpaReq);

        return (
          <div
            key={sch.id}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              marginTop: "15px",
              borderRadius: "6px",
              background: eligible ? "#e9ffe9" : "#ffe9e9",
            }}
          >
            <h3>{sch.title}</h3>
            <p>
              <strong>Required CGPA:</strong> {sch.cgpaReq}
            </p>
            <p>
              <strong>Deadline:</strong> {sch.lastDate}
            </p>
            <p>{sch.description}</p>

            {alreadyApplied ? (
              <button
                disabled
                style={{
                  background: "gray",
                  padding: "8px 12px",
                  marginTop: "10px",
                  color: "white",
                  borderRadius: "4px",
                }}
              >
                Applied ✔ (Pending)
              </button>
            ) : eligible ? (
              <button
                onClick={() => applyForScholarship(sch)}
                style={{
                  background: "green",
                  padding: "8px 12px",
                  marginTop: "10px",
                  color: "white",
                  cursor: "pointer",
                  borderRadius: "4px",
                }}
              >
                Apply
              </button>
            ) : (
              <button
                disabled
                style={{
                  background: "gray",
                  padding: "8px 12px",
                  marginTop: "10px",
                  color: "white",
                  borderRadius: "4px",
                }}
              >
                Not Eligible
              </button>
            )}
          </div>
        );
      })}

      {/* My Applications section */}
      <h2 style={{ marginTop: "40px" }}>📄 My Applications</h2>

      {myApplications.length === 0 ? (
        <p>You haven't applied for any scholarships yet.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "10px",
            textAlign: "left",
          }}
        >
          <thead>
            <tr>
              <th style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
                Scholarship
              </th>
              <th style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
                Applied On
              </th>
              <th style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {myApplications.map((app) => {
              const sch = scholarships.find((s) => s.id === app.scholarshipId);

              let appliedDate = "";
              if (app.appliedAt && app.appliedAt.seconds) {
                appliedDate = new Date(
                  app.appliedAt.seconds * 1000
                ).toLocaleDateString();
              } else {
                appliedDate = "-";
              }

              return (
                <tr key={app.id}>
                  <td
                    style={{
                      padding: "8px",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    {sch?.title || "Unknown"}
                  </td>
                  <td
                    style={{
                      padding: "8px",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    {appliedDate}
                  </td>
                  <td
                    style={{
                      padding: "8px",
                      borderBottom: "1px solid #eee",
                      color:
                        app.status === "Approved"
                          ? "green"
                          : app.status === "Rejected"
                          ? "red"
                          : "orange",
                      fontWeight: "bold",
                    }}
                  >
                    {app.status}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* Logout */}
      <button
        onClick={logout}
        style={{
          marginTop: "35px",
          background: "red",
          color: "white",
          padding: "10px 20px",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  );
}