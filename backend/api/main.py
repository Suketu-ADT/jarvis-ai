from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
from backend.workflows.main_graph import jarvis_graph
from backend.agents.llm import llm_service
from backend.voice.stt import stt_engine
from backend.voice.tts import tts_engine

app = FastAPI(title="JARVIS Core Engine", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

@app.get("/")
def read_root():
    return {"status": "JARVIS Core Engine is Online"}

@app.websocket("/ws/chat")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Initialize the graph state
            initial_state = {"input": data, "intent": "", "response": "", "metadata": {}}
            
            # Execute the LangGraph
            try:
                result = jarvis_graph.invoke(initial_state)
                response = result.get("response", "Error: No response generated.")
                intent = result.get("intent", "unknown")
                
                await manager.send_personal_message(f"[{intent.upper()}] JARVIS: {response}", websocket)
            except Exception as e:
                await manager.send_personal_message(f"[ERROR] JARVIS: {str(e)}", websocket)
                
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.websocket("/ws/audio")
async def audio_websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # Receive binary audio chunk
            audio_data = await websocket.receive_bytes()
            
            # Save chunk to a temporary file for Whisper
            temp_path = "temp_audio.wav"
            with open(temp_path, "wb") as f:
                f.write(audio_data)
            
            # Transcribe
            text = stt_engine.transcribe_audio_file(temp_path)
            
            if text:
                # Optionally run through graph if intent is expected, 
                # or just return the transcribed text for now
                await websocket.send_json({"type": "transcription", "text": text})
                
                # Clean up
                if os.path.exists(temp_path):
                    os.remove(temp_path)
                    
    except WebSocketDisconnect:
        print("Audio client disconnected")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)
