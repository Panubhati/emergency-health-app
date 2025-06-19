// File: NearbyHospitals.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/NearbyHospitals.module.css";

const NearbyHospitals = () => {
  const [location, setLocation] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        setError("Location access denied. Please enable location services.");
        setLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    const fetchHospitals = async () => {
      if (location) {
        try {
          const res = await axios.post("http://localhost:5000/api/nearby-hospitals", location);
          setHospitals(res.data);
        } catch (err) {
          setError("Failed to fetch hospitals.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchHospitals();
  }, [location]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Nearby Hospitals</h1>
      <p className={styles.subtitle}>Based on your current location</p>

      {loading && <div className={styles.status}>Loading hospitals...</div>}
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.hospitalsGrid}>
        {hospitals.map((hospital, index) => (
          <div className={styles.card} key={index}>
            <h2 className={styles.name}>{hospital.name}</h2>
            <p className={styles.address}>{hospital.vicinity}</p>
            {hospital.rating && (
              <p className={styles.rating}>⭐ {hospital.rating} / 5</p>
            )}
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${hospital.geometry.location.lat},${hospital.geometry.location.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mapLink}
            >
              View on Map
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NearbyHospitals;
