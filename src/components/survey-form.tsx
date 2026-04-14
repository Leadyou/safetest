"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { saveSurveyResponse } from "@/lib/survey-data";

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
  onSubmit: () => void;
}

export function SurveyForm({ onSubmit }: SurveyFormProps) {
  const [values, setValues] = useState(defaultValues);
  const [submitted, setSubmitted] = useState(false);

  const handleValueChange = (questionId: keyof typeof defaultValues, value: number) => {
    setValues((prev) => ({ ...prev, [questionId]: value }));
  };

  const isComplete = Object.values(values).every((v) => v > 0);

  const handleSubmit = () => {
    if (!isComplete) return;
    
    saveSurveyResponse({
      communication: values.communication,
      resources: values.resources,
      knowledge: values.knowledge,
      socialCapital: values.socialCapital,
      competencies: values.competencies,
    });
    
    setSubmitted(true);
    onSubmit();
  };

  if (submitted) {
    return (
      <Card className="border-green-500/30 bg-green-950/20">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="text-5xl">✓</div>
            <h3 className="text-xl font-semibold text-green-400">Dziękujemy za wypełnienie ankiety!</h3>
            <p className="text-slate-400">Twoja odpowiedź została zapisana i zaktualizowała statystyki gminy.</p>
            <Button 
              variant="outline" 
              onClick={() => {
                setValues(defaultValues);
                setSubmitted(false);
              }}
              className="mt-4"
            >
              Wypełnij ponownie
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-700 bg-slate-900/50">
      <CardHeader>
        <CardTitle className="text-xl text-amber-400 flex items-center gap-2">
          <span className="text-2xl">📋</span>
          Anonimowa ankieta urzędnika
        </CardTitle>
        <CardDescription className="text-slate-400">
          Oceń przygotowanie mieszkańców gminy na sytuacje kryzysowe (skala 1-5)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {questions.map((question) => (
          <div key={question.id} className="space-y-3">
            <div>
              <Label className="text-base font-semibold text-slate-200">
                {question.title}
              </Label>
              <p className="text-sm text-slate-400 mt-1">{question.description}</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {scaleLabels.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => handleValueChange(question.id, value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    values[question.id] === value
                      ? value <= 2
                        ? "bg-red-600 text-white ring-2 ring-red-400"
                        : value === 3
                        ? "bg-yellow-600 text-white ring-2 ring-yellow-400"
                        : "bg-green-600 text-white ring-2 ring-green-400"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  <span className="font-bold">{value}</span>
                  <span className="hidden sm:inline ml-1">- {label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
        
        <div className="pt-4 border-t border-slate-700">
          <Button 
            onClick={handleSubmit} 
            disabled={!isComplete}
            className={`w-full py-6 text-lg font-semibold ${
              isComplete 
                ? "bg-amber-600 hover:bg-amber-500 text-white" 
                : "bg-slate-700 text-slate-400"
            }`}
          >
            {isComplete ? "Wyślij odpowiedź" : "Odpowiedz na wszystkie pytania"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
