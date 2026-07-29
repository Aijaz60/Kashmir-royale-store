"use client";

import Image from "next/image";
import Link from "next/link";

type ProductCardProps = {
  image: string;
  title: string;
  description: string;
  price: string;
  oldPrice: string;
  discount: string;
  rating: string;
  onAddToCart: () => void;
};

export default function ProductCard({
  image,
  title,
  description,
  price,
  oldPrice,
  discount,
  rating,
  onAddToCart,
}: ProductCardProps) {
  return (
    <div className="group border rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-500">

      <Image
        src={image}
        alt={title}
        width={500}
        height={500}
        className="w-full h-80 object-cover group-hover:scale-105 transition duration-500"
      />

      <div className="p-6 flex flex-col">

        <h3 className="text-2xl font-bold">
          {title}
        </h3>

        <div className="flex items-center mt-3 text-yellow-500">
          ★★★★★
          <span className="ml-2 text-gray-600 text-sm">
            ({rating})
          </span>
        </div>

        <p className="mt-3 text-gray-600">
          {description}
        </p>

        <div className="mt-4 flex items-center gap-3">
          <span className="text-2xl font-bold">
            {price}
          </span>

          <span className="line-through text-gray-500">
            {oldPrice}
          </span>

          <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">
            {discount}
          </span>
        </div>

        <div className="mt-6 space-y-3">

          <button
            onClick={onAddToCart}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-lg transition"
          >
            🛒 Add to Cart
          </button>

          <Link href="/product/1">
            <button className="w-full border border-black hover:bg-black hover:text-white font-bold py-3 rounded-lg transition">
              View Details
            </button>
          </Link>

        </div>

      </div>

    </div>
  );
}