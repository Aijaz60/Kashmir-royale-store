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

  rating: number;

  image: string;
  images: string[];

  category: string;

  stock: number;

  featured?: boolean;
  newArrival?: boolean;
  bestSeller?: boolean;
  active?: boolean;
  reviews?: {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
}[];
};

export default function ProductDetailsPage() {
  const params = useParams();

  const {
  addToCart,
  addToWishlist,
  removeFromWishlist,
  isInWishlist,
} = useContext(CartContext);

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [reviewName, setReviewName] = useState("");
const [reviewRating, setReviewRating] = useState(5);
const [reviewComment, setReviewComment] = useState("");
const [submittingReview, setSubmittingReview] = useState(false);
async function submitReview() {
  if (
    !product ||
    !reviewName.trim() ||
    !reviewComment.trim()
  ) {
    alert("Please fill all review fields.");
    return;
  }

  setSubmittingReview(true);

  try {
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId: product._id,
        name: reviewName,
        rating: reviewRating,
        comment: reviewComment,
      }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Review submitted successfully!");

      setReviewName("");
      setReviewRating(5);
      setReviewComment("");

      window.location.reload();
    } else {
      alert(data.error || "Failed to submit review.");
    }
  } catch (error) {
    console.error(error);
    alert("Something went wrong.");
  } finally {
    setSubmittingReview(false);
  }
}
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

        setSelectedImage(
  data.images?.[0] || data.image || "/images/placeholder.jpg"
);
        const relatedRes = await fetch("/api/products");

if (relatedRes.ok) {
  const allProducts: Product[] = await relatedRes.json();

  

  const filtered = allProducts
    .filter(
      (item) =>
        item.category === data.category &&
        item._id !== data._id
    )
    .slice(0, 4);

  setRelatedProducts(filtered);
  
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
          
          <div className="overflow-hidden rounded-3xl border border-gray-200 shadow-2xl">
  <Image
    src={selectedImage}
    alt={product.title}
    width={700}
    height={700}
    priority
    className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
  />
</div>
<div className="mt-5 flex flex-wrap justify-center gap-3">
  {(product.images?.length
    ? product.images
    : [product.image]
  ).map((img, index) => (
    <button
      key={index}
      onClick={() => setSelectedImage(img)}
      className={`rounded-xl border-2 p-1 ${
        selectedImage === img
          ? "border-yellow-500"
          : "border-gray-300"
      }`}
    >
      <Image
        src={img}
        alt={`${product.title}-${index}`}
        width={90}
        height={90}
        className="rounded-lg object-cover"
      />
    </button>
  ))}
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

           <button
  onClick={() => {
    if (!product) return;

    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist({
        id: product._id,
        title: product.title,
        price: product.price,
        image:
          product.images?.[0] ||
          product.image ||
          "/images/placeholder.jpg",
      });
    }
  }}
  className="rounded-full border p-4 hover:bg-red-50 transition"
>
  <FaHeart
    className={`text-2xl ${
      product && isInWishlist(product._id)
        ? "text-red-600"
        : "text-gray-400"
    }`}
  />
</button>
          </div>

         <div className="mt-6 flex items-center gap-1">

  {[1, 2, 3, 4, 5].map((star) => (
    <FaStar
      key={star}
      className={
        star <= Math.round(product.rating)
          ? "text-yellow-500"
          : "text-gray-300"
      }
    />
  ))}

  <span className="ml-3 text-gray-600 font-medium">
    {product.rating}/5
  </span>

