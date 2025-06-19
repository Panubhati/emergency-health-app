import React, { useState, useEffect } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import styles from "../styles/DoctorDashboard.module.css";
import {
  FaUserMd,
  FaCalendarAlt,
  FaComments,
  FaFilePrescription,
  FaCog,
  FaBell
} from "react-icons/fa";

const DoctorDashboard = () => {
  const [doctorInfo, setDoctorInfo] = useState({
    firstName: "",
    lastName: "",
    specialization: "",
    qualification: "",
    email: "",
    licenseNumber: "",
    licenseState: "",
    experienceYears: "",
    city: ""
  });

  useEffect(() => {
    const fetchDoctorData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const docRef = doc(db, "users", user.uid); // ✅ correct path
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          setDoctorInfo({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            specialization: data.specialization || "",
            qualification: data.qualification || "",
            email: data.email || "",
            licenseNumber: data.licenseNumber || "",
            licenseState: data.licenseState || "",
            experienceYears: data.experienceYears || "",
            city: data.city || ""
          });
        }
      } catch (error) {
        console.error("Error fetching doctor data:", error);
      }
    };

    fetchDoctorData();
  }, []);

  const startVideoCall = () => {
    const room = `MedConnect_Consult_${Date.now()}`;
    const url = `/video-call?room=${room}`;
    window.open(url, "_blank", "width=1000,height=700");
  };

  return (
    <div className={styles.dashboardWrapper}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>🚑PulseCare</div>
        <nav className={styles.navMenu}>
          <ul>
            <li><FaUserMd /> Dashboard</li>
            <li><FaCalendarAlt /> Patients</li>
            <li><FaComments /> Appointments</li>
            <li><FaFilePrescription /> Consultations</li>
            <li><FaCog /> Settings</li>
          </ul>
        </nav>
        <div className={styles.doctorProfile}>
          <div className={styles.avatar}>DR</div>
          <div>
            <p className={styles.doctorName}>Dr. {doctorInfo.firstName} {doctorInfo.lastName}</p>
            <p className={styles.specialty}>{doctorInfo.specialization}</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {/* Header */}
        <header className={styles.header}>
          <div>
            <h1>Dashboard</h1>
            <p>Monday, May 12, 2025</p>
          </div>
          <div className={styles.headerRight}>
            <FaBell className={styles.bellIcon} />
            <div className={styles.profileInfo}>
              <div className={styles.profilePic}></div>
              <div>
                <p className={styles.doctorName}>Dr. {doctorInfo.firstName} {doctorInfo.lastName}</p>
                <p className={styles.specialty}>{doctorInfo.specialization} ({doctorInfo.qualification})</p>
                <p>Email: {doctorInfo.email}</p>
                <p>License: {doctorInfo.licenseNumber} ({doctorInfo.licenseState})</p>
                <p>Experience: {doctorInfo.experienceYears} years</p>
                <p>City: {doctorInfo.city}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Metrics Cards */}
        <section className={styles.metricsRow}>
          <div className={styles.metricCard}>
            <p>Total Patients</p>
            <h2>1,248</h2>
            <span className={styles.trendPositive}>↑ 12% from last month</span>
          </div>
          <div className={styles.metricCard}>
            <p>Appointments Today</p>
            <h2>8</h2>
            <span className={styles.trendPositive}>↑ 4% from yesterday</span>
          </div>
          <div className={styles.metricCard}>
            <p>Average Consultation</p>
            <h2>24 min</h2>
            <span className={styles.trendPositive}>↑ 2% more efficient</span>
          </div>
        </section>

        {/* Patient Queue */}
        <section className={styles.queueSection}>
          <h2>Patient Queue</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Time</th>
                <th>Type</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className={styles.patientAvatar}>P1</div>
                  <div>
                    <p>Patient Name</p>
                    <span>ID: #123451</span>
                  </div>
                </td>
                <td>10:31 AM</td>
                <td><span className={styles.badge}>New Visit</span></td>
                <td><span className={styles.statusInProgress}>In Progress</span></td>
                <td><button className={styles.primaryBtn}>Continue</button></td>
              </tr>
              <tr>
                <td>
                  <div className={styles.patientAvatar}>P2</div>
                  <div>
                    <p>Patient Name</p>
                    <span>ID: #123452</span>
                  </div>
                </td>
                <td>10:32 AM</td>
                <td><span className={styles.badge}>Follow-up</span></td>
                <td><span className={styles.statusWaiting}>Waiting</span></td>
                <td>
                  <button className={styles.primaryBtnOutline} onClick={startVideoCall}>
                    Start Call
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default DoctorDashboard;
