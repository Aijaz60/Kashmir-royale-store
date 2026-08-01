"use client";

import { useState, useEffect, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  FaHeart,
  FaStar,
  FaTruck,
  FaShieldAlt,
  FaWhatsapp,
} from "react-icons/fa";

import { CartContext } from "../../context/CartContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

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

export default function ProductDetailsPage() {
  const params = useParams();

  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(`/api/product/${params.id}`);

        if (!res.ok) {
          setLoading(false);
          return;
        }

        const data: Product = await res.json();

        setProduct(data);

        setSelectedImage(data.image);
        const relatedRes = await fetch("/api/products");

if (relatedRes.ok) {
  const allProducts: Product[] = await relatedRes.json();

  console.log("Current Product Category:", data.category);
console.log("All Products:", allProducts);
  const filtered = allProducts
    .filter(
      (item) =>
        item.category === data.category &&
        item._id !== data._id
    )
    .slice(0, 4);

  setRelatedProducts(filtered);
  console.log("Filtered Products:", filtered);
}
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [params.id]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">
          Loading Product...
        </h1>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">
          Product Not Found
        </h1>
      </main>
    );
  }

  return (
  <>
    <Navbar />

    <main className="min-h-screen bg-white pt-32 px-8">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16">

          {/* Left Side */}
        <div>
          <Image
            src={selectedImage}
            alt={product.title}
            width={700}
            height={700}
            className="w-full rounded-3xl border border-gray-200 shadow-2xl"
          />

          <div className="mt-5 flex justify-center">
            <button
              onClick={() => setSelectedImage(product.image)}
              className={`rounded-xl border-2 p-1 ${
                selectedImage === product.image
                  ? "border-yellow-500"
                  : "border-gray-300"
              }`}
            >
              <Image
                src={product.image}
                alt={product.title}
                width={90}
                height={90}
                className="rounded-lg"
              />
            </button>
          </div>
        </div>

        {/* Right Side */}
        <div>
          <div className="inline-block rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-700">
            ✨ Authentic Kashmiri Craftsmanship Since 1995
          </div>

          <div className="mt-6 flex items-start justify-between">
            <div>
              <h1 className="text-5xl font-extrabold">
                {product.title}
              </h1>

              <p className="mt-3 text-lg text-gray-500">
                Handwoven Luxury Collection
              </p>
            </div>

            <button className="rounded-full border p-4 hover:bg-red-50">
              <FaHeart className="text-2xl text-red-500" />
            </button>
          </div>

          <div className="mt-6 flex items-center gap-2 text-yellow-500">
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />

            <span className="ml-2 text-gray-500">
              ({product.rating})
            </span>
          </div>

          <div className="mt-8 rounded-2xl border border-yellow-200 bg-yellow-50 p-6">
            <div className="flex items-center gap-4">
              <span className="text-5xl font-extrabold text-yellow-600">
                ₹{product.price.toLocaleString()}
              </span>

              <span className="text-2xl text-gray-400 line-through">
                ₹{product.oldPrice.toLocaleString()}
              </span>

              <span className="rounded-full bg-red-600 px-3 py-1 text-white">
                {product.discount}% OFF
              </span>
            </div>
          </div>

          <p className="mt-8 leading-8 text-gray-600">
            {product.description}
          </p>

          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-3">
              <FaTruck className="text-yellow-500" />
              Free Shipping Across India
            </div>

            <div className="flex items-center gap-3">
              <FaShieldAlt className="text-green-600" />
              100% Secure Payment
            </div>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <button
              onClick={() =>
                quantity > 1 && setQuantity(quantity - 1)
              }
              className="h-10 w-10 rounded border"
            >
              -
            </button>

            <span className="text-xl font-bold">
              {quantity}
            </span>

            <button
              onClick={() => setQuantity(quantity + 1)}
              className="h-10 w-10 rounded border"
            >
              +
            </button>
          </div>

          <div className="mt-10 space-y-4">

                    <button
              onClick={() => {
                for (let i = 0; i < quantity; i++) {
                  addToCart({
                    id: product._id,
                    title: product.title,
                    price: product.price,
                    image: product.image,
                  });
                }

                alert("Product Added to Cart");
              }}
              className="w-full rounded-xl bg-yellow-500 py-4 text-lg font-bold transition hover:bg-yellow-400"
            >
              🛒 Add to Cart
            </button>

            <Link href="/checkout">
              <button className="w-full rounded-xl bg-black py-4 text-lg font-bold text-white transition hover:bg-gray-900">
                ⚡ Buy Now
              </button>
            </Link>

            <a
              href={`https://wa.me/917298129017?text=${encodeURIComponent(
                `Hello, I want to order "${product.title}" for ₹${product.price}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-4 text-lg font-bold text-white transition hover:bg-green-700"
            >
              <FaWhatsapp className="text-2xl" />
              WhatsApp Order
            </a>

            <Link
              href="/cart"
              className="block w-full rounded-xl border-2 border-black py-4 text-center text-lg font-bold transition hover:bg-black hover:text-white"
            >
              View Cart
            </Link>
          </div>
        </div>
      </div>
      {/* Related Products */}
<div className="max-w-7xl mx-auto mt-20">
  <h2 className="text-3xl font-bold mb-8">
    Related Products
  </h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
    {relatedProducts.map((item) => (
      <Link key={item._id} href={`/product/${item._id}`}>
        <div className="rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition overflow-hidden cursor-pointer">

          <Image
            src={item.image}
            alt={item.title}
            width={400}
            height={400}
            className="w-full h-72 object-cover"
          />

          <div className="p-5">
            <h3 className="font-bold text-lg line-clamp-2">
              {item.title}
            </h3>

            <p className="mt-3 text-yellow-600 font-bold text-xl">
              ₹{item.price.toLocaleString()}
            </p>

            <p className="text-gray-400 line-through">
              ₹{item.oldPrice.toLocaleString()}
            </p>
          </div>

        </div>
      </Link>
    ))}
  </div>
</div>
           </main>

    <Footer />
  </>
);
}