"use client"

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LuClock3 } from "react-icons/lu";
import { Switch } from "./switch";
import { Label } from "./label";

interface TimePickerProps {
  value: string; // Internal state always stores 24h "HH:MM"
  onChange: (time: string) => void;
  className?: string;
}

const HOURS_12 = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
const HOURS_24 = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
const MINUTES = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
const PERIODS = ['AM', 'PM'];

export default function TimePicker({ value, onChange, className = '' }: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [is24h, setIs24h] = useState(false);
  
  const [selectedHour, setSelectedHour] = useState('12');
  const [selectedMinute, setSelectedMinute] = useState('00');
  const [selectedPeriod, setSelectedPeriod] = useState('AM');
  
  const popoverRef = useRef<HTMLDivElement>(null);

  // Parse initial 24h value from parent
  useEffect(() => {
    if (value) {
      const [h, m] = value.split(':');
      let hr = parseInt(h, 10);
      
      if (is24h) {
        setSelectedHour(h.padStart(2, '0'));
      } else {
        const period = hr >= 12 ? 'PM' : 'AM';
        let displayHr = hr % 12;
        if (displayHr === 0) displayHr = 12;
        setSelectedHour(displayHr.toString().padStart(2, '0'));
        setSelectedPeriod(period);
      }
      setSelectedMinute(m ? m.padStart(2, '0') : '00');
    }
  }, [value, is24h]);

  // Handle outside click to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSave = () => {
    let hr24 = parseInt(selectedHour, 10);
    if (!is24h) {
      if (selectedPeriod === 'PM' && hr24 !== 12) hr24 += 12;
      if (selectedPeriod === 'AM' && hr24 === 12) hr24 = 0;
    }
    
    // Always emit 24h format HH:MM
    const formatted24 = `${hr24.toString().padStart(2, '0')}:${selectedMinute}`;
    onChange(formatted24);
    setIsOpen(false);
  };

  // Utility to render the scroll wheel
  const ScrollWheel = ({ 
    items, 
    selectedValue, 
    onChange, 
    width = 'w-16' 
  }: { 
    items: string[], 
    selectedValue: string, 
    onChange: (val: string) => void,
    width?: string
  }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const itemHeight = 40; // Fixed height per item

    useEffect(() => {
      if (scrollRef.current && isOpen) {
        const index = items.indexOf(selectedValue);
        if (index !== -1) {
          scrollRef.current.scrollTop = index * itemHeight;
        }
      }
    }, [selectedValue, isOpen, items]);

    const handleScroll = (e: React.UIEvent<HTMLElement>) => {
      const top = e.currentTarget.scrollTop;
      const index = Math.round(top / itemHeight);
      if (index >= 0 && index < items.length) {
        onChange(items[index]);
      }
    };

    return (
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className={`h-[120px] ${width} overflow-y-auto no-scrollbar scroll-smooth snap-y snap-mandatory relative`}
        style={{ scrollBehavior: 'smooth' }}
      >
        {/* Empty padding blocks to allow scrolling to first/last */}
        <div style={{ height: itemHeight }} />
        {items.map((item) => (
          <div 
            key={item} 
            className={`h-[40px] flex items-center justify-center snap-center text-lg font-bold transition-colors cursor-pointer ${
              selectedValue === item ? 'text-[#1B1818]' : 'text-gray-300'
            }`}
            onClick={() => {
              if (scrollRef.current) {
                const idx = items.indexOf(item);
                scrollRef.current.scrollTo({ top: idx * itemHeight, behavior: 'smooth' });
              }
            }}
          >
            {item}
          </div>
        ))}
        <div style={{ height: itemHeight }} />
      </div>
    );
  };

  // Convert 24h value to user-friendly display based on is24h
  const displayTime = () => {
    if (!value) return "Select time";
    
    const [h, m] = value.split(':');
    let hr = parseInt(h, 10);
    
    if (is24h) {
      return value;
    } else {
      const period = hr >= 12 ? 'PM' : 'AM';
      let displayHr = hr % 12;
      if (displayHr === 0) displayHr = 12;
      return `${displayHr.toString().padStart(2, '0')}:${m} ${period}`;
    }
  };

  return (
    <div className="relative inline-block w-full" ref={popoverRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-white border border-gray-200 rounded-xl pl-12 pr-4 py-2.5 text-xs font-bold text-left transition-all ${
           isOpen ? 'ring-2 ring-[#F56630]/20 border-[#F56630]' : 'hover:border-gray-300'
        } ${!value ? 'text-gray-300' : 'text-[#1B1818]'} ${className}`}
      >
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <LuClock3 className="text-base" />
        </div>
        {displayTime()}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-full left-0 mt-2 z-50 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 p-6 w-[300px]"
          >
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-[#1B1818] font-black text-base tracking-tight">Select time</h4>
              <div className="flex items-center gap-2">
                <Label className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">24h</Label>
                <Switch 
                  checked={is24h} 
                  onCheckedChange={setIs24h} 
                  className="data-[state=checked]:bg-[#F56630] scale-75"
                />
              </div>
            </div>

            <div className="relative flex justify-center items-center gap-1 mb-8">
              {/* Highlight Box */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[40px] bg-gray-50 rounded-xl pointer-events-none z-0" />
              
              <div className="flex gap-1 relative z-10 items-center">
                <ScrollWheel 
                  items={is24h ? HOURS_24 : HOURS_12} 
                  selectedValue={selectedHour} 
                  onChange={setSelectedHour} 
                />
                <span className="text-[#1B1818] font-black text-xl pb-1 mx-1">:</span>
                <ScrollWheel 
                  items={MINUTES} 
                  selectedValue={selectedMinute} 
                  onChange={setSelectedMinute} 
                />
                {!is24h && (
                  <>
                    <div className="w-2" />
                    <ScrollWheel 
                      items={PERIODS} 
                      selectedValue={selectedPeriod} 
                      onChange={setSelectedPeriod} 
                      width="w-14"
                    />
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest text-[#1B1818] bg-white border border-gray-200 hover:bg-gray-50 transition-all active:scale-95"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest text-white bg-[#F56630] hover:bg-[#d64815] transition-all active:scale-95 shadow-lg shadow-[#F56630]/20"
              >
                Save
              </button>
            </div>
            
            <style jsx global>{`
              .no-scrollbar::-webkit-scrollbar {
                display: none;
              }
              .no-scrollbar {
                -ms-overflow-style: none;  /* IE and Edge */
                scrollbar-width: none;     /* Firefox */
              }
            `}</style>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
