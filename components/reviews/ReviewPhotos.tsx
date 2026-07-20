'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ImagePlus, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';

export type ReviewPhoto = {
  id: string;
  url: string;
  sort_order?: number;
};

const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
const maxBytes = 5 * 1024 * 1024;

export function ReviewImagePicker({
  files,
  onChange,
  disabled = false,
}: {
  files: File[];
  onChange: (files: File[]) => void;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [files]);

  const addFiles = (selected: FileList | null) => {
    if (!selected) return;
    const incoming = Array.from(selected);
    if (inputRef.current) inputRef.current.value = '';
    const invalidType = incoming.find((file) => !allowedTypes.has(file.type));
    const oversized = incoming.find((file) => file.size > maxBytes);

    if (invalidType) {
      toast.error('Review photos must be JPEG, PNG, or WebP');
      return;
    }
    if (oversized) {
      toast.error('Each review photo must be 5 MB or smaller');
      return;
    }
    if (files.length + incoming.length > 5) {
      toast.error('You can upload up to 5 review photos');
      return;
    }

    onChange([...files, ...incoming]);
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <label className="block text-xs font-black uppercase tracking-widest text-gray-600 dark:text-gray-400">
          Photos <span className="normal-case tracking-normal font-medium">(optional)</span>
        </label>
        <span className="text-xs text-gray-500">{files.length}/5</span>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        disabled={disabled || files.length >= 5}
        onChange={(event) => addFiles(event.target.files)}
        className="sr-only"
      />
      <button
        type="button"
        disabled={disabled || files.length >= 5}
        onClick={() => inputRef.current?.click()}
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-primary/40 bg-primary/5 px-4 py-3 text-sm font-bold text-primary transition hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ImagePlus className="h-4 w-4" /> Add product photos
      </button>
      <p className="mt-2 text-xs leading-5 text-gray-500">JPEG, PNG, or WebP. Maximum 5 MB each.</p>

      {previews.length > 0 && (
        <div className="mt-3 grid grid-cols-2 gap-2 min-[380px]:grid-cols-3 sm:grid-cols-5 lg:grid-cols-3">
          {previews.map((url, index) => (
            <div key={`${files[index].name}-${files[index].lastModified}`} className="group relative aspect-square overflow-hidden rounded-lg border border-black/10 bg-black/5 dark:border-white/10">
              <Image src={url} alt={`Selected review photo ${index + 1}`} fill unoptimized className="object-cover" />
              <button
                type="button"
                onClick={() => onChange(files.filter((_, fileIndex) => fileIndex !== index))}
                disabled={disabled}
                className="absolute right-1.5 top-1.5 cursor-pointer rounded-full bg-black/70 p-1.5 text-white transition hover:bg-red-600 disabled:cursor-not-allowed"
                aria-label={`Remove selected photo ${index + 1}`}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ReviewPhotoGallery({
  images,
  reviewer,
  onOpen,
}: {
  images?: ReviewPhoto[];
  reviewer: string;
  onOpen: (photo: ReviewPhoto) => void;
}) {
  if (!images?.length) return null;

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {images.map((photo, index) => (
        <button
          type="button"
          key={photo.id}
          onClick={() => onOpen(photo)}
          className="relative h-20 w-20 cursor-zoom-in overflow-hidden rounded-lg border border-black/10 bg-black/5 transition hover:-translate-y-0.5 hover:border-primary hover:shadow-lg dark:border-white/10"
          aria-label={`Open review photo ${index + 1} from ${reviewer}`}
        >
          <Image src={photo.url} alt={`Review photo ${index + 1} from ${reviewer}`} fill sizes="80px" className="object-cover" />
        </button>
      ))}
    </div>
  );
}

export function ReviewPhotoLightbox({
  photo,
  reviewer,
  onClose,
}: {
  photo: ReviewPhoto | null;
  reviewer: string;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!photo) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [onClose, photo]);

  if (!photo) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-2 backdrop-blur-sm sm:p-4" role="dialog" aria-modal="true" aria-label="Review photo preview" onClick={onClose}>
      <button type="button" onClick={onClose} className="absolute right-4 top-4 cursor-pointer rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20" aria-label="Close review photo">
        <X className="h-6 w-6" />
      </button>
      <div className="relative h-[82dvh] w-full max-w-5xl" onClick={(event) => event.stopPropagation()}>
        <Image src={photo.url} alt={`Review photo from ${reviewer}`} fill sizes="100vw" className="object-contain" priority />
      </div>
    </div>
  );
}
