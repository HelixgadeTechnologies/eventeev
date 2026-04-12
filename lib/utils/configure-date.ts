// for formatting date to "Monday, September 2025"
export const formatDate = (dateStr: string) => {
  if (!dateStr) return "";

  const date = new Date(dateStr);
  const dayOfWeek = date.toLocaleString("en-US", { weekday: "long" });
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear();

  return `${dayOfWeek}, ${month} ${year}`;
};

// function to get the ordinal suffix (st, nd, rd, th)
export function getOrdinalSuffix(day: number) {
  if (day > 3 && day < 21) return "th"; // Covers 11th-13th
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

// for getting today's date
export function todaysDate() {
  const date = new Date();

  // Get day, month, and year
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear();

  return `${day}${getOrdinalSuffix(day)} ${month}, ${year}`;
}

// for getting day like "11th" from date string
export const formatDay = (dateStr: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const day = date.getDate();
  return `${day}${getOrdinalSuffix(day)}`;
};

// function to convert 12-hour time to 24-hour format
export const convertTo24HourFormat = (timeStr: string) => {
  if (!timeStr) return "";

  const cleanTime = timeStr.trim().toUpperCase();
  
  // Check if it's already in 12-hour format (e.g., "10:00 AM" or "10:00AM")
  const amPmMatch = cleanTime.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);
  
  if (amPmMatch) {
    let hour = parseInt(amPmMatch[1], 10);
    const minute = amPmMatch[2];
    const period = amPmMatch[3];

    if (period === "PM" && hour < 12) {
      hour += 12;
    } else if (period === "AM" && hour === 12) {
      hour = 0;
    }

    return `${hour.toString().padStart(2, "0")}:${minute}`;
  }

  // Fallback for simple "HH:MM" 24h or other formats
  return cleanTime;
};

/**
 * Checks if an event's end date and time have passed.
 * Combines endDate (or startDate) and endTime (or startTime) for comparison.
 */
export const isEventPassed = (event: {
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
} | null) => {
  if (!event) return false;

  const dateStr = event.endDate || event.startDate;
  const timeStr = event.endTime || event.startTime;

  if (!dateStr) return false;

  try {
    const date = new Date(dateStr);
    
    // Check if date is valid
    if (isNaN(date.getTime())) return false;

    // If time is provided, set the hours and minutes
    if (timeStr && timeStr !== "N/A") {
      const time24 = convertTo24HourFormat(timeStr);
      const timeParts = time24.split(":");
      if (timeParts.length === 2) {
        const hours = parseInt(timeParts[0], 10);
        const minutes = parseInt(timeParts[1], 10);
        if (!isNaN(hours) && !isNaN(minutes)) {
          date.setHours(hours, minutes, 0, 0);
        }
      }
    } else {
      // If no time is specified, assume it passes at the end of the day
      date.setHours(23, 59, 59, 999);
    }

    return date < new Date();
  } catch (error) {
    console.warn("Error parsing event date/time:", error);
    return false;
  }
};
