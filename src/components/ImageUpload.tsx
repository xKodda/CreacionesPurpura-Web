"use client";

import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void;
  currentImage?: string;
  className?: string;
}

export default function ImageUpload({ onImageUpload, currentImage, className = "" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [previewUrl, setPreviewUrl] = useState(currentImage || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      setUploadError("Solo se permiten archivos de imagen");
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("El archivo es demasiado grande. Máximo 5MB");
      return;
    }

    setIsUploading(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al subir la imagen");
      }

      const data = await response.json();
      setPreviewUrl(data.imageUrl);
      onImageUpload(data.imageUrl);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Error al subir la imagen");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl("");
    onImageUpload("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <label className="block text-sm font-medium text-brand-principal mb-1">
        Imagen del producto
      </label>
      
      {/* Preview de la imagen */}
      {previewUrl && (
        <div className="relative inline-block">
          <img
            src={previewUrl}
            alt="Preview"
            className="h-32 w-32 object-cover rounded-lg border-2 border-gray-200"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            title="Eliminar imagen"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Área de carga */}
      <div
        onClick={handleClick}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          previewUrl 
            ? "border-gray-300 bg-gray-50" 
            : "border-brand-acento bg-brand-acento/5 hover:bg-brand-acento/10"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />
        
        {isUploading ? (
          <div className="space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-acento border-t-transparent mx-auto"></div>
            <p className="text-sm text-brand-principal">Subiendo imagen...</p>
          </div>
        ) : previewUrl ? (
          <div className="space-y-2">
            <ImageIcon className="w-8 h-8 text-gray-400 mx-auto" />
            <p className="text-sm text-gray-600">Haz clic para cambiar la imagen</p>
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className="w-8 h-8 text-brand-acento mx-auto" />
            <p className="text-sm text-brand-principal font-medium">
              Haz clic para subir una imagen
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG, GIF hasta 5MB
            </p>
          </div>
        )}
      </div>

      {/* Mensaje de error */}
      {uploadError && (
        <p className="text-red-500 text-sm text-center">{uploadError}</p>
      )}
    </div>
  );
} 