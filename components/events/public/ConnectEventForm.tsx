"use client";

import { useState, FormEvent } from "react";
import EmailInput from "@/components/ui/EmailInput";
import Button from "@/components/ui/Button";
import { eventsService } from "@/lib/services/events.service";
import { useRouter } from "next/navigation";

export default function ConnectEventForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({ eventId: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.eventId || !formData.email) {
      setError("Please fill in both fields");
      return;
    }

    setLoading(true);
    const { data, error } = await eventsService.connectToEvent(formData.eventId, formData.email);
    setLoading(false);

    if (error) {
      setError(error.message || "Failed to connect to event");
    } else if (data) {
      if (data.isRegistered) {
        setSuccess(data.message);
        // Assuming attendees have a dashboard, or we just redirect them to the event page
        // The instructions say "if yes take them to the event page"
        // Wait, the attendee page is publicUrl but they should see they are verified. We will send them to publicUrl for now.
        // If there's an attendee portal, it would be /events/[id]/check-in/attendee/[attendeeId] or similar.
        // Let's redirect to publicUrl as requested, or maybe attendeeId URL? 
        setTimeout(() => {
          window.location.href = data.publicUrl;
        }, 1500);
      } else {
        setSuccess(data.message);
        setTimeout(() => {
          window.location.href = data.publicUrl;
        }, 1500);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      <div className="space-y-1">
        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Event ID (Code)</label>
        <input
          type="text"
          name="eventId"
          placeholder="e.g. TECH-A3X9"
          value={formData.eventId}
          onChange={handleChange}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#eb5017]/20 focus:border-[#eb5017] transition-all outline-none"
        />
      </div>
      <EmailInput
        name="email"
        label="Your Email"
        value={formData.email}
        onChange={handleChange}
      />
      {error && <p className="text-red-500 text-xs font-bold">{error}</p>}
      {success && <p className="text-green-600 text-xs font-bold">{success}</p>}
      <Button content="Connect to Event" isLoading={loading} type="submit" />
    </form>
  );
}
