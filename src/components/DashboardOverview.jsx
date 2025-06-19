"use client";

import styles from "./DashboardOverview.module.css";
import { Heart, User, Calendar, FileText } from "lucide-react";

export default function DashboardOverview() {
  return (
    <div className={styles.dashboardOverview}>
      <div className={styles.card}>
        <div className={styles.icon}>
          <Heart />
        </div>
        <div className={styles.cardContent}>
          <h3>Health Status</h3>
          <p>Your current health status</p>
        </div>
      </div>
      <div className={styles.card}>
        <div className={styles.icon}>
          <User />
        </div>
        <div className={styles.cardContent}>
          <h3>Personal Info</h3>
          <p>View your personal details</p>
        </div>
      </div>
      <div className={styles.card}>
        <div className={styles.icon}>
          <Calendar />
        </div>
        <div className={styles.cardContent}>
          <h3>Appointments</h3>
          <p>Upcoming medical appointments</p>
        </div>
      </div>
      <div className={styles.card}>
        <div className={styles.icon}>
          <FileText />
        </div>
        <div className={styles.cardContent}>
          <h3>Medical Records</h3>
          <p>Access your health records</p>
        </div>
      </div>
    </div>
  );
}
