import React, { useEffect, useState } from "react";
import styles from "../styles/NearbyAmbulances.module.css";

export default function NearbyAmbulances() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        try {
          const response = await fetch("http://localhost:5000/api/nearby-ambulances", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ lat, lng }),
          });

          if (!response.ok) {
            throw new Error("Failed to fetch nearby ambulances");
          }

          const data = await response.json();
          setPlaces(data.slice(0, 5)); // take first 5 results
        } catch (err) {
          console.error(err);
          setError("Could not fetch nearby ambulances.");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error("Location error:", err);
        setError("Failed to get your location.");
        setLoading(false);
      }
    );
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>🚑 Nearby Ambulance Services</h2>
      {loading && <p className={styles.loading}>Loading ambulances...</p>}
      {error && <p className={styles.error}>{error}</p>}
      {!loading && !error && places.length === 0 && (
        <p className={styles.notFound}>No nearby ambulance services found.</p>
      )}
      {places.map((p) => (
        <div key={p.place_id} className={styles.card}>
          <h3>{p.name}</h3>
          <p>{p.vicinity}</p>

          {p.formatted_phone_number ? (
            <p>
              📞{" "}
              <a className={styles.phone} href={`tel:${p.formatted_phone_number}`}>
                {p.formatted_phone_number}
              </a>
            </p>
          ) : (
            <p>📞 Not available</p>
          )}

          {p.rating && <p>⭐ {p.rating}</p>}

          <p>
            <a
              href={`https://www.google.com/maps/place/?q=place_id:${p.place_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mapLink}
            >
              📍 View on Google Maps
            </a>
          </p>
        </div>
      ))}
    </div>
  );
}
