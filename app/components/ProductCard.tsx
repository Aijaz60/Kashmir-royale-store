"use client";

import Image from "next/image";
import Link from "next/link";

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
  return (
    <div className="group overflow-hidden rounded-2xl border bg-white shadow-lg transition duration-500 hover:shadow-2xl">
      <Image
        src={image || "/images/no-image.png"}
        alt={title}
        width={500}
        height={500}
        className="h-80 w-full object-cover transition duration-500 group-hover:scale-105"
      />

      <div className="p-6">
        <h3 className="text-2xl font-bold">{title}</h3>

        <div className="mt-3 flex items-center text-yellow-500">
          ★★★★★
          <span className="ml-2 text-sm text-gray-600">
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

          <span className="text-gray-500 line-through">
            {oldPrice}
          </span>

          <span className="rounded bg-red-600 px-2 py-1 text-xs text-white">
            {discount}
          </span>
        </div>
        <div className="mt-3">
  {stock <= 0 ? (
    <p className="font-semibold text-red-600">
      ❌ Out of Stock
    </p>
  ) : stock <= 5 ? (
    <p className="font-semibold text-orange-500">
      ⚠️ Only {stock} left
    </p>
  ) : (
    <p className="font-semibold text-green-600">
      📦 In Stock ({stock})
    </p>
  )}
</div>

        <div className="mt-6 space-y-3">
          <button
            onClick={onAddToCart}
            disabled={stock <= 0}
            className={`w-full rounded-lg py-3 font-bold transition ${
  stock <= 0
    ? "bg-gray-400 cursor-not-allowed text-white"
    : "bg-yellow-500 hover:bg-yellow-400 text-black"
}`}
           >
            🛒 Add to Cart
          </button>

          <Link href={`/product/${id}`}>
            <button className="w-full rounded-lg border border-black py-3 font-bold transition hover:bg-black hover:text-white">
              View Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}