import { useState } from "react";
import { Lock, User, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import "../styles/DoctorLogin.css";

export default function DoctorLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // Get the user document from Firestore
      const userDocRef = doc(db, "users", uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        if (userData.role === "doctor") {
          navigate("/doctor-dashboard");
        } else {
          setError("Access denied");
        }
      } else {
        setError("User profile not found.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="doctor-login-page">
      <div className="doctor-login-container">
        <div className="doctor-login-header">
          <button
            onClick={() => navigate(-1)}
            className="doctor-back-button"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="doctor-login-logo">
            <div className="doctor-icon-wrapper">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="doctor-icon"
              >
                <path d="M14 11l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1>Doctor Portal</h1>
          </div>
          <p className="doctor-login-subtitle">Access your medical dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="doctor-login-form">
          {error && (
            <div className="doctor-login-error">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="doctor-icon-small"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div className="doctor-input-group">
            <label htmlFor="email">Email</label>
            <div className="doctor-input-wrapper">
              <User className="doctor-input-icon" size={18} />
              <input
                id="email"
                type="email"
                placeholder="doctor@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="doctor-input-group">
            <label htmlFor="password">Password</label>
            <div className="doctor-input-wrapper">
              <Lock className="doctor-input-icon" size={18} />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="doctor-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="doctor-forgot-password">
              <Link to="/forgot-password">Forgot password?</Link>
            </div>
          </div>

          <button
            type="submit"
            className="doctor-login-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="doctor-spinner"></div>
            ) : (
              "Sign In"
            )}
          </button>

          <div className="doctor-login-footer">
            <p>
              Want to join as a doctor?{" "}
              <Link to="/doctor-application">Apply here</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
