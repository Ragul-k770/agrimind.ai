import os
import random
import logging
from typing import Tuple
from PIL import Image
import google.generativeai as genai

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Try loading the API key from environment, optionally configured by dotenv in main.py
def get_gemini_model(model_name=None):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return None
    genai.configure(api_key=api_key)
    try:
        # Auto-detect the best available model for generateContent
        available_models = [m.name for m in genai.list_models() if 'generateContent' in m.supported_generation_methods]
        
        target_model = None
        # Prefer the newest flash variants or pro
        for m in available_models:
            if "flash" in m.lower():
                target_model = m
                break
        
        if not target_model:
            for m in available_models:
                if "pro" in m.lower():
                    target_model = m
                    break
                    
        # Fallback if nothing matches criteria
        if not target_model and available_models:
            target_model = available_models[0]
            
        target = target_model.replace("models/", "") if target_model else "gemini-1.0-pro"
        logger.info(f"Dynamically Selected Gemini Model: {target}")
        
        return genai.GenerativeModel(target)
    except Exception as e:
        logger.error(f"Error configuring Gemini model: {e}")
        return None

def process_agri_query(query: str, location: str, crop: str) -> str:
    """
    Generate an intelligent response using Gemini LLM if configured, 
    otherwise fallback to mock response.
    """
    query = query.lower()
    
    if not location or location == "":
        location = "an unspecified location"
        
    if not crop or crop == "":
         crop = "general crops"

    error_reason = "API Key empty or model failed to initialize."
    model = get_gemini_model("gemini-1.5-flash")
    
    if model:
        # Construct the Expert System Prompt
        system_instructions = (
            f"You are AgriMind AI, a highly advanced agricultural expert assistant. "
            f"The farmer chatting with you is located in '{location}' and is focusing on '{crop}'. "
            f"Provide highly accurate, scientifically-backed, and practical farming advice. "
            f"Structure your answer neatly using markdown. Use emojis for readability. "
            f"Be concise but thorough. Keep responses under 3 paragraphs unless asked for details."
        )
        
        prompt = f"{system_instructions}\n\nFarmer Query: {query}\n\nAgriMind AI:"
        
        try:
            logger.info("Calling Gemini API for text query...")
            response = model.generate_content(prompt)
            if response.text:
                return response.text
        except Exception as e:
            logger.error(f"Gemini API Error: {e}")
            error_reason = str(e)
            # Fall through to mock logic

    # Fallback Mock Logic
    soil_agent = "Alluvial loam, ideal for deep-root penetration."
    weather_agent = f"Forecast for {location} indicates optimal sunlight. Rain predicted in 4 days."
    crop_info = f"{crop} generally requires balanced NPK."
    disease_agent = "No critical symptoms reported."
    fertilizer = "Standard basal dose of Urea/DAP (50kg/acre). Top-up with Zinc sulfate."
    irrigation = "Irrigate every 3-5 days. Consider drip irrigation."
    market_agent = "₹2,500/qtl (Avg Mandi Price). Upward trend."
    safety_agent = "Wait for wind to subside before spraying."

    if "yellow" in query or "spots" in query or "wilt" in query:
        disease_agent = f"Symptoms suggest Nitrogen deficiency or blight in {crop}."
        fertilizer = "NPK 19:19:19 formulation at 5ml/litre water. Foliar spray every 14 days."

    explanation = f"This comprehensive plan targets your specific {crop} yield in {location}."

    return (
        f"**[FALLBACK MODE - {error_reason}]**\n\n"
        f"🌍 **Soil Insight**: {soil_agent}\n\n"
        f"🌦️ **Weather Impact**: {weather_agent}\n\n"
        f"🌾 **Crop/Disease Analysis**: {disease_agent} - {crop_info}\n\n"
        f"💊 **Fertilizer Plan**: {fertilizer}\n\n"
        f"💧 **Irrigation Advice**: {irrigation}\n\n"
        f"💰 **Market Insight**: {market_agent}\n\n"
        f"🛡️ **Safety Check**: {safety_agent}\n\n"
        f"💡 **Explanation**: {explanation}"
    )

def process_disease_image(filepath: str) -> Tuple[str, float, str]:
    """
    Analyze the plant leaf image using Gemini Vision to detect diseases.
    """
    model = get_gemini_model("gemini-1.5-flash")
    
    if model and os.path.exists(filepath):
        try:
            img = Image.open(filepath)
            prompt = (
                "You are an expert plant pathologist. Inspect this image of a plant leaf. "
                "Identify the crop if possible, and specifically diagnose any disease, pest, or deficiency shown in the image. "
                "Respond strictly in the following JSON format without markdown blocks: {\"disease\": \"Name of Disease\", \"confidence\": 0.95, \"recommendation\": \"Brief treatment step\"}. "
                "If it looks perfectly healthy, return 'Healthy' with a recommendation to maintain current care."
            )
            
            logger.info("Calling Gemini Vision API for image analysis...")
            response = model.generate_content([prompt, img])
            text = response.text.strip().removeprefix("```json").removesuffix("```").strip()
            
            import json
            try:
                data = json.loads(text)
                disease = data.get("disease", "Unknown Condition")
                confidence = float(data.get("confidence", 0.85))
                # Passing recommendation implicitly since the frontend expects just disease, conf
                # We'll adapt it in the frontend or backend
                return disease, confidence, data.get("recommendation", "Apply general care.")
            except json.JSONDecodeError:
                # If LLM didn't return perfect JSON
                return response.text[:50], 0.90, response.text
                
        except Exception as e:
            logger.error(f"Gemini Vision API Error: {e}")
            # Fall through to mock logic

    # Fallback Mock Logic
    diseases = ["Early Blight", "Leaf Rust", "Powdery Mildew"]
    return f"[MOCK] {random.choice(diseases)}", float(f"{random.uniform(0.85, 0.99):.2f}"), "Maintain immediate spraying of appropriate fungicide."

def get_weather_alerts(location: str):
    return [
        {"type": "WARNING", "msg": f"Rain expected in {location}. Delay pesticide spraying by 2 days."},
        {"type": "INFO", "msg": "Humidity rising. Moderate risk of fungal infections."}
    ]
