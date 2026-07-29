"use client";

import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import ProductCard from "./ProductCard";
import { products } from "../../data/products";

export default function Collections() {
  const { addToCart } = useContext(CartContext);

  return (
    <section id="collections" className="py-20 px-8">
      <h2 className="text-4xl font-bold text-center mb-12">
        Our Collections
      </h2>

      <div className="grid md:grid-cols-3 gap-8">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            image={product.image}
            title={product.title}
            description={product.description}
            price={`₹${product.price.toLocaleString()}`}
            oldPrice={`₹${product.oldPrice.toLocaleString()}`}
            discount={product.discount}
            rating={product.rating}
            onAddToCart={() =>
              addToCart({
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.image,
              })
            }
          />
        ))}
      </div>
    </section>
  );
}