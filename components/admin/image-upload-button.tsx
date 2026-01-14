"use client";

import { useState, useRef, useId } from "react";
import { toast } from "sonner";

interface ImageUploadButtonProps {
  onUploadComplete: (url: string) => void;
  label?: string;
  className?: string;
  id?: string; // Allow custom ID to avoid conflicts
}

export function ImageUploadButton({
  onUploadComplete,
  label = "Качи Снимка",
  className = "",
  id,
}: ImageUploadButtonProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const generatedId = useId();
  const inputId = id || `image-upload-${generatedId}`;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Моля, избери валиден файл със снимка");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Файлът е твърде голям. Максималният размер е 10MB");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error("Failed to parse response:", parseError);
        throw new Error("Грешка при обработка на отговора от сървъра");
      }

      if (!response.ok) {
        console.error("Upload failed:", data);
        throw new Error(data.error || `Грешка при качване на снимка (${response.status})`);
      }

      onUploadComplete(data.url);
      toast.success("Снимката е качена успешно");
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast.error(error.message || "Грешка при качване на снимка");
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        id={inputId}
        disabled={uploading}
      />
      <label
        htmlFor={inputId}
        className={`inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        {uploading ? "Качване..." : label}
      </label>
    </div>
  );
}
