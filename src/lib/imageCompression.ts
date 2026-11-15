/**
 * Adaptive client-side image compression targeting 300-500 KB
 * Preserves code and text legibility with WebP conversion
 */
export async function compressImage(file: File): Promise<{ file: File; originalSize: number; compressedSize: number; previewUrl: string }> {
  const originalSize = file.size;

  // Don't compress if already small (< 300KB) or if it's a PDF
  if (file.size <= 300 * 1024 || file.type === 'application/pdf') {
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

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Cap extreme resolution (e.g. 4K screenshots) while preserving text sharpness
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

        // Quality 0.85 ensures crisp code screenshot readability
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return resolve({
                file,
                originalSize,
                compressedSize: originalSize,
                previewUrl: URL.createObjectURL(file),
              });
            }

            const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.webp'), {
              type: 'image/webp',
              lastModified: Date.now(),
            });

            resolve({
              file: compressedFile,
              originalSize,
              compressedSize: blob.size,
              previewUrl: URL.createObjectURL(blob),
            });
          },
          'image/webp',
          0.85
        );
      };
    };
  });
}

