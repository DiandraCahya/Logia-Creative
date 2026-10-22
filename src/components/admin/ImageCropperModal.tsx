"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize2,
  Check,
  Loader2,
  Upload,
  Layers,
  Sparkles,
} from "lucide-react";

export type AspectRatioOption = "16:9" | "4:3" | "1:1" | "3:4" | "free";

interface ImageCropperModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl?: string;
  defaultAspect?: AspectRatioOption;
  title?: string;
  onCropComplete: (newUrl: string) => void;
}

export function ImageCropperModal({
  isOpen,
  onClose,
  imageUrl,
  defaultAspect = "16:9",
  title = "Sesuaikan & Potong Foto",
  onCropComplete,
}: ImageCropperModalProps) {
  const [mounted, setMounted] = useState(false);
  const [aspect, setAspect] = useState<AspectRatioOption>(defaultAspect);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0); // 0, 90, 180, 270
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentSrc, setCurrentSrc] = useState<string>(imageUrl || "");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update source when imageUrl changes
  useEffect(() => {
    if (imageUrl) {
      setCurrentSrc(imageUrl);
      setPan({ x: 0, y: 0 });
      setScale(1);
      setRotation(0);
      setErrorMessage("");
    }
  }, [imageUrl]);

  useEffect(() => {
    if (isOpen) {
      setAspect(defaultAspect);
    }
  }, [isOpen, defaultAspect]);

  // Load image object
  const [imageVersion, setImageVersion] = useState(0);

  // Load image object
  useEffect(() => {
    if (!currentSrc || !isOpen) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imgRef.current = img;
      setPan({ x: 0, y: 0 });
      setScale(1);
      setImageVersion((v) => v + 1);
    };
    img.onerror = () => {
      setErrorMessage("Gagal memuat gambar untuk dipotong.");
    };
    img.src = currentSrc;
  }, [currentSrc, isOpen]);

  // Compute aspect ratio decimal
  const getAspectDecimal = useCallback((): number => {
    switch (aspect) {
      case "16:9":
        return 16 / 9;
      case "4:3":
        return 4 / 3;
      case "1:1":
        return 1;
      case "3:4":
        return 3 / 4;
      case "free":
      default:
        if (imgRef.current) {
          return imgRef.current.naturalWidth / imgRef.current.naturalHeight;
        }
        return 16 / 9;
    }
  }, [aspect]);

  // Update live preview thumbnail
  const updatePreview = useCallback(
    (cropW: number, cropH: number) => {
      const previewCanvas = previewCanvasRef.current;
      const img = imgRef.current;
      if (!previewCanvas || !img) return;

      const pWidth = 140;
      const pHeight = Math.round(pWidth / (cropW / cropH));

      previewCanvas.width = pWidth;
      previewCanvas.height = pHeight;

      const pCtx = previewCanvas.getContext("2d");
      if (!pCtx) return;

      pCtx.clearRect(0, 0, pWidth, pHeight);

      // Calculate relative scale from crop box to preview
      const ratio = pWidth / cropW;
      const pCenterX = pWidth / 2 + pan.x * ratio;
      const pCenterY = pHeight / 2 + pan.y * ratio;

      pCtx.save();
      pCtx.translate(pCenterX, pCenterY);
      pCtx.rotate((rotation * Math.PI) / 180);

      const baseScale = Math.max(cropW / img.naturalWidth, cropH / img.naturalHeight);
      const finalScale = baseScale * scale * ratio;
      const drawW = img.naturalWidth * finalScale;
      const drawH = img.naturalHeight * finalScale;

      pCtx.imageSmoothingEnabled = true;
      pCtx.imageSmoothingQuality = "high";
      pCtx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
      pCtx.restore();
    },
    [scale, rotation, pan]
  );

  // Draw main interactive stage
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    const img = imgRef.current;
    if (!canvas || !stage || !img) return;

    const rect = stage.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const stageW = rect.width;
    const stageH = rect.height;

    canvas.width = stageW * dpr;
    canvas.height = stageH * dpr;
    canvas.style.width = `${stageW}px`;
    canvas.style.height = `${stageH}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, stageW, stageH);

    // 1. Calculate crop box dimensions inside stage
    const pad = 24;
    const maxCropW = stageW - pad * 2;
    const maxCropH = stageH - pad * 2;
    const targetAspect = getAspectDecimal();

    let cropW = maxCropW;
    let cropH = cropW / targetAspect;

    if (cropH > maxCropH) {
      cropH = maxCropH;
      cropW = cropH * targetAspect;
    }

    const cropX = (stageW - cropW) / 2;
    const cropY = (stageH - cropH) / 2;

    // 2. Draw dark background
    ctx.fillStyle = "#0c0c0e";
    ctx.fillRect(0, 0, stageW, stageH);

    // 3. Draw blurred/dimmed background of image outside
    ctx.save();
    ctx.filter = "blur(12px) brightness(0.25)";
    const bgScale = Math.max(stageW / img.naturalWidth, stageH / img.naturalHeight);
    const bgW = img.naturalWidth * bgScale;
    const bgH = img.naturalHeight * bgScale;
    ctx.drawImage(img, (stageW - bgW) / 2, (stageH - bgH) / 2, bgW, bgH);
    ctx.restore();

    // 4. Clip to crop box area
    ctx.save();
    ctx.beginPath();
    ctx.rect(cropX, cropY, cropW, cropH);
    ctx.clip();

    // 5. Draw the actual image inside crop box with pan, scale, and rotation
    ctx.save();
    // Center transformation on crop box center + pan
    const centerX = cropX + cropW / 2 + pan.x;
    const centerY = cropY + cropH / 2 + pan.y;

    ctx.translate(centerX, centerY);
    ctx.rotate((rotation * Math.PI) / 180);

    // Base scale so image fills crop box nicely
    const baseScale = Math.max(cropW / img.naturalWidth, cropH / img.naturalHeight);
    const finalScale = baseScale * scale;
    const drawW = img.naturalWidth * finalScale;
    const drawH = img.naturalHeight * finalScale;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();

    // 6. Draw Rule of Thirds grid lines inside crop box
    ctx.strokeStyle = "rgba(255, 255, 255, 0.22)";
    ctx.lineWidth = 1;

    // Vertical third lines
    ctx.beginPath();
    ctx.moveTo(cropX + cropW / 3, cropY);
    ctx.lineTo(cropX + cropW / 3, cropY + cropH);
    ctx.moveTo(cropX + (cropW * 2) / 3, cropY);
    ctx.lineTo(cropX + (cropW * 2) / 3, cropY + cropH);
    // Horizontal third lines
    ctx.moveTo(cropX, cropY + cropH / 3);
    ctx.lineTo(cropX + cropW, cropY + cropH / 3);
    ctx.moveTo(cropX, cropY + (cropH * 2) / 3);
    ctx.lineTo(cropX + cropW, cropY + (cropH * 2) / 3);
    ctx.stroke();

    ctx.restore(); // end clip

    // 7. Draw crop box border & corner handles
    ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
    ctx.lineWidth = 2;
    ctx.strokeRect(cropX, cropY, cropW, cropH);

    // Corner brackets
    const bracketLen = 14;
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#ffffff";
    ctx.beginPath();
    // Top-Left
    ctx.moveTo(cropX, cropY + bracketLen);
    ctx.lineTo(cropX, cropY);
    ctx.lineTo(cropX + bracketLen, cropY);
    // Top-Right
    ctx.moveTo(cropX + cropW - bracketLen, cropY);
    ctx.lineTo(cropX + cropW, cropY);
    ctx.lineTo(cropX + cropW, cropY + bracketLen);
    // Bottom-Left
    ctx.moveTo(cropX, cropY + cropH - bracketLen);
    ctx.lineTo(cropX, cropY + cropH);
    ctx.lineTo(cropX + bracketLen, cropY + cropH);
    // Bottom-Right
    ctx.moveTo(cropX + cropW - bracketLen, cropY + cropH);
    ctx.lineTo(cropX + cropW, cropY + cropH);
    ctx.lineTo(cropX + cropW, cropY + cropH - bracketLen);
    ctx.stroke();

    // 8. Update mini preview canvas
    updatePreview(cropW, cropH);
  }, [scale, rotation, pan, getAspectDecimal, updatePreview]);

  // Redraw when parameters change
  useEffect(() => {
    draw();
  }, [draw]);

  // Resize listener
  useEffect(() => {
    const handleResize = () => draw();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [draw]);

  // Mouse / Touch Drag handlers for panning
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }
  };

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.08 : -0.08;
    setScale((prev) => Math.min(3, Math.max(0.6, prev + delta)));
  };

  // Change image file directly from modal
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type === "image/svg+xml" || file.name.endsWith(".svg")) {
      setErrorMessage("Format SVG tidak didukung.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setCurrentSrc(event.target.result as string);
        setPan({ x: 0, y: 0 });
        setScale(1);
        setRotation(0);
      }
    };
    reader.readAsDataURL(file);
  };

  // Export cropped high-res canvas to WebP and upload
  const handleSaveCrop = async () => {
    const img = imgRef.current;
    const stage = stageRef.current;
    if (!img || !stage) return;

    setIsSaving(true);
    setErrorMessage("");

    try {
      const rect = stage.getBoundingClientRect();
      const stageW = rect.width;
      const stageH = rect.height;
      const targetAspect = getAspectDecimal();

      const pad = 24;
      const maxCropW = stageW - pad * 2;
      const maxCropH = stageH - pad * 2;

      let cropW = maxCropW;
      let cropH = cropW / targetAspect;
      if (cropH > maxCropH) {
        cropH = maxCropH;
        cropW = cropH * targetAspect;
      }

      // Desired output resolution (high quality, max dimension 1600px)
      const targetOutputWidth = Math.min(1600, Math.round(cropW * 2.5));
      const targetOutputHeight = Math.round(targetOutputWidth / targetAspect);

      const exportCanvas = document.createElement("canvas");
      exportCanvas.width = targetOutputWidth;
      exportCanvas.height = targetOutputHeight;

      const eCtx = exportCanvas.getContext("2d");
      if (!eCtx) throw new Error("Gagal membuat canvas ekspor.");

      const exportRatio = targetOutputWidth / cropW;
      const eCenterX = targetOutputWidth / 2 + pan.x * exportRatio;
      const eCenterY = targetOutputHeight / 2 + pan.y * exportRatio;

      eCtx.save();
      eCtx.translate(eCenterX, eCenterY);
      eCtx.rotate((rotation * Math.PI) / 180);

      const baseScale = Math.max(cropW / img.naturalWidth, cropH / img.naturalHeight);
      const finalScale = baseScale * scale * exportRatio;
      const drawW = img.naturalWidth * finalScale;
      const drawH = img.naturalHeight * finalScale;

      eCtx.imageSmoothingEnabled = true;
      eCtx.imageSmoothingQuality = "high";
      eCtx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
      eCtx.restore();

      // Convert to WebP blob
      const blob = await new Promise<Blob | null>((resolve) => {
        exportCanvas.toBlob(resolve, "image/webp", 0.88);
      });

      if (!blob) throw new Error("Gagal mengompres gambar hasil crop.");

      // Upload via POST /api/admin/media
      const filename = `crop-${aspect.replace(":", "x")}-${Date.now()}.webp`;
      const formData = new FormData();
      formData.append("file", blob, filename);
      formData.append("alt", `Hasil crop ${aspect} untuk tampilan website`);
      formData.append("slug", `crop-${aspect.replace(":", "x")}`);
      formData.append("width", String(targetOutputWidth));
      formData.append("height", String(targetOutputHeight));

      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal mengunggah foto yang sudah dipotong.");
      }

      const newPath = json.item?.path || json.path;
      if (!newPath) throw new Error("Path gambar tidak ditemukan dalam respons.");

      onCropComplete(newPath);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || "Terjadi kesalahan saat memproses crop.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cropper-title"
      className="fixed inset-0 z-[105] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-up overscroll-contain"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl border border-white/15 bg-neutral-900 text-white shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/10 shrink-0">
          <div>
            <h2 id="cropper-title" className="text-base sm:text-lg font-bold flex items-center gap-2">
              <Maximize2 className="w-5 h-5 text-neutral-300" />
              <span>{title}</span>
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Geser dan perbesar untuk membingkai area yang ingin ditampilkan di website.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-white/10 text-neutral-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Tutup pemotong foto"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Aspect Ratio Toolbar */}
        <div className="px-5 sm:px-6 py-2.5 bg-neutral-950/70 border-b border-white/5 flex flex-wrap items-center gap-2 shrink-0">
          <span className="text-xs font-semibold text-neutral-400 flex items-center gap-1.5 mr-1">
            <Layers className="w-3.5 h-3.5" /> Rasio Ukuran:
          </span>
          {[
            { id: "16:9", label: "16:9 (Portofolio / Modal)", note: "Rekomendasi" },
            { id: "4:3", label: "4:3 (Kartu Galeri)" },
            { id: "1:1", label: "1:1 (Persegi / Testimoni)" },
            { id: "3:4", label: "3:4 (Potret / Poster)" },
            { id: "free", label: "Ukuran Asli (Bebas)" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setAspect(item.id as AspectRatioOption);
                setPan({ x: 0, y: 0 });
                setScale(1);
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer flex items-center gap-1.5 border ${
                aspect === item.id
                  ? "bg-white text-black border-white shadow-sm font-semibold"
                  : "bg-white/5 text-neutral-300 hover:bg-white/10 border-white/10 hover:text-white"
              }`}
            >
              <span>{item.label}</span>
              {item.note && aspect !== item.id && (
                <span className="text-[10px] opacity-60">★</span>
              )}
            </button>
          ))}
        </div>

        {/* Interactive Canvas Stage */}
        <div className="relative flex-1 min-h-[300px] sm:min-h-[420px] bg-[#08080a] p-4 flex items-center justify-center overflow-hidden">
          <div
            ref={stageRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onWheel={handleWheel}
            className="relative w-full h-full max-h-[440px] rounded-2xl overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing select-none touch-none"
          >
            <canvas ref={canvasRef} className="block w-full h-full" />

            {/* Instruction Badge */}
            <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[11px] text-neutral-300 flex items-center gap-1.5">
              <span>💡 Geser untuk memindahkan • Putar scroll mouse untuk zoom</span>
            </div>
          </div>

          {/* Mini Live Preview Box */}
          <div className="hidden sm:block absolute top-6 right-6 p-2 rounded-2xl bg-neutral-900/90 backdrop-blur-md border border-white/15 shadow-xl text-center pointer-events-none z-20">
            <div className="text-[10px] font-bold text-neutral-400 mb-1.5 uppercase tracking-wider">
              Pratinjau Hasil
            </div>
            <div className="w-[140px] rounded-xl overflow-hidden border border-white/10 bg-black flex items-center justify-center">
              <canvas ref={previewCanvasRef} className="block max-w-full rounded-lg" />
            </div>
          </div>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="px-5 py-2.5 bg-red-950/80 border-t border-red-800 text-red-200 text-xs flex items-center gap-2">
            <span>⚠️ {errorMessage}</span>
          </div>
        )}

        {/* Bottom Control Bar */}
        <div className="px-5 sm:px-6 py-4 bg-neutral-950 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          {/* Zoom & Rotation Controls */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setScale((s) => Math.max(0.6, s - 0.15))}
              className="p-2 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
              aria-label="Perkecil zoom"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 flex-1 sm:w-40">
              <input
                type="range"
                min="0.6"
                max="3"
                step="0.05"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-white"
                aria-label="Slider zoom skala foto"
              />
              <span className="text-[11px] font-mono text-neutral-400 w-10 text-right">
                {Math.round(scale * 100)}%
              </span>
            </div>

            <button
              type="button"
              onClick={() => setScale((s) => Math.min(3, s + 0.15))}
              className="p-2 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
              aria-label="Perbesar zoom"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <div className="h-5 w-px bg-white/10 mx-1 hidden sm:block" />

            <button
              type="button"
              onClick={() => setRotation((r) => (r + 90) % 360)}
              className="px-3 py-2 min-h-[40px] flex items-center gap-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 text-xs font-medium transition-colors cursor-pointer"
              title="Putar 90 Derajat"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Putar</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setPan({ x: 0, y: 0 });
                setScale(1);
                setRotation(0);
              }}
              className="px-3 py-2 min-h-[40px] flex items-center gap-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 text-xs font-medium transition-colors cursor-pointer"
            >
              <span>Pusatkan</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-2 min-h-[40px] flex items-center gap-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 text-xs font-medium transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Ganti Foto</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 min-h-[44px] text-xs font-semibold rounded-xl border border-white/15 text-neutral-300 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSaveCrop}
              disabled={isSaving}
              className="px-5 py-2 min-h-[44px] text-xs font-semibold rounded-xl bg-white text-black hover:bg-neutral-200 active:scale-95 transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memproses Crop...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Terapkan & Simpan Crop</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
