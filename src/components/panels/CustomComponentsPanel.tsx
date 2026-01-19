import React, { useState, useRef } from 'react';
import { useSceneStore } from '../../store/sceneStore';
import { removeBackground, fileToDataUrl } from '../../utils/backgroundRemoval';
import type { BackgroundRemovalOptions } from '../../utils/backgroundRemoval';
import { Upload, Plus, Trash2, ImagePlus, Loader2, Settings2 } from 'lucide-react';

interface UploadState {
  file: File | null;
  originalPreview: string | null;
  processedPreview: string | null;
  isProcessing: boolean;
  error: string | null;
  name: string;
}

const CustomComponentsPanel: React.FC = () => {
  const { customAssets, addCustomAsset, removeCustomAsset, addObject } = useSceneStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadState, setUploadState] = useState<UploadState>({
    file: null,
    originalPreview: null,
    processedPreview: null,
    isProcessing: false,
    error: null,
    name: '',
  });

  const [showOptions, setShowOptions] = useState(false);
  const [options, setOptions] = useState<BackgroundRemovalOptions>({
    tolerance: 30,
    mode: 'auto',
    featherEdge: 1,
  });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadState((prev) => ({ ...prev, error: 'Please select an image file' }));
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadState((prev) => ({ ...prev, error: 'Image must be smaller than 10MB' }));
      return;
    }

    try {
      const dataUrl = await fileToDataUrl(file);
      const defaultName = file.name.replace(/\.[^/.]+$/, ''); // Remove extension

      setUploadState({
        file,
        originalPreview: dataUrl,
        processedPreview: null,
        isProcessing: true,
        error: null,
        name: defaultName,
      });

      // Process the image
      const { processed } = await removeBackground(dataUrl, options);

      setUploadState((prev) => ({
        ...prev,
        processedPreview: processed,
        isProcessing: false,
      }));
    } catch (err) {
      setUploadState((prev) => ({
        ...prev,
        error: 'Failed to process image. Please try again.',
        isProcessing: false,
      }));
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleReprocess = async () => {
    if (!uploadState.originalPreview) return;

    setUploadState((prev) => ({ ...prev, isProcessing: true, error: null }));

    try {
      const { processed } = await removeBackground(uploadState.originalPreview, options);
      setUploadState((prev) => ({
        ...prev,
        processedPreview: processed,
        isProcessing: false,
      }));
    } catch (err) {
      setUploadState((prev) => ({
        ...prev,
        error: 'Failed to reprocess image.',
        isProcessing: false,
      }));
    }
  };

  const handleAddAsset = async () => {
    if (!uploadState.originalPreview || !uploadState.processedPreview || !uploadState.name.trim()) {
      return;
    }

    try {
      // Generate thumbnail from processed image
      const { thumbnail } = await removeBackground(uploadState.originalPreview, options);

      addCustomAsset({
        name: uploadState.name.trim(),
        originalImage: uploadState.originalPreview,
        processedImage: uploadState.processedPreview,
        thumbnail,
      });

      // Reset upload state
      setUploadState({
        file: null,
        originalPreview: null,
        processedPreview: null,
        isProcessing: false,
        error: null,
        name: '',
      });
    } catch (err) {
      setUploadState((prev) => ({ ...prev, error: 'Failed to save asset' }));
    }
  };

  const handleCancelUpload = () => {
    setUploadState({
      file: null,
      originalPreview: null,
      processedPreview: null,
      isProcessing: false,
      error: null,
      name: '',
    });
  };

  const handleAddToTank = (assetId: string, assetName: string) => {
    const randomX = Math.random() * 60 + 20; // 20-80%
    const randomY = Math.random() * 40 + 30; // 30-70%

    addObject({
      type: 'custom',
      name: assetName,
      position: { x: randomX, y: randomY },
      rotation: 0,
      scale: 1,
      metadata: { customAssetId: assetId },
    });
  };

  const handleDeleteAsset = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeCustomAsset(id);
  };

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-sm font-semibold mb-3">Custom Components</h3>
      <p className="text-xs text-muted-foreground mb-4">
        Upload images and we'll remove the background automatically.
      </p>

      {/* Upload Area */}
      {!uploadState.originalPreview ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary hover:bg-accent/50 transition-colors"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Click to upload an image
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            PNG, JPG up to 10MB
          </p>
        </div>
      ) : (
        /* Preview & Edit Area */
        <div className="space-y-4">
          {/* Image Preview */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground">Original</span>
              <div className="aspect-square bg-muted rounded-lg overflow-hidden border border-border">
                <img
                  src={uploadState.originalPreview}
                  alt="Original"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground">Processed</span>
              <div
                className="aspect-square rounded-lg overflow-hidden border border-border"
                style={{
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Crect width=\'10\' height=\'10\' fill=\'%23ccc\'/%3E%3Crect x=\'10\' y=\'10\' width=\'10\' height=\'10\' fill=\'%23ccc\'/%3E%3C/svg%3E")',
                  backgroundSize: '20px 20px',
                }}
              >
                {uploadState.isProcessing ? (
                  <div className="w-full h-full flex items-center justify-center bg-muted/50">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : uploadState.processedPreview ? (
                  <img
                    src={uploadState.processedPreview}
                    alt="Processed"
                    className="w-full h-full object-contain"
                  />
                ) : null}
              </div>
            </div>
          </div>

          {/* Error Message */}
          {uploadState.error && (
            <p className="text-xs text-destructive">{uploadState.error}</p>
          )}

          {/* Name Input */}
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Asset Name</label>
            <input
              type="text"
              value={uploadState.name}
              onChange={(e) => setUploadState((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Enter a name..."
              className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Options Toggle */}
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <Settings2 size={14} />
            {showOptions ? 'Hide Options' : 'Adjust Settings'}
          </button>

          {/* Options Panel */}
          {showOptions && (
            <div className="p-3 bg-muted/50 rounded-lg space-y-3">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">
                  Tolerance: {options.tolerance}
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={options.tolerance}
                  onChange={(e) => setOptions({ ...options, tolerance: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Background Type</label>
                <select
                  value={options.mode}
                  onChange={(e) => setOptions({ ...options, mode: e.target.value as BackgroundRemovalOptions['mode'] })}
                  className="w-full px-2 py-1 text-sm border border-border rounded bg-background"
                >
                  <option value="auto">Auto Detect</option>
                  <option value="white">White Background</option>
                  <option value="green">Green Screen</option>
                </select>
              </div>
              <button
                onClick={handleReprocess}
                disabled={uploadState.isProcessing}
                className="w-full px-3 py-1.5 text-xs bg-accent hover:bg-accent/80 rounded transition-colors disabled:opacity-50"
              >
                Reprocess Image
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleCancelUpload}
              className="flex-1 px-3 py-2 text-sm border border-border rounded-md hover:bg-accent transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddAsset}
              disabled={uploadState.isProcessing || !uploadState.processedPreview || !uploadState.name.trim()}
              className="flex-1 px-3 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add to Library
            </button>
          </div>
        </div>
      )}

      {/* Custom Assets Library */}
      {customAssets.length > 0 && (
        <div className="pt-4 border-t border-border">
          <h4 className="text-xs font-medium text-muted-foreground mb-3">
            Your Assets ({customAssets.length})
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {customAssets.map((asset) => (
              <div
                key={asset.id}
                className="group relative aspect-square rounded-lg overflow-hidden border border-border cursor-pointer hover:border-primary transition-colors"
                style={{
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Crect width=\'10\' height=\'10\' fill=\'%23eee\'/%3E%3Crect x=\'10\' y=\'10\' width=\'10\' height=\'10\' fill=\'%23eee\'/%3E%3C/svg%3E")',
                  backgroundSize: '10px 10px',
                }}
                onClick={() => handleAddToTank(asset.id, asset.name)}
              >
                <img
                  src={asset.thumbnail}
                  alt={asset.name}
                  className="w-full h-full object-contain"
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                  <Plus size={20} className="text-white" />
                  <span className="text-xs text-white">Add to Tank</span>
                </div>

                {/* Delete button */}
                <button
                  onClick={(e) => handleDeleteAsset(asset.id, e)}
                  className="absolute top-1 right-1 p-1 bg-destructive/90 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
                >
                  <Trash2 size={12} className="text-white" />
                </button>

                {/* Name label */}
                <div className="absolute bottom-0 left-0 right-0 px-1 py-0.5 bg-black/70 text-white text-xs truncate">
                  {asset.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state for library */}
      {customAssets.length === 0 && !uploadState.originalPreview && (
        <div className="text-center py-4 text-muted-foreground">
          <ImagePlus className="w-10 h-10 mx-auto mb-2 opacity-50" />
          <p className="text-xs">No custom assets yet</p>
          <p className="text-xs">Upload an image to get started</p>
        </div>
      )}
    </div>
  );
};

export default CustomComponentsPanel;
