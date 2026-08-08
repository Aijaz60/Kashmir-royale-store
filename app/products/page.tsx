"use client";

import { useContext, useEffect, useMemo, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
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
  image: string;
  images: string[];

  featured: boolean;
  newArrival: boolean;
  bestSeller: boolean;
  active: boolean;
}

export default function ProductsPage() {
  const { addToCart } = useContext(CartContext);

  const [products, setProducts] =
    useState<Product[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] = useState(() => {
    if (typeof window === "undefined") {
      return "";
    }

    return (
      new URLSearchParams(
        window.location.search
      ).get("search") || ""
    );
  });

  const [category, setCategory] =
    useState("All");

  const [sort, setSort] =
    useState("Newest");

  /*
   * Load products
   */
  useEffect(() => {
    let cancelled = false;

    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;

        if (Array.isArray(data)) {
          setProducts(data);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          console.error(
            "Failed to load products:",
            error
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * Categories
   */
  const categories = useMemo(() => {
    const categorySet = new Set(
      products.map(
        (product) => product.category
      )
    );

    return ["All", ...Array.from(categorySet)];
  }, [products]);

  /*
   * Filter + Search + Sort
   */
 const filteredProducts = useMemo(() => {
  const filtered = products.filter((product) => {
    /*
     * Search
     */
    if (search.trim()) {
      const searchText =
        search.toLowerCase().trim();

      const matchesSearch =
        product.title
          .toLowerCase()
          .includes(searchText) ||
        product.description
          .toLowerCase()
          .includes(searchText) ||
        product.category
          .toLowerCase()
          .includes(searchText);

      if (!matchesSearch) {
        return false;
      }
    }

    /*
     * Category
     */
    if (
      category !== "All" &&
      product.category !== category
    ) {
      return false;
    }

    return true;
  });

  /*
   * Sorting
   */
  if (sort === "Price Low") {
    return [...filtered].sort(
      (a, b) => a.price - b.price
    );
  }

  if (sort === "Price High") {
    return [...filtered].sort(
      (a, b) => b.price - a.price
    );
  }

  if (sort === "Rating") {
    return [...filtered].sort(
      (a, b) => b.rating - a.rating
    );
  }

  return filtered;
}, [
  products,
  search,
  category,
  sort,
]);

  /*
   * Loading Screen
   */
  if (loading) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6 pt-32">
          <p className="text-lg font-semibold text-gray-600">
            Loading Products...
          </p>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 px-6 pb-16 pt-32">
        <div className="mx-auto max-w-7xl">

          {/* Heading */}
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold sm:text-5xl">
              Our Products
            </h1>

            <p className="mt-3 text-lg text-gray-500">
              Explore our complete collection
              of authentic Kashmiri products.
            </p>
          </div>

          {/* Filters */}
          <div className="mb-10 grid gap-4 md:grid-cols-3">

            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="🔍 Search products..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="w-full rounded-xl border bg-white p-4 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200"
              />

              {search && (
                <button
                  type="button"
                  onClick={() =>
                    setSearch("")
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-black"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category */}
            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              className="rounded-xl border bg-white p-4 outline-none transition focus:border-yellow-500"
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

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) =>
                setSort(e.target.value)
              }
              className="rounded-xl border bg-white p-4 outline-none transition focus:border-yellow-500"
            >
              <option value="Newest">
                Newest
              </option>

              <option value="Price Low">
                Price Low
              </option>

              <option value="Price High">
                Price High
              </option>

              <option value="Rating">
                Rating
              </option>
            </select>

          </div>

          {/* Result Count */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3 text-gray-600">

            <p>
              Showing{" "}
              <span className="font-bold text-black">
                {filteredProducts.length}
              </span>{" "}
              Products
            </p>

            {search && (
              <p className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-800">
                Search: &quot;{search}&quot;
              </p>
            )}

          </div>

          {/* Products Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

            {filteredProducts.length === 0 ? (
              <div className="col-span-full rounded-2xl border bg-white p-12 text-center">

                <div className="text-5xl">
                  🔍
                </div>

                <h2 className="mt-5 text-2xl font-bold">
                  No Products Found
                </h2>

                <p className="mt-4 text-gray-500">
                  Try changing your search or
                  filters.
                </p>

                {search && (
                  <button
                    type="button"
                    onClick={() =>
                      setSearch("")
                    }
                    className="mt-6 rounded-xl bg-yellow-500 px-6 py-3 font-bold text-black transition hover:bg-yellow-400"
                  >
                    Clear Search
                  </button>
                )}

              </div>
            ) : (
              filteredProducts.map(
                (product) => (
                  <ProductCard
                    key={product._id}
                    id={product._id}
                    image={
                      product.images?.[0] ||
                      product.image ||
                      "/placeholder.png"
                    }
                    title={product.title}
                    description={
                      product.description
                    }
                    price={`₹${product.price.toLocaleString(
                      "en-IN"
                    )}`}
                    oldPrice={`₹${product.oldPrice.toLocaleString(
                      "en-IN"
                    )}`}
                    discount={
                      product.discount
                    }
                    rating={String(
                      product.rating
                    )}
                    stock={product.stock}
                    onAddToCart={() =>
                      addToCart({
                        id: product._id,
                        title: product.title,
                        price: product.price,
                        image:
                          product.images?.[0] ||
                          product.image ||
                          "/placeholder.png",
                      })
                    }
                  />
                )
              )
            )}

          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}