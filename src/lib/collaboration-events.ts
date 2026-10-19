import type { CollabDraft } from "@/lib/receipt";

export function openCollaborationModal(draft?: CollabDraft | null) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("open-collaboration", { detail: draft || null })
    );
  }
}
