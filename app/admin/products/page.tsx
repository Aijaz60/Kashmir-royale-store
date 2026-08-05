"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Product {
  _id: string;

  title: string;
  description: string;

  category: string;

  price: number;
  oldPrice: number;

  discount: string;
  rating: number;

  stock: number;
  sold: number;

  images: string[];

  featured: boolean;
  newArrival: boolean;
  bestSeller: boolean;
  active: boolean;

  createdAt?: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const res = await fetch("/api/products");

      const data = await res.json();

      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchCategory =
        category === "All" ||
        product.category === category;

      const keyword = search.toLowerCase();

      const matchSearch =
        product.title.toLowerCase().includes(keyword) ||
        product.description.toLowerCase().includes(keyword);

      return matchCategory && matchSearch;
    });
  }, [products, search, category]);

  async function deleteProduct(id: string) {
    try {
      const res = await fetch(`/api/delete-product/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        setProducts((prev) =>
          prev.filter((product) => product._id !== id)
        );
      } else {
        alert("Failed to delete product");
      }
    } catch (error) {
      console.error(error);
    }
  }
    const totalProducts = products.length;

  const featuredProducts = products.filter(
    (product) => product.featured
  ).length;

  const newArrivals = products.filter(
    (product) => product.newArrival
  ).length;

  const bestSellers = products.filter(
    (product) => product.bestSeller
  ).length;

  return (
    <main className="min-h-screen bg-gray-100 p-8 pt-32">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <h1 className="text-4xl font-bold">
              Product Management
            </h1>

            <p className="mt-2 text-gray-500">
              Manage all your store products.
            </p>
          </div>

          <Link
            href="/admin/products/add"
            className="rounded-xl bg-yellow-500 px-6 py-3 font-bold text-black transition hover:bg-yellow-400"
          >
            + Add Product
          </Link>

        </div>

        {/* Statistics */}
        <div className="mb-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-2xl bg-white p-6 shadow">
            <p className="text-sm text-gray-500">
              Total Products
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              {totalProducts}
            </h2>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow">
            <p className="text-sm text-gray-500">
              Featured
            </p>

            <h2 className="mt-2 text-3xl font-bold text-yellow-600">
              {featuredProducts}
            </h2>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow">
            <p className="text-sm text-gray-500">
              New Arrivals
            </p>

            <h2 className="mt-2 text-3xl font-bold text-blue-600">
              {newArrivals}
            </h2>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow">
            <p className="text-sm text-gray-500">
              Best Sellers
            </p>

            <h2 className="mt-2 text-3xl font-bold text-red-600">
              {bestSellers}
            </h2>
          </div>

        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col gap-4 rounded-2xl bg-white p-6 shadow md:flex-row">

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-xl border p-3 outline-none focus:border-yellow-500"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-xl border p-3"
          >
            <option>All</option>
            <option>Shawls</option>
            <option>Pashmina</option>
            <option>Suits</option>
            <option>Stoles</option>
          </select>

        </div>
                {/* Products Table */}
        <div className="overflow-x-auto rounded-2xl bg-white shadow">

          <table className="w-full">

            <thead className="bg-black text-white">
              <tr>
                <th className="p-4 text-left">Image</th>
                <th className="p-4 text-left">Product</th>
                <th className="p-4 text-left">Category</th>
                <th className="p-4 text-left">Price</th>
                <th className="p-4 text-left">Stock</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>

              {loading ? (

                <tr>
                  <td
                    colSpan={7}
                    className="p-10 text-center text-gray-500"
                  >
                    Loading products...
                  </td>
                </tr>

              ) : filteredProducts.length === 0 ? (

                <tr>
                  <td
                    colSpan={7}
                    className="p-10 text-center text-gray-500"
                  >
                    No products found.
                  </td>
                </tr>

              ) : (

                filteredProducts.map((product) => (

                  <tr
                    key={product._id}
                    className="border-b hover:bg-gray-50"
                  >

                    <td className="p-4">
                      <Image
                        src={
                          product.images?.[0] ||
                          "/images/hero.jpg"
                        }
                        alt={product.title}
                        width={70}
                        height={70}
                        className="rounded-lg object-cover"
                      />
                    </td>

                    <td className="p-4">

                      <h3 className="font-bold">
                        {product.title}
                      </h3>

                      <div className="mt-2 flex flex-wrap gap-2">

                        {product.featured && (
                          <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                            ⭐ Featured
                          </span>
                        )}

                        {product.newArrival && (
                          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                            🆕 New
                          </span>
                        )}

                        {product.bestSeller && (
                          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                            🔥 Best Seller
                          </span>
                        )}

                      </div>

                    </td>

                    <td className="p-4">
                      {product.category}
                    </td>

                    <td className="p-4">
                      ₹{product.price.toLocaleString()}
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
                      {product.active ? (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                          Active
                        </span>
                      ) : (
                        <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
                          Inactive
                        </span>
                      )}
                    </td>

                    <td className="p-4">
                      <div className="flex justify-center gap-3">

                        <Link
                          href={`/admin/products/edit/${product._id}`}
                        >
                          <button className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700">
                            Edit
                          </button>
                        </Link>

                        <button
                          onClick={() => {
                            setSelectedId(product._id);
                            setDeleteModal(true);
                          }}
                          className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-700"
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

        {/* Delete Modal */}
        {deleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">

            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">

              <h2 className="text-2xl font-bold text-red-600">
                Delete Product
              </h2>

              <p className="mt-4 text-gray-600">
                Are you sure you want to permanently delete this product?
              </p>

              <div className="mt-8 flex justify-end gap-4">

                <button
                  onClick={() => {
                    setDeleteModal(false);
                    setSelectedId("");
                  }}
                  className="rounded-xl border px-5 py-2 hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    deleteProduct(selectedId);
                    setDeleteModal(false);
                    setSelectedId("");
                  }}
                  className="rounded-xl bg-red-600 px-5 py-2 font-semibold text-white hover:bg-red-700"
                >
                  Delete
                </button>

              </div>

            </div>

          </div>
        )}

      </div>
    </main>
  );
}
