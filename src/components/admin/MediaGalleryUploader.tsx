'use client';

import React, { useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2, Video, Images, Trash2, Plus, Film, CheckCircle2 } from 'lucide-react';
import { apiService } from '@/services/api';
import { API_CONFIG } from '@/services/api/config';
import { toast } from 'sonner';

interface MediaGalleryUploaderProps {
  /** Array of file paths or full URLs currently in the gallery */
  gallery?: string[];
  /** Callback fired whenever the gallery array changes */
  onChange: (gallery: string[]) => void;
  /** Subfolder for storage, e.g. "packages", "services", "destinations" */
  folder?: string;
  /** Label for the uploader section */
  label?: string;
  /** Subtitle / helper hint */
  hint?: string;
}

export function isVideoFile(urlOrPath: string): boolean {
  if (!urlOrPath) return false;
  const clean = urlOrPath.split('?')[0].toLowerCase();
  return (
    clean.endsWith('.mp4') ||
    clean.endsWith('.webm') ||
    clean.endsWith('.ogg') ||
    clean.endsWith('.mov') ||
    clean.endsWith('.mkv') ||
    clean.endsWith('.avi') ||
    clean.endsWith('.3gp') ||
    clean.endsWith('.m4v')
  );
}

export function getMediaUrl(item: string): string {
  if (!item) return '';
  if (item.startsWith('http://') || item.startsWith('https://') || item.startsWith('blob:')) {
    return item;
  }
  const clean = item.replace(/^storage\//, '').replace(/^\/+/, '');
  const baseUrl = (API_CONFIG.BASE_URL || 'https://apitourism.fikriti.com/api').replace(/\/api\/?$/, '');
  return `${baseUrl}/${clean}`;
}

export default function MediaGalleryUploader({
  gallery = [],
  onChange,
  folder = 'packages',
  label = 'معرض الصور والفيديوهات (Media Gallery)',
  hint = 'يمكنك رفع عدة صور وفيديوهات إضافية للعرض',
}: MediaGalleryUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadingCount, setUploadingCount] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      if (fileArray.length === 0) return;

      setUploadingCount((prev) => prev + fileArray.length);
      const newPaths: string[] = [];

      for (const file of fileArray) {
        // Validate file type
        const isImg = file.type.startsWith('image/');
        const isVid = file.type.startsWith('video/') || isVideoFile(file.name);

        if (!isImg && !isVid) {
          toast.error(`الملف ${file.name} غير مدعوم (يجب أن يكون صورة أو فيديو)`);
          setUploadingCount((prev) => Math.max(0, prev - 1));
          continue;
        }

        if (file.size > 100 * 1024 * 1024) {
          toast.error(`الملف ${file.name} يتجاوز الحد الأقصى (100 ميجابايت)`);
          setUploadingCount((prev) => Math.max(0, prev - 1));
          continue;
        }

        try {
          const res = await apiService.admin.media.upload(file, folder);
          if (res.success && res.data) {
            const finalUrl = res.data.url || getMediaUrl(res.data.path);
            newPaths.push(finalUrl);
          }
        } catch (err) {
          console.error('Failed to upload file:', file.name, err);
        } finally {
          setUploadingCount((prev) => Math.max(0, prev - 1));
        }
      }

      if (newPaths.length > 0) {
        onChange([...gallery, ...newPaths]);
        toast.success(`تم رفع ${newPaths.length} ملف/ملفات بنجاح إلى المعرض`);
      }
    },
    [folder, gallery, onChange]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemove = (index: number) => {
    const updated = gallery.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <label className="flex items-center gap-2 text-xs font-bold text-cyan uppercase tracking-wider">
            <Images className="size-4 text-cyan" />
            {label}
          </label>
          {hint && <p className="text-[11px] text-slate-400 mt-0.5">{hint}</p>}
        </div>
        <span className="px-2 py-0.5 rounded-full bg-cyan/10 border border-cyan/20 text-cyan text-[11px] font-bold">
          {gallery.length} ملفات
        </span>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {/* Drop Zone / Upload Button */}
        <div
          onClick={() => uploadingCount === 0 && inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`h-32 rounded-xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center p-2 ${
            isDragging
              ? 'border-cyan bg-cyan/10 scale-[1.02]'
              : 'border-white/15 bg-white/5 hover:border-cyan/40 hover:bg-white/[0.08]'
          } ${uploadingCount > 0 ? 'pointer-events-none opacity-70' : ''}`}
        >
          {uploadingCount > 0 ? (
            <div className="flex flex-col items-center gap-1.5">
              <Loader2 className="size-6 text-cyan animate-spin" />
              <span className="text-[11px] text-white font-medium">جاري رفع ({uploadingCount})...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1">
              <div className="size-9 rounded-lg bg-cyan/10 border border-cyan/20 flex items-center justify-center text-cyan">
                <Plus className="size-5" />
              </div>
              <span className="text-xs font-bold text-white mt-1">رفع صور / فيديو</span>
              <span className="text-[10px] text-slate-400">اختر عدة ملفات معاً</span>
            </div>
          )}
        </div>

        {/* Uploaded Media Items */}
        {gallery.map((item, index) => {
          const isVid = isVideoFile(item);
          const previewUrl = getMediaUrl(item);

          return (
            <div
              key={index}
              className="relative group h-32 rounded-xl overflow-hidden border border-white/10 bg-navy-light shrink-0"
            >
              {isVid ? (
                <div className="relative w-full h-full bg-black flex items-center justify-center">
                  <video
                    src={previewUrl}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                    preload="metadata"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="size-10 rounded-full bg-rose-500/80 backdrop-blur-md flex items-center justify-center text-white shadow-lg">
                      <Film className="size-5" />
                    </div>
                  </div>
                  <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-rose-500 text-white text-[9px] font-bold z-10 flex items-center gap-1">
                    <Video className="size-2.5" />
                    VIDEO
                  </span>
                </div>
              ) : (
                <div className="relative w-full h-full">
                  <Image
                    src={previewUrl}
                    alt={`Gallery media ${index + 1}`}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                  <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm text-cyan text-[9px] font-bold z-10">
                    IMAGE
                  </span>
                </div>
              )}

              {/* Hover overlay with action buttons */}
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-20">
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg bg-cyan text-navy hover:bg-cyan-light transition-colors"
                  title="معاينة"
                >
                  <Plus className="size-4" />
                </a>
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="p-2 rounded-lg bg-rose-500/80 text-white hover:bg-rose-600 transition-colors cursor-pointer"
                  title="حذف"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hidden File Input */}
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*,video/*,.mp4,.webm,.mov,.avi,.mkv"
        onChange={handleInputChange}
        className="sr-only"
        aria-label={label}
      />
    </div>
  );
}
