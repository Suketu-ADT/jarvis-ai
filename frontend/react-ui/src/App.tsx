import { useState } from 'react';
import Layout from './components/Layout';
import ChatWorkspace from './components/ChatWorkspace';
import CodingWorkspace from './components/CodingWorkspace';
import { useJarvis } from './hooks/useJarvis';

function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const { messages, aiState, sendMessage } = useJarvis();

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} aiState={aiState}>
      {activeTab === 'chat' && <ChatWorkspace messages={messages} sendMessage={sendMessage} />}
      {activeTab === 'code' && <CodingWorkspace />}
      {activeTab === 'system' && (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <h2 className="text-3xl font-bold text-jarvis-neon neon-text mb-4">System Monitoring</h2>
          <p className="text-gray-400">Live CPU and RAM utilization widgets will appear here.</p>
        </div>
      )}
      {activeTab === 'settings' && (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <h2 className="text-3xl font-bold text-jarvis-neon neon-text mb-4">Core Preferences</h2>
          <p className="text-gray-400">Manage Ollama models, voice profiles, and theme settings.</p>
        </div>
      )}
    </Layout>
  );
}

export default App;
