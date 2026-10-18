"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  isBefore,
  startOfDay,
  parseISO,
} from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value?: string;
  onChange: (date: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  dropUp?: boolean;
  minDate?: Date | string;
  disablePast?: boolean;
}

const parseDateValue = (val?: string): Date | null => {
  if (!val) return null;
  try {
    if (val.includes("T")) {
      const d = parseISO(val);
      return isNaN(d.getTime()) ? null : d;
    }
    const parts = val.split("-");
    if (parts.length === 3) {
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) - 1;
      const d = parseInt(parts[2], 10);
      const date = new Date(y, m, d);
      return isNaN(date.getTime()) ? null : date;
    }
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d;
  } catch {
    return null;
  }
};

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  label,
  placeholder = "Select date",
  className,
  dropUp: explicitDropUp,
  minDate,
  disablePast = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(parseDateValue(value));
  const [currentMonth, setCurrentMonth] = useState<Date>(parseDateValue(value) || new Date());
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const [isDropUp, setIsDropUp] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const today = new Date();

  const effectiveMinDate = React.useMemo(() => {
    if (minDate) {
      const parsed = typeof minDate === "string" ? parseDateValue(minDate) : minDate;
      if (parsed) return startOfDay(parsed);
    }
    if (disablePast) {
      return startOfDay(new Date());
    }
    return null;
  }, [minDate, disablePast]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const parsed = parseDateValue(value);
    setSelectedDate(parsed);
    if (parsed) {
      setCurrentMonth(parsed);
    }
  }, [value]);

  const updatePosition = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const popoverWidth = 295;
    const popoverHeight = 350;

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

  // Instant capture without requiring OK button, guarded against disabled past dates
  const handleSelectDay = (day: Date) => {
    if (effectiveMinDate && isBefore(startOfDay(day), effectiveMinDate)) {
      return;
    }
    setSelectedDate(day);
    onChange(format(day, "yyyy-MM-dd"));
    setIsOpen(false);
  };

  const handleToday = () => {
    if (effectiveMinDate && isBefore(startOfDay(today), effectiveMinDate)) {
      return;
    }
    setSelectedDate(today);
    setCurrentMonth(today);
    onChange(format(today, "yyyy-MM-dd"));
    setIsOpen(false);
  };

  const handleClear = () => {
    setSelectedDate(null);
    onChange("");
    setIsOpen(false);
  };

  const isPrevMonthDisabled =
    effectiveMinDate !== null &&
    isBefore(endOfMonth(subMonths(currentMonth, 1)), effectiveMinDate);

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between px-1 py-1 mb-2">
        <button
          type="button"
          disabled={isPrevMonthDisabled}
          onClick={() => !isPrevMonthDisabled && setCurrentMonth(subMonths(currentMonth, 1))}
          className={cn(
            "w-7 h-7 flex items-center justify-center rounded-xl bg-gray-50 transition-all text-gray-500 border border-gray-100",
            isPrevMonthDisabled
              ? "opacity-25 cursor-not-allowed hover:bg-gray-50 hover:text-gray-500"
              : "hover:bg-[#EB5017]/10 hover:text-[#EB5017] active:scale-95"
          )}
          title="Previous Month"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-xs font-black text-[#1B1818] tracking-tight">
          {format(currentMonth, "MMMM yyyy")}
        </span>
        <button
          type="button"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="w-7 h-7 flex items-center justify-center rounded-xl bg-gray-50 hover:bg-[#EB5017]/10 hover:text-[#EB5017] transition-all text-gray-500 border border-gray-100 active:scale-95"
          title="Next Month"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
    return (
      <div className="grid grid-cols-7 mb-1.5 border-b border-gray-100 pb-1">
        {days.map((day) => (
          <div key={day} className="text-center text-[9px] font-black text-gray-400 uppercase tracking-wider py-0.5">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isSelected = selectedDate && isSameDay(day, selectedDate);
        const isToday = isSameDay(day, today);
        const isPast = effectiveMinDate ? isBefore(startOfDay(day), effectiveMinDate) : false;

        days.push(
          <button
            type="button"
            key={day.toString()}
            disabled={isPast}
            onClick={() => !isPast && handleSelectDay(cloneDay)}
            className={cn(
              "h-8 w-8 flex items-center justify-center text-xs font-bold rounded-xl transition-all m-auto relative",
              isPast
                ? "opacity-25 text-gray-300 cursor-not-allowed hover:bg-transparent"
                : !isCurrentMonth
                ? "text-gray-300 hover:text-gray-500"
                : "text-[#1B1818]",
              !isPast && isSelected
                ? "bg-[#EB5017] text-white font-black shadow-md shadow-[#EB5017]/30 scale-105 z-10"
                : !isPast && "hover:bg-[#EB5017]/10 hover:text-[#EB5017]",
              !isPast && isToday && !isSelected && "border border-[#EB5017] text-[#EB5017] font-black"
            )}
          >
            {format(day, "d")}
          </button>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 gap-y-1" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="space-y-1">{rows}</div>;
  };

  const isTodayDisabled = effectiveMinDate !== null && isBefore(startOfDay(today), effectiveMinDate);

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
            width: "295px",
            zIndex: 99999,
          }}
          className="bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.22)] border border-gray-100 p-4 select-none"
        >
          {renderHeader()}
          {renderDays()}
          {renderCells()}

          {/* Quick Actions Footer */}
          <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between px-1">
            {!isTodayDisabled ? (
              <button
                type="button"
                onClick={handleToday}
                className="text-[10px] font-black text-[#EB5017] uppercase tracking-widest hover:underline"
              >
                Today
              </button>
            ) : <div />}
            {selectedDate && (
              <button
                type="button"
                onClick={handleClear}
                className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-gray-600 flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="relative w-full" ref={containerRef}>
      {label && (
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block mb-1.5">
          {label}
        </span>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={handleToggle}
        className={cn(
          "w-full bg-white/70 border border-gray-100 rounded-2xl px-4 py-3 text-xs font-bold text-[#1B1818] flex items-center justify-between cursor-pointer hover:border-gray-300 transition-all shadow-sm focus:ring-1 focus:ring-[#EB5017]",
          isOpen && "border-[#EB5017] ring-1 ring-[#EB5017]/20 bg-white",
          className
        )}
      >
        <span className={cn("truncate", !selectedDate && "text-gray-400 font-medium")}>
          {selectedDate ? format(selectedDate, "MMM d, yyyy") : placeholder}
        </span>
        <CalendarIcon className="w-4 h-4 text-gray-400 shrink-0 ml-2" />
      </button>

      {/* Portal Calendar */}
      {mounted && createPortal(popoverContent, document.body)}
    </div>
  );
};

export default DatePicker;
