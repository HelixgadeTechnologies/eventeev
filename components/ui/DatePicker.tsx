"use client";

import React, { useState, useRef, useEffect } from "react";
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
  parseISO,
} from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value?: string;
  onChange: (date: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  label,
  placeholder = "Select date",
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(value ? parseISO(value) : new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(value ? parseISO(value) : null);
  const containerRef = useRef<HTMLDivElement>(null);
  const today = new Date();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between px-1 py-2">
        <button
          type="button"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="w-6 h-6 flex items-center justify-center rounded-full bg-white shadow-sm hover:bg-gray-50 transition-all border border-gray-100"
        >
          <ChevronLeft className="w-3 h-3 text-gray-400" />
        </button>
        <span className="text-[10px] font-black text-[#1B1818]">
          {format(currentMonth, "MMMM yyyy")}
        </span>
        <button
          type="button"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="w-6 h-6 flex items-center justify-center rounded-full bg-white shadow-sm hover:bg-gray-50 transition-all border border-gray-100"
        >
          <ChevronRight className="w-3 h-3 text-gray-400" />
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
    return (
      <div className="grid grid-cols-7 mb-1">
        {days.map((day) => (
          <div key={day} className="text-center text-[8px] font-bold text-gray-400 uppercase tracking-[0.1em] py-1">
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

        days.push(
          <div
            key={day.toString()}
            onClick={() => setSelectedDate(cloneDay)}
            className={cn(
              "h-6 w-6 flex items-center justify-center text-[10px] font-black cursor-pointer rounded-lg transition-all m-auto relative",
              !isCurrentMonth ? "text-gray-300" : "text-[#1B1818]",
              isSelected
                ? "bg-[#EB5017] text-white shadow-md shadow-[#EB5017]/20 scale-105 z-10"
                : "hover:bg-gray-50 hover:text-[#EB5017]",
              isToday && !isSelected && "border border-[#EB5017] text-[#EB5017]"
            )}
          >
            {format(day, "d")}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="space-y-0.5">{rows}</div>;
  };

  const handleDone = () => {
    if (selectedDate) {
      onChange(format(selectedDate, "yyyy-MM-dd"));
    }
    setIsOpen(false);
  };

  const handleToday = () => {
    setSelectedDate(today);
    setCurrentMonth(today);
  };

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold text-[#1B1818] flex items-center justify-between cursor-pointer focus:ring-1 focus:ring-[#EB5017]/10 focus:border-[#EB5017] hover:border-gray-300 transition-all shadow-sm"
      >
        <span className="truncate">{selectedDate ? format(selectedDate, "MMM d, yyyy") : placeholder}</span>
        <CalendarIcon className="w-3.5 h-3.5 text-gray-400 shrink-0 ml-2" />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 3, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            className="absolute z-50 mt-1 bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-gray-100 p-3 w-[210px] left-0"
          >
            {renderHeader()}
            <div className="px-1">
                <div className="w-full h-[0.5px] bg-gray-100 mb-2" />
                {renderDays()}
                {renderCells()}
                <div className="mt-4 flex items-center justify-between">
                    <button
                        type="button"
                        onClick={handleToday}
                        className="text-[10px] font-black text-[#EB5017] uppercase tracking-widest hover:underline px-1"
                    >
                        Today
                    </button>
                    <button
                        type="button"
                        onClick={handleDone}
                        className="bg-[#EB5017] text-white px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-md shadow-[#EB5017]/10 hover:bg-[#d64815] transition-all active:scale-95"
                    >
                        Done
                    </button>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DatePicker;
