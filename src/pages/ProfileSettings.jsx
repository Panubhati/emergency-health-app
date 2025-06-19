import React, { useState, useEffect } from "react";
import { auth, db, storage } from "../../firebase"; 
import { doc, getDoc, updateDoc, serverTimestamp  } from "firebase/firestore"; 
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"; 
import styles from "../styles/ProfileSettings.module.css";

const ProfileSettings = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState("");
  const [mobileNumber, setMobileNumber] = useState(""); 
  const [medicalConditions, setMedicalConditions] = useState(""); 
  const [allergies, setAllergies] = useState(""); 

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        const userDocRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUser(userData);
          setName(userData.name || "");
          setEmail(userData.email || "");
          setPhone(userData.phone || "");
          setAddress(userData.address || "");
          setDob(userData.dob || "");
          setGender(userData.gender || "");
          setEmergencyContact(userData.emergencyContact || "");
          setProfilePicUrl(userData.profilePicUrl || "");
          setMobileNumber(userData.mobileNumber || "");
          setMedicalConditions(userData.medicalConditions || "");
          setAllergies(userData.allergies || "");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        name,
        email,
        phone,
        address,
        dob,
        gender,
        emergencyContact,
        mobileNumber,
        medicalConditions,
        allergies,
        updatedAt: serverTimestamp(),
      };

      if (profilePic) {
        const storageRef = ref(storage, `profile_pics/${auth.currentUser.uid}`);
        const uploadTask = uploadBytesResumable(storageRef, profilePic);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
          },
          (error) => {
            console.error("Error uploading profile picture:", error);
            alert("Failed to upload profile picture.");
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            updatedData.profilePicUrl = downloadURL;
            await updateDoc(doc(db, "users", auth.currentUser.uid), updatedData);
            alert("Profile updated successfully!");
          }
        );
      } else {
        await updateDoc(doc(db, "users", auth.currentUser.uid), updatedData);
        alert("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h2 className={styles.heading}>Profile Settings</h2>

        <form className={styles.form} onSubmit={handleUpdateProfile}>
          <div className={styles.formGroup}>
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={styles.inputField}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.inputField}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className={styles.inputField}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Mobile Number</label>
            <input
              type="text"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              required
              className={styles.inputField}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className={styles.inputField}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Date of Birth</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
              className={styles.inputField}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
              className={styles.inputField}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Emergency Contact</label>
            <input
              type="text"
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              required
              className={styles.inputField}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Medical Conditions</label>
            <textarea
              value={medicalConditions}
              onChange={(e) => setMedicalConditions(e.target.value)}
              placeholder="List any known medical conditions"
              rows="3"
              className={styles.inputField}
            ></textarea>
          </div>

          <div className={styles.formGroup}>
            <label>Allergies</label>
            <textarea
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              placeholder="List any allergies"
              rows="3"
              className={styles.inputField}
            ></textarea>
          </div>

          <div className={styles.formGroup}>
            <label>Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePicChange}
              className={styles.inputField}
            />
            {profilePicUrl && (
              <img src={profilePicUrl} alt="Profile" className={styles.profilePic} />
            )}
          </div>

          <button type="submit" className={styles.saveButton}>
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettings;
