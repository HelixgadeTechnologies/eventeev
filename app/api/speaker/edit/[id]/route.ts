import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await req.json();

    if (typeof globalThis !== 'undefined' && (globalThis as any).mockSpeakers) {
      const store = (globalThis as any).mockSpeakers;
      const index = store.findIndex((s: any) => s.id === id || s._id === id);
      
      if (index !== -1) {
        store[index] = { ...store[index], ...data, id };
        return NextResponse.json(store[index]);
      }
    }
    
    return NextResponse.json({ error: "Speaker not found" }, { status: 404 });
  } catch (error) {
    console.error("Speaker Update Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
