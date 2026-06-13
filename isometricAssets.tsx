import React from "react";
import { motion } from "motion/react";

// Isometric projection helper
// Maps 3D grid space (x, y, z) into 2D SVG canvas space (pixel X, pixel Y)
export const projectToIso = (
  x: number,
  y: number,
  z: number,
  cx = 280, // Center X reference
  cy = 240, // Center Y reference
  unit = 35  // Scale unit factor
) => {
  // x-axis runs down-and-right (30 degrees)
  // y-axis runs down-and-left (150 degrees)
  // z-axis runs straight up
  const xIso = cx + (x - y) * unit * 0.866;
  const yIso = cy + (x + y) * unit * 0.5 - z * unit * 0.75;
  return { x: xIso, y: yIso };
};

interface IsoBoxProps {
  x: number;
  y: number;
  z: number;
  dx: number;
  dy: number;
  dz: number;
  topColor: string;
  leftColor: string;
  rightColor: string;
  className?: string;
  delay?: number;
  glow?: boolean;
}

// A standard 3D-looking isometric box element with top, left, and right faces
export const IsoBox: React.FC<IsoBoxProps> = ({
  x,
  y,
  z,
  dx,
  dy,
  dz,
  topColor,
  leftColor,
  rightColor,
  className = "",
  delay = 0,
  glow = false
}) => {
  // Compute the 8 projection vertex points of the box
  const p000 = projectToIso(x, y, z);
  const p100 = projectToIso(x + dx, y, z);
  const p110 = projectToIso(x + dx, y + dy, z);
  const p010 = projectToIso(x, y + dy, z);

  const p001 = projectToIso(x, y, z + dz);
  const p101 = projectToIso(x + dx, y, z + dz);
  const p111 = projectToIso(x + dx, y + dy, z + dz);
  const p011 = projectToIso(x, y + dy, z + dz);

  const topPath = `M ${p001.x} ${p001.y} L ${p101.x} ${p101.y} L ${p111.x} ${p111.y} L ${p011.x} ${p011.y} Z`;
  const leftPath = `M ${p000.x} ${p000.y} L ${p010.x} ${p010.y} L ${p011.x} ${p011.y} L ${p001.x} ${p001.y} Z`;
  const rightPath = `M ${p010.x} ${p010.y} L ${p110.x} ${p110.y} L ${p111.x} ${p111.y} L ${p011.x} ${p011.y} Z`;

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.8, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", damping: 15, stiffness: 100, delay }}
      className={className}
    >
      {/* Left Face */}
      <path
        d={leftPath}
        fill={leftColor}
        stroke="rgba(0,0,0,0.12)"
        strokeWidth="0.8"
        style={glow ? { filter: "drop-shadow(0 0 1px rgba(251,191,36,0.2))" } : {}}
      />
      {/* Right face */}
      <path
        d={rightPath}
        fill={rightColor}
        stroke="rgba(0,0,0,0.12)"
        strokeWidth="0.8"
        style={glow ? { filter: "drop-shadow(0 0 1px rgba(251,191,36,0.2))" } : {}}
      />
      {/* Top Face */}
      <path
        d={topPath}
        fill={topColor}
        stroke="rgba(0,0,0,0.15)"
        strokeWidth="0.8"
      />
    </motion.g>
  );
};

// Beautiful customized nature details (isometric stylized trees)
export const PineTree: React.FC<{ x: number; y: number; delay?: number }> = ({ x, y, delay = 0 }) => {
  const base = projectToIso(x, y, 0);
  const trunkBase = projectToIso(x - 0.1, y - 0.1, 0);
  const trunkTop = projectToIso(x, y, 0.6);
  
  // Three tiered conical leaves structure represented as polygons
  const tier1BottomL = projectToIso(x - 0.7, y + 0.7, 0.5);
  const tier1BottomR = projectToIso(x + 0.7, y - 0.7, 0.5);
  const tier1Top = projectToIso(x, y, 1.4);

  const tier2BottomL = projectToIso(x - 0.5, y + 0.5, 1.1);
  const tier2BottomR = projectToIso(x + 0.5, y - 0.5, 1.1);
  const tier2Top = projectToIso(x, y, 2.0);

  const tier3BottomL = projectToIso(x - 0.3, y + 0.3, 1.7);
  const tier3BottomR = projectToIso(x + 0.3, y - 0.3, 1.7);
  const tier3Top = projectToIso(x, y, 2.5);

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.2, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", damping: 12, delay }}
    >
      {/* Trunk (Brown) */}
      <path
        d={`M ${trunkBase.x} ${trunkBase.y} L ${trunkBase.x + 8} ${trunkBase.y} L ${trunkTop.x + 4} ${trunkTop.y} L ${trunkTop.x - 4} ${trunkTop.y} Z`}
        fill="#7c2d12"
      />

      {/* Tier 1 - lower cones (Green with lighting shades) */}
      {/* Left shaded leaf face */}
      <path
        d={`M ${tier1BottomL.x} ${tier1BottomL.y} L ${base.x} ${base.y + 25} L ${tier1Top.x} ${tier1Top.y} Z`}
        fill="#15803d"
        stroke="rgba(0,0,0,0.1)"
      />
      {/* Right shaded leaf face */}
      <path
        d={`M ${tier1BottomR.x} ${tier1BottomR.y} L ${base.x} ${base.y + 25} L ${tier1Top.x} ${tier1Top.y} Z`}
        fill="#166534"
        stroke="rgba(0,0,0,0.1)"
      />

      {/* Tier 2 - mid cones */}
      <path
        d={`M ${tier2BottomL.x} ${tier2BottomL.y} L ${projectToIso(x, y, 0.6).x} ${projectToIso(x, y, 0.6).y + 18} L ${tier2Top.x} ${tier2Top.y} Z`}
        fill="#16a34a"
        stroke="rgba(0,0,0,0.1)"
      />
      <path
        d={`M ${tier2BottomR.x} ${tier2BottomR.y} L ${projectToIso(x, y, 0.6).x} ${projectToIso(x, y, 0.6).y + 18} L ${tier2Top.x} ${tier2Top.y} Z`}
        fill="#15803d"
        stroke="rgba(0,0,0,0.1)"
      />

      {/* Tier 3 - top cones */}
      <path
        d={`M ${tier3BottomL.x} ${tier3BottomL.y} L ${projectToIso(x, y, 1.2).x} ${projectToIso(x, y, 1.2).y + 12} L ${tier3Top.x} ${tier3Top.y} Z`}
        fill="#22c55e"
        stroke="rgba(0,0,0,0.1)"
      />
      <path
        d={`M ${tier3BottomR.x} ${tier3BottomR.y} L ${projectToIso(x, y, 1.2).x} ${projectToIso(x, y, 1.2).y + 12} L ${tier3Top.x} ${tier3Top.y} Z`}
        fill="#16a34a"
        stroke="rgba(0,0,0,0.1)"
      />
    </motion.g>
  );
};

