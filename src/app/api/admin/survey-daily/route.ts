import { NextRequest, NextResponse } from "next/server";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

function verifyAdmin(request: NextRequest): boolean {
  const secret = process.env.SURVEY_ADMIN_STATS_SECRET;
  if (!secret || secret.length < 8) return false;

  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) {
    return auth.slice(7) === secret;
  }

  const key = new URL(request.url).searchParams.get("key");
  return key === secret;
}

function dayKeyWarsaw(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-CA", { timeZone: "Europe/Warsaw" });
}

export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: "Supabase nie jest skonfigurowany." }, { status: 503 });
  }

  const serverSecret = process.env.SURVEY_ADMIN_STATS_SECRET;
  if (!serverSecret || serverSecret.length < 8) {
    return NextResponse.json(
      { error: "Na serwerze brak zmiennej SURVEY_ADMIN_STATS_SECRET (min. 8 znaków)." },
      { status: 503 }
    );
  }

  if (!verifyAdmin(request)) {
    return NextResponse.json(
      { error: "Nieprawidłowy klucz. Użyj nagłówka Authorization: Bearer lub parametru ?key=" },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const municipality = searchParams.get("municipality")?.toLowerCase() ?? null;

  try {
    const supabase = getSupabase()!;
    const since = new Date();
    since.setFullYear(since.getFullYear() - 2);

    let query = supabase
      .from("survey_responses")
      .select("created_at, municipality")
      .gte("created_at", since.toISOString())
      .order("created_at", { ascending: true });

    if (municipality) {
      query = query.eq("municipality", municipality);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const rows = data || [];
    const byDay: Record<string, number> = {};
    for (const row of rows) {
      const key = dayKeyWarsaw(row.created_at);
      byDay[key] = (byDay[key] || 0) + 1;
    }

    const days = Object.entries(byDay)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

    return NextResponse.json({
      total: rows.length,
      municipality: municipality,
      days,
    });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ error: "Nie udało się pobrać statystyk." }, { status: 500 });
  }
}
