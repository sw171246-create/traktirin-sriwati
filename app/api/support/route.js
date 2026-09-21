import { NextResponse } from "next/server";
import { getCreatorBySlug } from "@/lib/creators";
import { addSupport, listSupports } from "@/lib/supportStore";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const slug = request.nextUrl.searchParams.get("slug");
  return NextResponse.json({ supports: listSupports(slug) });
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body harus berupa JSON" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim().slice(0, 40) || "Anonim";
  const message = String(body.message ?? "").trim().slice(0, 200);
  const amount = Number(body.amount);
  const slug = String(body.slug ?? "");

  if (!(await getCreatorBySlug(slug))) {
    return NextResponse.json({ error: "Kreator tidak ditemukan" }, { status: 404 });
  }
  if (!Number.isInteger(amount) || amount < 5000 || amount > 1000000) {
    return NextResponse.json(
      { error: "Nominal harus antara Rp5.000 dan Rp1.000.000" },
      { status: 400 }
    );
  }

  const record = addSupport({ slug, name, message, amount });
  return NextResponse.json({ support: record }, { status: 201 });
}
