import React, { useState, useEffect } from "react";
import styles from "../styles/MedicalHistory.module.css";
import { supabase } from "../../supabaseClient";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const auth = getAuth();

export default function MedicalHistory() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const token = await firebaseUser.getIdToken();

        // Set Supabase session using Firebase JWT
        await supabase.auth.setSession({
          access_token: token,
          refresh_token: ""
        });

        fetchReports(firebaseUser.uid);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchReports = async (uid) => {
    const { data, error } = await supabase
      .from("medical_reports")
      .select("*")
      .eq("user_id", uid)
      .order("upload_date", { ascending: false });

    if (error) {
      console.error("Fetch error: ", error);
    } else {
      setReports(data);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!file || !title || !user) {
      return setError("Please provide a title, select a file, and be logged in.");
    }

    setIsLoading(true);

    try {
      const filePath = `${user.uid}/${Date.now()}-${file.name}`;

      // Upload to Supabase Storage
      const { data: storageData, error: storageError } = await supabase.storage
        .from("medical-reports")
        .upload(filePath, file);

      if (storageError) throw storageError;

      const { data: publicURL } = supabase.storage
        .from("medical-reports")
        .getPublicUrl(filePath);

      // Insert into medical_reports table
      const { error: insertError } = await supabase
        .from("medical_reports")
        .insert([
          {
            title,
            file_url: publicURL.publicUrl,
            upload_date: new Date().toISOString(),
            user_id: user.uid
          }
        ]);

      if (insertError) throw insertError;

      setSuccess("Report uploaded successfully!");
      setTitle("");
      setFile(null);
      fetchReports(user.uid);
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload report. Please try again.");
    } finally {
      setIsLoading(false);
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) setFile(droppedFile);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>🗂️ Medical History</h2>

      {/* Upload Section */}
      <div 
        className={`${styles.uploadSection} ${dragOver ? styles.dragOver : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="text"
          placeholder="Report Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.input}
          required
        />

        <div className={styles.fileInputWrapper}>
          <input
            type="file"
            accept=".pdf,.jpg,.png"
            onChange={(e) => setFile(e.target.files[0])}
            id="fileInput"
            className={styles.hiddenFileInput}
          />
          <label htmlFor="fileInput" className={styles.fileDropArea}>
            {file ? (
              <span className={styles.fileName}>📄 {file.name}</span>
            ) : (
              <span>Drag & drop files or click to browse</span>
            )}
          </label>
        </div>

        <button 
          onClick={handleUpload} 
          className={styles.uploadBtn}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className={styles.loadingText}>
              Uploading...
              <span className={styles.loadingSpinner}></span>
            </span>
          ) : (
            "Upload Report"
          )}
        </button>

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}
      </div>

      {/* Reports Grid */}
      <div className={styles.reportsGrid}>
        {reports.length === 0 ? (
          <div className={styles.emptyState}>
            <p>📂 No medical records uploaded yet</p>
            <p>Start by uploading your first report!</p>
          </div>
        ) : (
          reports.map((report) => (
            <div key={report.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <h4>{report.title}</h4>
                <span className={styles.fileType}>
                  {report.file_url?.split('.').pop().toUpperCase()}
                </span>
              </div>
              <p className={styles.uploadDate}>
                📅 {new Date(report.upload_date).toLocaleDateString()}
              </p>
              <div className={styles.cardActions}>
                <a
                  href={report.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.viewLink}
                >
                  📄 View / Download
                </a>
                {/* Delete can be added here */}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
