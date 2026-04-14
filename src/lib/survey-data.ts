"use client";

export interface SurveyResponse {
  id: string;
  timestamp: number;
  communication: number;
  resources: number;
  knowledge: number;
  socialCapital: number;
  competencies: number;
}

export interface SurveyStats {
  totalResponses: number;
  averages: {
    communication: number;
    resources: number;
    knowledge: number;
    socialCapital: number;
    competencies: number;
  };
  overallAverage: number;
  panicRisk: number;
  resilienceScore: number;
}

const STORAGE_KEY = "gmina_resilience_survey";

export function getSurveyResponses(): SurveyResponse[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveSurveyResponse(response: Omit<SurveyResponse, "id" | "timestamp">): void {
  const responses = getSurveyResponses();
  const newResponse: SurveyResponse = {
    ...response,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  };
  responses.push(newResponse);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(responses));
}

export function calculateStats(): SurveyStats {
  const responses = getSurveyResponses();
  
  if (responses.length === 0) {
    return {
      totalResponses: 0,
      averages: {
        communication: 0,
        resources: 0,
        knowledge: 0,
        socialCapital: 0,
        competencies: 0,
      },
      overallAverage: 0,
      panicRisk: 100,
      resilienceScore: 0,
    };
  }

  const sum = responses.reduce(
    (acc, r) => ({
      communication: acc.communication + r.communication,
      resources: acc.resources + r.resources,
      knowledge: acc.knowledge + r.knowledge,
      socialCapital: acc.socialCapital + r.socialCapital,
      competencies: acc.competencies + r.competencies,
    }),
    { communication: 0, resources: 0, knowledge: 0, socialCapital: 0, competencies: 0 }
  );

  const count = responses.length;
  const averages = {
    communication: sum.communication / count,
    resources: sum.resources / count,
    knowledge: sum.knowledge / count,
    socialCapital: sum.socialCapital / count,
    competencies: sum.competencies / count,
  };

  const overallAverage = 
    (averages.communication + 
     averages.resources + 
     averages.knowledge + 
     averages.socialCapital + 
     averages.competencies) / 5;

  const resilienceScore = (overallAverage / 5) * 100;
  const panicRisk = 100 - resilienceScore;

  return {
    totalResponses: count,
    averages,
    overallAverage,
    panicRisk,
    resilienceScore,
  };
}

export function getRadarData(stats: SurveyStats) {
  return [
    {
      dimension: "Komunikacja",
      value: stats.averages.communication,
      fullMark: 5,
    },
    {
      dimension: "Zasoby",
      value: stats.averages.resources,
      fullMark: 5,
    },
    {
      dimension: "Wiedza",
      value: stats.averages.knowledge,
      fullMark: 5,
    },
    {
      dimension: "Kapitał społeczny",
      value: stats.averages.socialCapital,
      fullMark: 5,
    },
    {
      dimension: "Kompetencje",
      value: stats.averages.competencies,
      fullMark: 5,
    },
  ];
}

export function generateForecast(stats: SurveyStats): string[] {
  const forecasts: string[] = [];
  const { averages } = stats;

  if (averages.communication < 2) {
    forecasts.push("⚠️ KRYTYCZNE: Przy braku prądu i internetu nastąpi paraliż informacyjny w ciągu pierwszych 6 godzin kryzysu.");
  } else if (averages.communication < 3.5) {
    forecasts.push("⚡ RYZYKO: Część mieszkańców nie będzie wiedziała gdzie szukać informacji - możliwe dezinformacja i panika.");
  }

  if (averages.resources < 2) {
    forecasts.push("🚨 KRYTYCZNE: Spodziewaj się oblężenia urzędu i sklepów w 2. dobie kryzysu. Brak zapasów = eskalacja konfliktu.");
  } else if (averages.resources < 3.5) {
    forecasts.push("⚡ RYZYKO: Ograniczone zapasy mogą prowadzić do napięć społecznych po 48-72 godzinach.");
  }

  if (averages.knowledge < 2) {
    forecasts.push("🚨 KRYTYCZNE: Brak znajomości lokalizacji schronów i sygnałów alarmowych zwiększy liczbę ofiar w pierwszych minutach zagrożenia.");
  } else if (averages.knowledge < 3.5) {
    forecasts.push("⚡ RYZYKO: Niepełna wiedza o procedurach może spowolnić reakcję na alarm.");
  }

  if (averages.socialCapital < 2) {
    forecasts.push("🚨 KRYTYCZNE: Niska spójność społeczna = rywalizacja zamiast współpracy. Ryzyko konfliktów sąsiedzkich.");
  } else if (averages.socialCapital < 3.5) {
    forecasts.push("⚡ RYZYKO: Niektóre grupy mogą izolować się zamiast współpracować.");
  } else if (averages.socialCapital >= 4) {
    forecasts.push("✅ ZASÓB: Silna wspólnota lokalna - podstawa odporności na kryzys.");
  }

  if (averages.competencies < 2) {
    forecasts.push("🚨 KRYTYCZNE: Brak umiejętności pierwszej pomocy zwiększy liczbę ofiar wymagających profesjonalnej pomocy medycznej.");
  } else if (averages.competencies < 3.5) {
    forecasts.push("⚡ RYZYKO: Ograniczone kompetencje medyczne mogą opóźnić pomoc poszkodowanym.");
  }

  if (stats.overallAverage >= 4) {
    forecasts.push("✅ SIŁA: Gmina wykazuje wysoką odporność społeczną. Kontynuuj działania edukacyjne.");
  }

  if (forecasts.length === 0) {
    forecasts.push("📊 Zebrano niewystarczającą ilość danych do wygenerowania prognozy.");
  }

  return forecasts;
}

export function getRiskLevel(panicRisk: number): {
  level: "low" | "medium" | "high" | "critical";
  label: string;
  color: string;
} {
  if (panicRisk < 25) {
    return { level: "low", label: "NISKIE", color: "text-green-500" };
  } else if (panicRisk < 50) {
    return { level: "medium", label: "UMIARKOWANE", color: "text-yellow-500" };
  } else if (panicRisk < 75) {
    return { level: "high", label: "WYSOKIE", color: "text-orange-500" };
  } else {
    return { level: "critical", label: "KRYTYCZNE", color: "text-red-500" };
  }
}
