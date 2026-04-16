"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

type DayRow = { date: string; count: number };

export default function AdminAnkietyPage() {
  const [secret, setSecret] = useState("");
  const [municipality, setMunicipality] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState<DayRow[]>([]);
  const [total, setTotal] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (municipality.trim()) params.set("municipality", municipality.trim().toLowerCase());
      const url = `/api/admin/survey-daily?${params.toString()}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${secret}` },
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Błąd");
        setDays([]);
        setTotal(null);
        return;
      }
      setDays(data.days || []);
      setTotal(data.total ?? 0);
    } catch {
      setError("Błąd połączenia");
      setDays([]);
      setTotal(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-800">Ankiety wg dni (admin)</h1>
          <Link href="/" className="text-blue-600 hover:underline text-sm">
            Strona główna
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Dostęp</CardTitle>
            <CardDescription>
              Wpisz ten sam klucz, który ustawisz w Vercel / .env jako{" "}
              <code className="bg-slate-100 px-1 rounded">SURVEY_ADMIN_STATS_SECRET</code>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="secret">Klucz administratora</Label>
              <input
                id="secret"
                type="password"
                autoComplete="off"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg"
                placeholder="Tajny klucz"
              />
            </div>
            <div>
              <Label htmlFor="muni">Opcjonalnie: filtr gminy (np. opole)</Label>
              <input
                id="muni"
                type="text"
                value={municipality}
                onChange={(e) => setMunicipality(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg"
                placeholder="Puste = wszystkie gminy"
              />
            </div>
            <Button onClick={() => void load()} disabled={loading || !secret.trim()}>
              {loading ? "Ładowanie…" : "Pobierz statystyki"}
            </Button>
            {error && <p className="text-red-600 text-sm">{error}</p>}
          </CardContent>
        </Card>

        {total !== null && (
          <Card>
            <CardHeader>
              <CardTitle>Wyniki</CardTitle>
              <CardDescription>
                Liczba ankiet w okresie (ostatnie 2 lata, strefa Europe/Warsaw). Łącznie:{" "}
                <strong>{total}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent>
              {days.length === 0 ? (
                <p className="text-slate-500">Brak danych.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="py-2 pr-4">Dzień</th>
                        <th className="py-2">Nowe ankiety</th>
                      </tr>
                    </thead>
                    <tbody>
                      {days.map((d) => (
                        <tr key={d.date} className="border-b border-slate-100">
                          <td className="py-2 pr-4 font-mono">{d.date}</td>
                          <td className="py-2 font-semibold">{d.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
