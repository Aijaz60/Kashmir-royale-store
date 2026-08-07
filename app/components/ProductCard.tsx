"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import toast from "react-hot-toast";

import {
  FaHeart,
  FaShoppingCart,
  FaStar,
  FaBolt,
} from "react-icons/fa";

import { CartContext } from "../context/CartContext";

type ProductCardProps = {
  id: string | number;
  image: string;
  title: string;
  description: string;
  price: string;
  oldPrice: string;
  discount: string;
  rating: string;
  stock: number;
  onAddToCart: () => void;
};

export default function ProductCard({
  id,
  image,
  title,
  description,
  price,
  oldPrice,
  discount,
  rating,
  stock,
  onAddToCart,
}: ProductCardProps) {
  const router = useRouter();

  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  } = useContext(CartContext);

  const wished = isInWishlist(id);

  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    onAddToCart();

    toast.success(`${title} added to cart`);

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 2000);
  };

  const handleBuyNow = () => {
    onAddToCart();

    toast.success(`${title} added to cart`);

    router.push("/checkout");
  };

  return (
    <div className="group overflow-hidden rounded-2xl border bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      {/* Product Image */}
      <div className="relative overflow-hidden">

        {discount && (
          <span className="absolute left-3 top-3 z-20 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white shadow">
            {discount}
          </span>
        )}

        <button
          onClick={() => {
            if (wished) {
              removeFromWishlist(id);
            } else {
              addToWishlist({
                id,
                title,
                price: Number(price.replace(/[₹,]/g, "")),
                image,
              });
            }
          }}
          className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg transition hover:scale-110"
        >
          <FaHeart
            className={`text-lg ${
              wished ? "text-red-600" : "text-gray-400"
            }`}
          />
        </button>

        <Link href={`/product/${id}`}>
          <Image
            src={image || "/images/no-image.png"}
            alt={title}
            width={600}
            height={600}
            sizes="(max-width:768px)100vw,(max-width:1200px)50vw,25vw"
            loading="lazy"
            className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </Link>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">

        <Link href={`/product/${id}`}>
          <h3 className="line-clamp-2 text-xl font-bold transition hover:text-yellow-600">
            {title}
          </h3>
        </Link>

        <div className="mt-3 flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <FaStar
              key={index}
              className={
                index < Math.round(Number(rating))
                  ? "text-yellow-500"
                  : "text-gray-300"
              }
            />
          ))}

          <span className="ml-2 text-sm text-gray-500">
            ({rating})
          </span>
        </div>

        <p className="mt-3 line-clamp-2 text-sm text-gray-600">
          {description}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3">

          <span className="text-2xl font-bold text-black">
            {price}
          </span>

          <span className="text-sm text-gray-400 line-through">
            {oldPrice}
          </span>

        </div>
                {/* Stock */}

        <div className="mt-4">

          {stock <= 0 ? (
            <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-600">
              ❌ Out of Stock
            </span>
          ) : stock <= 5 ? (
            <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-600">
              ⚠ Only {stock} Left
            </span>
          ) : (
            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
              ✅ In Stock ({stock})
            </span>
          )}

        </div>

        {/* Buttons */}

        <div className="mt-auto space-y-3 pt-6">

          <button
            onClick={handleAddToCart}
            disabled={stock <= 0}
            className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 font-bold transition ${
              stock <= 0
                ? "cursor-not-allowed bg-gray-300 text-white"
                : added
                ? "bg-green-600 text-white"
                : "bg-yellow-500 text-black hover:bg-yellow-400"
            }`}
          >
            {added ? (
              <>
                ✅ Added to Cart
              </>
            ) : (
              <>
                <FaShoppingCart />
                Add to Cart
              </>
            )}
          </button>

          <div className="grid grid-cols-2 gap-3">

            <button
              onClick={handleBuyNow}
              disabled={stock <= 0}
              className={`flex items-center justify-center gap-2 rounded-xl py-3 font-bold transition ${
                stock <= 0
                  ? "cursor-not-allowed bg-gray-300 text-white"
                  : "bg-black text-white hover:bg-gray-800"
              }`}
            >
              <FaBolt />
              Buy Now
            </button>

            <Link href={`/product/${id}`}>
              <button className="w-full rounded-xl border-2 border-black py-3 font-bold transition hover:bg-black hover:text-white">
                View Details
              </button>
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}