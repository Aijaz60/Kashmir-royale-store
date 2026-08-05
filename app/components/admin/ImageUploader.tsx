"use client";

import Image from "next/image";
import { useRef, useState } from "react";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUploader({
  value,
  onChange,
  label = "Upload Image",
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);

  async function upload(file: File) {
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        onChange(data.url);
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }

    setUploading(false);
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">

      <h3 className="mb-5 text-xl font-bold">
        {label}
      </h3>

      {value ? (
        <div className="space-y-4">

          <div className="relative h-52 overflow-hidden rounded-xl border">

            <Image
              src={value}
              alt="Preview"
              fill
              className="object-contain"
            />

          </div>

          <button
            type="button"
            onClick={() => onChange("")}
            className="rounded-lg bg-red-600 px-5 py-2 font-semibold text-white hover:bg-red-700"
          >
            Remove Image
          </button>

        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className="flex h-52 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-gray-300 transition hover:border-yellow-500 hover:bg-yellow-50"
        >
          <div className="text-center">

            <p className="text-xl font-bold">
              {uploading
                ? "Uploading..."
                : "Click to Upload"}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              PNG, JPG, WEBP
            </p>

          </div>
        </div>
      )}

      <input
        ref={inputRef}
        hidden
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            upload(e.target.files[0]);
          }
        }}
      />

    </div>
  );
}