// Smaller Apple/Oak trees with detailed fruits and nice rounded branches
export const RoundedTree: React.FC<{ x: number; y: number; delay?: number }> = ({ x, y, delay = 0 }) => {
  const base = projectToIso(x, y, 0);
  const foliageCenter = projectToIso(x, y, 1.4);

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.1, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", damping: 14, delay }}
    >
      {/* Tree trunk */}
      <line
        x1={base.x}
        y1={base.y}
        x2={foliageCenter.x}
        y2={foliageCenter.y}
        stroke="#451a03"
        strokeWidth="6"
        strokeLinecap="round"
      />
      
      {/* Branch sprouts */}
      <line
        x1={base.x}
        y1={base.y - 15}
        x2={base.x - 12}
        y2={base.y - 28}
        stroke="#451a03"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <line
        x1={base.x}
        y1={base.y - 20}
        x2={base.x + 14}
        y2={base.y - 32}
        stroke="#451a03"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Main Foliage Shadow */}
      <circle cx={foliageCenter.x + 2} cy={foliageCenter.y + 2} r="28" fill="#14532d" />
      {/* Main Foliage Highlight */}
      <circle cx={foliageCenter.x} cy={foliageCenter.y} r="28" fill="#15803d" />
      {/* Highlight crown */}
      <circle cx={foliageCenter.x - 8} cy={foliageCenter.y - 8} r="18" fill="#22c55e" opacity="0.85" />

      {/* Sweet Red Apples / Flowers */}
      <circle cx={foliageCenter.x - 12} cy={foliageCenter.y - 2} r="3" fill="#ef4444" />
      <circle cx={foliageCenter.x + 10} cy={foliageCenter.y - 12} r="3" fill="#ef4444" />
      <circle cx={foliageCenter.x + 6} cy={foliageCenter.y + 10} r="3" fill="#ef4444" />
      <circle cx={foliageCenter.x - 4} cy={foliageCenter.y + 14} r="3" fill="#ef4444" />
      
      {/* Apple highlight glint */}
      <circle cx={foliageCenter.x - 13} cy={foliageCenter.y - 3} r="1" fill="#ffffff" />
      <circle cx={foliageCenter.x + 9} cy={foliageCenter.y - 13} r="1" fill="#ffffff" />
    </motion.g>
  );
};

