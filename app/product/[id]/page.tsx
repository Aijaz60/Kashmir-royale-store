"use client";

import ProductCard from "../../components/ProductCard";
import { CartContext } from "../../context/CartContext";
import { useState, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaStar,
  FaTruck,
  FaShieldAlt,
  FaHeart,
} from "react-icons/fa";

export default function ProductDetailsPage() {
  const images = [
    "/images/shawl1.jpg",
    "/images/shawl2.jpg",
  ];

  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useContext(CartContext);

  return (
    <main className="min-h-screen pt-32 px-8 bg-white">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">

        {/* Left */}
        <div>
          <Image
            src={selectedImage}
            alt="Premium Shawl"
            width={700}
            height={700}
            className="rounded-2xl shadow-xl w-full hover:scale-105 transition duration-500"
          />

          <div className="flex gap-4 mt-5">
            {images.map((img) => (
              <Image
                key={img}
                src={img}
                alt="Thumbnail"
                width={90}
                height={90}
                onClick={() => setSelectedImage(img)}
                className="rounded-lg border cursor-pointer hover:border-yellow-500"
              />
            ))}
          </div>
        </div>

        {/* Right */}
        <div>

          <div className="flex items-center justify-between">
            <h1 className="text-5xl font-bold">
              Premium Kashmiri Shawl
            </h1>

            <button className="border rounded-full p-3 hover:bg-red-100">
              <FaHeart className="text-red-500 text-xl" />
            </button>
          </div>

          <div className="flex items-center gap-2 mt-5">
            <FaStar className="text-yellow-500" />
            <FaStar className="text-yellow-500" />
            <FaStar className="text-yellow-500" />
            <FaStar className="text-yellow-500" />
            <FaStar className="text-yellow-500" />

            <span className="text-gray-500">
              (245 Reviews)
            </span>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <span className="text-4xl font-bold text-yellow-600">
              ₹4,999
            </span>

            <span className="line-through text-gray-500">
              ₹6,999
            </span>

            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm">
              29% OFF
            </span>
          </div>

          <p className="mt-6 text-gray-600 leading-8">
            Authentic handcrafted Kashmiri shawl made by experienced artisans.
            Soft, luxurious and perfect for every season.
          </p>

          <div className="space-y-3 mt-8">

            <div className="flex items-center gap-3">
              <FaTruck className="text-yellow-500" />
              <span>Free Shipping Across India</span>
            </div>

            <div className="flex items-center gap-3">
              <FaShieldAlt className="text-green-600" />
              <span>100% Secure Payment</span>
            </div>

          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4 mt-8">

            <button
              onClick={() =>
                quantity > 1 && setQuantity(quantity - 1)
              }
              className="border w-10 h-10 rounded-lg"
            >
              -
            </button>

            <span className="text-xl font-bold">
              {quantity}
            </span>

            <button
              onClick={() => setQuantity(quantity + 1)}
              className="border w-10 h-10 rounded-lg"
            >
              +
            </button>

          </div>

          {/* Buttons */}
          <div className="mt-10 space-y-4">

            <button
              onClick={() => {
                for (let i = 0; i < quantity; i++) {
                  addToCart({
                    id: 1,
                    title: "Premium Kashmiri Shawl",
                    price: 4999,
                    image: "/images/shawl1.jpg",
                  });
                }

                alert("Product Added to Cart");
              }}
              className="w-full bg-yellow-500 hover:bg-yellow-400 py-4 rounded-xl font-bold"
            >
              🛒 Add to Cart
            </button>

            <Link href="/checkout">
              <button className="w-full bg-black text-white py-4 rounded-xl font-bold">
                Buy Now
              </button>
            </Link>

            <Link
              href="/cart"
              className="block w-full border-2 border-black py-4 rounded-xl font-bold text-center hover:bg-black hover:text-white"
            >
              Go to Cart
            </Link>

          </div>

        </div>

      </div>

      {/* Related Products */}
      <section className="max-w-7xl mx-auto mt-20 pb-20">

        <h2 className="text-4xl font-bold text-center mb-10">
          Related Products
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          <ProductCard
          id={1}
  image="/images/shawl1.jpg"
  title="Premium Kashmiri Shawl"
  description="Soft handcrafted premium shawl."
  price="₹4,999"
  oldPrice="₹6,999"
  discount="29% OFF"
  rating="245"
  onAddToCart={() =>
    addToCart({
      id: 1,
      title: "Premium Kashmiri Shawl",
      price: 4999,
      image: "/images/shawl1.jpg",
    })
  }
/>

          <ProductCard
          id={2}
  image="/images/shawl2.jpg"
  title="Luxury Pashmina"
  description="Authentic handmade Pashmina."
  price="₹8,999"
  oldPrice="₹10,999"
  discount="18% OFF"
  rating="180"
  onAddToCart={() =>
    addToCart({
      id: 2,
      title: "Luxury Pashmina",
      price: 8999,
      image: "/images/shawl2.jpg",
    })
  }
/>

          <ProductCard
          id={3}
  image="/images/suit1.jpg"
  title="Designer Suit"
  description="Elegant designer suit collection."
  price="₹3,499"
  oldPrice="₹4,999"
  discount="30% OFF"
  rating="150"
  onAddToCart={() =>
    addToCart({
      id: 3,
      title: "Designer Suit",
      price: 3499,
      image: "/images/suit1.jpg",
    })
  }
/>

        </div>

      </section>
    </main>
  );
}