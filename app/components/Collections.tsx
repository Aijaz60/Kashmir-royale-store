"use client";

import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import ProductCard from "./ProductCard";

export default function Collections() {
  const { cart, setCart } = useContext(CartContext);
  const addToCart = (product: any) => {
  const existing = cart.find((item: any) => item.id === product.id);

  if (existing) {
    setCart(
      cart.map((item: any) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  } else {
    setCart([...cart, { ...product, quantity: 1 }]);
  }
};

  return (
    <section id="collections" className="py-20 px-8">
      <h2 className="text-4xl font-bold text-center mb-12">
        Our Collections
      </h2>

      <div className="grid md:grid-cols-3 gap-8">

        <ProductCard
          image="/images/shawl1.jpg"
          title="Premium Shawls"
          description="Elegant handcrafted Kashmiri shawls."
          price="₹4,999"
          oldPrice="₹6,499"
          discount="23% OFF"
          rating="4.9"
          onAddToCart={() =>
  addToCart({
    id: 1,
    title: "Premium Shawls",
    price: 4999,
    image: "/images/shawl1.jpg",
  })
}
        />

        <ProductCard
          image="/images/shawl2.jpg"
          title="Authentic Pashmina"
          description="Soft and luxurious authentic Pashmina."
          price="₹8,999"
          oldPrice="₹11,999"
          discount="25% OFF"
          rating="5.0"
          onAddToCart={() =>
  addToCart({
    id: 2,
    title: "Authentic Pashmina",
    price: 8999,
    image: "/images/shawl2.jpg",
  })
}
        />

        <ProductCard
          image="/images/suit1.jpg"
          title="Designer Suits"
          description="Beautiful premium designer suits."
          price="₹2,999"
          oldPrice="₹3,999"
          discount="25% OFF"
          rating="4.8"
          onAddToCart={() =>
  addToCart({
    id: 3,
    title: "Designer Suits",
    price: 2999,
    image: "/images/suit1.jpg",
  })
}
        />

      </div>
    </section>
  );
}