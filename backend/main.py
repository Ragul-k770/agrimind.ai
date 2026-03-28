import json
import os
import uuid
from typing import Optional, List, Dict, Any
from datetime import datetime
from fastapi import FastAPI, HTTPException, UploadFile, File  # pyre-ignore[21]
from fastapi.middleware.cors import CORSMiddleware  # pyre-ignore[21]
from pydantic import BaseModel  # pyre-ignore[21]
from dotenv import load_dotenv # pyre-ignore[21]

load_dotenv(override=True)

from ai_engine import process_agri_query, process_disease_image, get_weather_alerts  # pyre-ignore[21]

app = FastAPI(title="AgriMind AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

USERS_FILE = "users.json"
sessions_db: Dict[str, Dict[str, Any]] = {}

def load_users() -> List[Dict[str, Any]]:
    if not os.path.exists(USERS_FILE):
        with open(USERS_FILE, "w") as f:
            json.dump([], f)
        return []
    try:
        with open(USERS_FILE, "r") as f:
            data = json.load(f)
            return data if isinstance(data, list) else []
    except Exception:
        return []

def save_users(users: List[Dict[str, Any]]) -> None:
    with open(USERS_FILE, "w") as f:
        json.dump(users, f, indent=2)

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class SetupRequest(BaseModel):
    token: str
    location: str
    crop: str
    farm_size: Optional[str] = ""

class ChatRequest(BaseModel):
    user_query: str
    location: str
    crop: str
    token: Optional[str] = None

@app.post("/register")
async def register_user(req: RegisterRequest):
    name = req.name.strip()
    email = req.email.strip().lower()
    password = req.password.strip()

    if not name or not email or not password:
        raise HTTPException(status_code=400, detail="Fields cannot be empty")

    users: List[Dict[str, Any]] = load_users()
    
    print(f"DEBUG: Checking if user exists - {email}")
    for u in users:
        if str(u.get("email")) == email:
            print(f"DEBUG: User already exists - {email}")
            raise HTTPException(status_code=400, detail="User already exists")

    new_id = 1 if not users else max([int(str(u.get("id", "0"))) for u in users]) + 1
    
    new_user: Dict[str, Any] = {
        "id": new_id,
        "name": name,
        "email": email,
        "password": password,
        "location": "",
        "crop": "",
        "farm_size": "",
        "created_at": datetime.utcnow().isoformat()
    }
    
    users.append(new_user)
    save_users(users)
    print(f"DEBUG: Registration successful for {email}")
    
    return {"message": "Registration successful", "user": name}

@app.post("/login")
async def login_user(req: LoginRequest):
    email = req.email.strip().lower()
    password = req.password.strip()
    
    if not email or not password:
        raise HTTPException(status_code=400, detail="Fields cannot be empty")

    print(f"DEBUG: Login attempt for {email}")
    users: List[Dict[str, Any]] = load_users()
    
    matched_user: Optional[Dict[str, Any]] = None
    for u in users:
        if str(u.get("email")) == email and str(u.get("password")) == password:
            matched_user = u
            break
            
    if matched_user is None:
        print(f"DEBUG: Invalid credentials for {email}")
        raise HTTPException(status_code=400, detail="Invalid credentials")
        
    assert matched_user is not None
    print(f"DEBUG: Matching result SUCCESS for {email}")
    
    token = str(uuid.uuid4())
    sessions_db[token] = matched_user
    
    return {
        "status": "success",
        "user": {
            "name": matched_user.get("name", ""),
            "email": matched_user.get("email", "")
        },
        "token": token,
        "name": matched_user.get("name", ""),
        "email": matched_user.get("email", ""),
        "location": matched_user.get("location", ""),
        "crop": matched_user.get("crop", ""),
        "farm_size": matched_user.get("farm_size", "")
    }

@app.post("/setup")
async def setup_user(req: SetupRequest):
    user_session: Optional[Dict[str, Any]] = sessions_db.get(str(req.token))
    if not user_session:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    users: List[Dict[str, Any]] = load_users()
    updated = False
    for u in users:
        if str(u.get("email")) == str(user_session.get("email")):
            u["location"] = req.location.strip()
            u["crop"] = req.crop.strip()
            if req.farm_size is not None:
                u["farm_size"] = str(req.farm_size).strip()
            
            user_session["location"] = u["location"]
            user_session["crop"] = u["crop"]
            user_session["farm_size"] = u["farm_size"]
            updated = True
            break
            
    if updated:
        save_users(users)
    
    return {"message": "Setup complete", "location": req.location, "crop": req.crop}

@app.get("/user")
async def get_user(token: str):
    user: Optional[Dict[str, Any]] = sessions_db.get(token)
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return {
        "name": user.get("name", ""), 
        "email": user.get("email", ""), 
        "location": user.get("location", ""), 
        "crop": user.get("crop", ""),
        "farm_size": user.get("farm_size", "")
    }

@app.post("/chat")
async def chat_endpoint(req: ChatRequest):
    if not req.user_query:
        raise HTTPException(status_code=400, detail="Query cannot be empty")
        
    query_lower = req.user_query.lower()
    extracted_location = req.location
    extracted_crop = req.crop
    
    # NLP Context Extraction (Mock simulation)
    if not extracted_location and (" in " in query_lower or "from " in query_lower or "at " in query_lower):
        words = query_lower.replace(".", "").split()
        prev_w = ""
        for w in words:
            if prev_w in ["in", "from", "at"]:
                candidate = str(w).capitalize()
                if candidate not in ["The", "A", "My"]:
                    extracted_location = candidate
            prev_w = w
                
    if not extracted_crop and ("grow" in query_lower or "farm" in query_lower or "crop is" in query_lower):
        words = query_lower.replace(".", "").split()
        prev_w = ""
        for w in words:
            if prev_w in ["growing", "farm", "farming", "crop", "is"]:
                candidate = str(w).capitalize()
                if candidate not in ["A", "The", "My", "In"]:
                    extracted_crop = candidate
            prev_w = w
    
    # Save extracted details to session & database simultaneously
    if req.token and (extracted_location != req.location or extracted_crop != req.crop):
        user_sess: Optional[Dict[str, Any]] = sessions_db.get(str(req.token))
        if user_sess:
            user_sess["location"] = extracted_location
            user_sess["crop"] = extracted_crop
            users: List[Dict[str, Any]] = load_users()
            for u in users:
                if str(u.get("email")) == str(user_sess.get("email")):
                    u["location"] = extracted_location
                    u["crop"] = extracted_crop
                    save_users(users)
                    break

    answer = process_agri_query(req.user_query, extracted_location, extracted_crop)
    return {
        "response": answer, 
        "updated_location": extracted_location, 
        "updated_crop": extracted_crop
    }

@app.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    import tempfile
    
    # Save uploaded file temporarily for PIL image processing
    with tempfile.NamedTemporaryFile(delete=False, suffix=".png") as temp_file:
        temp_file.write(await file.read())
        temp_filepath = temp_file.name
        
    try:
        disease, confidence, recommendation = process_disease_image(temp_filepath)
    finally:
        # Clean up
        if os.path.exists(temp_filepath):
            os.remove(temp_filepath)
            
    return {"disease": disease, "confidence": confidence, "recommendation": recommendation}

@app.get("/alerts")
async def alerts_endpoint(location: str = "India"):
    alerts = get_weather_alerts(location)
    return {"alerts": alerts}

@app.get("/market-trends")
async def market_trends(state: Optional[str] = None):
    # Fetch real market data from data.gov.in securely without exposing API key
    api_key = os.getenv("DATA_GOV_IN_API_KEY")
    if not api_key:
        return {"status": "mock", "data": []}
        
    try:
        url = f"https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key={api_key}&format=json&limit=50"
        
        # If state filter is provided, append it (Government API uses filters)
        if state and state.lower() != 'all':
            # Format state string properly: e.g. "Uttar Pradesh"
            formatted_state = state.replace("-", " ").title()
            url += f"&filters[state]={formatted_state}"
            
        import requests
        # Fetching with timeout since government APIs can be extremely slow
        res = requests.get(url, timeout=5)
        
        if res.status_code == 200:
            data = res.json()
            records = data.get("records", [])
            return {"status": "success", "data": records}
        else:
            return {"status": "error", "message": "API Limit or Error"}
            
    except Exception as e:
        print(f"Market API Error: {e}")
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    import uvicorn  # pyre-ignore[21]
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)


