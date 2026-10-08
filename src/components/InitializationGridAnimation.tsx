import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function InitializationGridAnimation() {
  const [animStage, setAnimStage] = useState<1 | 2 | 3>(1);

  useEffect(() => {
    // Stage 1 (0ms - 300ms): Grid Draw
    // Stage 2 (300ms - 600ms): Color Glow Sweep
    const timerStage2 = setTimeout(() => setAnimStage(2), 300);
    // Stage 3 (600ms+): Settled state
    const timerStage3 = setTimeout(() => setAnimStage(3), 600);

    return () => {
      clearTimeout(timerStage2);
      clearTimeout(timerStage3);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {/* Stage 1: Abstract SVG Line Animation (Interconnected 500-node circuit grid expanding) */}
      <svg
        className="w-full h-full opacity-40"
        viewBox="0 0 1000 600"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Retro-Neon Multi-Color Linear Gradient: Amber Gold -> Emerald Mint -> Fire Coral */}
          <linearGradient id="retroNeonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffaa00" />
            <stop offset="50%" stopColor="#00ff88" />
            <stop offset="100%" stopColor="#ff4141" />
          </linearGradient>

          {/* Sweeping Beam Filter */}
          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Grid Circuit Traces */}
        <motion.g
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          stroke="url(#retroNeonGradient)"
          strokeWidth="1.2"
          fill="none"
          filter="url(#neonGlow)"
        >
          {/* Horizontal Grid Conduits */}
          <line x1="100" y1="120" x2="900" y2="120" strokeDasharray="4 4" />
          <line x1="150" y1="220" x2="950" y2="220" strokeDasharray="6 3" />
          <line x1="80" y1="320" x2="920" y2="320" strokeDasharray="4 4" />
          <line x1="120" y1="420" x2="880" y2="420" strokeDasharray="5 5" />
          <line x1="200" y1="500" x2="850" y2="500" strokeDasharray="4 2" />

          {/* Vertical Busbar Conduits */}
          <line x1="250" y1="80" x2="250" y2="520" />
          <line x1="450" y1="60" x2="450" y2="540" />
          <line x1="650" y1="90" x2="650" y2="510" />
          <line x1="850" y1="70" x2="850" y2="530" />

          {/* Diagonal Optical Consensus Interconnects */}
          <path d="M 250,120 L 450,220 L 650,320 L 850,220" />
          <path d="M 450,120 L 650,220 L 450,320 L 250,420" />
          <path d="M 650,220 L 850,320 L 650,420 L 450,500" />
        </motion.g>

        {/* Micro-node junction points */}
        <g fill="#00ff88">
          <circle cx="250" cy="120" r="3" />
          <circle cx="450" cy="220" r="3" />
          <circle cx="650" cy="320" r="3" />
          <circle cx="850" cy="220" r="3" />
          <circle cx="450" cy="120" r="3" />
          <circle cx="650" cy="220" r="3" fill="#ffaa00" />
          <circle cx="450" cy="320" r="3" />
          <circle cx="250" cy="420" r="3" />
          <circle cx="650" cy="420" r="3" fill="#ff4141" />
        </g>
      </svg>

      {/* Stage 2: The Color Glow Horizontal Sweep (300ms to 600ms) */}
      {animStage >= 2 && (
        <motion.div
          initial={{ x: '-100%', opacity: 0 }}
          animate={{ x: '100%', opacity: [0, 0.8, 0] }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ffaa00]/30 via-[#00ff88]/30 via-[#ff4141]/30 to-transparent pointer-events-none"
          style={{
            filter: 'blur(15px)',
          }}
        />
      )}
    </div>
  );
}
