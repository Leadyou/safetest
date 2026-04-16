"use client";

export interface SurveyResponse {
  id: string;
  created_at: string;
  municipality: string;
  communication: number;
  resources: number;
  knowledge: number;
  social_capital: number;
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

export async function fetchSurveyResponses(municipality: string): Promise<SurveyResponse[]> {
  try {
    const response = await fetch(`/api/survey?municipality=${encodeURIComponent(municipality)}`, {
      method: 'GET',
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch responses');
    }
    
    const data = await response.json();
    return data.responses || [];
  } catch (error) {
    console.error('Error fetching responses:', error);
    return [];
  }
}

export async function saveSurveyResponse(response: {
  municipality: string;
  communication: number;
  resources: number;
  knowledge: number;
  socialCapital: number;
  competencies: number;
}): Promise<boolean> {
  try {
    const res = await fetch('/api/survey', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(response),
    });
    
    if (!res.ok) {
      throw new Error('Failed to save response');
    }
    
    return true;
  } catch (error) {
    console.error('Error saving response:', error);
    return false;
  }
}

export function calculateStats(responses: SurveyResponse[]): SurveyStats {
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
      socialCapital: acc.socialCapital + r.social_capital,
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

export interface UserSurveyScores {
  communication: number;
  resources: number;
  knowledge: number;
  socialCapital: number;
  competencies: number;
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

/** Dane do wykresu porównawczego: Twoja ocena vs średnia gminy (wszystkie ankiety, łącznie z Twoją). */
export function getComparisonRadarData(
  user: UserSurveyScores,
  stats: SurveyStats
): { dimension: string; twojaOcena: number; sredniaGminy: number }[] {
  return [
    { dimension: "Komunikacja", twojaOcena: user.communication, sredniaGminy: stats.averages.communication },
    { dimension: "Zasoby", twojaOcena: user.resources, sredniaGminy: stats.averages.resources },
    { dimension: "Wiedza", twojaOcena: user.knowledge, sredniaGminy: stats.averages.knowledge },
    { dimension: "Kapitał społeczny", twojaOcena: user.socialCapital, sredniaGminy: stats.averages.socialCapital },
    { dimension: "Kompetencje", twojaOcena: user.competencies, sredniaGminy: stats.averages.competencies },
  ];
}

export function generateForecast(stats: SurveyStats): string[] {
  const forecasts: string[] = [];
  const { averages } = stats;

  if (stats.totalResponses === 0) {
    return ["📊 Brak danych - wypełnij pierwszą ankietę, aby wygenerować prognozę."];
  }

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
    forecasts.push("📊 Wyniki w normie. Monitoruj sytuację i kontynuuj edukację mieszkańców.");
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
