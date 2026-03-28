import express from 'express';
import axios from 'axios';

const router = express.Router();

// AI System Prompt
const SYSTEM_PROMPT = "You are AgriMind AI, an expert farming assistant helping farmers with crop disease, soil, irrigation, and weather advice in simple language. Be incredibly helpful, practical, and provide premium quality responses.";

router.post('/', async (req, res) => {
  try {
    const { messages } = req.body;
    
    // We mock the AI integration using a free public endpoint or dummy response for demonstration if no API key is provided
    const apiKey = process.env.HUGGINGFACE_API_KEY || process.env.OPENROUTER_API_KEY;
    
    if (!apiKey || apiKey === 'your_hf_api_key_here') {
      // Return a simulated AI response for the user to see the UI working immediately
      const lastUserMessage = messages[messages.length - 1].content.toLowerCase();
      let reply = "Hello! I am AgriMind AI, your expert farming assistant. How can I help you today?";
      
      if (lastUserMessage.includes('yellow leaves')) {
        reply = "Yellow leaves on your crops often indicate a nitrogen deficiency or overwatering. \n\n**Diagnosis:** Nitrogen Deficiency\n**Solution:** Apply a nitrogen-rich fertilizer (like Urea or Ammonium Nitrate). Ensure proper soil drainage.";
      } else if (lastUserMessage.includes('fertilizer')) {
        reply = "Choosing the right fertilizer depends on your soil pH. I suggest conducting a soil test. However, a balanced NPK (Nitrogen-Phosphorus-Potassium) fertilizer like 10-10-10 is a safe start for most crops.";
      }
      
      return res.json({ reply });
    }

    // Example HuggingFace/OpenRouter Integration
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages]
      },
      {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({ reply: response.data.choices[0].message.content });

  } catch (error) {
    console.error("AI Error:", error.message);
    res.status(500).json({ reply: "I'm having trouble connecting to my agricultural knowledge base right now. Please try again later." });
  }
});

export default router;
