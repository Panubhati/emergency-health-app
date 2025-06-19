"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Lock, Mail } from "lucide-react";
import styles from "../styles/PatientLogin.module.css";

import { auth, db } from "../../firebase";
import {
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function PatientLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Check if user is already authenticated with patient role
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userSnapshot = await getDoc(userDocRef);
          
          if (userSnapshot.exists() && userSnapshot.data().role === "patient") {
            // Replace navigation to prevent back button
            navigate("/patient-dashboard", { replace: true });
          } else {
            await signOut(auth);
          }
        } catch (err) {
          console.error("Auth check error:", err);
          await signOut(auth);
        }
      }
    });

    return unsubscribe;
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Set persistence based on rememberMe
      await setPersistence(
        auth,
        rememberMe ? browserLocalPersistence : browserSessionPersistence
      );

      // Sign in user
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check user role
      const userDocRef = doc(db, "users", user.uid);
      const userSnapshot = await getDoc(userDocRef);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        if (userData.role === "patient") {
          // Use replace navigation to prevent back button issues
          navigate("/patient-dashboard", { replace: true });
        } else {
          await signOut(auth);
          setError("Unauthorized access. Please use a patient account.");
        }
      } else {
        await signOut(auth);
        setError("User data not found. Please contact support.");
      }
    } catch (err) {
      console.error("Login error:", err);
      if (
        err.code === "auth/wrong-password" ||
        err.code === "auth/user-not-found" ||
        err.code === "auth/invalid-email"
      ) {
        setError("Invalid email or password. Please try again.");
      } else {
        setError("Login failed. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h2>Patient Login</h2>
          <p>Access your emergency health services</p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email Address</label>
            <div className={styles.inputGroup}>
              <Mail className={styles.inputIcon} />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <div className={styles.inputGroup}>
              <Lock className={styles.inputIcon} />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <div className={styles.options}>
            <label className={styles.remember}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me</span>
            </label>
            <a href="/forgot-password" className={styles.forgot}>
              Forgot password?
            </a>
          </div>

          <button type="submit" disabled={isLoading} className={styles.button}>
            {isLoading ? "Logging in..." : "Login"}
            <ArrowRight className={styles.icon} />
          </button>
        </form>

        <div className={styles.footer}>
          <p>
            Don't have an account? <a href="/patient-register">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
}
