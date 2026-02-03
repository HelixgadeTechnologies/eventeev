"use client";

import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  add,
  isSameDay,
} from "date-fns";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa6";

type CalendarProps = {
  eventDate?: string | Date | null;
};

export default function Calendar({ eventDate }: CalendarProps) {
  const highlightDate = eventDate ? new Date(eventDate) : null;

  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();

  // Get start and end of the month
  const startMonth = startOfMonth(currentDate);
  const endMonth = endOfMonth(currentDate);
  const startDay = startOfWeek(startMonth);
  const endDay = endOfWeek(endMonth);

  // Generate all days for the calendar grid
  const days: Date[] = [];
  let day = startDay;
  while (day <= endDay) {
    days.push(new Date(day));
    day = add(day, { days: 1 });
  }

  const handlePreviousMonth = () => {
    setCurrentDate(add(currentDate, { months: -1 }));
  };

  const handleNextMonth = () => {
    setCurrentDate(add(currentDate, { months: 1 }));
  };

  return (
    <div className="w-full mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handlePreviousMonth}
          className="p-1 hover:bg-orange-100 rounded transition-colors"
          aria-label="Previous month"
        >
          <FaChevronLeft className="text-gray-600" />
        </button>
        <h2 className="text-[14px] font-semibold text-[#212934]">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <button
          onClick={handleNextMonth}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          aria-label="Next month"
        >
          <FaChevronRight className="text-gray-600" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-0.5 text-center text-gray-700">
        {/* Day headers */}
        {["S", "M", "T", "W", "T", "F", "S"].map((dayName, index) => (
          <div
            key={`header-${index}`}
            className="text-[14px] font-semibold text-[#212934]"
          >
            {dayName}
          </div>
        ))}

        {/* Calendar days */}
        {days.map((day) => {
          const isToday = isSameDay(day, today);
          const isCurrentMonth =
            format(day, "MM") === format(currentDate, "MM");
          const isHighlighted = highlightDate && isSameDay(day, highlightDate);

          return (
            <div
              key={`day-${format(day, "yyyy-MM-dd")}`}
              className={`p-2 rounded-full flex h-10 w-10 justify-center items-center text-sm transition-colors ${
                isToday ? "bg-[#EB5017] text-white font-bold" : ""
              } ${!isCurrentMonth ? "text-gray-400" : ""} ${
                isHighlighted ? "bg-[#eb5017] text-white font-semibold" : ""
              }`}
            >
              {format(day, "d")}
            </div>
          );
        })}
      </div>
    </div>
  );
}
