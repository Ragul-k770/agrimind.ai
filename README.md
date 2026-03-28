# AgriMind AI 🌾

AgriMind AI is an advanced, multi-modal agricultural platform designed to empower farmers with state-of-the-art AI intelligence, real-time climate data, dynamic market prices, and comprehensive crop disease analysis.

## 🚀 Key Features

*   **Google Gemini AI Engine:** High-quality, context-aware chatbot for intelligent agricultural advisory and crop growth support. Auto-detects the latest available model structure.
*   **Computer Vision (Plant Disease Detection):** Upload an image of a sick plant leaf for instant disease identification and customized treatment recommendations via Gemini Vision.
*   **Live Interactive Climate Map:** Leaflet-based dynamic maps integrating real-time API telemetry from **OpenWeatherMap** and **Open-Meteo**. Supports soil moisture and evapotranspiration data.
*   **Live Market Insights:** Access daily local Mandi prices for various Indian crops broken down dynamically by State and District using the **Data.gov.in** API.
*   **Premium Web UI:** Fully customized dark-glassmorphism aesthetic featuring a 3D Earth Globe login animation (Three.js) and intuitive dashboard layout.
*   **Cross-Device Local Support:** Completely mobile-ready over local Wi-Fi networks. API request endpoints dynamically bind to your device's LAN host IP infrastructure out-of-the-box.

---

## 📂 Project Structure

This repository contains two parallel architectures:
1. **Classic Version:** Python FastAPI Backend + Vanilla JavaScript/HTML Frontend.
2. **V2 Version (`agrimind-v2`):** Modern Node.js Express Backend + React + Vite + TailwindCSS Frontend.

---

## 🛠️ Setup: Classic Architecture (Python/Vanilla JS)

### 1. Backend Setup
The classic backend acts as the core intelligence router.
1. Make sure Python 3.8+ is installed.
2. Navigate to the `backend` folder and install everything from identical versions:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
3. Create a `.env` file inside the `backend` folder with your API keys:
   ```env
   GEMINI_API_KEY="your_gemini_api_key_here"
   DATA_GOV_IN_API_KEY="your_data_gov_in_api_key_here"
   ```
4. Start the server (binds globally on your LAN for mobile access):
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```

### 2. Frontend Setup
1. Open a new terminal inside the `frontend` folder.
2. Launch a fast HTTP server to host the static assets over your local network:
   ```bash
   cd frontend
   python -m http.server 5500
   ```
3. Access the immersive platform:
   - On your PC: `http://localhost:5500/login.html`
   - On Mobile: `http://<YOUR_LAN_IP>:5500/login.html`

---

## 💻 Setup: V2 Architecture (Node.js/React)

The V2 module is a fully modernized approach for future scaling.

### 1. Node Backend
```bash
cd agrimind-v2/backend
npm install
node server.js
```
*(Optionally setup the V2 `.env` file with `OPENROUTER_API_KEY` or `GEMINI_API_KEY` corresponding to those routes).*

### 2. React Frontend
```bash
cd agrimind-v2/frontend
npm install
npm run dev
```

---

## 🌱 Example Output (AI Analysis)

**User Input:** Let AgriMind AI know where you farm and what your primary crops are.
Message: *"My tomato leaves have yellow spots and are starting to wilt."*

**AI System:**
*Returns a categorized assessment powered by Gemini 1.5/3.1 dynamically:*
- **Diagnosis:** Symptoms point toward Nitrogen deficiency or early blight. 
- **Treatment:** Formulate NPK 19:19:19 spray. Consider copper-based fungicides if the wilting persists. Ensure immediate isolation of heavily infected leaves.
