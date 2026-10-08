import React from 'react';

interface Props {
  variant?: 'section2' | 'section4' | 'end';
  opacity?: number;
}

export function LuxuryFluidWaveBackdrop({ variant = 'section2', opacity = 1 }: Props) {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0"
      style={{ opacity }}
    >
      {/* Base Canvas Color */}
      <div className="absolute inset-0 bg-[#0E121A]" />

      {/* Photorealistic Organic Liquid Wave System (SVG Mesh & Velvet Gradient Curves) */}
      <svg
        className="absolute inset-0 w-full h-full object-cover filter contrast-[1.08]"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle Velvet Matte Noise Texture Filter */}
          <filter id="velvetTexture" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="stitch"
              result="noise"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.95   0 0 0 0 0.93   0 0 0 0 0.88  0 0 0 0.08 0"
              result="coloredNoise"
            />
            <feComposite operator="in" in2="SourceGraphic" />
          </filter>

          {/* Organic Liquid Gradient 1: Soft Cream to Muted Terracotta */}
          <linearGradient id="creamTerracotta" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F7F4EE" stopOpacity="0.85" />
            <stop offset="35%" stopColor="#EFECE3" stopOpacity="0.75" />
            <stop offset="65%" stopColor="#C26747" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#8C3F27" stopOpacity="0.9" />
          </linearGradient>

          {/* Organic Liquid Gradient 2: Light Sage Green to Soft Cream */}
          <linearGradient id="sageCream" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#A1B29D" stopOpacity="0.85" />
            <stop offset="45%" stopColor="#7B8F77" stopOpacity="0.75" />
            <stop offset="75%" stopColor="#546851" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#1E271D" stopOpacity="0.95" />
          </linearGradient>

          {/* Organic Liquid Gradient 3: Deep Terracotta Clay */}
          <linearGradient id="terracottaClay" x1="20%" y1="100%" x2="80%" y2="0%">
            <stop offset="0%" stopColor="#5E2214" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#AD583B" stopOpacity="0.75" />
            <stop offset="70%" stopColor="#D97A59" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#F9F6F0" stopOpacity="0.8" />
          </linearGradient>

          {/* Diffused Softening Blur */}
          <filter id="liquidGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="65" result="blur" />
          </filter>
        </defs>

        {/* SECTION 2 (The Cataclysm / Problem): Rich terracotta clay dominant with soft cream folds */}
        {variant === 'section2' && (
          <g filter="url(#liquidGlow)" opacity="0.38">
            {/* Massive Fluid Wave Sweep from Top-Right to Bottom-Left */}
            <path
              d="M 1920,0 L 1200,0 C 950,220 1150,550 780,720 C 450,860 300,950 0,1080 L 1920,1080 Z"
              fill="url(#terracottaClay)"
            />
            {/* Counter Swell Wave in Light Sage Green */}
            <path
              d="M 0,0 L 650,0 C 520,320 840,490 620,720 C 420,920 200,1000 0,1080 Z"
              fill="url(#sageCream)"
            />
            {/* Center Fluid Cream Ribbon with Velvet Highlights */}
            <path
              d="M 500,-100 C 900,200 680,600 1100,900 C 1300,1050 1600,1100 1920,800 C 1700,500 1400,300 1100,-100 Z"
              fill="url(#creamTerracotta)"
            />
          </g>
        )}

        {/* SECTION 4 (SCADA Terminal / Working Product): Calmer, structural sage green & cream waves with terracotta accents */}
        {variant === 'section4' && (
          <g filter="url(#liquidGlow)" opacity="0.32">
            {/* Top Arc in Soft Sage */}
            <path
              d="M 0,0 L 1920,0 L 1920,380 C 1450,280 1120,490 700,350 C 400,250 180,380 0,220 Z"
              fill="url(#sageCream)"
            />
            {/* Bottom Horizon Swell in Terracotta Clay */}
            <path
              d="M 0,820 C 350,740 750,910 1150,780 C 1480,680 1720,850 1920,760 L 1920,1080 L 0,1080 Z"
              fill="url(#terracottaClay)"
            />
            {/* Diagonal Silk Cream Flow */}
            <path
              d="M -100,300 C 450,450 780,250 1200,550 C 1500,750 1750,600 2020,800 L 1800,1000 C 1300,750 950,900 600,650 C 300,450 100,600 -100,500 Z"
              fill="url(#creamTerracotta)"
            />
          </g>
        )}

        {/* END SECTION (Finale / Cosmic Horizon): Balanced triumvirate of cream, terracotta clay, and light sage */}
        {variant === 'end' && (
          <g filter="url(#liquidGlow)" opacity="0.36">
            {/* Left Fluid Bloom in Sage */}
            <path
              d="M 0,0 L 800,0 C 700,350 450,600 650,850 C 780,1000 620,1080 400,1080 L 0,1080 Z"
              fill="url(#sageCream)"
            />
            {/* Right Fluid Bloom in Terracotta */}
            <path
              d="M 1920,0 L 1150,0 C 1300,350 1550,550 1350,800 C 1200,980 1400,1080 1600,1080 L 1920,1080 Z"
              fill="url(#terracottaClay)"
            />
            {/* Central Cream Light Wave */}
            <path
              d="M 750,0 C 1050,300 850,700 1200,1080 L 1050,1080 C 720,720 900,350 650,0 Z"
              fill="url(#creamTerracotta)"
            />
          </g>
        )}

        {/* Velvet Matte Finish Noise Layer */}
        <rect
          x="0"
          y="0"
          width="1920"
          height="1080"
          fill="#F7F4EE"
          filter="url(#velvetTexture)"
          opacity="0.12"
        />
      </svg>

      {/* Subtle Luxury Vignette Overlay ensuring pristine chart & typography contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E17]/80 via-transparent to-[#0A0E17]/90 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(10,14,23,0.75)_100%)] pointer-events-none" />
    </div>
  );
}
