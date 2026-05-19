import React from 'react';
import { motion, type TargetAndTransition } from 'framer-motion';

type AIState = 'idle' | 'listening' | 'thinking' | 'speaking';

interface AIOrbProps {
  state: AIState;
}

const AIOrb: React.FC<AIOrbProps> = ({ state }) => {
  const getVariants = (): TargetAndTransition => {
    switch (state) {
      case 'idle':
        return {
          scale: [1, 1.05, 1],
          opacity: [0.6, 0.8, 0.6],
          boxShadow: [
            "0 0 20px rgba(14, 165, 233, 0.4)",
            "0 0 40px rgba(14, 165, 233, 0.6)",
            "0 0 20px rgba(14, 165, 233, 0.4)"
          ],
          transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        };
      case 'listening':
        return {
          scale: [1, 1.15, 1],
          opacity: [0.8, 1, 0.8],
          boxShadow: [
            "0 0 30px rgba(16, 185, 129, 0.6)",
            "0 0 60px rgba(16, 185, 129, 0.9)",
            "0 0 30px rgba(16, 185, 129, 0.6)"
          ],
          transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
          borderColor: "rgba(16, 185, 129, 1)"
        };
      case 'thinking':
        return {
          scale: [1, 0.95, 1.05, 1],
          opacity: [0.8, 0.5, 0.9, 0.8],
          boxShadow: [
            "0 0 20px rgba(139, 92, 246, 0.6)",
            "0 0 50px rgba(139, 92, 246, 0.9)",
            "0 0 20px rgba(139, 92, 246, 0.6)"
          ],
          rotate: [0, 180, 360],
          transition: { duration: 2, repeat: Infinity, ease: "linear" },
          borderColor: "rgba(139, 92, 246, 1)"
        };
      case 'speaking':
        return {
          scale: [1, 1.2, 0.9, 1.1, 1],
          opacity: [0.8, 1, 0.7, 1, 0.8],
          boxShadow: [
            "0 0 30px rgba(6, 182, 212, 0.6)",
            "0 0 70px rgba(6, 182, 212, 0.9)",
            "0 0 40px rgba(6, 182, 212, 0.5)"
          ],
          transition: { duration: 1, repeat: Infinity, ease: "easeInOut" },
          borderColor: "rgba(6, 182, 212, 1)"
        };
      default:
        return {};
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative flex items-center justify-center w-32 h-32">
        {/* Outer Glow */}
        <motion.div
          animate={getVariants()}
          className="absolute w-full h-full rounded-full border-4 border-jarvis-neon/50 bg-jarvis-blue/20 backdrop-blur-md"
        />
        {/* Inner Core */}
        <motion.div
          animate={{
            scale: state === 'speaking' ? [1, 1.2, 1] : [1, 1.05, 1],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-16 h-16 rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.8)]"
        />
      </div>
      <span className="text-jarvis-neon font-semibold uppercase tracking-widest text-sm drop-shadow-[0_0_5px_rgba(14,165,233,0.8)]">
        {state}
      </span>
    </div>
  );
};

export default AIOrb;
