"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Replace, Loader2 } from "lucide-react";
import { toast } from "sonner";
import imageCompression from "browser-image-compression";
import { createClient } from "@/lib/supabase/client";

interface ImageUploaderProps {
  value: string;
  onChange: (path: string) => void;
  folder: string;
  label: string;
}

export function ImageUploader({
  value,
  onChange,
  folder,
  label,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const publicUrl = value
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${value}`
    : "";

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        toast.error("Only image files are allowed.");
        return;
      }

      setUploading(true);
      setProgress(10);

      try {
        // Compress image
        const compressed = await imageCompression(file, {
          maxWidthOrHeight: 1600,
          initialQuality: 0.8,
          maxSizeMB: 1,
          fileType: "image/webp",
          useWebWorker: true,
          onProgress: (p) => setProgress(Math.min(10 + p * 0.6, 70)),
        });

        setProgress(75);

        const supabase = createClient();
        const path = `${folder}/${crypto.randomUUID()}.webp`;

        const { error: uploadError } = await supabase.storage
          .from("media")
          .upload(path, compressed, {
            contentType: "image/webp",
            upsert: false,
          });

        if (uploadError) {
          throw new Error(uploadError.message);
        }

        setProgress(95);

        // Record in media_assets via direct insert (browser client)
        // The server action recordMediaAsset requires server context,
        // so we record it directly here using the browser client.
        await supabase.from("media_assets").insert({
          storage_path: path,
          width: null,
          height: null,
        });

        setProgress(100);
        onChange(path);
        toast.success("Image uploaded successfully.");
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Upload failed.";
        toast.error(message);
      } finally {
        setUploading(false);
        setProgress(0);
      }
    },
    [folder, onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      // Reset input so the same file can be re-selected
      e.target.value = "";
    },
    [handleFile]
  );

  const handleRemove = useCallback(() => {
    onChange("");
  }, [onChange]);

  const handleReplace = useCallback(() => {
    inputRef.current?.click();
  }, []);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-bone">{label}</label>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleInputChange}
        className="hidden"
      />

      {value ? (
        /* Preview state */
        <div className="relative overflow-hidden rounded-xl border border-line bg-ink-soft">
          <img
            src={publicUrl}
            alt={label}
            className="h-48 w-full object-cover"
          />
          {/* Overlay buttons */}
          <div className="absolute inset-x-0 bottom-0 flex gap-2 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8">
            <button
              type="button"
              onClick={handleReplace}
              disabled={uploading}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-ink-soft/90 px-3 py-2.5 text-sm font-medium text-bone transition-colors hover:bg-line disabled:opacity-50"
            >
              <Replace className="h-4 w-4" />
              Replace
            </button>
            <button
              type="button"
              onClick={handleRemove}
              disabled={uploading}
              className="flex items-center justify-center rounded-lg bg-red-600/90 px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-500 disabled:opacity-50"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Drop zone state */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !uploading && inputRef.current?.click()}
          className={`
            flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 transition-colors
            ${
              dragOver
                ? "border-accent bg-accent/5"
                : "border-line bg-ink-soft hover:border-muted"
            }
            ${uploading ? "pointer-events-none opacity-60" : ""}
          `}
        >
          {uploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          ) : (
            <Upload className="h-8 w-8 text-muted" />
          )}
          <div className="text-center">
            <p className="text-sm font-medium text-bone">
              {uploading ? "Uploading..." : "Drag & drop or tap to upload"}
            </p>
            <p className="mt-1 text-xs text-muted">
              JPG, PNG or WebP (max 1600px, compressed)
            </p>
          </div>
        </div>
      )}

      {/* Upload progress bar */}
      {uploading && (
        <div className="h-1.5 overflow-hidden rounded-full bg-ink-soft">
          <div
            className="h-full rounded-full bg-accent transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
