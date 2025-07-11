// for formatting date to "Monday, September 2025"
export const formatDate = (dateStr: string) => {
  if (!dateStr) return "";

  const date = new Date(dateStr);
  const dayOfWeek = date.toLocaleString("en-US", { weekday: "long" });
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear();

  return `${dayOfWeek}, ${month} ${year}`;
};

// for getting today's date
export function todaysDate() {
  const date = new Date();

  // Get day, month, and year
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear();

  // Function to get the ordinal suffix (st, nd, rd, th)
  function getOrdinalSuffix(day: number) {
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

  return `${day}${getOrdinalSuffix(day)} ${month}, ${year}`;
}

// function to convert 12-hour time to 24-hour format
export const convertTo24HourFormat = (timeStr: string) => {
  if (!timeStr) return "";

  // Check if already in 24-hour format
  if (timeStr.includes("AM") || timeStr.includes("PM")) {
    const [time, period] = timeStr.split(" ");
    const [hours, minutes] = time.split(":");
    let hour = parseInt(hours, 10);

    // Convert to 24-hour format
    if (period === "PM" && hour < 12) {
      hour += 12;
    } else if (period === "AM" && hour === 12) {
      hour = 0;
    }

    // Format with leading zeros
    return `${hour.toString().padStart(2, "0")}:${minutes}`;
  }

  return timeStr;
};
