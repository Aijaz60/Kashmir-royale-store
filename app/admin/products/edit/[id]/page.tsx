"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [rating, setRating] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Shawls");
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((products) => {
        const product = products.find((p: any) => p._id === id);

        if (!product) return;

        setTitle(product.title);
        setPrice(product.price.toString());
        setOldPrice(product.oldPrice.toString());
        setDiscount(product.discount);
        setRating(product.rating);
        setDescription(product.description);
        setCategory(product.category || "Shawls");
        setImage(product.image);
      });
  }, [id]);  
  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];

  if (!file) return;

  setUploading(true);

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if (data.success) {
    setImage(data.url);
  }

  setUploading(false);
};
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`/api/update-product/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        price,
        oldPrice,
        discount,
        rating,
        description,
        category,
        image,
      }),
    });

    const data = await res.json();

    if (data.success) {
      alert("✅ Product Updated Successfully");
      router.push("/admin/products");
    } else {
      alert("❌ Failed to Update Product");
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 pt-32 px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow">

        <h1 className="text-4xl font-bold mb-8">
          Edit Product
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            className="w-full border p-3 rounded-lg"
            placeholder="Product Name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            className="w-full border p-3 rounded-lg"
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <input
            className="w-full border p-3 rounded-lg"
            type="number"
            placeholder="Old Price"
            value={oldPrice}
            onChange={(e) => setOldPrice(e.target.value)}
          />

          <input
            className="w-full border p-3 rounded-lg"
            placeholder="Discount"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
          />

          <input
            className="w-full border p-3 rounded-lg"
            placeholder="Rating"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          />

          <textarea
            className="w-full border p-3 rounded-lg"
            rows={4}
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <select
  className="w-full border p-3 rounded-lg"
  value={category}
  onChange={(e) => setCategory(e.target.value)}
>
  <option value="Shawls">Shawls</option>
  <option value="Pashmina">Pashmina</option>
  <option value="Suits">Suits</option>
  <option value="Stoles">Stoles</option>
</select>
<select
  className="w-full border p-3 rounded-lg"
  value={category}
  onChange={(e) => setCategory(e.target.value)}
>
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
    className="w-full border p-3 rounded-lg"
  />

  {uploading && (
    <p className="text-blue-600">
      Uploading image...
    </p>
  )}

  {image && (
    <Image
      src={image}
      alt="Preview"
      width={250}
      height={250}
      className="rounded-lg border"
    />
  )}
</div>

          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-400 py-3 rounded-xl font-bold"
          >
            Update Product
          </button>

        </form>

      </div>
    </main>
  );
}