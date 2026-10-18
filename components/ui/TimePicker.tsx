"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LuClock3 } from "react-icons/lu";
import { cn } from "@/lib/utils";

interface TimePickerProps {
  value?: string; // 24h format "HH:mm" or "HH:mm AM/PM"
  onChange: (time: string) => void;
  className?: string;
  dropUp?: boolean;
  minTime?: string; // e.g. "14:30" or "09:00 AM" - disables times in the past
}

const HOURS = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
const MINUTES = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"];

const QUICK_PRESETS = [
  { label: "08:00 AM", h: "08", m: "00", p: "AM" as const },
  { label: "09:00 AM", h: "09", m: "00", p: "AM" as const },
  { label: "10:00 AM", h: "10", m: "00", p: "AM" as const },
  { label: "12:00 PM", h: "12", m: "00", p: "PM" as const },
  { label: "02:00 PM", h: "02", m: "00", p: "PM" as const },
  { label: "05:00 PM", h: "05", m: "00", p: "PM" as const },
  { label: "06:00 PM", h: "06", m: "00", p: "PM" as const },
  { label: "08:00 PM", h: "08", m: "00", p: "PM" as const },
  { label: "11:59 PM", h: "11", m: "59", p: "PM" as const },
];

function parseTimeString(val?: string): { hour: string; minute: string; period: "AM" | "PM" } {
  if (!val) {
    return { hour: "09", minute: "00", period: "AM" };
  }

  // Handle 12h format e.g. "09:30 AM"
  if (val.toUpperCase().includes("AM") || val.toUpperCase().includes("PM")) {
    const parts = val.trim().split(/\s+/);
    const timeParts = parts[0].split(":");
    const period = (parts[1] || "AM").toUpperCase() === "PM" ? "PM" : "AM";
    const h = parseInt(timeParts[0], 10) || 12;
    const m = parseInt(timeParts[1], 10) || 0;
    return {
      hour: h.toString().padStart(2, "0"),
      minute: m.toString().padStart(2, "0"),
      period,
    };
  }

  // Handle 24h format e.g. "14:30"
  const [hStr, mStr] = val.split(":");
  let h = parseInt(hStr, 10);
  if (isNaN(h)) h = 9;
  const m = parseInt(mStr, 10);
  const minute = (isNaN(m) ? 0 : m).toString().padStart(2, "0");
  const period: "AM" | "PM" = h >= 12 ? "PM" : "AM";
  let h12 = h % 12;
  if (h12 === 0) h12 = 12;

  return {
    hour: h12.toString().padStart(2, "0"),
    minute,
    period,
  };
}

function to24Hour(hour12: string, minute: string, period: "AM" | "PM"): string {
  let h = parseInt(hour12, 10);
  if (isNaN(h)) h = 12;
  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  return `${h.toString().padStart(2, "0")}:${minute}`;
}

function to24HourNumber(hour12: string | number, period: "AM" | "PM"): number {
  let h = typeof hour12 === "string" ? parseInt(hour12, 10) : hour12;
  if (isNaN(h)) h = 12;
  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  return h;
}

function parseMinTimeMinutes(minTimeStr?: string): number | null {
  if (!minTimeStr) return null;
  const p = parseTimeString(minTimeStr);
  const h24 = to24HourNumber(p.hour, p.period);
  const m = parseInt(p.minute, 10) || 0;
  return h24 * 60 + m;
}

