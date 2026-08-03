"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Product = {
  _id: string;
  title: string;
  description: string;
  price: number;
  oldPrice: number;
  discount: string;
  rating: string;
  image: string;
  stock: number;
};

export default function AdminProductsPage() {
  
const deleteProduct = async (id: string) => {
  const res = await fetch(`/api/delete-product/${id}`, {
    method: "DELETE",
  });

  const data = await res.json();

  if (data.success) {
    alert("✅ Product Deleted");

    setProducts((prev) =>
      prev.filter((product) => product._id !== id)
    );
  } else {
    alert("❌ Failed to delete product");
  }
};
const restockProduct = async (
  id: string,
  quantity: number
) => {
  try {
    const res = await fetch(`/api/restock-product/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quantity,
      }),
    });

    const data = await res.json();

    if (data.success) {
      alert(`✅ Stock increased by ${quantity}`);

      setProducts((prev) =>
        prev.map((product) =>
          product._id === id
            ? {
                ...product,
                stock: product.stock + quantity,
              }
            : product
        )
      );
    } else {
      alert("Failed to restock");
    }
  } catch (error) {
    console.error(error);
  }
};
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
const filteredProducts = products.filter((product) =>
  product.title.toLowerCase().includes(search.toLowerCase())
);
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  }, []);
  

  return (
    <main className="min-h-screen bg-gray-100 pt-32 px-8">
      <div className="max-w-7xl mx-auto">
        
          <div>
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">

  <div>
    <h1 className="text-4xl font-bold">
      Manage Products
    </h1>

    <p className="text-gray-500 mt-2">
      Total Products: {products.length}
    </p>
  </div>

  <div className="flex gap-4">

    <input
      type="text"
      placeholder="Search Product..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="border rounded-xl px-4 py-3 w-64 outline-none focus:ring-2 focus:ring-yellow-500"
    />

    <Link
      href="/admin/products/add"
      className="bg-yellow-500 hover:bg-yellow-400 px-6 py-3 rounded-xl font-bold"
    >
      + Add Product
    </Link>

  </div>

</div>
        </div>

        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="w-full">
            <thead className="bg-black text-white">
              <tr>
                <th className="p-4 text-left">Image</th>
                <th className="p-4 text-left">Product</th>
                <th className="p-4 text-left">Price</th>
                <th className="p-4 text-left">Discount</th>
                <th className="p-4 text-left">Rating</th>
                <th className="p-4 text-left">Stock</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
  {filteredProducts.length === 0 ? (
    <tr>
      <td colSpan={6} className="py-16 text-center">

        <div className="flex flex-col items-center">

          <div className="text-6xl">
            📦
          </div>

          <h2 className="mt-4 text-2xl font-bold">
            No Products Found
          </h2>

          <p className="mt-2 text-gray-500">
            There are no products available yet.
          </p>

          <Link
            href="/admin/products/add"
            className="mt-6 rounded-xl bg-yellow-500 px-6 py-3 font-bold hover:bg-yellow-400"
          >
            + Add Product
          </Link>

        </div>

      </td>
    </tr>
  ) : (
    filteredProducts.map((product) => (
      <tr key={product._id} className="border-b">
        <td className="p-4">
          <Image
            src={product.image || "/images/hero.jpg"}
            alt={product.title}
            width={70}
            height={70}
            className="rounded-lg object-cover"
          />
        </td>

        <td className="p-4 font-semibold">
          {product.title}
        </td>

        <td className="p-4">
          ₹{Number(product.price).toLocaleString()}
        </td>

        <td className="p-4">
          {product.discount}
        </td>

        <td className="p-4">
          ⭐ {product.rating}
        </td>
        <td className="p-4">
  {product.stock <= 0 ? (
    <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
      🔴 Out of Stock
    </span>
  ) : product.stock <= 5 ? (
    <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-700">
      🟡 Low Stock ({product.stock})
    </span>
  ) : (
    <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
      🟢 In Stock ({product.stock})
    </span>
  )}
</td>

        <td className="p-4">
          <div className="flex justify-center gap-3">
            <button
  type="button"
  onClick={() => restockProduct(product._id, 10)}
  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
>
  +10
</button>
<button
  type="button"
  onClick={() => restockProduct(product._id, 25)}
  className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
>
  +25
</button>

<button
  type="button"
  onClick={() => restockProduct(product._id, 50)}
  className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700"
>
  +50
</button>

            <Link href={`/admin/products/edit/${product._id}`}>
              <button
                type="button"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Edit
              </button>
            </Link>

            <button
              type="button"
              onClick={() => {
                setSelectedProductId(product._id);
                setShowDeleteModal(true);
              }}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Delete
            </button>

          </div>
        </td>
      </tr>
    ))
  )}
</tbody>

          </table>
        </div>
      </div>
      {showDeleteModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
    <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">

      <h2 className="text-2xl font-bold text-red-600">
        Delete Product
      </h2>

      <p className="mt-4 text-gray-600">
        Are you sure you want to delete this product?
      </p>

      <div className="mt-8 flex justify-end gap-4">

        <button
          onClick={() => {
            setShowDeleteModal(false);
            setSelectedProductId(null);
          }}
          className="rounded-xl border border-gray-300 px-5 py-2 hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          onClick={() => {
            if (selectedProductId) {
              deleteProduct(selectedProductId);
            }

            setShowDeleteModal(false);
            setSelectedProductId(null);
          }}
          className="rounded-xl bg-red-600 px-5 py-2 font-semibold text-white hover:bg-red-700"
        >
          Delete
        </button>

      </div>

    </div>
  </div>
)}
    </main>
  );
}