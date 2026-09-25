'use client';

import React, { useState, useCallback } from 'react';
import { UploadCloud, X } from 'lucide-react';
import Image from 'next/image';

export default function ImageUploader({ maxImages = 5, onImagesChange }) {
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const handleFileChange = useCallback((e) => {
    const files = Array.from(e.target.files);
    
    if (images.length + files.length > maxImages) {
      alert(`You can only upload a maximum of ${maxImages} images.`);
      return;
    }

    const newImages = [...images, ...files];
    setImages(newImages);
    onImagesChange(newImages);

    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  }, [images, maxImages, onImagesChange]);

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    onImagesChange(newImages);

    const newPreviewUrls = [...previewUrls];
    URL.revokeObjectURL(newPreviewUrls[index]);
    newPreviewUrls.splice(index, 1);
    setPreviewUrls(newPreviewUrls);
  };

  return (
    <div className="w-full">
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-indigo-500 transition-colors bg-gray-50">
        <div className="space-y-1 text-center">
          <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
          <div className="flex text-sm text-gray-600 justify-center">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500 px-2 py-1"
            >
              <span>Upload files</span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                disabled={images.length >= maxImages}
              />
            </label>
            <p className="pl-1 py-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB each ({images.length}/{maxImages})</p>
        </div>
      </div>

      {previewUrls.length > 0 && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {previewUrls.map((url, index) => (
            <div key={url} className="relative group rounded-lg overflow-hidden aspect-square border border-gray-200">
              <Image src={url} alt={`Preview ${index}`} fill className="object-cover" />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
