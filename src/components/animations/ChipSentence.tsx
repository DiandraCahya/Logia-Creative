"use client";
import { useState } from "react";

const OPTIONS = [
  "Website Company Profile",
  "Branding & Logo",
  "Toko Online",
  "UI/UX Design",
  "Konten Sosial Media",
  "Otomasi Workflow",
];

export default function ChipSentence({ onOpenCollaboration }: { onOpenCollaboration?: () => void }) {
  const [picked, setPicked] = useState<string | null>(null);

  return (
    <div className="text-center max-w-3xl mx-auto">
      <p className="text-2xl md:text-4xl font-bold text-slate-900 dark:text-white leading-snug">
        Saya butuh bantuan untuk{" "}
        <span className="inline-block align-middle">
          {picked ? (
            <span className="grad-cta px-4 py-1 rounded-full text-white text-xl md:text-3xl">
              {picked}
            </span>
          ) : (
            <span className="text-slate-400 dark:text-slate-500">...</span>
          )}
        </span>
      </p>
      <div className="flex flex-wrap justify-center gap-3 mt-8">
        {OPTIONS.map((opt) => (
          <button
            key={opt}
            onClick={() => setPicked(opt)}
            className={`px-5 py-2.5 rounded-full border text-sm font-medium transition-all duration-300 active:scale-95 ${
              picked === opt
                ? "grad-cta text-white border-transparent"
                : "border-slate-300 dark:border-white/15 text-slate-700 dark:text-slate-300 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      {picked && (
        <div className="mt-8">
          <button
            onClick={onOpenCollaboration}
            className="inline-block grad-cta px-8 py-4 rounded-full text-white font-semibold hover:-translate-y-0.5 transition-transform"
          >
            Diskusikan {picked} →
          </button>
        </div>
      )}
    </div>
  );
}
