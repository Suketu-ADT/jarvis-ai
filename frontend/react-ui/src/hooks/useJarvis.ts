import { useState, useEffect, useRef, useCallback } from 'react';

export type AIState = 'idle' | 'listening' | 'thinking' | 'speaking';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'jarvis';
  intent?: string;
}

export const useJarvis = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Hello, I am JARVIS. How can I assist you today?', sender: 'jarvis', intent: 'general' }
  ]);
  const [aiState, setAiState] = useState<AIState>('idle');
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Initialize WebSocket connection to FastAPI
    const ws = new WebSocket('ws://localhost:8080/ws/chat');
    
    ws.onopen = () => {
      console.log('Connected to JARVIS Core Engine');
      setAiState('idle');
    };

    ws.onmessage = (event) => {
      const data = event.data;
      
      // Basic parsing of FastAPI response format `[INTENT] JARVIS: Message`
      let intent = 'general';
      let text = data;
      
      const intentMatch = data.match(/^\[(.*?)\]\sJARVIS:\s(.*)/);
      if (intentMatch) {
        intent = intentMatch[1].toLowerCase();
        text = intentMatch[2];
      }

      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: text,
        sender: 'jarvis',
        intent: intent
      }]);
      
      setAiState('speaking');
      
      // Simulate going back to idle after speaking (in reality, tie this to TTS audio completion)
      setTimeout(() => setAiState('idle'), 3000);
    };

    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
      setAiState('idle');
    };

    ws.onclose = () => {
      console.log('Disconnected from JARVIS Core Engine');
      setAiState('idle');
    };

    wsRef.current = ws;

    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = useCallback((text: string) => {
    if (!text.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    
    // Add user message to UI
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      text,
      sender: 'user'
    }]);

    // Update AI State and send
    setAiState('thinking');
    wsRef.current.send(text);
  }, []);

  return { messages, aiState, sendMessage, setAiState };
};
