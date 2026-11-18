import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type Measurement = {
  date: string;
  height_cm: number | null;
  circumference_cm: number | null;
};

function measure(row: Record<string, unknown>): Measurement {
  const numberOrNull = (value: unknown): number | null => {
    if (value === null || value === undefined) return null;
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
  };
  const dateValue = new Date(String(row.date));
  return {
    date: Number.isNaN(dateValue.getTime()) ? "" : dateValue.toISOString().slice(0, 10),
    height_cm: numberOrNull(row.height_cm),
    circumference_cm: numberOrNull(row.circumference_cm),
  };
}

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { available: false, error: "Archivio misurazioni non configurato" },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }
  try {
    const sql = neon(process.env.DATABASE_URL);
    // Stesso archivio usato per il grafico pubblico. Nessuna credenziale nel JSON.
    const rows = await sql`
      SELECT date, height_cm, circumference_cm
      FROM measurements
      ORDER BY date ASC, id ASC
    `;
    const first = rows.length ? measure(rows[0]) : null;
    const latest = rows.length ? measure(rows[rows.length - 1]) : null;
    return NextResponse.json(
      { available: true, count: rows.length, first, latest, retrieved_at: new Date().toISOString() },
      { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=60" } }
    );
  } catch (error) {
    console.error("Vivo measurements API failure", error);
    return NextResponse.json(
      { available: false, error: "Misurazioni temporaneamente non disponibili" },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }
}
