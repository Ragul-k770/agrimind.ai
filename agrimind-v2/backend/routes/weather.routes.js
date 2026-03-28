import express from 'express';
import axios from 'axios';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { lat = 28.6139, lon = 77.2090 } = req.query; // Default to New Delhi

    // Fetch from Open-Meteo free API
    const response = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation_probability&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`);

    const current = response.data.current;
    
    // Check for alerts
    const rainChance = current.precipitation_probability || 0;
    let alert = null;
    
    if (rainChance > 50) {
      alert = "Heavy rain expected today. Secure your harvested crops and delay pesticide spraying.";
    }

    res.json({
      temperature: current.temperature_2m,
      humidity: current.relative_humidity_2m,
      rainChance: rainChance,
      alert: alert
    });

  } catch (error) {
    console.error("Weather Error:", error.message);
    res.status(500).json({ error: "Failed to fetch weather data." });
  }
});

export default router;
