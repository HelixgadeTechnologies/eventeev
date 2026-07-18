import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ eventId: string }> }) {
  try {
    const { eventId } = await params;
    const store = (typeof globalThis !== 'undefined' ? (globalThis as any).mockSpeakers : []) || [];
    const eventSpeakers = store.filter((s: any) => s.eventId === eventId);
    
    const uniqueTopics = new Set(
      eventSpeakers
        .map((s: any) => s.topic)
        .filter((t: any) => t && t.trim() !== '')
    ).size;

    const totalSessions = eventSpeakers.reduce((acc: number, s: any) => acc + (s.sessions?.length || 0), 0);

    return NextResponse.json({
      totalSpeakers: eventSpeakers.length,
      totalTopics: uniqueTopics,
      totalSessions
    });
  } catch (error) {
    console.error("Speaker Stats Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
