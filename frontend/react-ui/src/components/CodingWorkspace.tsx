import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Code2, Save } from 'lucide-react';

const CodingWorkspace: React.FC = () => {
  const [code, setCode] = useState<string>('// Ask JARVIS to generate some code, or start typing here.\n\nfunction calculateQuantumEntanglement(particles) {\n  return "Entangled!";\n}\n');
  const [language, setLanguage] = useState('javascript');

  const handleEditorChange = (value: string | undefined) => {
    if (value) setCode(value);
  };

  return (
    <div className="flex flex-col h-full w-full relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-jarvis-neon neon-text flex items-center gap-2">
          <Code2 size={24} />
          Development Environment
        </h2>
        
        <div className="flex items-center space-x-4">
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-black/30 border border-white/10 text-white rounded-lg px-3 py-1.5 focus:outline-none focus:border-jarvis-neon/50 text-sm"
          >
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
          </select>
          
          <button className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm transition-colors">
            <Save size={16} />
            Save
          </button>
          
          <button className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-jarvis-blue/20 hover:bg-jarvis-blue/30 border border-jarvis-blue/50 text-jarvis-neon text-sm transition-colors shadow-[0_0_10px_rgba(14,165,233,0.2)]">
            <Play size={16} />
            Execute
          </button>
        </div>
      </div>
      
      <div className="flex-1 border border-white/10 rounded-xl overflow-hidden shadow-inner bg-[#1e1e1e]">
        <Editor
          height="100%"
          language={language}
          theme="vs-dark"
          value={code}
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            padding: { top: 16 },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            formatOnPaste: true,
          }}
        />
      </div>
    </div>
  );
};

export default CodingWorkspace;
