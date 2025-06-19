"use client";

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, ArrowRight, Check } from "lucide-react";
import { 
  createUserWithEmailAndPassword, 
  sendEmailVerification, 
  updateProfile 
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../firebase";
import styles from "../styles/PatientSignup.module.css";

export default function PatientSignup() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const validatePassword = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    setPasswordStrength(strength);
    return strength >= 3;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (name === 'password') {
      validatePassword(value);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.includes('@')) newErrors.email = "Valid email is required";
    if (!validatePassword(formData.password)) newErrors.password = "Password too weak";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords don't match";
    if (!formData.agreeTerms) newErrors.agreeTerms = "You must accept the terms";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // 1. Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      const user = userCredential.user;

      // 2. Update user profile with display name
      await updateProfile(user, {
        displayName: `${formData.firstName} ${formData.lastName}`
      });

      // 3. Create user document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        displayName: `${formData.firstName} ${formData.lastName}`,
        role: "patient",
        emailVerified: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // 4. Send verification email
      await sendEmailVerification(user);

      // Display success message
      setSuccessMessage("Account created successfully! Please check your email to verify your account. Redirecting to login page...");
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate("/patient-login");
      }, 5000);
    } catch (error) {
      console.error("Signup error:", error);
      const newErrors = {};
      switch(error.code) {
        case 'auth/email-already-in-use':
          newErrors.email = "Email already in use";
          break;
        case 'auth/weak-password':
          newErrors.password = "Password is too weak";
          break;
        case 'auth/invalid-email':
          newErrors.email = "Invalid email address";
          break;
        default:
          newErrors.general = "An error occurred during signup. Please try again.";
      }
      setErrors(newErrors);
    } finally {
      setIsLoading(false);
    }
  };

  const getStrengthColor = () => {
    switch(passwordStrength) {
      case 0: return styles.strength0;
      case 1: return styles.strength1;
      case 2: return styles.strength2;
      case 3: return styles.strength3;
      case 4: return styles.strength4;
      default: return '';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h2>Patient Registration</h2>
          <p>Create your emergency health services account</p>
        </div>

        {successMessage && (
          <div className={styles.success}>
            {successMessage}
          </div>
        )}

        {errors.general && (
          <div className={styles.error}>
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.nameFields}>
            <div className={styles.formGroup}>
              <label htmlFor="firstName" className={styles.formLabel}>First Name</label>
              <div className={styles.inputGroup}>
                <User className={styles.inputIcon} size={18} />
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                  className={`${styles.formInput} ${errors.firstName ? styles.errorInput : ''}`}
                />
              </div>
              {errors.firstName && <span className={styles.fieldError}>{errors.firstName}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="lastName" className={styles.formLabel}>Last Name</label>
              <div className={styles.inputGroup}>
                <User className={styles.inputIcon} size={18} />
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                  className={`${styles.formInput} ${errors.lastName ? styles.errorInput : ''}`}
                />
              </div>
              {errors.lastName && <span className={styles.fieldError}>{errors.lastName}</span>}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.formLabel}>Email Address</label>
            <div className={styles.inputGroup}>
              <Mail className={styles.inputIcon} size={18} />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={`${styles.formInput} ${errors.email ? styles.errorInput : ''}`}
              />
            </div>
            {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.formLabel}>Password</label>
            <div className={styles.inputGroup}>
              <Lock className={styles.inputIcon} size={18} />
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                className={`${styles.formInput} ${errors.password ? styles.errorInput : ''}`}
              />
            </div>
            <div className={styles.passwordMeter}>
              <div className={`${styles.strengthBar} ${getStrengthColor()}`} 
                   style={{ width: `${passwordStrength * 25}%` }}></div>
            </div>
            <div className={styles.passwordHint}>
              {passwordStrength < 3 ? (
                "Use 8+ characters with uppercase, numbers & symbols"
              ) : (
                <span className={styles.strongPassword}>
                  <Check size={14} /> Strong password
                </span>
              )}
            </div>
            {errors.password && <span className={styles.fieldError}>{errors.password}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword" className={styles.formLabel}>Confirm Password</label>
            <div className={styles.inputGroup}>
              <Lock className={styles.inputIcon} size={18} />
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className={`${styles.formInput} ${errors.confirmPassword ? styles.errorInput : ''}`}
              />
            </div>
            {errors.confirmPassword && <span className={styles.fieldError}>{errors.confirmPassword}</span>}
          </div>

          <div className={styles.terms}>
            <input
              type="checkbox"
              id="agreeTerms"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              className={`${styles.termsCheckbox} ${errors.agreeTerms ? styles.errorCheckbox : ''}`}
            />
            <label htmlFor="agreeTerms" className={styles.termsLabel}>
              I agree to the <Link to="/terms" className={styles.link}>Terms</Link> and {' '}
              <Link to="/privacy" className={styles.link}>Privacy Policy</Link>
            </label>
            {errors.agreeTerms && <span className={styles.fieldError}>{errors.agreeTerms}</span>}
          </div>

          <button 
            type="submit" 
            disabled={isLoading} 
            className={styles.button}
          >
            {isLoading ? "Creating account..." : "Sign Up"}
            <ArrowRight className={styles.icon} size={18} />
          </button>
        </form>

        <div className={styles.footer}>
          <p>
            Already have an account? <Link to="/patient-login" className={styles.link}>Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}