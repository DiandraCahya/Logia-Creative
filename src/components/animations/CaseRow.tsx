"use client";
import { useRef, useState } from "react";

interface CaseRowProps {
  index: string;
  title: string;
  category: string;
  description: string;
  image: string;
  onClick?: () => void;
}

export default function CaseRow({ index, title, category, description, image, onClick }: CaseRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [preview, setPreview] = useState({ x: 0, y: 0, show: false });

  const onMove = (e: React.MouseEvent) => {
    const rect = rowRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPreview({ x: e.clientX - rect.left, y: e.clientY - rect.top, show: true });
  };

  return (
    <div
      ref={rowRef}
      onMouseMove={onMove}
      onMouseLeave={() => setPreview((p) => ({ ...p, show: false }))}
      onClick={onClick}
      className="case-row group relative border-t border-slate-200 dark:border-white/10 py-8 md:py-10 cursor-pointer"
    >
      {/* Preview gambar mengikuti cursor (desktop only) */}
      <div
        className="case-preview pointer-events-none absolute z-20 hidden md:block"
        style={{
          left: preview.x,
          top: preview.y,
          opacity: preview.show ? 1 : 0,
          transform: `translate(-50%, -50%) scale(${preview.show ? 1 : 0.85}) rotate(${preview.show ? 0 : -4}deg)`,
        }}
      >
        <img src={image} alt="" className="w-64 h-40 object-cover rounded-xl shadow-2xl" />
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-8 px-2">
        <span className="text-sm font-mono text-slate-400 dark:text-slate-500">({index})</span>
        <h3 className="text-2xl md:text-4xl font-bold text-slate-900 dark:text-white transition-transform duration-500 group-hover:translate-x-3">
          {title}
        </h3>
        <span className="text-sm uppercase tracking-wider text-blue-600 dark:text-blue-400 md:ml-auto">
          {category}
        </span>
        <span className="text-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 text-slate-900 dark:text-white">
          →
        </span>
      </div>
      <p className="mt-3 md:mt-2 px-2 md:pl-14 text-slate-600 dark:text-slate-400 max-w-2xl text-sm md:text-base">
        {description}
      </p>
    </div>
  );
}