</div>
<div className="mt-8 rounded-2xl border border-yellow-200 bg-yellow-50 p-6">

  <div className="flex flex-wrap items-center gap-4">

    <span className="text-5xl font-extrabold text-yellow-600">
      ₹{product.price.toLocaleString()}
    </span>

    <span className="text-2xl text-gray-400 line-through">
      ₹{product.oldPrice.toLocaleString()}
    </span>

    <span className="rounded-full bg-red-600 px-3 py-1 text-white">
      {product.discount}
    </span>

  </div>

  <div className="mt-4">
    {product.stock > 0 ? (
      <span className="font-semibold text-green-600">
        🟢 In Stock ({product.stock})
      </span>
    ) : (
      <span className="font-semibold text-red-600">
        🔴 Out of Stock
      </span>
    )}
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
              disabled={product.stock <= 0}
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
  disabled={product.stock <= 0}
              onClick={() => {
                for (let i = 0; i < quantity; i++) {
                  addToCart({
                    id: product._id,
                    title: product.title,
                    price: product.price,
                    image:
  product.images?.[0] ||
  product.image ||
  "/images/placeholder.jpg"
                  });
                }

                alert("Product Added to Cart");
              }}
              className={`w-full rounded-xl py-4 text-lg font-bold transition ${
  product.stock > 0
    ? "bg-yellow-500 hover:bg-yellow-400"
    : "cursor-not-allowed bg-gray-400"
}`}
            >
              {product.stock > 0 ? "🛒 Add to Cart" : "Out of Stock"}
            </button>

            {product.stock > 0 ? (
  <Link href="/checkout">
    <button className="w-full rounded-xl bg-black py-4 text-lg font-bold text-white transition hover:bg-gray-900">
      ⚡ Buy Now
    </button>
  </Link>
) : (
  <button
    disabled
    className="w-full cursor-not-allowed rounded-xl bg-gray-400 py-4 text-lg font-bold text-white"
  >
    Out of Stock
  </button>
)}
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
  
  src={
    item.images?.find((img: string) => img.trim() !== "") ||
    item.image?.trim() ||
    "/images/placeholder.jpg"
  }
  alt={item.title || "Product"}
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

{/* Reviews */}
<div className="max-w-7xl mx-auto mt-20">
  <h2 className="mb-8 text-3xl font-bold">
    Customer Reviews
  </h2>

  <div className="rounded-2xl bg-gray-50 p-8 border">

    <input
      type="text"
      placeholder="Your Name"
      value={reviewName}
      onChange={(e) =>
        setReviewName(e.target.value)
      }
      className="mb-4 w-full rounded-lg border p-3"
    />

    <select
      value={reviewRating}
      onChange={(e) =>
        setReviewRating(Number(e.target.value))
      }
      className="mb-4 w-full rounded-lg border p-3"
    >
      <option value={5}>⭐⭐⭐⭐⭐ (5)</option>
      <option value={4}>⭐⭐⭐⭐ (4)</option>
      <option value={3}>⭐⭐⭐ (3)</option>
      <option value={2}>⭐⭐ (2)</option>
      <option value={1}>⭐ (1)</option>
    </select>

    <textarea
      rows={5}
      placeholder="Write your review..."
      value={reviewComment}
      onChange={(e) =>
        setReviewComment(e.target.value)
      }
      className="w-full rounded-lg border p-3"
    />

    <button
      onClick={submitReview}
      disabled={submittingReview}
      className="mt-5 rounded-xl bg-yellow-500 px-8 py-3 font-bold text-black hover:bg-yellow-400 disabled:opacity-50"
    >
      {submittingReview
        ? "Submitting..."
        : "Submit Review"}
    </button>
<div className="mt-10">
  <h3 className="mb-6 text-2xl font-bold">
    Customer Feedback
  </h3>

  {product.reviews?.length ? (
    <div className="space-y-6">
      {product.reviews.map((review) => (
        <div
          key={review._id}
          className="rounded-xl border bg-white p-5"
        >
          <div className="flex items-center justify-between">
            <h4 className="font-bold">
              {review.name}
            </h4>

            <span className="text-yellow-500">
              {"⭐".repeat(review.rating)}
            </span>
          </div>

          <p className="mt-3 text-gray-700">
            {review.comment}
          </p>

          <p className="mt-3 text-sm text-gray-500">
            {new Date(
              review.createdAt
            ).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  ) : (
    <p className="mt-6 text-gray-500">
      No reviews yet. Be the first to review this product.
    </p>
  )}
</div>
  </div>
</div>
           </main>

    <Footer />
  </>
);
}