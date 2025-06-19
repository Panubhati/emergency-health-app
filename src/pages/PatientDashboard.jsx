import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Home,
  User,
  Ambulance,
  HeartPulse,
  Hospital,
  FileText,
  Settings,
  LogOut,
  Bell
} from "lucide-react";
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import styles from "../styles/PatientDashboard.module.css";

export default function PatientDashboard() {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("Patient");

  useEffect(() => {
    async function fetchUserName() {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          const data = snap.data();
          setDisplayName(data.name || user.displayName || "Patient");
        }
      } catch (err) {
        console.error("Error fetching user name:", err);
      }
    }
    fetchUserName();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/patient-login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleConsultNow = () => {
    const roomId = "medconnect-video-room";
    navigate(`/video-call?room=${roomId}`);
  };

  return (
    <div className={styles.dashboard}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <h2 className={styles.brand}>Patient Dashboard</h2>
        <ul className={styles.nav}>
          <li className={styles.navItem}>
            <Link to="/"><Home size={20} /> Home</Link>
          </li>
          <li className={styles.navItem}>
            <Link to="/consult-doctor"><User size={20} /> Consult Doctor</Link>
          </li>
          <li className={styles.navItem}>
            <Link to="/nearby-ambulances"><Ambulance size={20} /> Request Ambulance</Link>
          </li>
          <li className={styles.navItem}>
            <Link to="/ai-assistant"><HeartPulse size={20} /> First-Aid Assistant</Link>
          </li>
          <li className={styles.navItem}>
            <Link to="/nearby-hospitals"><Hospital size={20} /> Nearby Hospitals</Link>
          </li>
          <li className={styles.navItem}>
            <Link to="/medical-history"><FileText size={20} /> Medical History</Link>
          </li>
          <li className={styles.navItem}>
            <Link to="/profile-settings"><Settings size={20} /> Profile Settings</Link>
          </li>
          <li className={styles.navItem} onClick={handleLogout}>
            <LogOut size={20} /> Logout
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Header */}
        <header className={styles.header}>
          <h1 className={styles.title}>Hello, {displayName}!</h1>
          <div className={styles.actions}>
            <Bell size={24} />
            <img
              src="https://i.pravatar.cc/40"
              alt="Profile"
              className={styles.avatar}
            />
          </div>
        </header>

        {/* Cards */}
        <section className={styles.cardsGrid}>
          <div className={styles.card}>
            <div className={styles.statusBadge}>ONLINE</div>
            <h3 className={styles.cardTitle}>Consult Now</h3>
            <p className={styles.cardDescription}>Connect with a doctor</p>
            <button className={styles.btn} onClick={handleConsultNow}>Consult Now</button>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Request Ambulance</h3>
            <p className={styles.cardDescription}>Get immediate assistance</p>
           <button className={styles.btn} onClick={() => navigate("/nearby-ambulances")}>
            Request Ambulance
            </button>

          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Use AI Assistant</h3>
            <p className={styles.cardDescription}>Get first-aid advice</p>
            <button
              className={styles.btn}
              onClick={() => navigate("/ai-assistant")}
            >
              Use AI Assistant
            </button>
          </div>
        </section>

        {/* Info Sections */}
        <section className={styles.infoGrid}>
          <div className={styles.infoPanel}>
            <h2 className={styles.infoPanelTitle}>Ongoing Consultations</h2>
            <div className={styles.infoItem}>
              <strong className={styles.infoItemTitle}>Dr.Prathmesh</strong>
              <p className={styles.infoItemDesc}>Cardiologist</p>
            </div>
            <div className={styles.infoItem}>Recent Hospitals</div>
          </div>

          <div className={styles.infoPanel}>
            <h2 className={styles.infoPanelTitle}>Recent Medical Records</h2>
            <div className={styles.infoItem}>
              <strong className={styles.infoItemTitle}>Blood Test</strong>
              <p className={styles.infoItemDesc}>23 Mar 2024</p>
            </div>
            <div className={styles.infoItem}>
              <strong className={styles.infoItemTitle}>X-Ray</strong>
              <p className={styles.infoItemDesc}>10 Feb 2024</p>
            </div>
            <div className={styles.map}>🗺️ Nearby Hospitals Map</div>
          </div>
        </section>
      </main>
    </div>
  );
}
