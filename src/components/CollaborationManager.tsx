"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import type { CollabDraft } from "@/lib/receipt";

function retryDynamicImport<T>(
  importer: () => Promise<T>,
  retriesLeft = 2,
  interval = 800
): Promise<T> {
  return new Promise((resolve, reject) => {
    importer()
      .then(resolve)
      .catch((error) => {
        const isChunkError =
          error?.name === "ChunkLoadError" ||
          (error?.message && error.message.includes("Loading chunk"));

        if (retriesLeft > 0) {
          setTimeout(() => {
            retryDynamicImport(importer, retriesLeft - 1, interval).then(resolve, reject);
          }, interval);
          return;
        }

        if (typeof window !== "undefined" && isChunkError) {
          const reloadKey = "collab_chunk_retry_reloaded";
          const hasReloaded = sessionStorage.getItem(reloadKey);
          if (!hasReloaded) {
            sessionStorage.setItem(reloadKey, "true");
            window.location.reload();
            return;
          }
        }
        reject(error);
      });
  });
}

const CollaborationModal = dynamic(
  () =>
    retryDynamicImport(() =>
      import("@/components/CollaborationModal").then((mod) => mod.CollaborationModal)
    ),
  { ssr: false, loading: () => null }
);

const ChatWidget = dynamic(
  () =>
    retryDynamicImport(() =>
      import("@/components/ChatWidget").then((mod) => mod.ChatWidget)
    ),
  { ssr: false, loading: () => null }
);

export { openCollaborationModal } from "@/lib/collaboration-events";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  onReset: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ModalErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("CollaborationModal Error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 z-[10003] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-neutral-900 text-black dark:text-white p-6 rounded-2xl max-w-sm w-full text-center shadow-2xl border border-black/10 dark:border-white/10">
            <h3 className="font-bold text-lg mb-2">Gagal Memuat Formulir</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-5">
              Koneksi atau chunk pembaruan aplikasi terputus. Silakan coba muat ulang halaman.
            </p>
            <div className="flex gap-2 justify-center">
              <button
                type="button"
                onClick={() => {
                  this.setState({ hasError: false });
                  if (typeof window !== "undefined") window.location.reload();
                }}
                className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-full text-xs font-semibold cursor-pointer"
              >
                Muat Ulang Halaman
              </button>
              <button
                type="button"
                onClick={() => {
                  this.setState({ hasError: false });
                  this.props.onReset();
                }}
                className="px-4 py-2 bg-neutral-200 dark:bg-neutral-800 text-black dark:text-white rounded-full text-xs font-semibold cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

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
      document.documentElement.dataset.collabActive = "true";
      document.documentElement.dataset.collabOpen = "true";
      window.dispatchEvent(
        new CustomEvent("collab-modal-state", { detail: { isOpen: true } })
      );
    } else {
      delete document.documentElement.dataset.collabActive;
      if (!document.documentElement.dataset.archiveOpen) {
        delete document.documentElement.dataset.collabOpen;
        window.dispatchEvent(
          new CustomEvent("collab-modal-state", { detail: { isOpen: false } })
        );
      }
    }
  }, [isOpen]);

  // Preload dynamic chunks pada saat idle agar klik langsung responsif dan chunk siap di browser cache
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (typeof document !== "undefined" && document.documentElement.classList.contains("is-audit")) {
      return;
    }

    const preloadModal = () => {
      import("@/components/CollaborationModal").catch(() => {});
    };

    if ("requestIdleCallback" in window) {
      const id = (window as any).requestIdleCallback(preloadModal, { timeout: 3500 });
      return () => (window as any).cancelIdleCallback(id);
    } else {
      const t = setTimeout(preloadModal, 2000);
      return () => clearTimeout(t);
    }
  }, []);

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
        <ModalErrorBoundary onReset={() => setIsOpen(false)}>
          <CollaborationModal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            initialDraft={draft}
            onDraftConsumed={() => setDraft(null)}
          />
        </ModalErrorBoundary>
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
