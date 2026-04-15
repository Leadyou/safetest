"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface MunicipalitySelectorProps {
  onSelect: (municipality: string) => void;
}

const EXAMPLE_MUNICIPALITIES = [
  "Opole",
  "Grodków", 
  "Ujazd",
  "Zębowice",
  "Branice",
  "Niemodlin",
  "Turawa",
  "Lewin Brzeski",
];

export function MunicipalitySelector({ onSelect }: MunicipalitySelectorProps) {
  const [customName, setCustomName] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleSelect = (name: string) => {
    if (name.trim()) {
      const normalized = name.trim().toLowerCase();
      localStorage.setItem("selected_municipality", normalized);
      onSelect(normalized);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-white to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg border-slate-200 bg-white shadow-lg">
        <CardHeader className="text-center">
          <div className="text-5xl mb-4">🏛️</div>
          <CardTitle className="text-2xl text-teal-600">
            Panel Monitoringu Społecznego Przygotowania Kryzysowego
          </CardTitle>
          <CardDescription className="text-slate-600 text-base">
            Wybierz gminę, dla której chcesz wypełnić ankietę lub zobaczyć wyniki
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!showCustomInput ? (
            <>
              <div>
                <Label className="text-slate-700 mb-3 block">Popularne gminy:</Label>
                <div className="grid grid-cols-2 gap-2">
                  {EXAMPLE_MUNICIPALITIES.map((name) => (
                    <Button
                      key={name}
                      variant="outline"
                      onClick={() => handleSelect(name)}
                      className="justify-start text-left bg-slate-100 border-slate-300 text-slate-700 hover:bg-teal-500 hover:border-teal-500 hover:text-white"
                    >
                      {name}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-slate-400">lub</span>
                </div>
              </div>

              <Button
                onClick={() => setShowCustomInput(true)}
                className="w-full bg-teal-500 hover:bg-teal-400 text-white"
              >
                ✏️ Wpisz nazwę innej gminy
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="municipality" className="text-slate-700">
                  Nazwa gminy:
                </Label>
                <input
                  id="municipality"
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="np. Nowa Wieś, Gmina Przykład..."
                  className="w-full mt-2 px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && customName.trim()) {
                      handleSelect(customName);
                    }
                  }}
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowCustomInput(false)}
                  className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700"
                >
                  ← Wróć
                </Button>
                <Button
                  onClick={() => handleSelect(customName)}
                  disabled={!customName.trim()}
                  className="flex-1 bg-teal-500 hover:bg-teal-400 text-white disabled:bg-slate-300 disabled:text-slate-500"
                >
                  Wybierz →
                </Button>
              </div>
            </div>
          )}

          <p className="text-xs text-slate-500 text-center">
            Twój wybór zostanie zapamiętany na tym urządzeniu
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
