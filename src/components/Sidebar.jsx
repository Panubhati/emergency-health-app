import React from "react";
import { Link } from "react-router-dom"; // You can use Link if you want navigation to be handled by react-router
import { Home, FileText, Phone, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Use useNavigate from react-router-dom
import styles from "./Sidebar.module.css";

export default function Sidebar() {
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Example onClick handler to navigate programmatically
  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>Emergency Health</div>
      <ul className={styles.navLinks}>
        <li onClick={() => handleNavigate("/patient-dashboard")}>
          <Home />
          <span>Home</span>
        </li>
        <li onClick={() => handleNavigate("/patient-health-records")}>
          <FileText />
          <span>Health Records</span>
        </li>
        <li onClick={() => handleNavigate("/patient-emergency-request")}>
          <Phone />
          <span>Emergency Request</span>
        </li>
        <li onClick={() => handleNavigate("/patient-consultation")}>
          <Heart />
          <span>Consultation</span>
        </li>
      </ul>
    </div>
  );
}
