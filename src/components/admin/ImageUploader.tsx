'use client';

import React, { useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2, ImageIcon, CheckCircle2 } from 'lucide-react';
import { apiService } from '@/services/api';
import { toast } from 'sonner';

interface ImageUploaderProps {
  /** Current image URL (for preview when editing) */
  currentUrl?: string;
  /** Called when upload succeeds — passes the stored path to save in DB */
  onUpload: (path: string, url: string) => void;
  /** Called when the image is removed */
  onRemove?: () => void;
  /** Storage subfolder — e.g. "destinations", "services", "packages" */
  folder?: string;
  /** Label shown above the drop zone */
  label?: string;
  /** Whether the field is required */
  required?: boolean;
}

export default function ImageUploader({
  currentUrl,
  onUpload,
  onRemove,
  folder = 'uploads',
  label = 'Cover Image',
  required = false,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(currentUrl || '');
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    // Validate client-side first
    const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowed.includes(file.type)) {
      toast.error('Only image files are allowed (jpeg, png, gif, webp, svg)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be under 5 MB');
      return;
    }

    // Show local preview instantly
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
    setUploading(true);

    try {
      const res = await apiService.admin.media.upload(file, folder);
      if (res.success && res.data) {
        onUpload(res.data.path, res.data.url);
        // Replace local blob with CDN URL
        setPreviewUrl(res.data.url);
        toast.success('Image uploaded successfully');
      }
    } catch {
      // Error handled by httpClient interceptor
      setPreviewUrl(currentUrl || '');
    } finally {
      setUploading(false);
      URL.revokeObjectURL(localUrl);
    }
  }, [folder, onUpload, currentUrl]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset input so the same file can be re-selected
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    setPreviewUrl('');
    onRemove?.();
  };

  return (
    <div className="space-y-2">
      {/* Label */}
      <label className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
        <ImageIcon className="size-3.5 text-cyan" />
        {label}
        {required && <span className="text-rose-400">*</span>}
      </label>

      {/* Drop Zone / Preview */}
      {previewUrl ? (
        /* ── Preview State ─────────────────────────────────────────── */
        <div className="relative group w-full h-48 rounded-xl overflow-hidden border border-white/10">
          <Image
            src={previewUrl}
            alt="Cover image preview"
            fill
            className="object-cover"
            unoptimized={previewUrl.startsWith('blob:')}
          />

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan text-navy text-xs font-bold hover:bg-cyan/90 transition-colors disabled:opacity-50"
            >
              {uploading ? <Loader2 className="size-3.5 animate-spin" /> : <Upload className="size-3.5" />}
              {uploading ? 'Uploading…' : 'Change'}
            </button>
            <button
              type="button"
              onClick={handleRemove}
              disabled={uploading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-bold hover:bg-rose-500 hover:text-white transition-all disabled:opacity-50"
            >
              <X className="size-3.5" />
              Remove
            </button>
          </div>

          {/* Upload spinner overlay */}
          {uploading && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="size-8 text-cyan animate-spin" />
                <span className="text-xs text-white font-medium">Uploading…</span>
              </div>
            </div>
          )}

          {/* Success badge */}
          {!uploading && (
            <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/80 backdrop-blur-sm text-white text-[10px] font-bold">
              <CheckCircle2 className="size-3" /> Uploaded
            </div>
          )}
        </div>
      ) : (
        /* ── Drop Zone State ─────────────────────────────────────────── */
        <div
          onClick={() => !uploading && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`relative w-full h-36 rounded-xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
            isDragging
              ? 'border-cyan bg-cyan/10 scale-[1.01]'
              : 'border-white/10 bg-white/5 hover:border-cyan/40 hover:bg-white/[0.07]'
          } ${uploading ? 'pointer-events-none opacity-60' : ''}`}
        >
          {uploading ? (
            <>
              <Loader2 className="size-8 text-cyan animate-spin" />
              <p className="text-xs text-slate-400 font-medium">Uploading image…</p>
            </>
          ) : (
            <>
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${isDragging ? 'bg-cyan/20' : 'bg-white/10'}`}>
                <Upload className={`size-5 ${isDragging ? 'text-cyan' : 'text-slate-400'}`} />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-white">
                  {isDragging ? 'Drop to upload' : 'Click or drag & drop'}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  PNG, JPG, WEBP, GIF, SVG — max 5 MB
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/jpg,image/gif,image/webp,image/svg+xml"
        onChange={handleInputChange}
        className="sr-only"
        aria-label={label}
      />
    </div>
  );
}
