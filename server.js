import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// === Existing AI Assistant Endpoint (Groq) ===
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

app.post("/api/openai", async (req, res) => {
  const { userMessage } = req.body;

  if (!userMessage) {
    return res.status(400).json({ error: "No user message provided." });
  }

  try {
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: "llama3-70b-8192",
        messages: [
          {
            role: "system",
            content:
              "You are an AI Health Assistant. Only answer questions related to health, first-aid, symptoms, medicines, doctors, or hospitals. If asked anything unrelated to medicine, politely refuse and guide them back to health topics.",
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
        temperature: 0.5,
        max_tokens: 1024,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
      }
    );

    const botReply =
      response.data.choices?.[0]?.message?.content ||
      "Sorry, I couldn't understand. Please try again.";

    return res.json({ message: botReply });
  } catch (error) {
    console.error(
      "Error fetching Groq response:",
      error.response?.data || error.message
    );
    return res.status(500).json({ error: "Server Error. Please try again." });
  }
});

// === Nearby Hospitals Endpoint ===
app.post("/api/nearby-hospitals", async (req, res) => {
  const { lat, lng } = req.body;

  if (!lat || !lng) {
    return res.status(400).json({ error: "Latitude and longitude are required." });
  }

  try {
    const googleResponse = await axios.get(
      "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
      {
        params: {
          location: `${lat},${lng}`,
          radius: 5000,
          type: "hospital",
          key: process.env.GOOGLE_MAPS_API_KEY,
        },
      }
    );

    res.json(googleResponse.data.results);
  } catch (error) {
    console.error("Error fetching hospitals:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch nearby hospitals." });
  }
});

// === Nearby Ambulances Endpoint ===
app.post("/api/nearby-ambulances", async (req, res) => {
  const { lat, lng } = req.body;

  if (!lat || !lng) {
    return res.status(400).json({ error: "Latitude and longitude are required." });
  }

  try {
    // Step 1: Fetch nearby ambulance services
    const nearbyResponse = await axios.get(
      "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
      {
        params: {
          location: `${lat},${lng}`,
          radius: 10000,
          keyword: "ambulance service",
          key: process.env.GOOGLE_MAPS_API_KEY,
        },
      }
    );

    const places = nearbyResponse.data.results;

    // Step 2: Fetch details for each place to get phone numbers
    const detailedPlaces = await Promise.all(
      places.map(async (place) => {
        try {
          const detailsResponse = await axios.get(
            "https://maps.googleapis.com/maps/api/place/details/json",
            {
              params: {
                place_id: place.place_id,
                fields: "name,formatted_phone_number,vicinity,rating",
                key: process.env.GOOGLE_MAPS_API_KEY,
              },
            }
          );
          return detailsResponse.data.result;
        } catch (err) {
          console.error(
            `Failed to get details for place_id: ${place.place_id}`,
            err.message
          );
          return place; // fallback to basic info if details fail
        }
      })
    );

    res.json(detailedPlaces);
  } catch (error) {
    console.error(
      "Error fetching nearby ambulances:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to fetch nearby ambulances." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
