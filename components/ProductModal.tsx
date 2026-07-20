'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Upload, Loader2, Star, Image as ImageIcon, Trash2 } from 'lucide-react';
import api, { BASE_URL } from '../services/api';
import { endpoints } from '../services/apiConfig';
import toast from 'react-hot-toast';
import ConfirmationModal from './ConfirmationModal';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product?: any;
}

interface ImageEntry {
  id: string;          // unique key for React
  file?: File;         // new local file
  url: string;         // preview URL (blob or cloudinary)
  is_default: boolean;
  is_thumbnail: boolean;
  public_id?: string | null;
  isExisting: boolean; // already saved on backend
}

export default function ProductModal({ isOpen, onClose, onSuccess, product }: ProductModalProps) {
  const [formData, setFormData] = useState({ name: '', description: '', price: '', category: 'plants', stock: '', is_featured: false });
  const [images, setImages] = useState<ImageEntry[]>([]);
  const [imageToRemove, setImageToRemove] = useState<ImageEntry | null>(null);
  const [loading, setLoading] = useState(false);
  const isEdit = !!product;

  // ─── Seed state when modal opens ───────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;

    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        category: product.category || 'plants',
        stock: product.stock !== undefined ? product.stock.toString() : '0',
        is_featured: !!product.is_featured,
      });

      // Load existing images from product.images array (JSONB)
      const existingImages: ImageEntry[] = [];
      const raw: any[] = product.images || [];

      raw.forEach((img, i) => {
        const url = img.url?.startsWith('http') ? img.url : `${BASE_URL}${img.url}`;
        existingImages.push({
          id: `existing-${i}`,
          url,
          is_default: img.is_default,
          is_thumbnail: img.is_thumbnail,
          public_id: img.public_id || null,
          isExisting: true,
        });
      });

      // Fallback: if no images array but image_url exists
      if (existingImages.length === 0 && product.image_url) {
        const url = product.image_url.startsWith('http') ? product.image_url : `${BASE_URL}${product.image_url}`;
        existingImages.push({ id: 'existing-0', url, is_default: true, is_thumbnail: true, public_id: null, isExisting: true });
      }

      setImages(existingImages);
    } else {
      setFormData({ name: '', description: '', price: '', category: 'plants', stock: '', is_featured: false });
      setImages([]);
    }
  }, [product, isOpen]);

  // ─── File picker ────────────────────────────────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const newEntries: ImageEntry[] = files.map((file, i) => ({
      id: `new-${Date.now()}-${i}`,
      file,
      url: URL.createObjectURL(file),
      is_default: images.length === 0 && i === 0,
      is_thumbnail: images.length === 0 && i === 0,
      isExisting: false,
    }));

    setImages(prev => {
      const updated = [...prev, ...newEntries];
      // if nothing has default yet, set first
      if (!updated.some(img => img.is_default)) {
        updated[0].is_default = true;
        updated[0].is_thumbnail = true;
      }
      return updated;
    });

    e.target.value = ''; // reset input so same file can be re-added after removal
  };

  // ─── Remove an image ────────────────────────────────────────────────────────
  const removeImage = (id: string) => {
    setImages(prev => {
      const filtered = prev.filter(img => img.id !== id);
      // if we removed the default, assign to first remaining
      if (!filtered.some(img => img.is_default) && filtered.length > 0) {
        filtered[0].is_default = true;
      }
      if (!filtered.some(img => img.is_thumbnail) && filtered.length > 0) {
        filtered[0].is_thumbnail = true;
      }
      return filtered;
    });
  };

  // ─── Set default ────────────────────────────────────────────────────────────
  const setDefault = (id: string) => {
    setImages(prev => prev.map(img => ({ ...img, is_default: img.id === id })));
  };

  // ─── Set thumbnail ──────────────────────────────────────────────────────────
  const setThumbnail = (id: string) => {
    setImages(prev => prev.map(img => ({ ...img, is_thumbnail: img.id === id })));
  };

  // ─── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category) {
      toast.error('Please fill in required fields');
      return;
    }
    if (images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('category', formData.category);
    data.append('stock', formData.stock || '0');
    data.append('is_featured', String(formData.is_featured));

    // Separate new files from existing
    const newFiles = images.filter(img => !img.isExisting && img.file);
    newFiles.forEach(img => data.append('images', img.file!));

    // Compute indices relative to new uploads only for backend
    const defaultIdx = newFiles.findIndex(img => img.is_default);
    const thumbnailIdx = newFiles.findIndex(img => img.is_thumbnail);
    data.append('defaultIndex', String(Math.max(0, defaultIdx)));
    data.append('thumbnailIndex', String(Math.max(0, thumbnailIdx)));

    if (isEdit) {
      // Pass existing images metadata so backend can merge
      const existingImagesMeta = images
        .filter(img => img.isExisting)
        .map(img => ({ url: img.url, public_id: img.public_id || null, is_default: img.is_default, is_thumbnail: img.is_thumbnail }));
      data.append('imagesMetadata', JSON.stringify(existingImagesMeta));
      data.append('keepExistingImages', 'true');

      // Absolute indices (across all images, existing + new)
      const allImagesFlat = images;
      const absDefault = allImagesFlat.findIndex(img => img.is_default);
      const absThumbnail = allImagesFlat.findIndex(img => img.is_thumbnail);
      data.append('absoluteDefaultIndex', String(absDefault));
      data.append('absoluteThumbnailIndex', String(absThumbnail));
    }

    try {
      setLoading(true);
      const endpoint = isEdit ? endpoints.products.detail(product.id) : endpoints.products.list;
      const method = isEdit ? 'put' : 'post';
      const res = await api[method](endpoint, data, { headers: { 'Content-Type': 'multipart/form-data' } });

      if (res.data.success) {
        toast.success(isEdit ? 'Product updated!' : 'Product added!');
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || `Failed to ${isEdit ? 'update' : 'add'} product`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 p-0 backdrop-blur-md sm:items-center sm:p-4">
      <div className="max-h-[96dvh] w-full max-w-4xl overflow-hidden rounded-t-2xl border border-black/5 bg-card shadow-2xl dark:border-white/10 sm:max-h-[92dvh] sm:rounded-xl">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 px-5 sm:px-10 py-5 sm:py-7 border-b border-black/5 dark:border-white/10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">{isEdit ? 'Edit Product' : 'Add New Product'}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{images.length} image{images.length !== 1 ? 's' : ''} selected</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="custom-scrollbar max-h-[calc(96dvh-5.5rem)] overflow-y-auto sm:max-h-[calc(92dvh-6rem)]">
          <div className="p-5 sm:p-10 space-y-8 sm:space-y-10">

            {/* ── Image Upload Zone ── */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <label className="text-sm font-black uppercase tracking-widest text-primary">Product Images</label>
                <label htmlFor="multi-image-input" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary/10 text-primary text-xs font-black uppercase tracking-wider cursor-pointer hover:bg-primary hover:text-white transition-all">
                  <Upload className="w-4 h-4" /> Add Images
                </label>
                <input type="file" id="multi-image-input" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
              </div>

              {images.length === 0 ? (
                <label htmlFor="multi-image-input" className="flex flex-col items-center justify-center border-2 border-dashed border-black/10 dark:border-white/10 rounded-xl p-8 sm:p-16 cursor-pointer hover:border-primary transition-all group">
                  <div className="p-5 bg-primary/10 rounded-full mb-4 group-hover:bg-primary/20 transition">
                    <Upload className="w-10 h-10 text-primary" />
                  </div>
                  <p className="font-bold text-foreground">Click to upload images</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">JPEG, PNG, WEBP - up to 10 images</p>
                </label>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
                  {images.map(img => (
                    <div key={img.id} className="relative group aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-primary/30 transition-all">
                      <Image src={img.url} alt="Product preview" fill unoptimized sizes="(max-width: 640px) 50vw, 20vw" className="h-full w-full object-cover" />

                      {/* Badges */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {img.is_default && (
                          <span className="bg-primary text-white text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Star className="w-2.5 h-2.5 fill-white" /> Default
                          </span>
                        )}
                        {img.is_thumbnail && (
                          <span className="bg-amber-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                            <ImageIcon className="w-2.5 h-2.5" /> Thumb
                          </span>
                        )}
                      </div>

                      {/* Action overlay */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60 p-2 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
                        <button type="button" onClick={() => setDefault(img.id)}
                          className={`w-full flex items-center justify-center gap-1 py-1 rounded-lg text-[10px] font-black transition ${img.is_default ? 'bg-primary text-white' : 'bg-white/20 text-white hover:bg-primary'}`}>
                          <Star className="w-3 h-3" /> Set Default
                        </button>
                        <button type="button" onClick={() => setThumbnail(img.id)}
                          className={`w-full flex items-center justify-center gap-1 py-1 rounded-lg text-[10px] font-black transition ${img.is_thumbnail ? 'bg-amber-500 text-white' : 'bg-white/20 text-white hover:bg-amber-500'}`}>
                          <ImageIcon className="w-3 h-3" /> Set Thumb
                        </button>
                        <button type="button" onClick={() => setImageToRemove(img)}
                          className="w-full flex items-center justify-center gap-1 py-1 rounded-lg text-[10px] font-black bg-red-500/80 hover:bg-red-500 text-white transition">
                          <Trash2 className="w-3 h-3" /> Remove
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Add more tile */}
                  <label htmlFor="multi-image-input" className="aspect-square rounded-lg border-2 border-dashed border-black/10 dark:border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition group">
                    <Upload className="w-6 h-6 text-gray-600 dark:text-gray-400 group-hover:text-primary mb-2" />
                    <span className="text-[10px] font-black text-gray-600 dark:text-gray-400 group-hover:text-primary">Add More</span>
                  </label>
                </div>
              )}

              <p className="text-xs text-gray-600 dark:text-gray-400">
                <span className="font-black text-primary">Default</span> = main product image &nbsp;|&nbsp;
                <span className="font-black text-amber-500">Thumbnail</span> = card preview image
              </p>
            </div>

            {/* ── Product Info ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-600 dark:text-gray-400">Product Name *</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Royal Monstera"
                    className="w-full px-6 py-4 rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 focus:ring-2 focus:ring-primary outline-none transition font-medium text-foreground placeholder:text-gray-500" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-600 dark:text-gray-400">Category</label>
                    <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-6 py-4 rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 outline-none font-bold text-foreground">
                      <option value="plants">Plants</option>
                      <option value="seeds">Seeds</option>
                      <option value="tools">Tools</option>
                      <option value="planters">Planters</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-600 dark:text-gray-400">Price (₹) *</label>
                    <input type="number" step="0.01" required value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-6 py-4 rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 outline-none font-bold text-foreground" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-600 dark:text-gray-400">Inventory Stock</label>
                  <input type="number" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-6 py-4 rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 outline-none font-bold text-foreground" />
                </div>
                <label className="flex items-center gap-3 rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-6 py-4 font-bold text-foreground">
                  <input type="checkbox" checked={formData.is_featured} onChange={e => setFormData({ ...formData, is_featured: e.target.checked })} />
                  Featured product
                </label>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-600 dark:text-gray-400">Full Description</label>
                <textarea rows={9} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed botanical information..."
                  className="w-full h-full px-6 py-4 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 focus:ring-2 focus:ring-primary outline-none transition resize-none font-medium text-foreground placeholder:text-gray-500" />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row gap-4 px-6 sm:px-10 py-6 sm:py-7 border-t border-black/5 dark:border-white/10 bg-black/2 dark:bg-white/2">
            <button type="button" onClick={onClose}
              className="flex-1 py-4 rounded-lg font-black text-gray-700 dark:text-gray-300 bg-black/5 dark:bg-white/5 hover:bg-black/10 transition">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-4 rounded-lg font-black text-white bg-primary hover:bg-primary-dark shadow-xl shadow-primary/20 transition flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</> : (isEdit ? 'Update Product' : 'Add Product')}
            </button>
          </div>
        </form>
      </div>
      <ConfirmationModal
        isOpen={!!imageToRemove}
        onClose={() => setImageToRemove(null)}
        onConfirm={() => {
          if (imageToRemove) removeImage(imageToRemove.id);
        }}
        title="Remove image?"
        message="This image will be removed from the product before saving."
        confirmText="Remove"
        variant="danger"
      />
    </div>
  );
}
