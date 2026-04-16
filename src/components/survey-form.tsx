"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { saveSurveyResponse, fetchSurveyResponses, calculateStats, SurveyStats } from "@/lib/survey-data";
import { SurveyComparisonChart } from "@/components/survey-comparison-chart";

type SubmitStatus = "idle" | "submitting" | "success" | "error";

interface Question {
  id: keyof typeof defaultValues;
  title: string;
  description: string;
}

const questions: Question[] = [
  {
    id: "communication",
    title: "1. Komunikacja kryzysowa",
    description: "Czy mieszkańcy wiedzą, gdzie szukać oficjalnych informacji bez internetu i prądu?",
  },
  {
    id: "resources",
    title: "2. Zasoby i zapasy",
    description: "Jaki procent mieszkańców posiada zapasy żywności, wody i leków na minimum 72 godziny?",
  },
  {
    id: "knowledge",
    title: "3. Wiedza o procedurach",
    description: "Czy mieszkańcy znają lokalizację schronów, sygnały alarmowe i procedury ewakuacji?",
  },
  {
    id: "socialCapital",
    title: "4. Kapitał społeczny",
    description: "Czy sąsiedzi będą ze sobą współpracować w sytuacji kryzysowej, czy raczej rywalizować o zasoby?",
  },
  {
    id: "competencies",
    title: "5. Kompetencje ratownicze",
    description: "Jaki jest poziom znajomości pierwszej pomocy i umiejętności przetrwania wśród mieszkańców?",
  },
];

const scaleLabels = [
  { value: 1, label: "Całkowity brak" },
  { value: 2, label: "Bardzo niski" },
  { value: 3, label: "Przeciętny" },
  { value: 4, label: "Dobry" },
  { value: 5, label: "Pełna gotowość" },
];

const defaultValues = {
  communication: 0,
  resources: 0,
  knowledge: 0,
  socialCapital: 0,
  competencies: 0,
};

interface SurveyFormProps {
  municipality: string;
  onSaved: () => void | Promise<void>;
  onGoToDashboard: () => void;
}

export function SurveyForm({ municipality, onSaved, onGoToDashboard }: SurveyFormProps) {
  const [values, setValues] = useState(defaultValues);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [comparisonStats, setComparisonStats] = useState<SurveyStats | null>(null);
  const [savedSnapshot, setSavedSnapshot] = useState<typeof defaultValues | null>(null);

  const handleValueChange = (questionId: keyof typeof defaultValues, value: number) => {
    setValues((prev) => ({ ...prev, [questionId]: value }));
  };

  const isComplete = Object.values(values).every((v) => v > 0);

  const handleSubmit = async () => {
    if (!isComplete || status === "submitting") return;

    setStatus("submitting");

    const success = await saveSurveyResponse({
      municipality,
      communication: values.communication,
      resources: values.resources,
      knowledge: values.knowledge,
      socialCapital: values.socialCapital,
      competencies: values.competencies,
    });

    if (success) {
      const responses = await fetchSurveyResponses(municipality);
      const stats = calculateStats(responses);
      setComparisonStats(stats);
      setSavedSnapshot({ ...values });
      await onSaved();
      setStatus("success");
    } else {
      setStatus("error");
    }
  };

  const handleGoToDashboard = () => {
    setValues(defaultValues);
    setComparisonStats(null);
    setSavedSnapshot(null);
    setStatus("idle");
    onGoToDashboard();
  };

  const handleFillAnother = () => {
    setValues(defaultValues);
    setComparisonStats(null);
    setSavedSnapshot(null);
    setStatus("idle");
  };

  if (status === "success" && comparisonStats && savedSnapshot) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <Card className="border-teal-200 bg-teal-50">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <div className="text-5xl">✓</div>
              <h3 className="text-xl font-semibold text-teal-600">Dziękujemy za wypełnienie ankiety!</h3>
              <p className="text-slate-600 text-sm">
                Poniżej porównanie Twojej oceny ze średnią w gminie (wszystkie zapisane ankiety, łącznie z Twoją).
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-teal-600">Twoja ocena wobec średniej gminy</CardTitle>
            <CardDescription className="text-slate-600">
              Wykres radarowy: niebieski — Twoja ocena, turkusowy — średnia z ankiet dla tej gminy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SurveyComparisonChart
              userScores={{
                communication: savedSnapshot.communication,
                resources: savedSnapshot.resources,
                knowledge: savedSnapshot.knowledge,
                socialCapital: savedSnapshot.socialCapital,
                competencies: savedSnapshot.competencies,
              }}
              stats={comparisonStats}
            />
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={handleGoToDashboard}
            className="bg-blue-500 hover:bg-blue-400 text-white px-8 py-3 text-base rounded-xl"
          >
            Przejdź do Dashboardu
          </Button>
          <Button
            variant="outline"
            onClick={handleFillAnother}
            className="border-slate-300 text-slate-700 px-8 py-3 text-base rounded-xl"
          >
            Wypełnij kolejną ankietę
          </Button>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="text-5xl">✗</div>
            <h3 className="text-xl font-semibold text-red-600">Błąd zapisu!</h3>
            <p className="text-slate-600">Nie udało się zapisać odpowiedzi. Sprawdź połączenie i spróbuj ponownie.</p>
            <Button
              onClick={() => setStatus("idle")}
              className="mt-4 bg-slate-500 hover:bg-slate-400 text-white"
            >
              Spróbuj ponownie
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200 bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl text-teal-600 flex items-center gap-2">
          <span className="text-2xl">📋</span>
          Anonimowa ankieta urzędnika
        </CardTitle>
        <CardDescription className="text-slate-600">
          Oceń przygotowanie mieszkańców gminy na sytuacje kryzysowe (skala 1-5)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {questions.map((question) => (
          <div key={question.id} className="space-y-3">
            <div>
              <Label className="text-base font-semibold text-slate-800">
                {question.title}
              </Label>
              <p className="text-sm text-slate-600 mt-1">{question.description}</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {scaleLabels.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => handleValueChange(question.id, value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    values[question.id] === value
                      ? value <= 2
                        ? "bg-orange-500 text-white ring-2 ring-orange-300"
                        : value === 3
                        ? "bg-cyan-500 text-white ring-2 ring-cyan-300"
                        : "bg-teal-500 text-white ring-2 ring-teal-300"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300"
                  }`}
                >
                  <span className="font-bold">{value}</span>
                  <span className="hidden sm:inline ml-1">- {label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="pt-4 border-t border-slate-200">
          <Button
            onClick={handleSubmit}
            disabled={!isComplete || status === "submitting"}
            className={`w-full py-6 text-lg font-semibold rounded-xl ${
              isComplete && status !== "submitting"
                ? "bg-teal-500 hover:bg-teal-400 text-white"
                : "bg-slate-200 text-slate-400"
            }`}
          >
            {status === "submitting"
              ? "Zapisywanie..."
              : isComplete
                ? "✓ Wyślij odpowiedź"
                : "Odpowiedz na wszystkie pytania"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
