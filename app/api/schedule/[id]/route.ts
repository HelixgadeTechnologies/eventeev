import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await req.json();

    const schedules = (global as any).mockSchedules || [];
    const index = schedules.findIndex((s: any) => s.id === id || s._id === id);

    if (index === -1) {
      return NextResponse.json({ error: "Schedule not found" }, { status: 404 });
    }

    // Keep the id, update other fields
    schedules[index] = { ...schedules[index], ...data, id };

    return NextResponse.json(schedules[index]);
  } catch (error) {
    console.error("Schedule Update Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const schedules = (global as any).mockSchedules || [];
    const index = schedules.findIndex((s: any) => s.id === id || s._id === id);

    if (index === -1) {
      return NextResponse.json({ error: "Schedule not found" }, { status: 404 });
    }

    schedules.splice(index, 1);

    return NextResponse.json({ message: "Schedule item deleted successfully" });
  } catch (error) {
    console.error("Schedule Delete Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
