import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LuClock3 } from "react-icons/lu";

interface TimePickerProps {
  value: string; // "HH:MM AM/PM" format or "HH:MM" 24h
  onChange: (time: string) => void;
  className?: string;
}

const HOURS = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
const MINUTES = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
const PERIODS = ['AM', 'PM'];

export default function TimePicker({ value, onChange, className = '' }: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Parse initial value or default to 12:00 AM
  const [selectedHour, setSelectedHour] = useState('12');
  const [selectedMinute, setSelectedMinute] = useState('00');
  const [selectedPeriod, setSelectedPeriod] = useState('AM');
  
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      // Basic parser for "HH:MM AM/PM" or "HH:MM"
      const timeRegex = /^(\d{1,2}):(\d{2})(?:\s?(AM|PM))?$/i;
      const match = value.match(timeRegex);
      if (match) {
        let [, h, m, p] = match;
        
        let hr = parseInt(h, 10);
        if (!p) {
          // It's 24 hr time
          p = hr >= 12 ? 'PM' : 'AM';
          if (hr > 12) hr -= 12;
          if (hr === 0) hr = 12;
        } else {
          p = p.toUpperCase();
        }
        
        setSelectedHour(hr.toString().padStart(2, '0'));
        setSelectedMinute(m.padStart(2, '0'));
        setSelectedPeriod(p);
      }
    }
  }, [value, isOpen]);

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
    // Note: Always returns in "HH:MM AM/PM" format or 24-hr if needed. 
    // We'll format to 24-hour style "HH:MM" as standard input[type=time] normally returns 24h.
    let hr24 = parseInt(selectedHour, 10);
    if (selectedPeriod === 'PM' && hr24 !== 12) hr24 += 12;
    if (selectedPeriod === 'AM' && hr24 === 12) hr24 = 0;
    
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
            className={`h-[40px] flex items-center justify-center snap-center text-lg font-medium transition-colors cursor-pointer ${
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

  // Convert current value to 12h AM/PM for display on button
  const displayTime = () => {
    if (!value) return "Select time";
    const timeRegex = /^(\d{1,2}):(\d{2})/;
    const match = value.match(timeRegex);
    if (match) {
      let hr = parseInt(match[1], 10);
      const min = match[2];
      const ampm = hr >= 12 ? 'PM' : 'AM';
      if (hr > 12) hr -= 12;
      if (hr === 0) hr = 12;
      return `${hr.toString().padStart(2, '0')}:${min} ${ampm}`;
    }
    return value;
  };

  return (
    <div className="relative inline-block w-full" ref={popoverRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-4 py-3 text-sm font-medium text-left transition-all ${
           isOpen ? 'ring-2 ring-[#EB5017]/20 border-[#EB5017]' : 'hover:border-gray-300 hover:bg-white'
        } ${!value ? 'text-gray-400' : 'text-[#1B1818]'} ${className}`}
      >
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <LuClock3 className="text-lg" />
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
            className="absolute top-full left-0 mt-2 z-50 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 p-6 w-[280px]"
          >
            <div className="text-center mb-6">
              <h4 className="text-[#1B1818] font-bold text-lg">Select time</h4>
            </div>

            <div className="relative flex justify-center items-center gap-1 mb-6">
              {/* Highlight Box over the center row */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[40px] border border-gray-100 bg-gray-50/50 rounded-2xl pointer-events-none z-0" />
              
              <div className="flex gap-2 relative z-10 items-center">
                <ScrollWheel 
                  items={HOURS} 
                  selectedValue={selectedHour} 
                  onChange={setSelectedHour} 
                />
                <span className="text-gray-300 font-bold text-xl pb-1">:</span>
                <ScrollWheel 
                  items={MINUTES} 
                  selectedValue={selectedMinute} 
                  onChange={setSelectedMinute} 
                />
                <div className="w-2" /> {/* Spacer */}
                <ScrollWheel 
                  items={PERIODS} 
                  selectedValue={selectedPeriod} 
                  onChange={setSelectedPeriod} 
                  width="w-16"
                />
              </div>
            </div>

            <div className="flex justify-between items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex-1 px-4 py-3 rounded-xl font-bold text-sm text-[#1B1818] hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 px-4 py-3 rounded-xl font-bold text-sm text-white bg-[#1B1818] hover:bg-black transition-colors shadow-md"
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
