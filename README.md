<div align="center">
  <img src="https://img.shields.io/badge/JARVIS-AI--Assistant-blueviolet?style=for-the-badge&logo=openai" alt="JARVIS AI" />
  <h1>JARVIS: Multi-Agent AI Operating System</h1>
  <p>A futuristic, production-grade AI desktop assistant combining a sleek glassmorphism UI with powerful local AI capabilities.</p>

  <a href="#features">Features</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#installation">Installation</a> •
  <a href="#usage">Usage</a>
</div>

---

## 🌟 Overview

**JARVIS** is a state-of-the-art AI desktop assistant designed to act as a futuristic operating system. Built with a full-stack architecture, it pairs a premium React/Electron frontend with a robust Python FastAPI backend. JARVIS supports a multi-agent workflow (Teaching, Coding, Vision) to create a highly personalized and automated desktop experience.

By leveraging powerful local models via Ollama, speech-to-text with Faster-Whisper, and text-to-speech with Piper, JARVIS operates swiftly and privately on your machine.

## ✨ Features

- **Multi-Agent Workflows:** Specialized agents for distinct tasks (e.g., Coding Agent, Teaching Agent, Vision Agent).
- **Voice Interactions:** Seamless speech-to-text (STT) using Whisper and text-to-speech (TTS) with Piper TTS.
- **Desktop Automation:** Integrated with `pyautogui` and `psutil` to control and monitor the operating system.
- **Memory & Vector Search:** Persistent context management using ChromaDB.
- **Cinematic UI:** A stunning glassmorphism design with fluid Framer Motion animations.
- **Real-Time Communication:** WebSockets facilitate instantaneous data flow between the AI backend and the React frontend.

## 🏗️ Architecture

```mermaid
graph TD;
    subgraph Frontend [Frontend (React + Vite)]
        UI[Glassmorphism UI] --> |Animations| FramerMotion[Framer Motion]
        UI --> |Code Editor| Monaco[Monaco Editor]
        UI <--> |WebSockets| Backend
    end

    subgraph Backend [Backend (FastAPI)]
        API[FastAPI Server] --> LangGraph[LangGraph/LangChain]
        LangGraph --> MultiAgent[Multi-Agent System]
        LangGraph <--> Memory[ChromaDB]
        MultiAgent --> Ollama[Local AI Models - Ollama]
        MultiAgent --> Desktop[Desktop Automation - PyAutoGUI]
        MultiAgent --> AudioIn[STT - Faster Whisper]
        MultiAgent --> AudioOut[TTS - Piper]
    end
```

## 🛠️ Tech Stack

**Frontend:**
- React 19
- Vite
- Framer Motion
- Tailwind CSS
- Lucide React
- Monaco Editor

**Backend:**
- Python (FastAPI)
- LangChain / LangGraph
- ChromaDB (Vector Database)
- SQLAlchemy (PostgreSQL/SQLite)
- Faster-Whisper (Speech-to-Text)
- Piper TTS (Text-to-Speech)
- PyAutoGUI & Psutil (Desktop Automation)

## 🚀 Installation

### Prerequisites
- Node.js (v18+)
- Python 3.10+
- Ollama (for local LLMs)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/jarvis-ai.git
cd jarvis-ai
```

### 2. Setup the Backend
Navigate to the backend directory and install the required Python packages:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
pip install -r requirements.txt
```

### 3. Setup the Frontend
Navigate to the frontend directory and install Node modules:
```bash
cd ../frontend/react-ui
npm install
```

## 💻 Usage

### Start the Backend
```bash
cd backend
# Make sure your virtual environment is activated
uvicorn main:app --reload
```

### Start the Frontend
```bash
cd frontend/react-ui
npm run dev
```

The JARVIS UI will be available at `http://localhost:5173`. Connect your microphone and start interacting with your new AI assistant!

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/yourusername/jarvis-ai/issues).

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
