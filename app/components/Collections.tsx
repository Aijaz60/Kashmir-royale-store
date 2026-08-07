"use client";

import { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import ProductCard from "./ProductCard";

type Product = {
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
};

export default function Collections() {
  const { addToCart } = useContext(CartContext);

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();

        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error(error);
        setProducts([]);
      }
    }

    loadProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const categoryMatch =
      selectedCategory === "All" ||
      product.category.toLowerCase() === selectedCategory.toLowerCase();

    const searchMatch =
      product.title.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase());

    return categoryMatch && searchMatch;
  });

  return (
    <section id="collections" className="px-8 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex justify-center">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md rounded-full border border-gray-300 px-5 py-3 outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-300"
          />
        </div>

        <div className="mb-10 flex flex-wrap justify-center gap-4">
          {["All", "Shawls", "Pashmina", "Suits", "Stoles"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-5 py-2 font-semibold transition ${
                selectedCategory === cat
                  ? "bg-yellow-500 text-black"
                  : "bg-gray-200 hover:bg-yellow-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <h2 className="mb-12 text-center text-4xl font-bold">
          Our Collections
        </h2>

        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center">
            <h3 className="text-2xl font-bold text-gray-500">
              No Products Found
            </h3>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                id={product._id}
                image={
                  product.images?.[0] ||
                  product.image ||
                  "/placeholder.png"
                }
                title={product.title}
                description={product.description}
                price={`₹${product.price.toLocaleString()}`}
                oldPrice={`₹${product.oldPrice.toLocaleString()}`}
                discount={product.discount}
                rating={String(product.rating)}
                stock={product.stock ?? 0}
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
            ))}
          </div>
        )}
      </div>
    </section>
  );
}