/**
 * Logia Creative CMS - Client-side Image Processor
 * Uses pure HTML5 Canvas API (no external libraries).
 * Converts jpg, png, webp, avif to optimized WebP (max 1600px, quality 0.8, max 1MB).
 * SVG is strictly banned.
 */

export interface ProcessedImageResult {
  blob: Blob;
  width: number;
  height: number;
  size: number;
  previewUrl: string;
}

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
export const MAX_FILE_SIZE_BYTES = 1024 * 1024; // 1MB
export const MAX_DIMENSION_PX = 1600;

export function isAllowedImageType(file: File): boolean {
  if (file.type === "image/svg+xml" || file.name.toLowerCase().endsWith(".svg")) {
    return false;
  }
  return ALLOWED_IMAGE_TYPES.includes(file.type);
}

export async function processImageForUpload(file: File): Promise<ProcessedImageResult> {
  if (!isAllowedImageType(file)) {
    throw new Error("Format file tidak didukung. Hanya JPG, PNG, WebP, dan AVIF yang diperbolehkan (SVG dilarang).");
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Gagal membaca file gambar."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Gagal memuat gambar ke canvas."));
      img.onload = () => {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        // Calculate proportional scale: max dimension <= 1600px
        if (width > MAX_DIMENSION_PX || height > MAX_DIMENSION_PX) {
          if (width > height) {
            height = Math.round((height * MAX_DIMENSION_PX) / width);
            width = MAX_DIMENSION_PX;
          } else {
            width = Math.round((width * MAX_DIMENSION_PX) / height);
            height = MAX_DIMENSION_PX;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas context 2D tidak tersedia."));
          return;
        }

        // High quality smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP format with quality 0.8
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Gagal mengompres gambar ke format WebP."));
              return;
            }

            if (blob.size > MAX_FILE_SIZE_BYTES) {
              reject(
                new Error(
                  `Ukuran gambar setelah kompres (${Math.round(blob.size / 1024)} KB) melebihi batas 1MB.`
                )
              );
              return;
            }

            const previewUrl = URL.createObjectURL(blob);
            resolve({
              blob,
              width,
              height,
              size: blob.size,
              previewUrl,
            });
          },
          "image/webp",
          0.8
        );
      };

      img.src = reader.result as string;
    };

    reader.readAsDataURL(file);
  });
}
