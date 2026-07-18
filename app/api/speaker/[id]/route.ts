import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (typeof globalThis !== 'undefined' && (globalThis as any).mockSpeakers) {
      const store = (globalThis as any).mockSpeakers;
      const speaker = store.find((s: any) => s.id === id || s._id === id);
      if (speaker) return NextResponse.json(speaker);
    }
    return NextResponse.json({ error: "Speaker not found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (typeof globalThis !== 'undefined' && (globalThis as any).mockSpeakers) {
      const store = (globalThis as any).mockSpeakers;
      const index = store.findIndex((s: any) => s.id === id || s._id === id);
      
      if (index !== -1) {
        store.splice(index, 1);
        return NextResponse.json({ message: "Speaker deleted successfully" });
      }
    }
    
    return NextResponse.json({ error: "Speaker not found" }, { status: 404 });
  } catch (error) {
    console.error("Speaker Delete Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
