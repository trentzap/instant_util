from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import logging
import json
import os
from sqlmodel import Session
from database import create_db_and_tables, get_session
from routers import jobs, auth, quotes
from ws_manager import manager
from models import SosAlert
from utils.auth import get_current_user

app = FastAPI(title="Instant.Utilities API")

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    logging.info("Creating database tables...")
    create_db_and_tables()

# Include Routers
app.include_router(auth.router)
app.include_router(jobs.router)
app.include_router(quotes.router)

@app.get("/")
def read_root():
    return {"message": "Instant.Utilities API is running"}

@app.websocket("/ws/sos/{facility_id}")
async def websocket_sos_endpoint(websocket: WebSocket, facility_id: str, token: str = Query(None), session: Session = Depends(get_session)):
    if not token:
        await websocket.close(code=1008)
        return
        
    try:
        user = get_current_user(token=token, session=session)
    except HTTPException:
        await websocket.close(code=1008)
        return

    await manager.connect(websocket, facility_id)
    try:
        while True:
            # Receive SOS payload from Resident
            data = await websocket.receive_text()
            payload = json.loads(data)
            
            tap_count = payload.get("tap_count", 0)
            message = payload.get("message", "No message provided")
            
            # Save the SOS Alert to the PostgreSQL database
            new_alert = SosAlert(
                resident_id=user.id, 
                facility_id=int(facility_id) if facility_id.isdigit() else 1,
                message=message,
                tap_count=tap_count
            )
            session.add(new_alert)
            session.commit()
            session.refresh(new_alert)
            
            # Broadcast the alert payload to all connected Managers listening to this facility
            await manager.broadcast_to_facility(payload, facility_id)
            
    except WebSocketDisconnect:
        manager.disconnect(websocket, facility_id)