export default function TimePicker({
  value,
  onChange,
  className = "",
  dropUp: explicitDropUp,
  minTime,
}: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const parsed = parseTimeString(value);
  const [selectedHour, setSelectedHour] = useState(parsed.hour);
  const [selectedMinute, setSelectedMinute] = useState(parsed.minute);
  const [selectedPeriod, setSelectedPeriod] = useState<"AM" | "PM">(parsed.period);

  const [pos, setPos] = useState({ top: 0, left: 0 });
  const [isDropUp, setIsDropUp] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const minMinutes = parseMinTimeMinutes(minTime);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (value) {
      const p = parseTimeString(value);
      setSelectedHour(p.hour);
      setSelectedMinute(p.minute);
      setSelectedPeriod(p.period);
    }
  }, [value]);

  // Ensure selected time is never in the past if minTime is set
  useEffect(() => {
    if (minMinutes !== null) {
      const currentTotal =
        to24HourNumber(selectedHour, selectedPeriod) * 60 + parseInt(selectedMinute, 10);
      if (currentTotal < minMinutes && minTime) {
        const p = parseTimeString(minTime);
        setSelectedHour(p.hour);
        setSelectedMinute(p.minute);
        setSelectedPeriod(p.period);
        onChange(to24Hour(p.hour, p.minute, p.period));
      }
    }
  }, [minMinutes, minTime, selectedHour, selectedMinute, selectedPeriod, onChange]);

  const updatePosition = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const popoverWidth = 315;
    const popoverHeight = 390;

    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    let dropUp = false;
    if (explicitDropUp !== undefined) {
      dropUp = explicitDropUp;
    } else {
      dropUp = spaceBelow < popoverHeight && spaceAbove > spaceBelow;
    }

    let top = dropUp ? rect.top - popoverHeight - 8 : rect.bottom + 8;
    if (top < 12) top = 12;
    if (top + popoverHeight > window.innerHeight - 12) {
      top = Math.max(12, window.innerHeight - popoverHeight - 12);
    }

    let left = rect.left;
    if (left + popoverWidth > window.innerWidth - 16) {
      left = Math.max(16, rect.right - popoverWidth);
    }
    if (left < 16) left = 16;

    setPos({ top, left });
    setIsDropUp(dropUp);
  }, [explicitDropUp]);

  useEffect(() => {
    if (!isOpen) return;

    updatePosition();

    const handleScrollOrResize = () => {
      updatePosition();
    };

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        popoverRef.current &&
        !popoverRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, updatePosition]);

  const handleToggle = () => {
    if (!isOpen) {
      updatePosition();
    }
    setIsOpen(!isOpen);
  };

  const emitTimeChange = (h: string, m: string, p: "AM" | "PM") => {
    const time24 = to24Hour(h, m, p);
    onChange(time24);
  };

  const handleSelectHour = (h: string) => {
    if (minMinutes !== null) {
      const hourLatestMins = to24HourNumber(h, selectedPeriod) * 60 + 59;
      if (hourLatestMins < minMinutes) return;
      // If hour is at boundary, ensure minute isn't in the past
      const currentMins = to24HourNumber(h, selectedPeriod) * 60 + parseInt(selectedMinute, 10);
      if (currentMins < minMinutes && minTime) {
        const p = parseTimeString(minTime);
        setSelectedHour(h);
        setSelectedMinute(p.minute);
        emitTimeChange(h, p.minute, selectedPeriod);
        return;
      }
    }
    setSelectedHour(h);
    emitTimeChange(h, selectedMinute, selectedPeriod);
  };

  const handleSelectMinute = (m: string) => {
    if (minMinutes !== null) {
      const currentMins =
        to24HourNumber(selectedHour, selectedPeriod) * 60 + parseInt(m, 10);
      if (currentMins < minMinutes) return;
    }
    setSelectedMinute(m);
    emitTimeChange(selectedHour, m, selectedPeriod);
  };

  const handleSelectPeriod = (p: "AM" | "PM") => {
    if (minMinutes !== null && p === "AM") {
      // 11:59 AM is 719 minutes
      if (minMinutes > 11 * 60 + 59) return;
    }
    setSelectedPeriod(p);
    emitTimeChange(selectedHour, selectedMinute, p);
  };

  const handleSelectPreset = (preset: typeof QUICK_PRESETS[0]) => {
    if (minMinutes !== null) {
      const presetMins =
        to24HourNumber(preset.h, preset.p) * 60 + parseInt(preset.m, 10);
      if (presetMins < minMinutes) return;
    }
    setSelectedHour(preset.h);
    setSelectedMinute(preset.m);
    setSelectedPeriod(preset.p);
    emitTimeChange(preset.h, preset.m, preset.p);
    setIsOpen(false);
  };

  const handleCustomHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 2) val = val.slice(0, 2);
    let num = parseInt(val, 10);
    if (!isNaN(num)) {
      if (num < 1) num = 1;
      if (num > 12) num = 12;
      const hStr = num.toString().padStart(2, "0");
      if (minMinutes !== null) {
        const hourLatestMins = to24HourNumber(hStr, selectedPeriod) * 60 + 59;
        if (hourLatestMins < minMinutes) return;
      }
      setSelectedHour(hStr);
      emitTimeChange(hStr, selectedMinute, selectedPeriod);
    }
  };

  const handleCustomMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 2) val = val.slice(0, 2);
    let num = parseInt(val, 10);
    if (!isNaN(num)) {
      if (num < 0) num = 0;
      if (num > 59) num = 59;
      const mStr = num.toString().padStart(2, "0");
      if (minMinutes !== null) {
        const totalMins =
          to24HourNumber(selectedHour, selectedPeriod) * 60 + parseInt(mStr, 10);
        if (totalMins < minMinutes) return;
      }
      setSelectedMinute(mStr);
      emitTimeChange(selectedHour, mStr, selectedPeriod);
    }
  };

  const handleDone = () => {
    emitTimeChange(selectedHour, selectedMinute, selectedPeriod);
    setIsOpen(false);
  };

  const displayTime = () => {
    if (!value) return "Select time";
    const p = parseTimeString(value);
    return `${p.hour}:${p.minute} ${p.period}`;
  };

  const isAmDisabled = minMinutes !== null && minMinutes > 11 * 60 + 59;

  const popoverContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={popoverRef}
          initial={{ opacity: 0, y: isDropUp ? 6 : -6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: isDropUp ? 6 : -6, scale: 0.98 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          style={{
            position: "fixed",
            top: `${pos.top}px`,
            left: `${pos.left}px`,
            width: "315px",
            zIndex: 99999,
          }}
          className="bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.22)] border border-gray-100 p-5 select-none"
        >
          {/* Header / Active Time Display with interactive direct inputs */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
            <div className="flex items-center gap-2">
              <LuClock3 className="text-[#EB5017] text-lg shrink-0" />
              <div className="flex items-center bg-gray-50 border border-gray-100 rounded-xl px-2 py-1">
                <input
                  type="text"
                  value={selectedHour}
                  onChange={handleCustomHourChange}
                  className="w-7 text-center font-black text-sm text-[#1B1818] bg-transparent outline-none focus:text-[#EB5017]"
                  title="Hour (1-12)"
                />
                <span className="font-black text-sm text-gray-400 pb-0.5">:</span>
                <input
                  type="text"
                  value={selectedMinute}
                  onChange={handleCustomMinuteChange}
                  className="w-7 text-center font-black text-sm text-[#1B1818] bg-transparent outline-none focus:text-[#EB5017]"
                  title="Minute (0-59)"
                />
              </div>
            </div>

            {/* AM / PM Toggle */}
            <div className="flex items-center bg-gray-100 p-1 rounded-xl">
              <button
                type="button"
                disabled={isAmDisabled}
                onClick={() => handleSelectPeriod("AM")}
                className={cn(
                  "px-2.5 py-1 text-[10px] font-black uppercase rounded-lg transition-all",
                  isAmDisabled && "opacity-25 cursor-not-allowed hover:bg-transparent",
                  !isAmDisabled && selectedPeriod === "AM"
                    ? "bg-[#EB5017] text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-800"
                )}
              >
                AM
              </button>
              <button
                type="button"
                onClick={() => handleSelectPeriod("PM")}
                className={cn(
                  "px-2.5 py-1 text-[10px] font-black uppercase rounded-lg transition-all",
                  selectedPeriod === "PM"
                    ? "bg-[#EB5017] text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-800"
                )}
              >
                PM
              </button>
            </div>
          </div>

          {/* Quick Popular Times */}
          <div className="mb-4">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2">
              Popular Times
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {QUICK_PRESETS.map((preset) => {
                const isCurrent =
                  selectedHour === preset.h &&
                  selectedMinute === preset.m &&
                  selectedPeriod === preset.p;
                const presetMins =
                  to24HourNumber(preset.h, preset.p) * 60 + parseInt(preset.m, 10);
                const isPresetDisabled = minMinutes !== null && presetMins < minMinutes;

                return (
                  <button
                    type="button"
                    key={preset.label}
                    disabled={isPresetDisabled}
                    onClick={() => handleSelectPreset(preset)}
                    className={cn(
                      "py-1.5 px-2 text-[10px] font-bold rounded-lg border transition-all text-center",
                      isPresetDisabled
                        ? "opacity-25 border-gray-100 text-gray-300 cursor-not-allowed hover:bg-transparent"
                        : isCurrent
                        ? "bg-[#EB5017] text-white border-[#EB5017] shadow-sm font-black"
                        : "bg-gray-50/70 border-gray-100 text-gray-700 hover:border-[#EB5017]/30 hover:bg-[#EB5017]/5"
                    )}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Clickable Hours Selection */}
          <div className="mb-3">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">
              Select Hour
            </span>
            <div className="grid grid-cols-6 gap-1">
              {HOURS.map((h) => {
                const hourLatestMins =
                  to24HourNumber(h, selectedPeriod) * 60 + 59;
                const isHourDisabled =
                  minMinutes !== null && hourLatestMins < minMinutes;

                return (
                  <button
                    type="button"
                    key={h}
                    disabled={isHourDisabled}
                    onClick={() => handleSelectHour(h)}
                    className={cn(
                      "h-8 rounded-lg text-xs font-bold transition-all flex items-center justify-center",
                      isHourDisabled
                        ? "opacity-25 text-gray-300 cursor-not-allowed hover:bg-transparent"
                        : selectedHour === h
                        ? "bg-[#EB5017] text-white font-black shadow-sm scale-105"
                        : "bg-gray-50 text-gray-700 hover:bg-[#EB5017]/10 hover:text-[#EB5017]"
                    )}
                  >
                    {h}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Clickable Minutes Selection */}
          <div className="mb-4">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">
              Select Minute
            </span>
            <div className="grid grid-cols-6 gap-1">
              {MINUTES.map((m) => {
                const currentMins =
                  to24HourNumber(selectedHour, selectedPeriod) * 60 + parseInt(m, 10);
                const isMinuteDisabled =
                  minMinutes !== null && currentMins < minMinutes;

                return (
                  <button
                    type="button"
                    key={m}
                    disabled={isMinuteDisabled}
                    onClick={() => handleSelectMinute(m)}
                    className={cn(
                      "h-8 rounded-lg text-xs font-bold transition-all flex items-center justify-center",
                      isMinuteDisabled
                        ? "opacity-25 text-gray-300 cursor-not-allowed hover:bg-transparent"
                        : selectedMinute === m
                        ? "bg-[#EB5017] text-white font-black shadow-sm scale-105"
                        : "bg-gray-50 text-gray-700 hover:bg-[#EB5017]/10 hover:text-[#EB5017]"
                    )}
                  >
                    :{m}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer with Now & Done buttons */}
          <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                const now = new Date();
                const hNow = now.getHours();
                const mNow = (Math.round(now.getMinutes() / 5) * 5) % 60;
                const pNow: "AM" | "PM" = hNow >= 12 ? "PM" : "AM";
                let h12Now = hNow % 12;
                if (h12Now === 0) h12Now = 12;
                const hStr = h12Now.toString().padStart(2, "0");
                const mStr = mNow.toString().padStart(2, "0");
                setSelectedHour(hStr);
                setSelectedMinute(mStr);
                setSelectedPeriod(pNow);
                emitTimeChange(hStr, mStr, pNow);
              }}
              className="text-[10px] font-black text-[#EB5017] uppercase tracking-wider hover:underline"
            >
              Current Time
            </button>
            <button
              type="button"
              onClick={handleDone}
              className="bg-[#1B1818] text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#EB5017] transition-all shadow-sm active:scale-95"
            >
              Done
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={handleToggle}
        className={cn(
          "w-full bg-white/70 border border-gray-100 rounded-2xl pl-11 pr-4 py-3 text-xs font-bold text-left transition-all relative flex items-center justify-between shadow-sm hover:border-gray-300 focus:ring-1 focus:ring-[#EB5017]",
          isOpen && "border-[#EB5017] ring-1 ring-[#EB5017]/20 bg-white",
          !value ? "text-gray-400 font-medium" : "text-[#1B1818]",
          className
        )}
      >
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <LuClock3 className="text-base" />
        </div>
        <span className="truncate">{displayTime()}</span>
      </button>

      {/* Portal Popover */}
      {mounted && createPortal(popoverContent, document.body)}
    </div>
  );
}
