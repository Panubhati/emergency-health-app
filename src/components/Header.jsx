"use client";

import styles from "./Header.module.css";
import { Bell, UserCircle } from "lucide-react";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <h1>Patient Dashboard</h1>
      </div>

      <div className={styles.right}>
        <div className={styles.iconButton}>
          <Bell />
          <span className={styles.badge}>3</span>
        </div>
        <div className={styles.profile}>
          <UserCircle />
          <span className={styles.username}>John Doe</span>
        </div>
      </div>
    </header>
  );
}
