"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import type { CollabDraft } from "@/lib/receipt";

const CollaborationModal = dynamic(
  () => import("@/components/CollaborationModal").then((mod) => mod.CollaborationModal),
  { ssr: false, loading: () => null }
);
const ChatWidget = dynamic(
  () => import("@/components/ChatWidget").then((mod) => mod.ChatWidget),
  { ssr: false, loading: () => null }
);

export { openCollaborationModal } from "@/lib/collaboration-events";

export function CollaborationManager() {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState<CollabDraft | null>(null);
  const [loadChat, setLoadChat] = useState(false);

  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent<CollabDraft | null>;
      setDraft(customEvent.detail || null);
      setIsOpen(true);
    };

    const handleClose = () => setIsOpen(false);

    window.addEventListener("open-collaboration", handleOpen);
    window.addEventListener("close-collaboration", handleClose);

    return () => {
      window.removeEventListener("open-collaboration", handleOpen);
      window.removeEventListener("close-collaboration", handleClose);
    };
  }, []);

  // Sync open/close state to document dataset and window event for navbar
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isOpen) {
      document.documentElement.dataset.collabOpen = "true";
      window.dispatchEvent(
        new CustomEvent("collab-modal-state", { detail: { isOpen: true } })
      );
    } else {
      delete document.documentElement.dataset.collabOpen;
      window.dispatchEvent(
        new CustomEvent("collab-modal-state", { detail: { isOpen: false } })
      );
    }
  }, [isOpen]);

  useEffect(() => {
    if (typeof document !== "undefined" && document.documentElement.classList.contains("is-audit")) {
      return;
    }

    if ("requestIdleCallback" in window) {
      const id = (window as any).requestIdleCallback(
        () => setLoadChat(true),
        { timeout: 2500 }
      );
      return () => {
        (window as any).cancelIdleCallback(id);
      };
    } else {
      const t = setTimeout(() => setLoadChat(true), 1500);
      return () => {
        clearTimeout(t);
      };
    }
  }, []);

  return (
    <>
      {isOpen && (
        <CollaborationModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          initialDraft={draft}
          onDraftConsumed={() => setDraft(null)}
        />
      )}
      {loadChat && (
        <ChatWidget
          onAutofill={(d) => {
            setDraft(d);
            setIsOpen(true);
          }}
        />
      )}
    </>
  );
}
