import React from 'react';
import { Bot, Code2, Monitor, Settings } from 'lucide-react';
import AIOrb from './AIOrb';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  aiState: 'idle' | 'listening' | 'thinking' | 'speaking';
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, aiState }) => {
  const tabs = [
    { id: 'chat', icon: <Bot size={24} />, label: 'Chat' },
    { id: 'code', icon: <Code2 size={24} />, label: 'Coding' },
    { id: 'system', icon: <Monitor size={24} />, label: 'System' },
    { id: 'settings', icon: <Settings size={24} />, label: 'Settings' }
  ];

  return (
    <div className="flex h-screen w-full bg-jarvis-dark text-white overflow-hidden relative">
      {/* Animated Background Mesh */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-jarvis-blue/30 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-jarvis-neon/30 blur-[120px]" />
      </div>

      {/* Sidebar */}
      <nav className="z-10 w-24 h-full flex flex-col items-center py-8 space-y-8 glass-panel border-l-0 border-y-0 rounded-none border-r-white/10">
        <div className="mb-8">
          <div className="w-12 h-12 rounded-full border-2 border-jarvis-neon flex items-center justify-center text-jarvis-neon font-bold text-xl shadow-[0_0_15px_rgba(14,165,233,0.5)]">
            J
          </div>
        </div>
        
        <div className="flex-1 w-full flex flex-col items-center space-y-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-3 rounded-xl transition-all duration-300 ${
                activeTab === tab.id 
                  ? 'bg-jarvis-blue/20 text-jarvis-neon shadow-[0_0_15px_rgba(14,165,233,0.3)]' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
              title={tab.label}
            >
              {tab.icon}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 h-full relative z-10 flex flex-col p-6">
        <header className="w-full flex justify-end items-start h-40">
          <AIOrb state={aiState} />
        </header>
        
        <div className="flex-1 glass-panel p-6 overflow-hidden flex flex-col">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
