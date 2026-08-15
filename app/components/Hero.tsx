"use client";

import { useEffect, useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

interface Banner {
  _id?: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  image: string;
  active: boolean;
}

export default function Hero() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBanners() {
      try {
        const res = await fetch("/api/banners/active", {
          cache: "no-store",
        });

        const data = await res.json();

        if (
          data.success &&
          Array.isArray(data.banners) &&
          data.banners.length > 0
        ) {
          setBanners(data.banners);
        }
      } catch (error) {
        console.error("Failed to load banners:", error);
      } finally {
        setLoading(false);
      }
    }

    loadBanners();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [banners.length]);

  function nextSlide() {
    setCurrent((prev) => (prev + 1) % banners.length);
  }

  function prevSlide() {
    setCurrent((prev) =>
      prev === 0 ? banners.length - 1 : prev - 1
    );
  }

  if (loading) {
    return (
      <section className="flex min-h-[250px] items-center justify-center bg-black sm:min-h-[400px]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-yellow-500 border-t-transparent" />
      </section>
    );
  }

  if (banners.length === 0) {
    return null;
  }

  const banner = banners[current];

  return (
    <section className="relative w-full overflow-hidden bg-black">

      {/* FULL BANNER IMAGE */}
      <div className="relative w-full">
        <a
          href={banner.buttonLink || "#collections"}
          className="block w-full"
          aria-label={banner.buttonText || banner.title}
        >
          <img
            src={banner.image}
            alt={banner.title || "Kashmir Royale Banner"}
            className="block h-auto w-full object-contain"
            loading="eager"
          />
        </a>
      </div>

      {/* PREVIOUS BUTTON */}
      {banners.length > 1 && (
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Previous banner"
          className="
            absolute left-2 top-1/2 z-20
            -translate-y-1/2
            rounded-full
            bg-black/60
            p-3
            text-white
            shadow-lg
            backdrop-blur-sm
            transition
            hover:bg-yellow-500
            hover:text-black
            sm:left-5
            sm:p-4
          "
        >
          <FaChevronLeft size={18} />
        </button>
      )}

      {/* NEXT BUTTON */}
      {banners.length > 1 && (
        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next banner"
          className="
            absolute right-2 top-1/2 z-20
            -translate-y-1/2
            rounded-full
            bg-black/60
            p-3
            text-white
            shadow-lg
            backdrop-blur-sm
            transition
            hover:bg-yellow-500
            hover:text-black
            sm:right-5
            sm:p-4
          "
        >
          <FaChevronRight size={18} />
        </button>
      )}

      {/* SLIDER DOTS */}
      {banners.length > 1 && (
        <div
          className="
            absolute bottom-3 left-1/2 z-20
            flex -translate-x-1/2
            gap-2
            sm:bottom-5
            sm:gap-3
          "
        >
          {banners.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrent(index)}
              aria-label={`Go to banner ${index + 1}`}
              className={`
                h-2.5 rounded-full
                transition-all duration-300
                ${
                  current === index
                    ? "w-8 bg-yellow-400"
                    : "w-2.5 bg-white/70"
                }
              `}
            />
          ))}
        </div>
      )}
    </section>
  );
}