// Traditional cozy campfire with real-time flickering visual
export const Campfire: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  const fireLoc = projectToIso(x, y, 0);

  return (
    <g>
      {/* Ash/Soot ring */}
      <ellipse cx={fireLoc.x} cy={fireLoc.y} rx="18" ry="10" fill="#374151" opacity="0.6" />
      
      {/* Outer gray rocks enclosing the fire */}
      <ellipse cx={fireLoc.x} cy={fireLoc.y} rx="14" ry="8" fill="none" stroke="#6b7280" strokeWidth="3" strokeDasharray="4 2" />

      {/* Burning Wood logs crossed */}
      <line x1={fireLoc.x - 12} y1={fireLoc.y + 4} x2={fireLoc.x + 12} y2={fireLoc.y - 4} stroke="#78350f" strokeWidth="4" strokeLinecap="round" />
      <line x1={fireLoc.x + 10} y1={fireLoc.y + 4} x2={fireLoc.x - 10} y2={fireLoc.y - 4} stroke="#451a03" strokeWidth="4" strokeLinecap="round" />

      {/* Glowing embers */}
      <ellipse cx={fireLoc.x} cy={fireLoc.y - 2} rx="6" ry="3" fill="#f59e0b" opacity="0.8" />

      {/* Flickering Flames: multiple layers of animated motion paths */}
      <motion.path
        d={`M ${fireLoc.x - 6} ${fireLoc.y - 2} Q ${fireLoc.x} ${fireLoc.y - 25} ${fireLoc.x + 6} ${fireLoc.y - 2} Z`}
        fill="#ef4444"
        opacity="0.95"
        animate={{
          scaleY: [1, 1.3, 0.9, 1.25, 1],
          skewX: [0, 5, -5, 3, 0],
          y: [0, -3, 1, -2, 0]
        }}
        transition={{
          repeat: Infinity,
          duration: 1.2,
          ease: "easeInOut"
        }}
        style={{ transformOrigin: `${fireLoc.x}px ${fireLoc.y}px` }}
      />
      <motion.path
        d={`M ${fireLoc.x - 4} ${fireLoc.y - 2} Q ${fireLoc.x} ${fireLoc.y - 20} ${fireLoc.x + 4} ${fireLoc.y - 2} Z`}
        fill="#f97316"
        opacity="0.95"
        animate={{
          scaleY: [1, 1.4, 0.8, 1.2, 1],
          skewX: [0, -4, 4, -2, 0],
          y: [0, -2, 1, -1, 0]
        }}
        transition={{
          repeat: Infinity,
          duration: 0.9,
          ease: "easeInOut"
        }}
        style={{ transformOrigin: `${fireLoc.x}px ${fireLoc.y}px` }}
      />
      <motion.path
        d={`M ${fireLoc.x - 2} ${fireLoc.y - 1} Q ${fireLoc.x} ${fireLoc.y - 14} ${fireLoc.x + 2} ${fireLoc.y - 1} Z`}
        fill="#facc15"
        opacity="0.98"
        animate={{
          scaleY: [1, 1.2, 0.9, 1.3, 1],
          scaleX: [1, 1.1, 0.85, 1.05, 1]
        }}
        transition={{
          repeat: Infinity,
          duration: 0.7,
          ease: "easeInOut"
        }}
        style={{ transformOrigin: `${fireLoc.x}px ${fireLoc.y}px` }}
      />
    </g>
  );
};

// Animated Chimney Smoke Puff
export const SmokePuff: React.FC<{ cx: number; cy: number; duration: number; delay: number }> = ({ cx, cy, duration, delay }) => {
  return (
    <motion.circle
      cx={cx}
      cy={cy}
      r="4"
      fill="#e5e7eb"
      opacity="0"
      animate={{
        x: [-3, 8, -5, 12],
        y: [0, -50, -90, -130],
        r: [4, 10, 16, 22],
        opacity: [0, 0.8, 0.5, 0]
      }}
      transition={{
        repeat: Infinity,
        duration,
        delay,
        ease: "easeOut"
      }}
    />
  );
};

