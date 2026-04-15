"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface MunicipalitySelectorProps {
  onSelect: (municipality: string) => void;
}

const EXAMPLE_MUNICIPALITIES = [
  "Warszawa",
  "Kraków", 
  "Wrocław",
  "Poznań",
  "Gdańsk",
  "Łódź",
  "Katowice",
  "Lublin",
  "Białystok",
  "Szczecin",
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
    <div className="min-h-screen bg-gradient-to-b from-slate-800 via-slate-700 to-slate-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg border-slate-600 bg-slate-700/80">
        <CardHeader className="text-center">
          <div className="text-5xl mb-4">🏛️</div>
          <CardTitle className="text-2xl text-teal-400">
            Panel Monitorowania Odporności Gminy
          </CardTitle>
          <CardDescription className="text-slate-300 text-base">
            Wybierz gminę, dla której chcesz wypełnić ankietę lub zobaczyć wyniki
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!showCustomInput ? (
            <>
              <div>
                <Label className="text-slate-200 mb-3 block">Popularne gminy:</Label>
                <div className="grid grid-cols-2 gap-2">
                  {EXAMPLE_MUNICIPALITIES.map((name) => (
                    <Button
                      key={name}
                      variant="outline"
                      onClick={() => handleSelect(name)}
                      className="justify-start text-left bg-slate-600 border-slate-500 text-white hover:bg-teal-600 hover:border-teal-500"
                    >
                      {name}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-600" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-slate-700 px-2 text-slate-400">lub</span>
                </div>
              </div>

              <Button
                onClick={() => setShowCustomInput(true)}
                className="w-full bg-teal-600 hover:bg-teal-500 text-white"
              >
                ✏️ Wpisz nazwę innej gminy
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="municipality" className="text-slate-200">
                  Nazwa gminy:
                </Label>
                <input
                  id="municipality"
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="np. Nowa Wieś, Gmina Przykład..."
                  className="w-full mt-2 px-4 py-3 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
                  className="flex-1 bg-slate-600 hover:bg-slate-500 text-white"
                >
                  ← Wróć
                </Button>
                <Button
                  onClick={() => handleSelect(customName)}
                  disabled={!customName.trim()}
                  className="flex-1 bg-teal-600 hover:bg-teal-500 text-white disabled:bg-slate-500"
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
