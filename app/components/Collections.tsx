"use client";

import { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import ProductCard from "./ProductCard";
export default function Collections() {

type Product = {
  _id: string;
  title: string;
  description: string;
  price: number;
  oldPrice: number;
  discount: string;
  rating: string;
  image: string;
};

const [products, setProducts] = useState<Product[]>([]);

useEffect(() => {
  fetch("/api/products")
    .then((res) => res.json())
    .then((data) => setProducts(data))
    .catch((err) => console.error(err));
}, []);
  const { addToCart } = useContext(CartContext);

  return (
    <section id="collections" className="py-20 px-8">
      <h2 className="text-4xl font-bold text-center mb-12">
        Our Collections
      </h2>

      <div className="grid md:grid-cols-3 gap-8">
        {products.map((product) => (
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
    </section>
  );
}