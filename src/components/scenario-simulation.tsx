"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SurveyStats } from "@/lib/survey-data";

interface ScenarioSimulationProps {
  stats: SurveyStats;
}

interface Scenario {
  id: string;
  title: string;
  icon: string;
  getMessage: (stats: SurveyStats) => { status: "safe" | "warning" | "danger" | "critical"; message: string };
}

const scenarios: Scenario[] = [
  {
    id: "blackout",
    title: "Awaria zasilania (48h)",
    icon: "⚡",
    getMessage: (stats) => {
      const avg = (stats.averages.communication + stats.averages.resources) / 2;
      if (avg >= 4) return { status: "safe", message: "Mieszkańcy poradzą sobie samodzielnie" };
      if (avg >= 3) return { status: "warning", message: "Możliwe drobne napięcia społeczne" };
      if (avg >= 2) return { status: "danger", message: "Spodziewane kolejki i konflikty" };
      return { status: "critical", message: "Chaos i paraliż decyzyjny" };
    },
  },
  {
    id: "cyberattack",
    title: "Cyberatak na infrastrukturę",
    icon: "🔒",
    getMessage: (stats) => {
      const avg = stats.averages.communication;
      if (avg >= 4) return { status: "safe", message: "Alternatywne kanały komunikacji sprawne" };
      if (avg >= 3) return { status: "warning", message: "Spowolniona wymiana informacji" };
      if (avg >= 2) return { status: "danger", message: "Dezinformacja i panika" };
      return { status: "critical", message: "Całkowity paraliż informacyjny" };
    },
  },
  {
    id: "evacuation",
    title: "Nagła ewakuacja",
    icon: "🚨",
    getMessage: (stats) => {
      const avg = stats.averages.knowledge;
      if (avg >= 4) return { status: "safe", message: "Sprawna, zorganizowana ewakuacja" };
      if (avg >= 3) return { status: "warning", message: "Możliwe opóźnienia i zamieszanie" };
      if (avg >= 2) return { status: "danger", message: "Chaos, ludzie nie znają procedur" };
      return { status: "critical", message: "Ryzyko ofiar przez dezorientację" };
    },
  },
  {
    id: "supplies",
    title: "Brak dostaw (72h+)",
    icon: "📦",
    getMessage: (stats) => {
      const avg = (stats.averages.resources + stats.averages.socialCapital) / 2;
      if (avg >= 4) return { status: "safe", message: "Wspólnota dzieli się zasobami" };
      if (avg >= 3) return { status: "warning", message: "Napięcia przy dystrybucji" };
      if (avg >= 2) return { status: "danger", message: "Rywalizacja o zasoby" };
      return { status: "critical", message: "Oblężenie sklepów i urzędu" };
    },
  },
  {
    id: "casualties",
    title: "Poszkodowani (masowy incydent)",
    icon: "🏥",
    getMessage: (stats) => {
      const avg = (stats.averages.competencies + stats.averages.socialCapital) / 2;
      if (avg >= 4) return { status: "safe", message: "Skuteczna pierwsza pomoc sąsiedzka" };
      if (avg >= 3) return { status: "warning", message: "Ograniczona pomoc przedmedyczna" };
      if (avg >= 2) return { status: "danger", message: "Brak pomocy do przyjazdu służb" };
      return { status: "critical", message: "Zwiększona liczba ofiar" };
    },
  },
];

const statusConfig = {
  safe: {
    bg: "bg-teal-900/50",
    border: "border-teal-600/50",
    badge: "bg-teal-600 text-white",
    badgeLabel: "BEZPIECZNY",
    glow: "shadow-teal-500/20",
  },
  warning: {
    bg: "bg-cyan-900/50",
    border: "border-cyan-600/50",
    badge: "bg-cyan-600 text-white",
    badgeLabel: "UMIARKOWANY",
    glow: "shadow-cyan-500/20",
  },
  danger: {
    bg: "bg-slate-600/50",
    border: "border-slate-500/50",
    badge: "bg-slate-500 text-white",
    badgeLabel: "WYMAGAJĄCY",
    glow: "shadow-slate-500/20",
  },
  critical: {
    bg: "bg-slate-700/50",
    border: "border-slate-500/50",
    badge: "bg-slate-600 text-white",
    badgeLabel: "PRIORYTETOWY",
    glow: "shadow-slate-500/20",
  },
};

export function ScenarioSimulation({ stats }: ScenarioSimulationProps) {
  if (stats.totalResponses === 0) {
    return (
      <Card className="border-slate-600 bg-slate-700/50">
        <CardHeader>
          <CardTitle className="text-xl text-teal-400 flex items-center gap-2">
            <span className="text-2xl">🎭</span>
            Symulacja Scenariuszy
          </CardTitle>
          <CardDescription className="text-slate-300">
            Prognoza reakcji mieszkańców na różne typy kryzysów
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-center justify-center text-slate-400">
            <div className="text-center">
              <div className="text-5xl mb-4">🔒</div>
              <p>Wypełnij ankietę, aby odblokować symulacje</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-600 bg-slate-700/50">
      <CardHeader>
        <CardTitle className="text-xl text-teal-400 flex items-center gap-2">
          <span className="text-2xl">🎭</span>
          Symulacja Scenariuszy
        </CardTitle>
        <CardDescription className="text-slate-300">
          Prognoza reakcji mieszkańców na różne typy kryzysów
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scenarios.map((scenario) => {
            const result = scenario.getMessage(stats);
            const config = statusConfig[result.status];
            
            return (
              <div
                key={scenario.id}
                className={`p-4 rounded-xl border-2 ${config.bg} ${config.border} shadow-lg ${config.glow} transition-all hover:scale-[1.02]`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">{scenario.icon}</span>
                  <Badge className={config.badge}>
                    {config.badgeLabel}
                  </Badge>
                </div>
                <h3 className="font-semibold text-slate-200 mb-2">
                  {scenario.title}
                </h3>
                <p className="text-sm text-slate-400">
                  {result.message}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
