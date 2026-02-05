from fastapi import WebSocket
from typing import Dict
import json


class WebSocketManager:
    """Manager for WebSocket connections per task."""

    def __init__(self):
        self.active_connections: Dict[str, list[WebSocket]] = {}

    async def connect(self, task_id: str, websocket: WebSocket):
        await websocket.accept()
        if task_id not in self.active_connections:
            self.active_connections[task_id] = []
        self.active_connections[task_id].append(websocket)

    def disconnect(self, task_id: str, websocket: WebSocket):
        if task_id in self.active_connections:
            self.active_connections[task_id].remove(websocket)
            if not self.active_connections[task_id]:
                del self.active_connections[task_id]

    async def send_progress(self, task_id: str, data: dict):
        if task_id in self.active_connections:
            message = json.dumps(data)
            for connection in self.active_connections[task_id]:
                try:
                    await connection.send_text(message)
                except Exception:
                    pass


ws_manager = WebSocketManager()
