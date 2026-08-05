"use client";

import { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import ProductCard from "./ProductCard";

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

export default function FeaturedProducts() {
  const { addToCart } = useContext(CartContext);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const res = await fetch("/api/products");

      const data = await res.json();

      if (Array.isArray(data)) {
        const featured = data.filter(
          (product: Product) =>
            product.featured === true &&
            product.active === true
        );

        setProducts(featured);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
    if (loading) {
    return (
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-10 text-center text-4xl font-bold">
            ⭐ Featured Products
          </h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-[420px] animate-pulse rounded-2xl bg-gray-200"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="mb-4 text-4xl font-bold">
            ⭐ Featured Products
          </h2>

          <p className="text-lg text-gray-500">
            No featured products available.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold">
            ⭐ Featured Products
          </h2>

          <p className="mt-3 text-gray-500">
            Discover our handpicked luxury collection.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {products.map((product) => (
            <ProductCard
              key={product._id}
              id={product._id}
              image={product.images?.[0] || "/placeholder.png"}
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
                  image: product.images?.[0] || "/placeholder.png",
                })
              }
            />
          ))}

        </div>

      </div>
    </section>
  );
}
