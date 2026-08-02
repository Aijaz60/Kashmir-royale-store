"use client";

import { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import ProductCard from "./ProductCard";

type Product = {
  _id: string;
  title: string;
  description: string;
  price: number;
  oldPrice: number;
  discount: string;
  rating: string;
  image: string;
  category: string;
};

export default function Collections() {
  const { addToCart } = useContext(CartContext);

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");

 useEffect(() => {
  fetch("/api/products")
    .then((res) => res.json())
    .then((data) => {
      setProducts(Array.isArray(data) ? data : []);
    })
    .catch((err) => {
      console.error(err);
      setProducts([]);
    });
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
    <section id="collections" className="py-20 px-8">
      <div className="max-w-7xl mx-auto">

        <div className="flex justify-center mb-8">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md rounded-full border border-gray-300 px-5 py-3 outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-300"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {["All", "Shawls", "Pashmina", "Suits", "Stoles"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full font-semibold transition ${
                selectedCategory === cat
                  ? "bg-yellow-500 text-black"
                  : "bg-gray-200 hover:bg-yellow-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <h2 className="text-4xl font-bold text-center mb-12">
          Our Collections
        </h2>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-gray-500">
              No Products Found
            </h3>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                id={product._id}
                image={product.image}
                title={product.title}
                description={product.description}
                price={`₹${product.price.toLocaleString()}`}
                oldPrice={`₹${product.oldPrice.toLocaleString()}`}
                discount={product.discount}
                rating={product.rating}
                onAddToCart={() =>
                  addToCart({
                    id: product._id,
                    title: product.title,
                    price: product.price,
                    image: product.image,
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