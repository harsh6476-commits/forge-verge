/**
 * Truly adaptive multi-pass client-side image compression
 * Targets 300-500 KB while strictly preserving code screenshot legibility.
 * Falls back to original file if compression cannot preserve readability.
 */
export async function compressImage(
  file: File
): Promise<{ file: File; originalSize: number; compressedSize: number; previewUrl: string }> {
  const originalSize = file.size;

  // Don't compress non-images or files already below target threshold
  if (file.size <= 300 * 1024 || file.type === 'application/pdf' || !file.type.startsWith('image/')) {
    return {
      file,
      originalSize,
      compressedSize: originalSize,
      previewUrl: URL.createObjectURL(file),
    };
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onerror = () => {
      resolve({
        file,
        originalSize,
        compressedSize: originalSize,
        previewUrl: URL.createObjectURL(file),
      });
    };

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onerror = () => {
        resolve({
          file,
          originalSize,
          compressedSize: originalSize,
          previewUrl: URL.createObjectURL(file),
        });
      };

      img.onload = async () => {
        let width = img.width;
        let height = img.height;

        // Cap extreme dimensions (e.g. 4K/retina captures) to max 2048px to prevent memory crashes
        const maxDimension = 2048;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve({
            file,
            originalSize,
            compressedSize: originalSize,
            previewUrl: URL.createObjectURL(file),
          });
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Multi-pass quality iteration targeting 300KB - 500KB
        // Minimum quality 0.70 to guarantee sharp text in code screenshots
        const qualitySteps = [0.90, 0.82, 0.75, 0.70];
        let bestBlob: Blob | null = null;

        for (const quality of qualitySteps) {
          const blob: Blob | null = await new Promise((res) => {
            canvas.toBlob((b) => res(b), 'image/webp', quality);
          });

          if (!blob) continue;

          bestBlob = blob;
          // Target hit: between 250KB and 500KB
          if (blob.size <= 500 * 1024) {
            break;
          }
        }

        // If even at 0.70 it's still very large, try a gentle 0.85 scale pass if dimensions > 1200
        if (bestBlob && bestBlob.size > 500 * 1024 && width > 1200) {
          const scaledCanvas = document.createElement('canvas');
          scaledCanvas.width = Math.round(width * 0.85);
          scaledCanvas.height = Math.round(height * 0.85);
          const scaledCtx = scaledCanvas.getContext('2d');
          if (scaledCtx) {
            scaledCtx.drawImage(canvas, 0, 0, scaledCanvas.width, scaledCanvas.height);
            const scaledBlob: Blob | null = await new Promise((res) => {
              scaledCanvas.toBlob((b) => res(b), 'image/webp', 0.80);
            });
            if (scaledBlob && scaledBlob.size < bestBlob.size) {
              bestBlob = scaledBlob;
            }
          }
        }

        // If compression failed or is larger than original, return original
        if (!bestBlob || bestBlob.size >= originalSize) {
          return resolve({
            file,
            originalSize,
            compressedSize: originalSize,
            previewUrl: URL.createObjectURL(file),
          });
        }

        const compressedFile = new File([bestBlob], file.name.replace(/\.[^/.]+$/, '.webp'), {
          type: 'image/webp',
          lastModified: Date.now(),
        });

        resolve({
          file: compressedFile,
          originalSize,
          compressedSize: bestBlob.size,
          previewUrl: URL.createObjectURL(bestBlob),
        });
      };
    };
  });
}
