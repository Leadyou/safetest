"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const shareOptions = [
  {
    id: "whatsapp",
    name: "WhatsApp",
    icon: "💬",
    color: "bg-green-600 hover:bg-green-500",
    getUrl: (url: string, text: string) =>
      `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
  },
  {
    id: "messenger",
    name: "Messenger",
    icon: "💭",
    color: "bg-blue-600 hover:bg-blue-500",
    getUrl: (url: string) =>
      `https://www.facebook.com/dialog/send?link=${encodeURIComponent(url)}&app_id=291494419107518&redirect_uri=${encodeURIComponent(url)}`,
  },
  {
    id: "telegram",
    name: "Telegram",
    icon: "✈️",
    color: "bg-sky-500 hover:bg-sky-400",
    getUrl: (url: string, text: string) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
  },
  {
    id: "email",
    name: "Email",
    icon: "📧",
    color: "bg-slate-600 hover:bg-slate-500",
    getUrl: (url: string, text: string) =>
      `mailto:?subject=${encodeURIComponent("Ankieta: Odporność Społeczna Gminy")}&body=${encodeURIComponent(text + "\n\n" + url)}`,
  },
  {
    id: "sms",
    name: "SMS",
    icon: "📱",
    color: "bg-orange-600 hover:bg-orange-500",
    getUrl: (url: string, text: string) =>
      `sms:?body=${encodeURIComponent(text + " " + url)}`,
  },
];

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

  const handleShare = (option: typeof shareOptions[0]) => {
    const url = option.getUrl(shareUrl, shareText);
    window.open(url, "_blank", "noopener,noreferrer");
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

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Panel Monitorowania Odporności Społecznej Gminy",
          text: shareText,
          url: shareUrl,
        });
        setIsOpen(false);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Share failed:", err);
        }
      }
    }
  };

  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-cyan-500 hover:bg-cyan-400 text-white px-5 py-2 text-base rounded-xl"
      >
        📤 Udostępnij
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

            {typeof navigator !== "undefined" && "share" in navigator && (
              <button
                onClick={handleNativeShare}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-white font-medium transition-colors"
              >
                <span className="text-lg">📲</span>
                <span>Udostępnij...</span>
              </button>
            )}

            <div className="grid grid-cols-2 gap-2">
              {shareOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleShare(option)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-white text-sm font-medium transition-colors ${option.color}`}
                >
                  <span>{option.icon}</span>
                  <span>{option.name}</span>
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-200">
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium transition-colors"
              >
                {copied ? (
                  <>
                    <span>✓</span>
                    <span>Skopiowano!</span>
                  </>
                ) : (
                  <>
                    <span>🔗</span>
                    <span>Kopiuj link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
