"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductForm {
  title: string;
  description: string;
  category: string;

  price: string;
  oldPrice: string;
  discount: string;
  rating: string;

  stock: string;

  featured: boolean;
  newArrival: boolean;
  bestSeller: boolean;
  active: boolean;

  images: string[];
}

const initialForm: ProductForm = {
  title: "",
  description: "",
  category: "Shawls",

  price: "",
  oldPrice: "",
  discount: "",
  rating: "5",

  stock: "",

  featured: false,
  newArrival: false,
  bestSeller: false,
  active: true,

  images: [],
};

export default function AddProductPage() {
  const [form, setForm] =
    useState<ProductForm>(initialForm);

  const [uploading, setUploading] = useState(false);

  async function uploadImage(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    setUploading(true);

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image: reader.result,
          }),
        });

        const data = await res.json();

        if (data.success) {
          setForm((prev) => ({
            ...prev,
            images: [...prev.images, data.url],
          }));
        } else {
          alert("Image upload failed.");
        }
      } catch (error) {
        console.error(error);
        alert("Upload failed.");
      }

      setUploading(false);
    };
  }

  function removeImage(index: number) {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  }

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!form.title.trim()) {
      alert("Product name is required.");
      return;
    }

    if (form.images.length === 0) {
      alert("Please upload at least one image.");
      return;
    }

    const response = await fetch("/api/add-product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...form,
        price: Number(form.price),
        oldPrice: Number(form.oldPrice),
        stock: Number(form.stock),
      }),
    });

    const data = await response.json();

    if (!data.success) {
      alert("Failed to add product.");
      return;
    }

    alert("✅ Product Added Successfully!");

    setForm(initialForm);
  }
    return (
    <main className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="mx-auto max-w-6xl rounded-2xl bg-white p-8 shadow-xl">

        <h1 className="mb-2 text-4xl font-bold">
          Add New Product
        </h1>

        <p className="mb-10 text-gray-500">
          Create premium products for Kashmir Royale.
        </p>

        <form onSubmit={handleSubmit} className="space-y-10">

          {/* Product Details */}
          <div className="rounded-2xl border bg-gray-50 p-6">

            <h2 className="mb-6 text-2xl font-bold">
              📝 Product Details
            </h2>

            <div className="grid gap-6 md:grid-cols-2">

              <input
                className="rounded-lg border p-3"
                placeholder="Product Name"
                value={form.title}
                onChange={(e) =>
                  setForm({
                    ...form,
                    title: e.target.value,
                  })
                }
              />

              <select
                className="rounded-lg border p-3"
                value={form.category}
                onChange={(e) =>
                  setForm({
                    ...form,
                    category: e.target.value,
                  })
                }
              >
                <option>Shawls</option>
                <option>Pashmina</option>
                <option>Suits</option>
                <option>Stoles</option>
              </select>

              <textarea
                rows={5}
                className="rounded-lg border p-3 md:col-span-2"
                placeholder="Product Description"
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
              />

            </div>

          </div>

          {/* Pricing */}
          <div className="rounded-2xl border bg-gray-50 p-6">

            <h2 className="mb-6 text-2xl font-bold">
              💰 Pricing & Inventory
            </h2>

            <div className="grid gap-6 md:grid-cols-2">

              <input
                type="number"
                className="rounded-lg border p-3"
                placeholder="Price"
                value={form.price}
                onChange={(e) =>
                  setForm({
                    ...form,
                    price: e.target.value,
                  })
                }
              />

              <input
                type="number"
                className="rounded-lg border p-3"
                placeholder="Old Price"
                value={form.oldPrice}
                onChange={(e) =>
                  setForm({
                    ...form,
                    oldPrice: e.target.value,
                  })
                }
              />

              <input
                className="rounded-lg border p-3"
                placeholder="Discount"
                value={form.discount}
                onChange={(e) =>
                  setForm({
                    ...form,
                    discount: e.target.value,
                  })
                }
              />

              <input
                className="rounded-lg border p-3"
                placeholder="Rating"
                value={form.rating}
                onChange={(e) =>
                  setForm({
                    ...form,
                    rating: e.target.value,
                  })
                }
              />

              <input
                type="number"
                className="rounded-lg border p-3"
                placeholder="Stock Quantity"
                value={form.stock}
                onChange={(e) =>
                  setForm({
                    ...form,
                    stock: e.target.value,
                  })
                }
              />

            </div>

          </div>
                    {/* Product Images */}
          <div className="rounded-2xl border bg-gray-50 p-6">

            <h2 className="mb-6 text-2xl font-bold">
              🖼️ Product Images
            </h2>

            <input
              type="file"
              accept="image/*"
              onChange={uploadImage}
              className="w-full rounded-lg border p-3"
            />

            {uploading && (
              <p className="mt-4 font-medium text-blue-600">
                Uploading image...
              </p>
            )}

            {form.images.length > 0 && (
              <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-4">

                {form.images.map((image, index) => (
                  <div
                    key={index}
                    className="relative overflow-hidden rounded-xl border bg-white shadow"
                  >
                    <Image
                      src={image}
                      alt={`Product ${index + 1}`}
                      width={300}
                      height={300}
                      className="h-48 w-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute right-2 top-2 rounded-full bg-red-600 px-3 py-1 text-sm font-bold text-white hover:bg-red-700"
                    >
                      ✕
                    </button>

                    {index === 0 && (
                      <div className="absolute bottom-0 w-full bg-yellow-500 py-2 text-center text-sm font-bold text-black">
                        Main Image
                      </div>
                    )}
                  </div>
                ))}

              </div>
            )}

          </div>
                    {/* Product Flags */}
          <div className="rounded-2xl border bg-gray-50 p-6">

            <h2 className="mb-6 text-2xl font-bold">
              🏷️ Product Settings
            </h2>

            <div className="grid gap-5 md:grid-cols-2">

              <label className="flex items-center gap-3 rounded-lg border bg-white p-4">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      featured: e.target.checked,
                    })
                  }
                />
                <span className="font-medium">
                  ⭐ Featured Product
                </span>
              </label>

              <label className="flex items-center gap-3 rounded-lg border bg-white p-4">
                <input
                  type="checkbox"
                  checked={form.newArrival}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      newArrival: e.target.checked,
                    })
                  }
                />
                <span className="font-medium">
                  🆕 New Arrival
                </span>
              </label>

              <label className="flex items-center gap-3 rounded-lg border bg-white p-4">
                <input
                  type="checkbox"
                  checked={form.bestSeller}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      bestSeller: e.target.checked,
                    })
                  }
                />
                <span className="font-medium">
                  🔥 Best Seller
                </span>
              </label>

              <label className="flex items-center gap-3 rounded-lg border bg-white p-4">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      active: e.target.checked,
                    })
                  }
                />
                <span className="font-medium">
                  🟢 Active Product
                </span>
              </label>

            </div>

          </div>

          {/* Submit Button */}
          <div className="flex justify-end">

            <button
              type="submit"
              disabled={uploading}
              className="rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 px-10 py-4 font-bold text-black transition-all duration-300 hover:scale-105 hover:from-yellow-400 hover:to-yellow-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "💾 Save Product"}
            </button>

          </div>

        </form>

      </div>
    </main>
  );
}