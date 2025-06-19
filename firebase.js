// ================== IMPORTS ================== //

import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  addDoc
} from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getStorage } from "firebase/storage";

// ================== FIREBASE CONFIG ================== //

const firebaseConfig = {
  apiKey: "AIzaSyAuzB6l3LjBrdjJt0hH4xfbQF_afdIkkkA",
  authDomain: "healthassistance-b8164.firebaseapp.com",
  projectId: "healthassistance-b8164",
  storageBucket: "healthassistance-b8164.appspot.com",
  messagingSenderId: "84957433167",
  appId: "1:84957433167:web:1fd83c6e5d0b1bbfddc93a",
  measurementId: "G-H13YRNT9PR"
};

// ================== INITIALIZE SERVICES ================== //

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = isSupported().then((yes) => (yes ? getAnalytics(app) : null));

// ================== USER PROFILE CREATION ================== //

export const createUserProfile = async (user, additionalData = {}) => {
  if (!user) throw new Error("No user provided for profile creation");

  const userRef = doc(db, "users", user.uid);
  const userData = {
    uid: user.uid,
    email: user.email,
    emailVerified: user.emailVerified,
    role: additionalData.role || "patient",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    
    // Standard fields
    name: additionalData.name || "",
    phone: additionalData.phone || "",
    address: additionalData.address || "",
    dob: additionalData.dob || "",
    profilePicUrl: additionalData.profilePicUrl || "",

    // NEW PATIENT-SPECIFIC FIELDS
    mobileNumber: additionalData.mobileNumber || "",
    gender: additionalData.gender || "",
    medicalConditions: additionalData.medicalConditions || "",
    allergies: additionalData.allergies || "",
    emergencyContact: additionalData.emergencyContact || ""
  };

  try {
    await setDoc(userRef, userData);
    return userRef;
  } catch (error) {
    console.error("Error creating user profile:", error);
    throw error;
  }
};

// ================== DOCTOR APPLICATION SUBMISSION ================== //

export const submitDoctorApplication = async (formData) => {
  try {
    const applicationData = {
      firstName: formData.firstName || "",
      lastName: formData.lastName || "",
      email: formData.email || "",
      phone: formData.phone || "",
      gender: formData.gender || "",
      dateOfBirth: formData.dateOfBirth || "",
      address: formData.address || "",
      city: formData.city || "",
      state: formData.state || "",
      zipCode: formData.zipCode || "",
      specialization: formData.specialization || "",
      qualification: formData.qualification || "",
      medicalSchool: formData.medicalSchool || "",
      graduationYear: formData.graduationYear || "",
      licenseNumber: formData.licenseNumber || "",
      licenseState: formData.licenseState || "",
      experienceYears: formData.experienceYears || "",
      currentHospital: formData.currentHospital || "",
      boardCertified: formData.boardCertified || false,
      additionalCertifications: formData.additionalCertifications || "",
      researchExperience: formData.researchExperience || "",
      message: formData.message || "",
      submittedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, "doctorApplications"), applicationData);

    console.log("Doctor application submitted with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding doctor application: ", e);
    throw new Error("There was an error submitting the application.");
  }
};

// ================== EXPORTS ================== //

export {
  app,
  auth,
  db,
  storage,
  analytics,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit
};
