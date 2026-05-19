import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'jarvis';
  intent?: string;
}

interface ChatWorkspaceProps {
  messages: Message[];
  sendMessage: (text: string) => void;
}

const ChatWorkspace: React.FC<ChatWorkspaceProps> = ({ messages, sendMessage }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full w-full relative">
      <h2 className="text-2xl font-semibold mb-4 text-jarvis-neon neon-text">Communication Link</h2>
      
      {/* Message Area */}
      <div className="flex-1 overflow-y-auto pr-4 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl ${
              msg.sender === 'user' 
                ? 'bg-jarvis-blue/20 border border-jarvis-blue/30 rounded-br-none' 
                : 'bg-white/5 border border-white/10 rounded-bl-none'
            }`}>
              {msg.intent && msg.sender === 'jarvis' && (
                <div className="text-xs text-jarvis-cyan/70 uppercase tracking-widest mb-2 font-semibold">
                  [{msg.intent}]
                </div>
              )}
              <div className="text-white/90 leading-relaxed">
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="mt-4 pt-4 border-t border-white/10 flex items-center space-x-4 relative">
        <button className="p-3 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-jarvis-neon">
          <Mic size={20} />
        </button>
        <div className="flex-1 relative">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Command JARVIS..."
            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-jarvis-neon/50 focus:ring-1 focus:ring-jarvis-neon/50 transition-all"
          />
        </div>
        <button 
          onClick={handleSend}
          className="p-3 rounded-xl bg-jarvis-blue/20 text-jarvis-neon hover:bg-jarvis-blue/30 border border-jarvis-blue/50 transition-all shadow-[0_0_10px_rgba(14,165,233,0.2)]"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatWorkspace;
