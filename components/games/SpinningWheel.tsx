"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface SpinningWheelProps {
  names: string[];
  onWinner: (name: string) => void;
}

const SpinningWheel: React.FC<SpinningWheelProps> = ({ names, onWinner }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const controls = useAnimation();
  const wheelRef = useRef<HTMLDivElement>(null);

  // Colors for segments
  const colors = [
    '#EB5017', '#1B1818', '#FFECE5', '#F9FAFB', 
    '#AD3307', '#667185', '#0F973D', '#2D31A6'
  ];

  const spin = async () => {
    if (isSpinning || names.length === 0) return;

    setIsSpinning(true);
    
    // Calculate a random rotation (at least 5 full spins + extra for winner)
    const extraSpins = 5 + Math.random() * 5;
    const totalRotation = rotation + extraSpins * 360;
    
    setRotation(totalRotation);

    await controls.start({
      rotate: totalRotation,
      transition: {
        duration: 8,
        ease: [0.13, 0, 0, 1], // Custom cubic bezier for smooth deceleration
      }
    });

    setIsSpinning(false);

    // Calculate winner based on final rotation
    const normalizedRotation = (totalRotation % 360);
    // The pointer is at the top (0 degrees). 
    // Wheel rotates clockwise.
    // So 0 degrees is the start of the first segment.
    // Normalized rotation is how much the wheel has moved clockwise.
    // The index of the item at the top is (names.length - Math.floor(normalizedRotation / (360 / names.length))) % names.length
    
    const segmentAngle = 360 / names.length;
    const winnerIndex = Math.floor((360 - normalizedRotation) / segmentAngle) % names.length;
    
    onWinner(names[winnerIndex === -1 ? 0 : winnerIndex]);
  };

  if (names.length === 0) {
    return (
      <div className="text-center p-10 border-2 border-dashed border-gray-200 rounded-[32px] bg-gray-50/50">
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No users available for the wheel</p>
      </div>
    );
  }

  const segmentAngle = 360 / names.length;

  return (
    <div className="relative flex flex-col items-center gap-12 pt-10">
      {/* Pointer */}
      <div className="absolute top-0 left-1/2 -ml-6 -mt-2 z-20">
        <div className="w-12 h-14 bg-[#EB5017] clip-path-polygon-[50%_100%,0%_0%,100%_0%] shadow-xl rounded-t-lg flex items-center justify-center pt-2">
            <div className="w-2 h-2 bg-white rounded-full shadow-inner animate-pulse" />
        </div>
      </div>

      {/* Wheel Container */}
      <div className="relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] max-w-[90vw] max-h-[60vh] aspect-square">
        {/* Outer Glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#EB5017]/20 to-transparent blur-3xl animate-pulse" />
        
        {/* The Wheel */}
        <motion.div
          animate={controls}
          initial={{ rotate: 0 }}
          style={{ rotate: rotation }}
          className="relative w-full h-full rounded-full border-[12px] border-[#1B1818] shadow-2xl overflow-hidden bg-white"
        >
          {names.map((name, i) => (
            <div
              key={i}
              className="absolute top-0 left-1/2 w-1/2 h-full origin-left overflow-hidden"
              style={{
                transform: `rotate(${i * segmentAngle}deg)`,
                clipPath: names.length > 2 
                    ? `polygon(0 0, 100% 0, 100% ${Math.tan((segmentAngle * Math.PI) / 180) * 100}%, 0 0)`
                    : 'none',
              }}
            >
              <div 
                className="w-full h-full"
                style={{ 
                    backgroundColor: colors[i % colors.length],
                    opacity: 0.9 + (i % 2) * 0.1
                }}
              >
                <div 
                  className="absolute top-[15%] left-[15%] w-[70%] text-center whitespace-nowrap overflow-hidden text-ellipsis"
                  style={{ 
                    transform: `rotate(${segmentAngle / 2}deg)`,
                    color: (i % colors.length === 2 || i % colors.length === 3) ? '#1B1818' : 'white',
                    fontWeight: 900,
                    fontSize: names.length > 10 ? '10px' : '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                >
                  {name.split(' ')[0]}
                </div>
              </div>
            </div>
          ))}

          {/* Center Hub */}
          <div className="absolute inset-0 m-auto w-16 h-16 bg-[#1B1818] rounded-full shadow-2xl flex items-center justify-center z-10 border-4 border-white">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#EB5017] to-[#FF8A00] animate-spin duration-[3000ms]" />
          </div>
        </motion.div>
      </div>

      {/* Spin Button */}
      <button
        onClick={spin}
        disabled={isSpinning}
        className={`px-12 py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 shadow-xl ${
          isSpinning 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : 'bg-[#EB5017] text-white hover:bg-[#d64815] hover:scale-105 active:scale-95 shadow-[#EB5017]/30'
        }`}
      >
        {isSpinning ? 'Wheel is spinning...' : 'Spin the Wheel'}
      </button>

      {/* Decorative Lights */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(235,80,23,0.05)_0%,transparent_50%)]" />
    </div>
  );
};

export default SpinningWheel;
