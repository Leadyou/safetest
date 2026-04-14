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
    bg: "bg-green-950/50",
    border: "border-green-700/50",
    badge: "bg-green-700 text-green-100",
    badgeLabel: "BEZPIECZNY",
    glow: "shadow-green-500/20",
  },
  warning: {
    bg: "bg-yellow-950/50",
    border: "border-yellow-700/50",
    badge: "bg-yellow-700 text-yellow-100",
    badgeLabel: "UMIARKOWANY",
    glow: "shadow-yellow-500/20",
  },
  danger: {
    bg: "bg-orange-950/50",
    border: "border-orange-700/50",
    badge: "bg-orange-700 text-orange-100",
    badgeLabel: "ZAGROŻENIE",
    glow: "shadow-orange-500/20",
  },
  critical: {
    bg: "bg-red-950/50",
    border: "border-red-700/50",
    badge: "bg-red-700 text-red-100",
    badgeLabel: "KRYTYCZNY",
    glow: "shadow-red-500/20",
  },
};

export function ScenarioSimulation({ stats }: ScenarioSimulationProps) {
  if (stats.totalResponses === 0) {
    return (
      <Card className="border-slate-700 bg-slate-900/50">
        <CardHeader>
          <CardTitle className="text-xl text-amber-400 flex items-center gap-2">
            <span className="text-2xl">🎭</span>
            Symulacja Scenariuszy
          </CardTitle>
          <CardDescription className="text-slate-400">
            Prognoza reakcji mieszkańców na różne typy kryzysów
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-center justify-center text-slate-500">
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
    <Card className="border-slate-700 bg-slate-900/50">
      <CardHeader>
        <CardTitle className="text-xl text-amber-400 flex items-center gap-2">
          <span className="text-2xl">🎭</span>
          Symulacja Scenariuszy
        </CardTitle>
        <CardDescription className="text-slate-400">
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
