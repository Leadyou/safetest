"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ShareButtonProps {
  municipality?: string;
}

export function ShareButton({ municipality }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const shareUrl = municipality 
    ? `${baseUrl}?gmina=${encodeURIComponent(municipality)}`
    : baseUrl;
  
  const municipalityName = municipality 
    ? municipality.charAt(0).toUpperCase() + municipality.slice(1) 
    : "naszej gminy";
  
  const shareText = `Wypełnij krótką ankietę oceniającą gotowość kryzysową gminy ${municipalityName}:`;

  const handleWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setIsOpen(false);
  };

  const handleEmail = () => {
    const subject = encodeURIComponent("Ankieta: Przygotowanie Kryzysowe Gminy");
    const body = encodeURIComponent(shareText + "\n\n" + shareUrl);
    const mailtoUrl = `mailto:?subject=${subject}&body=${body}`;
    
    const link = document.createElement('a');
    link.href = mailtoUrl;
    link.click();
    
    setIsOpen(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-500 hover:bg-blue-400 text-white px-6 py-3 text-base rounded-xl"
      >
        Udostępnij Znajomemu
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 z-50 w-64 bg-white border border-slate-200 rounded-xl shadow-xl p-3 space-y-2">
            <p className="text-xs text-slate-500 mb-3 px-1">
              Wyślij link do ankiety:
            </p>

            <button
              onClick={handleWhatsApp}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white font-medium transition-colors"
            >
              <span>WhatsApp</span>
            </button>

            <button
              onClick={handleEmail}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-600 hover:bg-slate-500 text-white font-medium transition-colors"
            >
              <span>Email</span>
            </button>

            <div className="pt-2 border-t border-slate-200">
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium transition-colors"
              >
                {copied ? (
                  <span>Skopiowano!</span>
                ) : (
                  <span>Kopiuj link</span>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
