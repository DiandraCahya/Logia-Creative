"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Image as ImageIcon, X, Check, Search } from "lucide-react";
import type { MediaItem } from "@/lib/cms/types";

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (path: string, alt?: string) => void;
  currentValue?: string;
  title?: string;
}

export function MediaPickerModal({
  isOpen,
  onClose,
  onSelect,
  currentValue,
  title = "Pilih Foto dari Media Library",
}: MediaPickerModalProps) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedPath, setSelectedPath] = useState(currentValue || "");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    setSelectedPath(currentValue || "");
    fetchMedia();
  }, [isOpen, currentValue]);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/media");
      const json = await res.json();
      const list = Array.isArray(json.data) ? json.data : Array.isArray(json.media) ? json.media : [];
      setItems(list);
    } catch {
      // Ignore error
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !mounted) return null;

  const filtered = items.filter(
    (item) =>
      item.alt.toLowerCase().includes(search.toLowerCase()) ||
      item.path.toLowerCase().includes(search.toLowerCase())
  );

  const handleConfirm = () => {
    const chosen = items.find((i) => i.path === selectedPath);
    onSelect(selectedPath, chosen?.alt);
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div
        className="w-full max-w-3xl max-h-[85vh] bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            <h3 className="font-semibold text-base text-neutral-900 dark:text-neutral-100">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Tutup pemilih media"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari foto berdasarkan nama atau deskripsi..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 text-neutral-900 dark:text-white"
            />
          </div>
        </div>

        {/* Media Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="py-16 text-center text-sm text-neutral-500">Memuat berkas media...</div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-sm text-neutral-500">
              Tidak ada foto yang ditemukan. Unggah foto terlebih dahulu di halaman Media.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filtered.map((item) => {
                const isSelected = selectedPath === item.path;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedPath(item.path)}
                    onDoubleClick={() => {
                      onSelect(item.path, item.alt);
                      onClose();
                    }}
                    className={`group relative aspect-square rounded-xl overflow-hidden border text-left transition-all ${
                      isSelected
                        ? "border-black dark:border-white ring-2 ring-black dark:ring-white scale-[0.98]"
                        : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600"
                    }`}
                  >
                    <Image
                      src={item.path}
                      alt={item.alt}
                      fill
                      sizes="(max-width: 640px) 160px, 200px"
                      className="object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent text-[11px] text-white truncate">
                      {item.alt}
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center shadow-md">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
          <div className="text-xs text-neutral-500 truncate max-w-md">
            {selectedPath ? `Terpilih: ${selectedPath}` : "Belum ada foto yang dipilih"}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              disabled={!selectedPath}
              onClick={handleConfirm}
              className="px-5 py-2 text-sm font-semibold rounded-xl bg-black dark:bg-white text-white dark:text-black disabled:opacity-40 hover:opacity-90 transition-opacity"
            >
              Gunakan Foto Ini
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
