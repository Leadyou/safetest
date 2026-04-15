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
    setView("dashboard");
  };

  if (!mounted) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-100 via-white to-slate-100 flex items-center justify-center">
        <div className="text-teal-600 animate-pulse">Ładowanie...</div>
      </main>
    );
  }

  if (!municipality) {
    return <MunicipalitySelector onSelect={handleMunicipalitySelect} />;
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-100 via-white to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-teal-600 animate-pulse text-xl mb-2">Ładowanie danych...</div>
          <div className="text-slate-500 text-sm">
            Pobieranie odpowiedzi dla gminy: <span className="text-teal-600 capitalize">{municipality}</span>
          </div>
        </div>
      </main>
    );
  }

  const displayMunicipality = municipality.charAt(0).toUpperCase() + municipality.slice(1);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-100 via-white to-slate-100">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col items-center gap-4">
            {/* Rząd 1: Logo, tytuł i Udostępnij */}
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-4xl">🛡️</span>
                <h1 className="text-2xl font-bold text-slate-800">
                  Panel Monitorowania Odporności Gminy
                </h1>
              </div>
              <ShareButton municipality={municipality} />
            </div>

            {/* Rząd 2: Gmina i przyciski akcji */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {/* Nazwa gminy z liczbą odpowiedzi */}
              <div className="bg-blue-500 px-6 py-3 rounded-xl">
                <span className="text-white text-lg font-bold">
                  {displayMunicipality} ({stats?.totalResponses || 0} odp.)
                </span>
              </div>
              
              <Button
                onClick={handleChangeMunicipality}
                className="bg-blue-500 hover:bg-blue-400 text-white px-6 py-3 text-base rounded-xl"
              >
                Zmień gminę
              </Button>
              
              <Button
                onClick={() => setView("survey")}
                className={`px-6 py-3 text-base rounded-xl transition-all ${
                  view === "survey" 
                    ? "bg-blue-600 hover:bg-blue-500 text-white" 
                    : "bg-blue-500 hover:bg-blue-400 text-white"
                }`}
              >
                Ankieta
              </Button>
              
              <Button
                onClick={() => setView("dashboard")}
                className={`px-6 py-3 text-base rounded-xl transition-all ${
                  view === "dashboard" 
                    ? "bg-blue-600 hover:bg-blue-500 text-white" 
                    : "bg-blue-500 hover:bg-blue-400 text-white"
                }`}
              >
                Dashboard
              </Button>
              
              <Button
                onClick={refreshStats}
                className="bg-blue-500 hover:bg-blue-400 text-white px-6 py-3 text-base rounded-xl"
              >
                Odśwież
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <p className="font-semibold">⚠️ Błąd połączenia z bazą danych</p>
            <p className="text-sm mt-1">{error}</p>
            <p className="text-sm mt-2 text-red-500">
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

      <footer className="border-t border-slate-200 mt-16 bg-white">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-slate-500">
            <p>
              Panel Monitorowania Odporności Gminy v2.1
            </p>
            <p className="mt-1">
              Narzędzie wspierające zarządzanie kryzysowe • Dane anonimowe
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
      <main className="min-h-screen bg-gradient-to-b from-slate-100 via-white to-slate-100 flex items-center justify-center">
        <div className="text-teal-600 animate-pulse">Ładowanie...</div>
      </main>
    }>
      <HomeContent />
    </Suspense>
  );
}
