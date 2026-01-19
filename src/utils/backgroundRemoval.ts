/**
 * Background removal utility using HTML5 Canvas
 * Removes white/light backgrounds and optionally green screens
 */

export interface BackgroundRemovalOptions {
  tolerance: number; // 0-255, how much deviation from target color is allowed
  mode: 'white' | 'green' | 'auto'; // What type of background to remove
  featherEdge: number; // Pixel radius for edge smoothing
}

const DEFAULT_OPTIONS: BackgroundRemovalOptions = {
  tolerance: 30,
  mode: 'auto',
  featherEdge: 1,
};

/**
 * Load an image from a data URL or file URL
 */
export const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * Convert a File to a base64 data URL
 */
export const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Detect the dominant corner color (likely background)
 */
const detectBackgroundColor = (imageData: ImageData): { r: number; g: number; b: number } => {
  const { data, width, height } = imageData;
  const sampleSize = 10; // Sample pixels from corners
  const samples: { r: number; g: number; b: number }[] = [];

  // Sample from corners
  const corners = [
    { x: 0, y: 0 },
    { x: width - sampleSize, y: 0 },
    { x: 0, y: height - sampleSize },
    { x: width - sampleSize, y: height - sampleSize },
  ];

  for (const corner of corners) {
    for (let dx = 0; dx < sampleSize; dx++) {
      for (let dy = 0; dy < sampleSize; dy++) {
        const x = corner.x + dx;
        const y = corner.y + dy;
        const idx = (y * width + x) * 4;
        samples.push({
          r: data[idx],
          g: data[idx + 1],
          b: data[idx + 2],
        });
      }
    }
  }

  // Calculate average
  const avg = samples.reduce(
    (acc, s) => ({ r: acc.r + s.r, g: acc.g + s.g, b: acc.b + s.b }),
    { r: 0, g: 0, b: 0 }
  );
  const count = samples.length;

  return {
    r: Math.round(avg.r / count),
    g: Math.round(avg.g / count),
    b: Math.round(avg.b / count),
  };
};

/**
 * Check if a color is similar to a target color within tolerance
 */
const isColorSimilar = (
  r: number,
  g: number,
  b: number,
  target: { r: number; g: number; b: number },
  tolerance: number
): boolean => {
  const dr = Math.abs(r - target.r);
  const dg = Math.abs(g - target.g);
  const db = Math.abs(b - target.b);
  return dr <= tolerance && dg <= tolerance && db <= tolerance;
};

/**
 * Check if a color is "white-ish" (high brightness, low saturation)
 */
const isWhitish = (r: number, g: number, b: number, tolerance: number): boolean => {
  const threshold = 255 - tolerance;
  const minChannel = Math.min(r, g, b);
  const maxChannel = Math.max(r, g, b);
  const saturation = maxChannel > 0 ? (maxChannel - minChannel) / maxChannel : 0;

  return minChannel > threshold || (r > 200 && g > 200 && b > 200 && saturation < 0.15);
};

/**
 * Check if a color is "green screen" green
 */
const isGreenScreen = (r: number, g: number, b: number, tolerance: number): boolean => {
  // Green screen is typically high green, low red and blue
  return g > 100 && g > r + tolerance && g > b + tolerance;
};

/**
 * Remove background from an image
 */
export const removeBackground = async (
  imageDataUrl: string,
  options: Partial<BackgroundRemovalOptions> = {}
): Promise<{ processed: string; thumbnail: string }> => {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const img = await loadImage(imageDataUrl);

  // Create canvas at original size
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;

  // Draw image
  ctx.drawImage(img, 0, 0);

  // Get image data
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const { data } = imageData;

  // Detect background color if auto mode
  let targetColor = { r: 255, g: 255, b: 255 };
  if (opts.mode === 'auto') {
    targetColor = detectBackgroundColor(imageData);
  }

  // Process pixels
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    let shouldRemove = false;

    if (opts.mode === 'white') {
      shouldRemove = isWhitish(r, g, b, opts.tolerance);
    } else if (opts.mode === 'green') {
      shouldRemove = isGreenScreen(r, g, b, opts.tolerance);
    } else {
      // Auto mode - check against detected background color
      shouldRemove = isColorSimilar(r, g, b, targetColor, opts.tolerance);
      // Also check for pure white backgrounds
      if (!shouldRemove) {
        shouldRemove = isWhitish(r, g, b, opts.tolerance * 0.8);
      }
    }

    if (shouldRemove) {
      data[i + 3] = 0; // Set alpha to 0 (transparent)
    }
  }

  // Apply feathering to smooth edges
  if (opts.featherEdge > 0) {
    applyEdgeFeathering(imageData, opts.featherEdge);
  }

  // Put processed image data back
  ctx.putImageData(imageData, 0, 0);

  // Generate processed image
  const processed = canvas.toDataURL('image/png');

  // Generate thumbnail (max 128px)
  const thumbnailSize = 128;
  const scale = Math.min(thumbnailSize / img.width, thumbnailSize / img.height);
  const thumbCanvas = document.createElement('canvas');
  thumbCanvas.width = Math.round(img.width * scale);
  thumbCanvas.height = Math.round(img.height * scale);
  const thumbCtx = thumbCanvas.getContext('2d')!;
  thumbCtx.drawImage(canvas, 0, 0, thumbCanvas.width, thumbCanvas.height);
  const thumbnail = thumbCanvas.toDataURL('image/png');

  return { processed, thumbnail };
};

/**
 * Apply edge feathering to smooth out jagged edges
 */
const applyEdgeFeathering = (imageData: ImageData, radius: number): void => {
  const { data, width, height } = imageData;
  const alphaCopy = new Uint8ClampedArray(width * height);

  // Copy alpha channel
  for (let i = 0; i < width * height; i++) {
    alphaCopy[i] = data[i * 4 + 3];
  }

  // Apply simple box blur to alpha channel at edges
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const alpha = alphaCopy[idx];

      // Only process edge pixels (semi-transparent or at boundary)
      if (alpha > 0 && alpha < 255) {
        let sum = 0;
        let count = 0;

        for (let dy = -radius; dy <= radius; dy++) {
          for (let dx = -radius; dx <= radius; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              sum += alphaCopy[ny * width + nx];
              count++;
            }
          }
        }

        data[idx * 4 + 3] = Math.round(sum / count);
      }
    }
  }
};

/**
 * Create a simple preview of what will be removed
 */
export const previewRemoval = async (
  imageDataUrl: string,
  options: Partial<BackgroundRemovalOptions> = {}
): Promise<string> => {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const img = await loadImage(imageDataUrl);

  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;

  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const { data } = imageData;

  let targetColor = { r: 255, g: 255, b: 255 };
  if (opts.mode === 'auto') {
    targetColor = detectBackgroundColor(imageData);
  }

  // Highlight what will be removed in red
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    let shouldRemove = false;

    if (opts.mode === 'white') {
      shouldRemove = isWhitish(r, g, b, opts.tolerance);
    } else if (opts.mode === 'green') {
      shouldRemove = isGreenScreen(r, g, b, opts.tolerance);
    } else {
      shouldRemove = isColorSimilar(r, g, b, targetColor, opts.tolerance);
      if (!shouldRemove) {
        shouldRemove = isWhitish(r, g, b, opts.tolerance * 0.8);
      }
    }

    if (shouldRemove) {
      // Show as red overlay
      data[i] = 255;
      data[i + 1] = 0;
      data[i + 2] = 0;
      data[i + 3] = 128;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL('image/png');
};
