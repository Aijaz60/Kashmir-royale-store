"use client";

import { useState } from "react";
import Image from "next/image";

export default function AddProductPage() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [rating, setRating] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Shawls");
  const [stock, setStock] = useState("");

  const [image, setImage] = useState("");
const [preview, setPreview] = useState("");
const [uploading, setUploading] = useState(false);

  const uploadImage = async (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const file = e.target.files?.[0];

  if (!file) return;

  setUploading(true);

  setPreview(URL.createObjectURL(file));

  const reader = new FileReader();

  reader.readAsDataURL(file);

  reader.onloadend = async () => {
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
      setImage(data.url);
    } else {
      alert("Image upload failed");
    }

    setUploading(false);
  };
};

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const response = await fetch("/api/add-product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
  title,
  price: Number(price),
  oldPrice: Number(oldPrice),
  discount,
  rating,
  description,
  category,
  image,
  stock: Number(stock),
}),
    });

    const data = await response.json();

    if (!data.success) {
      alert("Failed to add product");
      return;
    }
        alert("✅ Product Added Successfully!");

    setTitle("");
    setPrice("");
    setOldPrice("");
    setDiscount("");
    setRating("");
    setDescription("");
    setCategory("Shawls");
    setImage("");
    setStock("");
  };

  return (
    <main className="min-h-screen bg-gray-100 pt-32 px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg">

        <h1 className="text-4xl font-bold mb-8">
          Add New Product
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            type="text"
            placeholder="Product Name"
            className="w-full border p-3 rounded-lg"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="number"
            placeholder="Price"
            className="w-full border p-3 rounded-lg"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <input
            type="number"
            placeholder="Old Price"
            className="w-full border p-3 rounded-lg"
            value={oldPrice}
            onChange={(e) => setOldPrice(e.target.value)}
          />

          <input
            type="text"
            placeholder="Discount (Example: 25% OFF)"
            className="w-full border p-3 rounded-lg"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
          />

          <input
            type="text"
            placeholder="Rating"
            className="w-full border p-3 rounded-lg"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          />

          <textarea
            rows={4}
            placeholder="Description"
            className="w-full border p-3 rounded-lg"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <select
  className="w-full border p-3 rounded-lg"
  value={category}
  onChange={(e) => setCategory(e.target.value)}
>
  <input
  type="number"
  placeholder="Stock Quantity"
  className="w-full border p-3 rounded-lg"
  value={stock}
  onChange={(e) => setStock(e.target.value)}
/>
  <option value="Shawls">Shawls</option>
  <option value="Pashmina">Pashmina</option>
  <option value="Suits">Suits</option>
  <option value="Stoles">Stoles</option>
</select>

          <div className="space-y-3">
           <input
  type="file"
  accept="image/*"
  onChange={uploadImage}
  className="w-full rounded-lg border border-gray-300 p-3"
 />

            {uploading && (
              <p className="text-blue-600">
                Uploading image...
              </p>
            )}

           {(preview || image) && (
  <div className="mt-4">
    <p className="mb-2 font-semibold text-gray-700">
      Image Preview
    </p>

    <Image
      src={preview || image}
      alt="Preview"
      width={250}
      height={250}
      className="rounded-xl border-2 border-yellow-400 shadow-lg object-cover"
    />
  </div>
)}
          </div>
                    <button
            type="submit"
            disabled={uploading}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-xl disabled:opacity-50"
          >
            {uploading ? "Uploading Image..." : "Add Product"}
          </button>

        </form>

      </div>
    </main>
  );
}