// Fully assembled 3D visual landscape depending on user progress stage (0 through 12)
export const IsometricScene: React.FC<{
  progressStep: number; // 0 to 12 steps
  weather: "sunny" | "rainy" | "snowy" | "night";
}> = ({ progressStep, weather }) => {
  
  // Decides whether specific components should be shown based on progress step
  const showFoundation = progressStep >= 1;
  const showPath = progressStep >= 2;
  const showFireplace = progressStep >= 3;
  const showLeftWall = progressStep >= 4;
  const showRightWall = progressStep >= 5;
  const showDoor = progressStep >= 6;
  const showWindows = progressStep >= 7;
  const showBackWalls = progressStep >= 8;
  const showRoofLeft = progressStep >= 9;
  const showRoofRight = progressStep >= 10;
  const showChimney = progressStep >= 11;
  const showDecorations = progressStep >= 12;

  // Real 3D-aligned isometric roof projection nodes
  const roofRidgeStart = projectToIso(1.6, 3.0, 2.30);
  const roofRidgeEnd = projectToIso(4.4, 3.0, 2.30);
  const roofLeftLowBack = projectToIso(1.6, 4.4, 1.80);  // Back-left low eave
  const roofLeftLowFront = projectToIso(4.4, 4.4, 1.80); // Front-left low eave
  const roofRightLowBack = projectToIso(1.6, 1.6, 1.80);  // Back-right low eave
  const roofRightLowFront = projectToIso(4.4, 1.6, 1.80); // Front-right low eave

  // Dynamic Chimney smoke source projected coordinate
  const chimneySmokeSource = projectToIso(2.2, 3.5, 3.15);

  // Helper linear interpolation function for 2D points to dynamically distribute shingle grooves
  const lerp2D = (pA: { x: number; y: number }, pB: { x: number; y: number }, t: number) => ({
    x: pA.x + (pB.x - pA.x) * t,
    y: pA.y + (pB.y - pA.y) * t,
  });

  // SVG points lists
  const pointsLeftStr = `${roofRidgeStart.x},${roofRidgeStart.y} ${roofRidgeEnd.x},${roofRidgeEnd.y} ${roofLeftLowFront.x},${roofLeftLowFront.y} ${roofLeftLowBack.x},${roofLeftLowBack.y}`;
  const pointsRightStr = `${roofRidgeStart.x},${roofRidgeStart.y} ${roofRidgeEnd.x},${roofRidgeEnd.y} ${roofRightLowFront.x},${roofRightLowFront.y} ${roofRightLowBack.x},${roofRightLowBack.y}`;

  // Ridge cap points list
  const ridgeCapP1 = projectToIso(1.58, 2.96, 2.32);
  const ridgeCapP2 = projectToIso(4.42, 2.96, 2.32);
  const ridgeCapP3 = projectToIso(4.42, 3.04, 2.32);
  const ridgeCapP4 = projectToIso(1.58, 3.04, 2.32);
  const pointsRidgeCapStr = `${ridgeCapP1.x},${ridgeCapP1.y} ${ridgeCapP2.x},${ridgeCapP2.y} ${ridgeCapP3.x},${ridgeCapP3.y} ${ridgeCapP4.x},${ridgeCapP4.y}`;

  // Shingle guide lines
  const leftShingleLines = [0.25, 0.5, 0.75].map((t) => ({
    start: lerp2D(roofRidgeStart, roofLeftLowBack, t),
    end: lerp2D(roofRidgeEnd, roofLeftLowFront, t)
  }));
  const rightShingleLines = [0.25, 0.5, 0.75].map((t) => ({
    start: lerp2D(roofRidgeStart, roofRightLowBack, t),
    end: lerp2D(roofRidgeEnd, roofRightLowFront, t)
  }));

  // Front fascia thickness highlights (creates volumetric 3D look)
  const fasciaLeftBotR = projectToIso(4.4, 3.0, 2.22);
  const fasciaLeftBotL = projectToIso(4.4, 4.4, 1.72);
  const pointsFasciaLeftStr = `${roofRidgeEnd.x},${roofRidgeEnd.y} ${fasciaLeftBotR.x},${fasciaLeftBotR.y} ${fasciaLeftBotL.x},${fasciaLeftBotL.y} ${roofLeftLowFront.x},${roofLeftLowFront.y}`;

  const fasciaRightBotL = projectToIso(4.4, 3.0, 2.22);
  const fasciaRightBotR = projectToIso(4.4, 1.6, 1.72);
  const pointsFasciaRightStr = `${roofRidgeEnd.x},${roofRidgeEnd.y} ${fasciaRightBotL.x},${fasciaRightBotL.y} ${fasciaRightBotR.x},${fasciaRightBotR.y} ${roofRightLowFront.x},${roofRightLowFront.y}`;

  // Render variables for projection formula
  const baseDim = 5.2; // Size of the floating green garden island

  // Determine ambient sky color and lighting overlay based on weather selection
  let skyGradient = "from-cyan-300 via-sky-200 to-sky-100";
  let groundGrassTop = "#4ade80"; // standard green grass
  let groundGrassLeft = "#16a34a";
  let groundGrassRight = "#15803d";
  let groundDirtLeft = "#78350f";
  let groundDirtRight = "#451a03";

  if (weather === "night") {
    skyGradient = "from-indigo-950 via-slate-900 to-slate-800";
    groundGrassTop = "#166534";
    groundGrassLeft = "#14532d";
    groundGrassRight = "#064e3b";
  } else if (weather === "rainy") {
    skyGradient = "from-slate-500 via-slate-400 to-slate-300";
    groundGrassTop = "#15803d";
    groundGrassLeft = "#166534";
    groundGrassRight = "#14532d";
  } else if (weather === "snowy") {
    skyGradient = "from-blue-100 via-slate-200 to-sky-50";
    groundGrassTop = "#f8fafc"; // Covered in pristine thick white snow!
    groundGrassLeft = "#cbd5e1";
    groundGrassRight = "#94a3b8";
  }

  return (
    <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-emerald-950 bg-gradient-to-b from-sky-400 to-sky-200">
      
      {/* Sky backdrop */}
      <div className={`absolute inset-0 bg-gradient-to-b ${skyGradient} transition-all duration-1000`} />

      {/* Floating clouds or falling snow/rain overlay */}
      {weather === "sunny" && (
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ x: [-40, 600] }}
            transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
            className="absolute top-8 left-4 w-16 h-8 bg-white/70 rounded-full blur-[1px]"
          />
          <motion.div
            animate={{ x: [-80, 500] }}
            transition={{ repeat: Infinity, duration: 28, ease: "linear", delay: 8 }}
            className="absolute top-16 right-10 w-24 h-10 bg-white/50 rounded-full blur-[2px]"
          />
          {/* A sweet smiling bright orange Sun */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 48, ease: "linear" }}
            className="absolute top-6 left-12 w-14 h-14 bg-amber-400 rounded-full shadow-lg shadow-amber-300/40 flex items-center justify-center text-amber-100 text-lg"
          >
            ☀️
          </motion.div>
        </div>
      )}

      {weather === "night" && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-16 w-12 h-12 bg-amber-100 rounded-full shadow-xl shadow-amber-100/30 flex items-center justify-center text-[28px]">
            🌙
          </div>
          {/* Twinkling stars */}
          {[1,2,3,4,5,6].map((st) => (
            <motion.div
              key={st}
              className="absolute bg-white rounded-full"
              style={{
                width: st % 2 === 0 ? "3px" : "2px",
                height: st % 2 === 0 ? "3px" : "2px",
                top: `${15 + st * 12}%`,
                left: `${10 + st * 15}%`
              }}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ repeat: Infinity, duration: 1.5 + st * 0.4, delay: st * 0.2 }}
            />
          ))}
        </div>
      )}

      {weather === "rainy" && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          {/* Rain streaks */}
          {[...Array(15)].map((_, idx) => (
            <motion.div
              key={idx}
              className="absolute w-[1.5px] h-10 bg-sky-200/40 rounded"
              style={{
                left: `${10 + idx * 7}%`,
                top: `-40px`
              }}
              animate={{
                top: ["-40px", "450px"],
                x: [0, -30]
              }}
              transition={{
                repeat: Infinity,
                duration: 0.8 + Math.random() * 0.5,
                delay: Math.random() * 1.5,
                ease: "linear"
              }}
            />
          ))}
          <div className="absolute top-8 left-10 text-gray-500 opacity-60 text-4xl">🌧️</div>
        </div>
      )}

      {weather === "snowy" && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          {/* Flakes */}
          {[...Array(20)].map((_, idx) => (
            <motion.div
              key={idx}
              className="absolute w-2 h-2 bg-white rounded-full opacity-80 blur-[0.5px]"
              style={{
                left: `${5 + idx * 5}%`,
                top: `-20px`
              }}
              animate={{
                top: ["-20px", "450px"],
                x: [0, (idx % 2 === 0 ? 25 : -25)]
              }}
              transition={{
                repeat: Infinity,
                duration: 2.5 + Math.random() * 2,
                delay: Math.random() * 3,
                ease: "linear"
              }}
            />
          ))}
          <div className="absolute top-6 right-10 text-slate-100 opacity-70 text-4xl">❄️</div>
        </div>
      )}

      {/* Main SVG Container */}
      <svg
        id="cottage-3d-island"
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 560 440"
      >
        {/* Dynamic Shadow underneath the flying island platform */}
        <ellipse cx="280" cy="380" rx="140" ry="24" fill="rgba(15,23,42,0.18)" />

        {/* ========================================================= */}
        {/* STEP 0: THE FLOATING MAIN NATURE ISLAND BEDROCK */}
        {/* ========================================================= */}
        {/* Render Soil Base Slab */}
        <IsoBox
          x={0}
          y={0}
          z={-1.2}
          dx={baseDim}
          dy={baseDim}
          dz={1.2}
          topColor={groundGrassTop}
          leftColor={groundGrassLeft}
          rightColor={groundGrassRight}
          className="transition-all duration-1000"
        />
        {/* Fertilized dirt layers beneath (Brown soil undercutter) */}
        <IsoBox
          x={0}
          y={0}
          z={-2.0}
          dx={baseDim}
          dy={baseDim}
          dz={0.8}
          topColor="#451a03"
          leftColor={groundDirtLeft}
          rightColor={groundDirtRight}
          className="transition-all duration-1000"
        />

        {/* Small Stone Cobbles clustered around the dirt island for realism */}
        <IsoBox x={0.2} y={baseDim - 0.5} z={-2.2} dx={0.4} dy={0.3} dz={0.2} topColor="#6b7280" leftColor="#4b5563" rightColor="#374151" />
        <IsoBox x={baseDim - 0.6} y={0.3} z={-2.1} dx={0.3} dy={0.4} dz={0.15} topColor="#9ca3af" leftColor="#6b7280" rightColor="#4b5563" />

        {/* NATURE ENHANCEMENTS: Trees on the back corners */}
        <PineTree x={0.4} y={1.2} delay={0.1} />
        <RoundedTree x={1.2} y={0.4} delay={0.25} />
        
        {/* Small details on the lawn: bonfire campsite */}
        <Campfire x={4.3} y={1.0} />

        {/* Forest shrubbery/Bushes/Flowers */}
        <g id="grass-blades">
          {/* Static flower blossoms dotted in the scenery */}
          <circle cx="160" cy="335" r="4" fill="#ef4444" />
          <circle cx="160" cy="335" r="2" fill="#fcd34d" />
          
          <circle cx="430" cy="270" r="4.5" fill="#a855f7" />
          <circle cx="430" cy="270" r="2.2" fill="#ffffff" />
          
          <circle cx="410" cy="260" r="3.5" fill="#f43f5e" />
          <circle cx="410" cy="260" r="1.5" fill="#fef08a" />
          
          <circle cx="130" cy="290" r="4.5" fill="#3b82f6" />
          <circle cx="130" cy="290" r="2.2" fill="#fbcfe8" />
        </g>

        {/* ========================================================= */}
        {/* STEP 2: WINDING WALKWAY PATHWAYS (showPath) */}
        {/* ========================================================= */}
        {showPath && (
          <g id="stone-walkway-path">
            {/* Smooth rounded tiles along the walkway from door (x=3, y=3) to garden edge */}
            {/* Tile 1 */}
            <IsoBox x={3.2} y={3.5} z={0.01} dx={0.6} dy={0.6} dz={0.03} topColor="#9ca3af" leftColor="#6b7280" rightColor="#4b5563" delay={0.1} />
            {/* Tile 2 */}
            <IsoBox x={3.6} y={4.0} z={0.01} dx={0.5} dy={0.5} dz={0.03} topColor="#cbd5e1" leftColor="#94a3b8" rightColor="#64748b" delay={0.2} />
            {/* Tile 3 */}
            <IsoBox x={4.1} y={4.3} z={0.01} dx={0.6} dy={0.5} dz={0.03} topColor="#9ca3af" leftColor="#6b7280" rightColor="#4b5563" delay={0.3} />
            {/* Tile 4 */}
            <IsoBox x={4.6} y={4.6} z={0.01} dx={0.5} dy={0.5} dz={0.03} topColor="#cbd5e1" leftColor="#94a3b8" rightColor="#64748b" delay={0.4} />
          </g>
        )}

        {/* ========================================================= */}
        {/* STEP 1: COTTAGE FOUNDATION SLAB (showFoundation) */}
        {/* ========================================================= */}
        {showFoundation && (
          <IsoBox
            x={1.8}
            y={1.8}
            z={0}
            dx={2.4}
            dy={2.4}
            dz={0.25}
            topColor="#94a3b8" // Slate stone floor tiles
            leftColor="#475569"
            rightColor="#334155"
            glow={showDecorations}
          />
        )}

        {/* ========================================================= */}
        {/* STEP 3: FIREPLACE AND CHIMNEY BASE SHAFT (showFireplace) */}
        {/* ========================================================= */}
        {showFireplace && (
          <IsoBox
            x={1.9}
            y={3.6}
            z={0.25}
            dx={0.5}
            dy={0.5}
            dz={1.6}
            topColor="#57534e" // Dark coal-fired stone brick
            leftColor="#44403c"
            rightColor="#292524"
          />
        )}

        {/* ========================================================= */}
        {/* STEP 4: LEFT SIDE LOG WALLS (Y-axis logs) (showLeftWall) */}
        {/* ========================================================= */}
        {showLeftWall && (
          <g id="cabin-left-wall">
            {/* Left wooden partition wall structure with open hole for circular cozy window */}
            {/* Solid back pillar column */}
            <IsoBox x={1.8} y={3.6} z={0.25} dx={0.25} dy={0.6} dz={1.6} topColor="#a16207" leftColor="#854d0e" rightColor="#713f12" />
            
            {/* Low foundation logs below panel window */}
            <IsoBox x={1.8} y={2.2} z={0.25} dx={0.25} dy={1.4} dz={0.5} topColor="#a16207" leftColor="#854d0e" rightColor="#713f12" />
            
            {/* Solid front post log column */}
            <IsoBox x={1.8} y={1.8} z={0.25} dx={0.25} dy={0.4} dz={1.6} topColor="#a16257" leftColor="#854d1a" rightColor="#713f18" />

            {/* Over-window roofing headers */}
            <IsoBox x={1.8} y={2.2} z={1.35} dx={0.25} dy={1.4} dz={0.5} topColor="#a16207" leftColor="#854d0e" rightColor="#713f12" />
          </g>
        )}

        {/* ========================================================= */}
        {/* STEP 5: RIGHT SIDE LOG WALLS (X-axis logs) (showRightWall) */}
        {/* ========================================================= */}
        {showRightWall && (
          <g id="cabin-right-wall">
            {/* Wall stretching along X axis containing opening space for door */}
            {/* Left corner logs stack pillar */}
            <IsoBox x={1.8} y={1.8} z={0.25} dx={0.5} dy={0.25} dz={1.6} topColor="#b45309" leftColor="#92400e" rightColor="#78350f" />
            
            {/* Right wall portion next to the door span */}
            <IsoBox x={3.2} y={1.8} z={0.25} dx={1.0} dy={0.25} dz={1.6} topColor="#b45309" leftColor="#92400e" rightColor="#78350f" />

            {/* Over-door support header beam */}
            <IsoBox x={2.3} y={1.8} z={1.45} dx={0.9} dy={0.25} dz={0.4} topColor="#b45309" leftColor="#92400e" rightColor="#78350f" />
          </g>
        )}

        {/* ========================================================= */}
        {/* STEP 6: WOODEN ENTRANCE DOOR (showDoor) */}
        {/* ========================================================= */}
        {showDoor && (
          <g id="cabin-main-entrance-door">
            {/* Inner door frame structure */}
            <IsoBox
              x={2.35}
              y={1.8}
              z={0.25}
              dx={0.8}
              dy={0.06}
              dz={1.2}
              topColor="#b45309"
              leftColor={showDecorations ? "#fbbf24" : "#d97706"} // Warm lighting leak
              rightColor="#78350f"
            />
            {/* Cozy door handles and circular peep door ornament details */}
            <circle cx="218" cy="225" r="2" fill="#eab308" />
          </g>
        )}

        {/* ========================================================= */}
        {/* STEP 7: GLASS WINDOW FRAMES (showWindows) */}
        {/* ========================================================= */}
        {showWindows && (
          <g id="cabin-glass-windows">
            {/* Left Wall Round window */}
            <ellipse
              cx="160"
              cy="210"
              rx="12"
              ry="8"
              fill={showDecorations ? "rgba(253,224,71,0.85)" : "rgba(147,197,253,0.6)"}
              stroke="#e2e8f0"
              strokeWidth="2"
            />
            {/* Round window panes crosshair detail */}
            <line x1="160" y1="202" x2="160" y2="218" stroke="#475569" strokeWidth="1" />
            <line x1="148" y1="210" x2="172" y2="210" stroke="#475569" strokeWidth="1" />

            {/* Window glow filter overlay if weather is night and decorations unlocked */}
            {showDecorations && (
              <circle cx="160" cy="210" r="14" fill="#fef08a" opacity="0.3" style={{ filter: "blur(4px)" }} />
            )}

            {/* Right Wall pane window (window right of door) */}
            <path
              d="M 334 205 L 358 191 L 358 218 L 334 232 Z"
              fill={showDecorations ? "rgba(253,224,71,0.85)" : "rgba(186,230,253,0.7)"}
              stroke="#cbd5e1"
              strokeWidth="2"
            />
            <path d="M 346 198 L 346 225" stroke="#475569" strokeWidth="1" />
            <path d="M 334 218 L 358 204" stroke="#475569" strokeWidth="1" />
          </g>
        )}

        {/* ========================================================= */}
        {/* STEP 8: CABINET BACK & INNER LOGS STRUCTURE (showBackWalls) */}
        {/* ========================================================= */}
        {showBackWalls && (
          <g id="cabin-back-walls">
            {/* Complete back partition logging walls (rear enclosures of the house) */}
            {/* Left back wall Y-column logs */}
            <IsoBox x={1.8} y={3.8} z={0.25} dx={0.25} dy={0.4} dz={1.6} topColor="#78350f" leftColor="#451a03" rightColor="#292524" />
            
            {/* Far back wall (X-axis logs covering coordinate back boundaries) */}
            <IsoBox x={1.8} y={4.2} z={0.25} dx={2.4} dy={0.2} dz={1.6} topColor="#78350f" leftColor="#451a03" rightColor="#292524" />

            {/* Gables (Triangular peaks for supporting roof) */}
            {/* Left Triangular Gable top */}
            <IsoBox x={1.8} y={1.8} z={1.85} dx={0.25} dy={2.4} dz={0.4} topColor="#b45309" leftColor="#92400e" rightColor="#78350f" />
            {/* Right Triangular Gable top */}
            <IsoBox x={1.8} y={1.8} z={1.85} dx={2.4} dy={0.25} dz={0.4} topColor="#b45309" leftColor="#92400e" rightColor="#78350f" />
          </g>
        )}

        {/* ========================================================= */}
        {/* STEP 9: LEFT ROOF SLATED TILE PANEL (showRoofLeft) */}
        {/* ========================================================= */}
        {showRoofLeft && (
          <g id="cabin-roof-left">
            {/* Symmetrically projected 3D sloped panel */}
            <polygon
              points={pointsLeftStr}
              fill="#b91c1c" // Earthy terracotta red base
              stroke="#991b1b"
              strokeWidth="1.5"
            />
            {/* Dynamically interpolated layer grooves for roof panel shingles */}
            {leftShingleLines.map((line, idx) => (
              <line
                key={`left-shingle-${idx}`}
                x1={line.start.x}
                y1={line.start.y}
                x2={line.end.x}
                y2={line.end.y}
                stroke="#7f1d1d"
                strokeWidth="1"
              />
            ))}
            
            {/* Front fascia thickness highlight */}
            <polygon
              points={pointsFasciaLeftStr}
              fill="#991b1b"
              stroke="#7f1d1d"
              strokeWidth="1"
            />
          </g>
        )}

        {/* ========================================================= */}
        {/* STEP 10: RIGHT ROOF SLATED TILE PANEL (showRoofRight) */}
        {/* ========================================================= */}
        {showRoofRight && (
          <g id="cabin-roof-right">
            {/* Symmetrically projected 3D sloped panel */}
            <polygon
              points={pointsRightStr}
              fill="#991b1b" // Shadow-shaded darker red
              stroke="#7f1d1d"
              strokeWidth="1.5"
            />
            {/* Dynamically interpolated layer grooves for roof panel shingles */}
            {rightShingleLines.map((line, idx) => (
              <line
                key={`right-shingle-${idx}`}
                x1={line.start.x}
                y1={line.start.y}
                x2={line.end.x}
                y2={line.end.y}
                stroke="#78350f"
                strokeWidth="1"
              />
            ))}

            {/* Front fascia thickness highlight */}
            <polygon
              points={pointsFasciaRightStr}
              fill="#7f1d1d"
              stroke="#6b1212"
              strokeWidth="1"
            />

            {/* Symmetrically projected Ridgecap (keeping rain out) */}
            <polygon
              points={pointsRidgeCapStr}
              fill="#7f1d1d"
              stroke="#4c0519"
              strokeWidth="1"
              opacity="0.95"
            />
          </g>
        )}

        {/* ========================================================= */}
        {/* STEP 11: CHIMNEY ON ROOF AND SMOKE SHADERS (showChimney) */}
        {/* ========================================================= */}
        {showChimney && (
          <g id="cabin-chimney-and-smoke">
            {/* Small brick chimney box projecting from the slated roof top */}
            <IsoBox
              x={2.0}
              y={3.3}
              z={2.1}
              dx={0.4}
              dy={0.4}
              dz={0.9}
              topColor="#b45309" // Clay brick colors
              leftColor="#78350f"
              rightColor="#451a03"
            />
            {/* Metal cowl chimney rim */}
            <IsoBox
              x={1.95}
              y={3.25}
              z={3.0}
              dx={0.5}
              dy={0.5}
              dz={0.15}
              topColor="#475569"
              leftColor="#334155"
              rightColor="#1e293b"
            />

            {/* Dynamic rising smoke puffs from projected source point */}
            <SmokePuff cx={chimneySmokeSource.x} cy={chimneySmokeSource.y} duration={4.2} delay={0} />
            <SmokePuff cx={chimneySmokeSource.x} cy={chimneySmokeSource.y} duration={3.8} delay={1.2} />
            <SmokePuff cx={chimneySmokeSource.x} cy={chimneySmokeSource.y} duration={4.6} delay={2.5} />
          </g>
        )}

        {/* ========================================================= */}
        {/* STEP 12: GOLDEN GLOWS & GARDEN EXTRA DETAILS (showDecorations) */}
        {/* ========================================================= */}
        {showDecorations && (
          <g id="crown-completed-decorations">
            {/* Cute wooden fence around back-right coordinates */}
            {/* Post 1 */}
            <IsoBox x={0.1} y={4.2} z={0} dx={0.15} dy={0.15} dz={0.5} topColor="#bfdbfe" leftColor="#93c5fd" rightColor="#60a5fa" />
            {/* Post 2 */}
            <IsoBox x={0.1} y={4.7} z={0} dx={0.15} dy={0.15} dz={0.5} topColor="#bfdbfe" leftColor="#93c5fd" rightColor="#60a5fa" />
            {/* Post 3 */}
            <IsoBox x={0.1} y={5.1} z={0} dx={0.15} dy={0.15} dz={0.5} topColor="#bfdbfe" leftColor="#93c5fd" rightColor="#60a5fa" />
            {/* Fence cross beams */}
            <IsoBox x={0.1} y={4.2} z={0.3} dx={0.08} dy={1.0} dz={0.08} topColor="#bfdbfe" leftColor="#93c5fd" rightColor="#60a5fa" />

            {/* Picket posts at the front-right of the clearing */}
            <IsoBox x={4.8} y={3.5} z={0} dx={0.12} dy={0.12} dz={0.45} topColor="#f1f5f9" leftColor="#e2e8f0" rightColor="#cbd5e1" />
            <IsoBox x={4.8} y={4.0} z={0} dx={0.12} dy={0.12} dz={0.45} topColor="#f1f5f9" leftColor="#e2e8f0" rightColor="#cbd5e1" />
            <IsoBox x={4.8} y={4.5} z={0} dx={0.12} dy={0.12} dz={0.45} topColor="#f1f5f9" leftColor="#e2e8f0" rightColor="#cbd5e1" />

            {/* Golden glowing window highlights at night */}
            {weather === "night" && (
              <g id="window-glare">
                {/* Yellow lighting polygon on the ground grass casting shadow/glow from right pane */}
                <polygon
                  points="346,236 410,240 430,285 365,275"
                  fill="url(#yellowGlowGrad)"
                  opacity="0.35"
                />
                
                {/* Defs block for gradient shadow */}
                <defs>
                  <linearGradient id="yellowGlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </g>
            )}

            {/* A gorgeous companion sheep grazing on the grass floor (x=1.2, y=4.5) */}
            <g id="grazing-sheep-ornament">
              {/* Back side shadow */}
              <ellipse cx="232" cy="334" rx="14" ry="8" fill="rgba(0,0,0,0.15)" />
              {/* Fluffy sheep body */}
              <ellipse cx="230" cy="331" rx="12" ry="9" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="0.5" />
              <circle cx="220" cy="331" r="7" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="0.5" />
              {/* Dark face */}
              <circle cx="215" cy="330" r="4.5" fill="#334155" />
              {/* Cute stick legs */}
              <line x1="223" y1="337" x2="223" y2="344" stroke="#334155" strokeWidth="1.8" />
              <line x1="227" y1="338" x2="227" y2="345" stroke="#334155" strokeWidth="1.8" />
              <line x1="233" y1="337" x2="233" y2="344" stroke="#334155" strokeWidth="1.8" />
              <line x1="237" y1="336" x2="237" y2="343" stroke="#334155" strokeWidth="1.8" />
            </g>

            {/* Complete sparkling star-spray over the cottage roof */}
            <motion.g
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.95, 1.05, 0.95] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <polygon points="285,62 287,67 292,67 288,71 289,76 285,73 281,76 282,71 278,67 283,67" fill="#fef08a" />
              <polygon points="175,142 176,145 179,145 177,147 178,150 175,148 172,150 173,147 171,145 174,145" fill="#fef08a" />
              <polygon points="360,132 361,135 364,135 362,137 363,140 360,138 357,140 358,137 356,135 359,135" fill="#fef08a" />
            </motion.g>
          </g>
        )}
      </svg>

      {/* Progressive Stage Title Badge Overlay */}
      <div className="absolute top-4 right-4 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-emerald-500/30 flex items-center gap-2 select-none">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-xs font-mono font-bold text-emerald-300">
          {progressStep === 12
            ? "Կառուցումը Ավարտված է! 🎉"
            : `Փուլ: ${progressStep} / 12`}
        </span>
      </div>

      {/* Progress percentage slider background track */}
      <div className="absolute bottom-4 left-4 right-4 h-2 bg-slate-950/60 rounded-full overflow-hidden border border-white/10">
        <motion.div
          className="h-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 shadow-lg shadow-teal-500/50"
          style={{ width: `${(progressStep / 12) * 100}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};
