import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

// Page imports
import LandingPage from "./pages/LandingPage";
import PatientLogin from "./pages/PatientLogin";
import PatientSignup from "./pages/PatientSignup";
import DoctorLogin from "./pages/DoctorLogin";
import DoctorApplication from "./pages/DoctorApplication";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import PatientDashboard from "./pages/PatientDashboard";
import AiAssistant from "./pages/AiAssistant";
import ProfileSettings from "./pages/ProfileSettings";
import NearbyHospitals from "./pages/NearbyHospitals";
import DoctorDashboard from "./pages/DoctorDashboard";
import VideoCall from "./pages/VideoCall"; // ✅ Already present
import NearbyAmbulances from "./pages/NearbyAmbulances";
import MedicalHistory from "./pages/MedicalHistory"; // ✅ Already present

// CSS imports
import "./styles/LandingPage.css";
import "./styles/PatientLogin.module.css";
import "./styles/PatientSignup.module.css";
import "./styles/DoctorLogin.css";
import "./styles/DoctorApplication.css";
import "./styles/AdminLogin.module.css";
import "./styles/AdminDashboard.module.css";
import "./styles/PatientDashboard.module.css";
import "./styles/AiAssistant.module.css";
import "./styles/ProfileSettings.module.css";
import "./styles/NearbyHospitals.module.css";
import "./styles/DoctorDashboard.module.css";
import "./styles/NearbyAmbulances.module.css";
import "./styles/MedicalHistory.module.css"; // ✅ Already present

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/patient-login" element={user ? <Navigate to="/patient-dashboard" /> : <PatientLogin />} />
        <Route path="/patient-register" element={<PatientSignup />} />
        <Route path="/doctor-login" element={<DoctorLogin />} />
        <Route path="/doctor-application" element={<DoctorApplication />} />
        <Route path="/admin-login" element={user ? <Navigate to="/admin-dashboard" /> : <AdminLogin />} />
        <Route path="/doctor-dashboard" element={user ? <DoctorDashboard /> : <Navigate to="/doctor-login" />} />

        {/* Protected Routes */}
        <Route 
          path="/admin-dashboard" 
          element={user?.email === "admin@example.com" ? <AdminDashboard /> : <Navigate to="/admin-login" />} 
        />
        <Route 
          path="/patient-dashboard" 
          element={user ? <PatientDashboard /> : <Navigate to="/patient-login" />} 
        />
        
        {/* Feature Routes */}
        <Route path="/ai-assistant" element={<AiAssistant />} />
        <Route path="/profile-settings" element={user ? <ProfileSettings /> : <Navigate to="/patient-login" />} />
        <Route path="/nearby-hospitals" element={user ? <NearbyHospitals /> : <Navigate to="/patient-login" />} />
        <Route path="/video-call" element={user ? <VideoCall /> : <Navigate to="/doctor-login" />} /> {/* ✅ New Route */}
        <Route path="/nearby-ambulances" element={<NearbyAmbulances />} />
        <Route path="/medical-history" element={<MedicalHistory />} />
        {/* Redirects */}
        <Route path="/dashboard" element={<Navigate to="/" />} />
        <Route path="/register" element={<Navigate to="/patient-register" />} />
        <Route path="/login" element={<Navigate to="/patient-login" />} />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
