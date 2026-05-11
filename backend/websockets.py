from fastapi import WebSocket
from typing import Dict, List

class ConnectionManager:
    def __init__(self):
        # Map facility_id to a list of active WebSocket connections
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, facility_id: str):
        await websocket.accept()
        if facility_id not in self.active_connections:
            self.active_connections[facility_id] = []
        self.active_connections[facility_id].append(websocket)

    def disconnect(self, websocket: WebSocket, facility_id: str):
        if facility_id in self.active_connections:
            if websocket in self.active_connections[facility_id]:
                self.active_connections[facility_id].remove(websocket)
            if not self.active_connections[facility_id]:
                del self.active_connections[facility_id]

    async def broadcast_to_facility(self, message: dict, facility_id: str):
        if facility_id in self.active_connections:
            # We iterate over a copy of the list to safely handle disconnections during broadcast
            for connection in list(self.active_connections[facility_id]):
                try:
                    await connection.send_json(message)
                except Exception as e:
                    print(f"Error sending message to connection: {e}")

# Global instance
manager = ConnectionManager()
