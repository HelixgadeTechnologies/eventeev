import { NextRequest, NextResponse } from "next/server";

// Initialize mock speakers array if it doesn't exist
if (typeof globalThis !== 'undefined' && !(globalThis as any).mockSpeakers) {
  (globalThis as any).mockSpeakers = [
    {
      id: "sp-1",
      eventId: "6a55d72b4ff0c7f2856c7708",
      firstName: "Jane",
      lastName: "Doe",
      title: "CTO",
      company: "Tech Corp",
      bio: "An experienced tech leader.",
      topic: "Future of AI",
      twitter: "@janedoe",
    }
  ];
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ eventId: string }> }) {
  try {
    const { eventId } = await params;
    const store = (typeof globalThis !== 'undefined' ? (globalThis as any).mockSpeakers : []);
    const eventSpeakers = store.filter((s: any) => s.eventId === eventId);
    
    return NextResponse.json(eventSpeakers);
  } catch (error) {
    console.error("Speaker Fetch Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
