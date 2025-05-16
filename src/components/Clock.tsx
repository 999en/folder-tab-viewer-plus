
import { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";

const Clock = () => {
  const { settings } = useApp();
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    // Initial update
    updateDateTime();
    
    // Update every second
    const interval = setInterval(updateDateTime, 1000);
    
    return () => clearInterval(interval);
  }, [settings.use24HourFormat]);

  const updateDateTime = () => {
    const now = new Date();
    
    // Format time
    let hours = now.getHours();
    const minutes = now.getMinutes();
    let timeString = "";
    
    if (settings.use24HourFormat) {
      timeString = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    } else {
      const period = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12; // Convert to 12-hour format
      timeString = `${hours}:${minutes.toString().padStart(2, "0")} ${period}`;
    }
    
    setTime(timeString);
    
    // Format date
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    setDate(now.toLocaleDateString(undefined, options));
  };

  if (!settings.showClock && !settings.showDate) return null;

  return (
    <div className="text-center animate-fade-in">
      {settings.showClock && (
        <h1 className="text-7xl font-bold tracking-tight ios-clock-text">{time}</h1>
      )}
      {settings.showDate && (
        <p className="text-lg text-muted-foreground mt-2">{date}</p>
      )}
    </div>
  );
};

export default Clock;
