import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ eventId: string }> }) {
  try {
    const { eventId } = await params;
    
    // Fetch schedule items for the event
    const schedules = ((global as any).mockSchedules || []).filter((s: any) => s.event === eventId || s.eventId === eventId);
    
    // Sort by startTime
    schedules.sort((a: any, b: any) => a.startTime.localeCompare(b.startTime));

    return NextResponse.json(schedules);
  } catch (error) {
    console.error("Schedule Fetch Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
