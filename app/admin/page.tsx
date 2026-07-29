"use client";

import Link from "next/link";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-gray-100 pt-32 px-8">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold mb-10">
          Admin Dashboard
        </h1>

        <div className="grid md:grid-cols-3 gap-8">

          <Link href="/admin/products">
            <div className="bg-white p-8 rounded-2xl shadow hover:shadow-xl transition cursor-pointer">
              <h2 className="text-2xl font-bold mb-2">
                Products
              </h2>
              <p className="text-gray-500">
                Add, Edit and Delete Products
              </p>
            </div>
          </Link>

          <div className="bg-white p-8 rounded-2xl shadow">
            <h2 className="text-2xl font-bold mb-2">
              Orders
            </h2>
            <p className="text-gray-500">
              Coming Soon
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow">
            <h2 className="text-2xl font-bold mb-2">
              Customers
            </h2>
            <p className="text-gray-500">
              Coming Soon
            </p>
          </div>

        </div>

      </div>
    </main>
  );
}