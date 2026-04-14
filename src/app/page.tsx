"use client";

import { useState, useEffect, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SurveyForm } from "@/components/survey-form";
import { ResilienceDashboard } from "@/components/resilience-dashboard";
import { ScenarioSimulation } from "@/components/scenario-simulation";
import { calculateStats, SurveyStats, getSurveyResponses } from "@/lib/survey-data";

type View = "survey" | "dashboard";

export default function Home() {
  const [view, setView] = useState<View>("dashboard");
  const [stats, setStats] = useState<SurveyStats | null>(null);
  const [mounted, setMounted] = useState(false);

  const refreshStats = useCallback(() => {
    setStats(calculateStats());
  }, []);

  useEffect(() => {
    setMounted(true);
    refreshStats();
  }, [refreshStats]);

  const handleSurveySubmit = () => {
    refreshStats();
  };

  const clearAllData = () => {
    if (confirm("Czy na pewno chcesz usunąć wszystkie odpowiedzi ankiety?")) {
      localStorage.removeItem("gmina_resilience_survey");
      refreshStats();
    }
  };

  if (!mounted || !stats) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-amber-400 animate-pulse">Ładowanie...</div>
      </main>
    );
  }

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
                <p className="text-sm text-slate-400">
                  System oceny gotowości kryzysowej gminy
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="border-amber-600 text-amber-400">
                📊 {stats.totalResponses} odpowiedzi
              </Badge>
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
        {view === "survey" ? (
          <div className="max-w-2xl mx-auto">
            <SurveyForm onSubmit={handleSurveySubmit} />
          </div>
        ) : (
          <div className="space-y-8">
            <ResilienceDashboard stats={stats} />
            <ScenarioSimulation stats={stats} />
            
            {stats.totalResponses > 0 && (
              <div className="flex justify-center pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllData}
                  className="text-red-400 border-red-800 hover:bg-red-950"
                >
                  🗑️ Wyczyść wszystkie dane (reset)
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      <footer className="border-t border-slate-800 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-slate-500">
            <p>
              Panel Monitorowania Odporności Społecznej Gminy v1.0
            </p>
            <p className="mt-1">
              Narzędzie wspierające zarządzanie kryzysowe • Dane anonimowe, przechowywane lokalnie
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
