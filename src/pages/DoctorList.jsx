import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import styles from "../styles/DoctorList.module.css";

export default function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchDoctors() {
      setLoading(true);
      try {
        const q = query(
          collection(db, "users"),
          where("role", "==", "doctor"),
          where("status", "==", "approved")
        );
        const snapshot = await getDocs(q);
        const results = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setDoctors(results);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDoctors();
  }, []);

  const handleSelectDoctor = (doctorId) => {
    navigate(`/book-appointment/${doctorId}`);
  };

  if (loading) return <p>Loading doctors...</p>;

  return (
    <div className={styles.container}>
      <h2>Available Doctors</h2>
      {doctors.length === 0 ? (
        <p>No doctors available at the moment.</p>
      ) : (
        <div className={styles.grid}>
          {doctors.map((doc) => (
            <div key={doc.id} className={styles.card}>
              <h3>
                Dr. {doc.firstName} {doc.lastName}
              </h3>
              <p><strong>Specialization:</strong> {doc.specialization}</p>
              <p><strong>Experience:</strong> {doc.experienceYears} years</p>
              <button onClick={() => handleSelectDoctor(doc.id)}>Book Appointment</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
