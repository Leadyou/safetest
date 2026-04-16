"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { getComparisonRadarData, SurveyStats, UserSurveyScores } from "@/lib/survey-data";

interface SurveyComparisonChartProps {
  userScores: UserSurveyScores;
  stats: SurveyStats;
}

export function SurveyComparisonChart({ userScores, stats }: SurveyComparisonChartProps) {
  const data = getComparisonRadarData(userScores, stats);

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={360}>
        <RadarChart data={data} margin={{ top: 20, right: 36, bottom: 20, left: 36 }}>
          <PolarGrid stroke="#cbd5e1" />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{ fill: "#475569", fontSize: 11 }}
          />
          <PolarRadiusAxis angle={90} domain={[0, 5]} tick={{ fill: "#64748b", fontSize: 10 }} tickCount={6} />
          <Radar
            name="Twoja ocena"
            dataKey="twojaOcena"
            stroke="#2563eb"
            fill="#2563eb"
            fillOpacity={0.35}
            strokeWidth={2}
          />
          <Radar
            name="Średnia gminy"
            dataKey="sredniaGminy"
            stroke="#14b8a6"
            fill="#14b8a6"
            fillOpacity={0.25}
            strokeWidth={2}
          />
          <Legend
            wrapperStyle={{ paddingTop: 16 }}
            formatter={(value) => <span className="text-slate-700 text-sm">{value}</span>}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
            }}
            labelStyle={{ color: "#0d9488" }}
            formatter={(value) => [typeof value === "number" ? value.toFixed(2) : value, ""]}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
