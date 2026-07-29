"use client";

import { products } from "../../../data/products";
import Image from "next/image";

export default function AdminProductsPage() {
  return (
    <main className="min-h-screen bg-gray-100 pt-32 px-8">
      <div className="max-w-7xl mx-auto">

        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold">
            Manage Products
          </h1>

          <button className="bg-yellow-500 hover:bg-yellow-400 px-6 py-3 rounded-xl font-bold">
            + Add Product
          </button>
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
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b">

                  <td className="p-4">
                    <Image
                      src={product.image}
                      alt={product.title}
                      width={70}
                      height={70}
                      className="rounded-lg"
                    />
                  </td>

                  <td className="p-4 font-semibold">
                    {product.title}
                  </td>

                  <td className="p-4">
                    ₹{product.price.toLocaleString()}
                  </td>

                  <td className="p-4">
                    {product.discount}
                  </td>

                  <td className="p-4">
                    ⭐ {product.rating}
                  </td>

                  <td className="p-4 flex justify-center gap-3">

                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                      Edit
                    </button>

                    <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                      Delete
                    </button>

                  </td>

                </tr>
              ))}
            </tbody>

          </table>

        </div>

      </div>
    </main>
  );
}