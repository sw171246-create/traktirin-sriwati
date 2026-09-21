import { NextResponse } from "next/server";
import { getCreators } from "@/lib/creators";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { source, creators } = await getCreators();
    return NextResponse.json({ source, count: creators.length, creators });
  } catch (error) {
    console.error("[api/creators]", error);
    return NextResponse.json({ error: "Data kreator tidak dapat diambil" }, { status: 502 });
  }
}
