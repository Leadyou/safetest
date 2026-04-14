"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SurveyForm } from "@/components/survey-form";
import { ResilienceDashboard } from "@/components/resilience-dashboard";
import { ScenarioSimulation } from "@/components/scenario-simulation";
import { ShareButton } from "@/components/share-button";
import { MunicipalitySelector } from "@/components/municipality-selector";
import { calculateStats, SurveyStats, fetchSurveyResponses } from "@/lib/survey-data";

type View = "survey" | "dashboard";

function HomeContent() {
  const searchParams = useSearchParams();
  const [municipality, setMunicipality] = useState<string | null>(null);
  const [view, setView] = useState<View>("dashboard");
  const [stats, setStats] = useState<SurveyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const urlMunicipality = searchParams.get('gmina');
    const storedMunicipality = localStorage.getItem('selected_municipality');
    
    if (urlMunicipality) {
      const normalized = urlMunicipality.toLowerCase();
      setMunicipality(normalized);
      localStorage.setItem('selected_municipality', normalized);
    } else if (storedMunicipality) {
      setMunicipality(storedMunicipality);
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const refreshStats = useCallback(async () => {
    if (!municipality) return;
    
    try {
      setLoading(true);
      setError(null);
      const responses = await fetchSurveyResponses(municipality);
      const newStats = calculateStats(responses);
      setStats(newStats);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Nie udało się pobrać danych. Sprawdź konfigurację Supabase.');
      setStats({
        totalResponses: 0,
        averages: { communication: 0, resources: 0, knowledge: 0, socialCapital: 0, competencies: 0 },
        overallAverage: 0,
        panicRisk: 100,
        resilienceScore: 0,
      });
    } finally {
      setLoading(false);
    }
  }, [municipality]);

  useEffect(() => {
    if (municipality) {
      refreshStats();
    }
  }, [municipality, refreshStats]);

  const handleMunicipalitySelect = (selected: string) => {
    setMunicipality(selected);
    window.history.replaceState({}, '', `?gmina=${encodeURIComponent(selected)}`);
  };

  const handleChangeMunicipality = () => {
    localStorage.removeItem('selected_municipality');
    setMunicipality(null);
    setStats(null);
    window.history.replaceState({}, '', '/');
  };

  const handleSurveySubmit = () => {
    refreshStats();
  };

  if (!mounted) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-amber-400 animate-pulse">Ładowanie...</div>
      </main>
    );
  }

  if (!municipality) {
    return <MunicipalitySelector onSelect={handleMunicipalitySelect} />;
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-amber-400 animate-pulse text-xl mb-2">Ładowanie danych...</div>
          <div className="text-slate-500 text-sm">
            Pobieranie odpowiedzi dla gminy: <span className="text-amber-400 capitalize">{municipality}</span>
          </div>
        </div>
      </main>
    );
  }

  const displayMunicipality = municipality.charAt(0).toUpperCase() + municipality.slice(1);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🛡️</span>
              <div>
                <h1 className="text-xl font-bold text-slate-100">
                  Panel Monitorowania Odporności
                </h1>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <span>Gmina:</span>
                  <span className="text-amber-400 font-medium">{displayMunicipality}</span>
                  <button
                    onClick={handleChangeMunicipality}
                    className="text-xs text-slate-500 hover:text-slate-300 underline"
                  >
                    (zmień)
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <Badge variant="outline" className="border-amber-600 text-amber-400">
                📊 {stats?.totalResponses || 0} odpowiedzi
              </Badge>
              <ShareButton municipality={municipality} />
              <Button
                variant="ghost"
                size="sm"
                onClick={refreshStats}
                className="text-slate-400 hover:text-white"
              >
                🔄 Odśwież
              </Button>
              <div className="flex gap-2">
                <Button
                  variant={view === "dashboard" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setView("dashboard")}
                  className={view === "dashboard" ? "bg-amber-600 hover:bg-amber-500" : ""}
                >
                  Dashboard
                </Button>
                <Button
                  variant={view === "survey" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setView("survey")}
                  className={view === "survey" ? "bg-amber-600 hover:bg-amber-500" : ""}
                >
                  Ankieta
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-950/50 border border-red-800 rounded-lg text-red-200">
            <p className="font-semibold">⚠️ Błąd połączenia z bazą danych</p>
            <p className="text-sm mt-1">{error}</p>
            <p className="text-sm mt-2 text-slate-400">
              Upewnij się, że zmienne środowiskowe NEXT_PUBLIC_SUPABASE_URL i NEXT_PUBLIC_SUPABASE_ANON_KEY są poprawnie skonfigurowane.
            </p>
          </div>
        )}

        {view === "survey" ? (
          <div className="max-w-2xl mx-auto">
            <SurveyForm municipality={municipality} onSubmit={handleSurveySubmit} />
          </div>
        ) : (
          <div className="space-y-8">
            {stats && (
              <>
                <ResilienceDashboard stats={stats} />
                <ScenarioSimulation stats={stats} />
              </>
            )}
          </div>
        )}
      </div>

      <footer className="border-t border-slate-800 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-slate-500">
            <p>
              Panel Monitorowania Odporności Społecznej Gminy v2.0
            </p>
            <p className="mt-1">
              Narzędzie wspierające zarządzanie kryzysowe • Dane anonimowe, przechowywane w chmurze (Supabase)
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-amber-400 animate-pulse">Ładowanie...</div>
      </main>
    }>
      <HomeContent />
    </Suspense>
  );
}
