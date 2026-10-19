"use client";

import React from "react";
import { openCollaborationModal } from "@/lib/collaboration-events";

interface HeroCtaButtonProps {
  onOpenCollaboration?: () => void;
}

export function HeroCtaButton({ onOpenCollaboration }: HeroCtaButtonProps) {
  const handleClick = () => {
    if (onOpenCollaboration) {
      onOpenCollaboration();
    } else {
      openCollaborationModal();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="btn-solid flex-1 sm:flex-none justify-center whitespace-nowrap px-4 sm:px-8 py-3.5 sm:py-4 min-h-[48px] sm:min-h-[52px] bg-black dark:bg-white text-white dark:text-black text-sm font-semibold rounded-full flex items-center gap-2 group transition-transform hover:scale-[1.02] active:scale-[0.98]"
    >
      <span>Mulai Proyek</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4 text-white dark:text-black transition-transform group-hover:translate-x-1"
        aria-hidden="true"
      >
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </svg>
    </button>
  );
}
