import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { Lock, Mail, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Validate input
      if (!email || !password) {
        throw new Error("Please fill in all fields.");
      }

      // Firebase sign in
      const { user } = await signInWithEmailAndPassword(auth, email, password);

      // Fetch user role
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) throw new Error("User profile not found.");

      const { role } = userSnap.data();
      if (role !== "admin") {
        await signOut(auth);
        throw new Error("Access denied. Admin privileges required.");
      }

      // Redirect to admin dashboard
      setTimeout(() => {
        navigate("/admin-dashboard");
      }, 800); // Optional delay
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="admin-logo">
            <Lock size={32} className="admin-icon" />
          </div>
          <h1>Admin Portal</h1>
          <p className="admin-subtitle">Secure access to system administration</p>
        </div>

        {error && (
          <div className="admin-error-message">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-input-group">
            <label htmlFor="email">
              <Mail size={18} />
              <span>Email Address</span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@example.com"
              autoComplete="username"
            />
          </div>

          <div className="admin-input-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter password"
                autoComplete="current-password"
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="admin-login-button"
            disabled={isLoading}
          >
            {isLoading ? <span className="admin-spinner"></span> : "Sign In as Admin"}
          </button>
        </form>

        <div className="admin-footer">
          <p>
            Having trouble? Contact{" "}
            <a href="mailto:support@healthcare.com">system support</a>
          </p>
        </div>
      </div>
    </div>
  );
}
