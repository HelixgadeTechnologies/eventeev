import { NextRequest, NextResponse } from "next/server";

// Mock schedule database in memory
let globalSchedules: any[] = [
  { id: "1", event: "6a55d72b4ff0c7f2856c7708", startTime: "09:00", endTime: "10:00", title: "Registration & Breakfast", type: "Activity", speakers: [] },
  { id: "2", event: "6a55d72b4ff0c7f2856c7708", startTime: "10:00", endTime: "11:00", title: "Keynote Address", type: "Keynote", speakers: [{ name: "John Doe", role: "CEO" }] },
  { id: "3", event: "6a55d72b4ff0c7f2856c7708", startTime: "11:30", endTime: "12:30", title: "Networking Session", type: "Networking", speakers: [] },
];

if (typeof globalThis !== 'undefined' && !(globalThis as any).mockSchedules) {
  (globalThis as any).mockSchedules = globalSchedules;
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    // Assign a mock id
    const newSchedule = {
      ...data,
      id: `s-${Date.now()}`
    };

    const store = (typeof globalThis !== 'undefined' ? (globalThis as any).mockSchedules : globalSchedules);
    store.push(newSchedule);
    
    return NextResponse.json(newSchedule, { status: 201 });
  } catch (error) {
    console.error("Schedule Create Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
