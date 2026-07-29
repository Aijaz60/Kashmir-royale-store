"use client";

import { useState } from "react";

export default function AddProductPage() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [rating, setRating] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    alert("Product Added Successfully!");

    console.log({
      title,
      price,
      oldPrice,
      discount,
      rating,
      description,
      image,
    });

    setTitle("");
    setPrice("");
    setOldPrice("");
    setDiscount("");
    setRating("");
    setDescription("");
    setImage("");
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

          <input
            type="text"
            placeholder="/images/product.jpg"
            className="w-full border p-3 rounded-lg"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-xl"
          >
            Add Product
          </button>

        </form>

      </div>
    </main>
  );
}