import React, { useEffect, useState } from "react";
import { Home, Users, FileText, BarChart2, LogOut } from "lucide-react";
import styles from "../styles/AdminDashboard.module.css"; // <- Import the CSS Module
import { db } from "../../firebase";
import { getDocs, collection, query, where } from "firebase/firestore";

const navItems = [
  { icon: <Home size={20} />, label: "Dashboard" },
  { icon: <Users size={20} />, label: "Users" },
  { icon: <FileText size={20} />, label: "Applications" },
  { icon: <BarChart2 size={20} />, label: "Analytics" },
  { icon: <LogOut size={20} />, label: "Logout" },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    doctorsApproved: 0,
    pendingApplications: 0,
    activeSessions: 34,
  });
  const [applications, setApplications] = useState([]);
  const [users, setUsers] = useState([]);

  // Fetching data from Firestore on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user stats
        const userSnapshot = await getDocs(collection(db, "users"));
        const doctorSnapshot = await getDocs(collection(db, "doctors"));
        const applicationSnapshot = await getDocs(
          query(collection(db, "applications"), where("status", "==", "Pending"))
        );

        setStats({
          totalUsers: userSnapshot.size,
          doctorsApproved: doctorSnapshot.size,
          pendingApplications: applicationSnapshot.size,
          activeSessions: 34, // Replace with real session data if available
        });

        // Fetch applications
        const apps = [];
        applicationSnapshot.forEach((doc) => {
          apps.push(doc.data());
        });
        setApplications(apps);

        // Fetch user data
        const usersData = [];
        userSnapshot.forEach((doc) => {
          usersData.push(doc.data());
        });
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={styles.dashboard}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <h2 className={styles.sidebarTitle}>Admin Panel</h2>
        <nav className={styles.nav}>
          {navItems.map((item, index) => (
            <div key={index} className={styles.navItem}>
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Stats Section */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <h3 className={styles.statTitle}>Total Users</h3>
            <p className={styles.statValue}>{stats.totalUsers}</p>
          </div>
          <div className={styles.statCard}>
            <h3 className={styles.statTitle}>Doctors Approved</h3>
            <p className={styles.statValue}>{stats.doctorsApproved}</p>
          </div>
          <div className={styles.statCard}>
            <h3 className={styles.statTitle}>Pending Applications</h3>
            <p className={styles.statValue}>{stats.pendingApplications}</p>
          </div>
          <div className={styles.statCard}>
            <h3 className={styles.statTitle}>Active Sessions</h3>
            <p className={styles.statValue}>{stats.activeSessions}</p>
          </div>
        </div>

        {/* Recent Applications */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Recent Doctor Applications</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Specialization</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app, index) => (
                <tr key={index}>
                  <td>{app.name}</td>
                  <td>{app.specialization}</td>
                  <td>
                    <span
                      className={`${styles.statusPill} ${
                        app.status === "Approved"
                          ? styles.statusApproved
                          : app.status === "Pending"
                          ? styles.statusPending
                          : styles.statusRejected
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* User Management */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>User Management</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <td>{user.email}</td>
                  <td style={{ textTransform: "capitalize" }}>{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Activity Log */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Activity Log</h2>
          <ul className={styles.activityLog}>
            {/* You can populate this with real logs from Firestore */}
            <li>User admin@health.com approved Dr. Smith's application.</li>
            <li>New doctor application submitted by Dr. Khan.</li>
            <li>Password reset requested by user patient123@gmail.com.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
