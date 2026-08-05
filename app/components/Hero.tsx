"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight, FaWhatsapp } from "react-icons/fa";

interface Banner {
  _id?: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  image: string;
  active: boolean;
}

const fallbackBanners: Banner[] = [
  {
    title: "Kashmir Royale Shawls",
    subtitle: "Authentic Kashmiri Craftsmanship Since 1995",
    buttonText: "View Collection",
    buttonLink: "#collections",
    image: "/images/banners/banner1.jpg",
    active: true,
  },
  {
    title: "Luxury Pashmina",
    subtitle: "Soft • Elegant • Handmade",
    buttonText: "Shop Now",
    buttonLink: "#collections",
    image: "/images/banners/banner2.jpg",
    active: true,
  },
  {
    title: "Premium Suits",
    subtitle: "Designed For Every Occasion",
    buttonText: "Explore",
    buttonLink: "#collections",
    image: "/images/banners/banner3.jpg",
    active: true,
  },
];

export default function Hero() {
  const [banners, setBanners] = useState<Banner[]>(fallbackBanners);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBanners();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [banners]);

  async function loadBanners() {
    try {
      const res = await fetch("/api/banners/active");

      const data = await res.json();

      if (data.success && data.banners.length > 0) {
        setBanners(data.banners);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrent((prev) =>
      prev === 0 ? banners.length - 1 : prev - 1
    );
  };
    if (loading) {
    return (
      <section className="relative flex h-screen items-center justify-center bg-black">
        <div className="text-xl font-semibold text-white">
          Loading banners...
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-screen overflow-hidden">

      {banners.map((banner, index) => (
        <div
          key={banner._id ?? index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            current === index ? "opacity-100 z-10" : "opacity-0"
          }`}
        >
          <Image
            src={banner.image}
            alt={banner.title}
            fill
            priority={index === 0}
            className="object-cover"
          />

          <div className="absolute inset-0 bg-black/60" />
        </div>
      ))}

      <div className="relative z-20 flex h-full items-center justify-center px-6">

        <div className="max-w-5xl text-center text-white">

          <div className="mb-6 inline-block rounded-full border border-yellow-500/40 bg-black/30 px-6 py-2 backdrop-blur-md">
            <span className="text-sm uppercase tracking-[0.35em] text-yellow-300">
              Since 1995 • Authentic Kashmiri Craftsmanship
            </span>
          </div>

          <h1 className="text-5xl font-extrabold leading-tight md:text-7xl lg:text-8xl">
            {banners[current].title}
          </h1>

          <p className="mt-5 text-xl text-yellow-300 md:text-3xl">
            {banners[current].subtitle}
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-6">

            <a
              href={banners[current].buttonLink || "#collections"}
              className="rounded-xl bg-yellow-500 px-8 py-4 font-bold text-black transition hover:bg-yellow-400"
            >
              {banners[current].buttonText || "View Collection"}
            </a>

            <a
              href="https://wa.me/917298129017"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl border-2 border-white px-8 py-4 font-bold text-white transition hover:border-green-600 hover:bg-green-600"
            >
              <FaWhatsapp size={22} />
              WhatsApp Order
            </a>

          </div>

        </div>

      </div>
            {/* Previous Button */}
      <button
        onClick={prevSlide}
        className="absolute left-5 top-1/2 z-30 -translate-y-1/2 rounded-full bg-black/40 p-4 text-white backdrop-blur-md transition-all duration-300 hover:bg-yellow-500 hover:text-black"
      >
        <FaChevronLeft size={22} />
      </button>

      {/* Next Button */}
      <button
        onClick={nextSlide}
        className="absolute right-5 top-1/2 z-30 -translate-y-1/2 rounded-full bg-black/40 p-4 text-white backdrop-blur-md transition-all duration-300 hover:bg-yellow-500 hover:text-black"
      >
        <FaChevronRight size={22} />
      </button>

      {/* Slider Dots */}
      <div className="absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 gap-3">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-3 rounded-full transition-all duration-300 ${
              current === index
                ? "w-10 bg-yellow-400"
                : "w-3 bg-white/60"
            }`}
          />
        ))}
      </div>

    </section>
  );
}