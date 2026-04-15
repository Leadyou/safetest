"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { SurveyStats, getRadarData, getRiskLevel, generateForecast } from "@/lib/survey-data";

interface ResilienceDashboardProps {
  stats: SurveyStats;
}

export function ResilienceDashboard({ stats }: ResilienceDashboardProps) {
  const radarData = getRadarData(stats);
  const riskLevel = getRiskLevel(stats.panicRisk);
  const forecasts = generateForecast(stats);

  const getRiskGradient = () => {
    if (stats.panicRisk < 25) return "from-teal-600 to-teal-700";
    if (stats.panicRisk < 50) return "from-cyan-600 to-cyan-700";
    if (stats.panicRisk < 75) return "from-slate-500 to-slate-600";
    return "from-slate-600 to-slate-700";
  };

  const getResilienceGradient = () => {
    if (stats.resilienceScore >= 75) return "from-teal-600 to-teal-700";
    if (stats.resilienceScore >= 50) return "from-cyan-600 to-cyan-700";
    if (stats.resilienceScore >= 25) return "from-slate-500 to-slate-600";
    return "from-slate-600 to-slate-700";
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className={`border-0 bg-gradient-to-br ${getRiskGradient()}`}>
          <CardHeader className="pb-2">
            <CardDescription className="text-white/80 font-medium">
              Wskaźnik Ryzyka Paniki
            </CardDescription>
            <CardTitle className="text-4xl font-bold text-white">
              {stats.panicRisk.toFixed(1)}%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress 
              value={stats.panicRisk} 
              className="h-3 bg-white/20"
            />
            <p className={`mt-2 font-semibold ${riskLevel.color}`}>
              Poziom: {riskLevel.label}
            </p>
          </CardContent>
        </Card>

        <Card className={`border-0 bg-gradient-to-br ${getResilienceGradient()}`}>
          <CardHeader className="pb-2">
            <CardDescription className="text-white/80 font-medium">
              Wskaźnik Odporności
            </CardDescription>
            <CardTitle className="text-4xl font-bold text-white">
              {stats.resilienceScore.toFixed(1)}%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress 
              value={stats.resilienceScore} 
              className="h-3 bg-white/20"
            />
            <p className="mt-2 text-white/90">
              Odpowiedzi: <span className="font-bold">{stats.totalResponses}</span>
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-600 bg-slate-700/50">
        <CardHeader>
          <CardTitle className="text-xl text-teal-400 flex items-center gap-2">
            <span className="text-2xl">📊</span>
            Profil Odporności Gminy
          </CardTitle>
          <CardDescription className="text-slate-300">
            Wykres radarowy 5 wymiarów gotowości kryzysowej (im większy obszar, tym lepsza odporność)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stats.totalResponses === 0 ? (
            <div className="h-80 flex items-center justify-center text-slate-500">
              <div className="text-center">
                <div className="text-5xl mb-4">📭</div>
                <p>Brak danych - wypełnij pierwszą ankietę</p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <RadarChart data={radarData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                <PolarGrid stroke="#475569" />
                <PolarAngleAxis 
                  dataKey="dimension" 
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 5]} 
                  tick={{ fill: "#64748b", fontSize: 10 }}
                  tickCount={6}
                />
                <Radar
                  name="Odporność"
                  dataKey="value"
                  stroke="#14b8a6"
                  fill="#14b8a6"
                  fillOpacity={0.4}
                  strokeWidth={2}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#334155",
                    border: "1px solid #475569",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#14b8a6" }}
                  itemStyle={{ color: "#e2e8f0" }}
                  formatter={(value) => [typeof value === "number" ? value.toFixed(2) : value, "Średnia"]}
                />
              </RadarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card className="border-slate-600 bg-slate-700/50">
        <CardHeader>
          <CardTitle className="text-xl text-teal-400 flex items-center gap-2">
            <span className="text-2xl">🔮</span>
            Dynamiczna Prognoza Zachowań
          </CardTitle>
          <CardDescription className="text-slate-300">
            Przewidywane scenariusze oparte na aktualnych danych
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {forecasts.map((forecast, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  forecast.includes("KRYTYCZNE")
                    ? "bg-slate-600/50 border-slate-500 text-slate-200"
                    : forecast.includes("RYZYKO")
                    ? "bg-cyan-900/30 border-cyan-700/50 text-cyan-200"
                    : forecast.includes("ZASÓB") || forecast.includes("SIŁA")
                    ? "bg-teal-900/30 border-teal-700/50 text-teal-200"
                    : "bg-slate-600/30 border-slate-500 text-slate-300"
                }`}
              >
                {forecast}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
