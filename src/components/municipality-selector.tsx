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
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg border-slate-700 bg-slate-900/80">
        <CardHeader className="text-center">
          <div className="text-5xl mb-4">🏛️</div>
          <CardTitle className="text-2xl text-amber-400">
            Panel Monitorowania Odporności
          </CardTitle>
          <CardDescription className="text-slate-400 text-base">
            Wybierz gminę, dla której chcesz wypełnić ankietę lub zobaczyć wyniki
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!showCustomInput ? (
            <>
              <div>
                <Label className="text-slate-300 mb-3 block">Popularne gminy:</Label>
                <div className="grid grid-cols-2 gap-2">
                  {EXAMPLE_MUNICIPALITIES.map((name) => (
                    <Button
                      key={name}
                      variant="outline"
                      onClick={() => handleSelect(name)}
                      className="justify-start text-left hover:bg-amber-950 hover:border-amber-600 hover:text-amber-400"
                    >
                      {name}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-slate-900 px-2 text-slate-500">lub</span>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={() => setShowCustomInput(true)}
                className="w-full border-amber-600 text-amber-400 hover:bg-amber-950"
              >
                ✏️ Wpisz nazwę innej gminy
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="municipality" className="text-slate-300">
                  Nazwa gminy:
                </Label>
                <input
                  id="municipality"
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="np. Nowa Wieś, Gmina Przykład..."
                  className="w-full mt-2 px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
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
                  variant="outline"
                  onClick={() => setShowCustomInput(false)}
                  className="flex-1"
                >
                  ← Wróć
                </Button>
                <Button
                  onClick={() => handleSelect(customName)}
                  disabled={!customName.trim()}
                  className="flex-1 bg-amber-600 hover:bg-amber-500 text-white"
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
