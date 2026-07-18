import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const newSpeaker = {
      ...data,
      id: `sp-${Date.now()}`
    };

    if (typeof globalThis !== 'undefined') {
      if (!(globalThis as any).mockSpeakers) {
        (globalThis as any).mockSpeakers = [];
      }
      (globalThis as any).mockSpeakers.push(newSpeaker);
    }
    
    return NextResponse.json(newSpeaker, { status: 201 });
  } catch (error) {
    console.error("Speaker Create Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
