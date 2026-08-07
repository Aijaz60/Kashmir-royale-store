"use client";

import { useContext, useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { CartContext } from "../context/CartContext";

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

  images: string[];

  featured: boolean;
  newArrival: boolean;
  bestSeller: boolean;
  active: boolean;
}

export default function ProductsPage() {
  const { addToCart } = useContext(CartContext);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("Newest");

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const res = await fetch("/api/products");

      const data = await res.json();

      if (Array.isArray(data)) {
       setProducts(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  const categories = useMemo(() => {
  const list = [
    "All",
    ...new Set(products.map((p) => p.category)),
  ];

  return list;
}, [products]);

const filteredProducts = useMemo(() => {
  let filtered = [...products];

  // Search
  if (search.trim()) {
    filtered = filtered.filter((product) =>
      product.title
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }

  // Category
  if (category !== "All") {
    filtered = filtered.filter(
      (product) =>
        product.category === category
    );
  }

  // Sorting
  switch (sort) {
    case "Price Low":
      filtered.sort(
        (a, b) => a.price - b.price
      );
      break;

    case "Price High":
      filtered.sort(
        (a, b) => b.price - a.price
      );
      break;

    case "Rating":
      filtered.sort(
        (a, b) => b.rating - a.rating
      );
      break;

    default:
      break;
  }

  return filtered;
}, [products, search, category, sort]);

if (loading) {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <h1 className="text-3xl font-bold">
        Loading Products...
      </h1>
    </main>
  );
}
return (
  <>
    <Navbar />

    <main className="min-h-screen bg-gray-50 pt-32 px-6 pb-16">
      <div className="mx-auto max-w-7xl">

        <div className="mb-10 text-center">
          <h1 className="text-5xl font-bold">
            Our Products
          </h1>

          <p className="mt-3 text-lg text-gray-500">
            Explore our complete collection of authentic
            Kashmiri products.
          </p>
        </div>

        {/* Filters */}

        <div className="mb-10 grid gap-4 md:grid-cols-3">

          <input
            type="text"
            placeholder="🔍 Search products..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="rounded-xl border p-4"
          />

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            className="rounded-xl border p-4"
          >
            {categories.map((cat) => (
              <option
                key={cat}
                value={cat}
              >
                {cat}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) =>
              setSort(e.target.value)
            }
            className="rounded-xl border p-4"
          >
            <option>Newest</option>
            <option>Price Low</option>
            <option>Price High</option>
            <option>Rating</option>
          </select>

        </div>

        <div className="mb-8 text-gray-600">
          Showing{" "}
          <span className="font-bold">
            {filteredProducts.length}
          </span>{" "}
          Products
        </div>

       <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
  {filteredProducts.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <h2 className="text-3xl font-bold">
                No Products Found
              </h2>

              <p className="mt-4 text-gray-500">
                Try changing your search or filters.
              </p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                id={product._id}
                image={
                  product.images?.[0] ||
                  "/placeholder.png"
                }
                title={product.title}
                description={product.description}
                price={`₹${product.price.toLocaleString()}`}
                oldPrice={`₹${product.oldPrice.toLocaleString()}`}
                discount={product.discount}
                rating={String(product.rating)}
                stock={product.stock}
                onAddToCart={() =>
                  addToCart({
                    id: product._id,
                    title: product.title,
                    price: product.price,
                    image:
                      product.images?.[0] ||
                      "/placeholder.png",
                  })
                }
              />
            ))
          )}
        </div>

      </div>
    </main>

    <Footer />
  </>
);
}
