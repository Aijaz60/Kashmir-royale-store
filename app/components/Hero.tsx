"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  FaChevronLeft,
  FaChevronRight,
  FaWhatsapp,
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

const fallbackImages = [
  "/images/hero.jpg",
  "/images/shawl1.jpg",
  "/images/suit1.jpg",
];

const fallbackBanners: Banner[] = [
  {
    title: "Kashmir Royale Shawls",
    subtitle: "Authentic Kashmiri Craftsmanship Since 1995",
    buttonText: "View Collection",
    buttonLink: "#collections",
    image: "/images/hero.jpg",
    active: true,
  },
  {
    title: "Luxury Pashmina",
    subtitle: "Soft • Elegant • Handmade",
    buttonText: "Shop Now",
    buttonLink: "#collections",
    image: "/images/shawl1.jpg",
    active: true,
  },
  {
    title: "Premium Suits",
    subtitle: "Designed For Every Occasion",
    buttonText: "Explore",
    buttonLink: "#collections",
    image: "/images/suit1.jpg",
    active: true,
  },
];

export default function Hero() {
  const [banners, setBanners] =
    useState<Banner[]>(fallbackBanners);

  const [current, setCurrent] = useState(0);

  const [loading, setLoading] = useState(true);

  const [failedImages, setFailedImages] =
    useState<Record<number, boolean>>({});

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
    if (banners.length <= 1) {
      return;
    }

    const timer = setInterval(() => {
      setCurrent((prev) => {
        return (prev + 1) % banners.length;
      });
    }, 5000);

    return () => clearInterval(timer);
  }, [banners.length]);

  const nextSlide = () => {
    setCurrent((prev) => {
      return (prev + 1) % banners.length;
    });
  };

  const prevSlide = () => {
    setCurrent((prev) => {
      return prev === 0
        ? banners.length - 1
        : prev - 1;
    });
  };

  const getImage = (
    banner: Banner,
    index: number
  ) => {
    if (failedImages[index]) {
      return (
        fallbackImages[index % fallbackImages.length]
      );
    }

    if (!banner.image) {
      return (
        fallbackImages[index % fallbackImages.length]
      );
    }

    return banner.image;
  };

  if (loading) {
    return (
      <section className="relative flex h-screen items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-yellow-500 border-t-transparent" />

          <p className="text-lg">
            Loading banners...
          </p>
        </div>
      </section>
    );
  }

  if (!banners.length) {
    return (
      <section className="relative flex h-screen items-center justify-center overflow-hidden">
        <Image
          src="/images/hero.jpg"
          alt="Kashmir Royale"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 px-6 text-center text-white">
          <h1 className="text-5xl font-extrabold md:text-7xl">
            Kashmir Royale Shawls
          </h1>

          <p className="mt-5 text-xl text-yellow-300">
            Authentic Kashmiri Craftsmanship Since 1995
          </p>
        </div>
      </section>
    );
  }

  const activeBanner =
    banners[current] || banners[0];

  return (
    <section className="relative h-screen min-h-[650px] w-full overflow-hidden">
      {/* Background Images */}
      {banners.map((banner, index) => (
        <div
          key={banner._id ?? index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            current === index
              ? "z-10 opacity-100"
              : "z-0 opacity-0"
          }`}
        >
          <Image
            src={getImage(banner, index)}
            alt={banner.title}
            fill
            priority={index === 0}
            sizes="100vw"
            quality={85}
            className="object-cover"
            onError={() => {
              setFailedImages((prev) => ({
                ...prev,
                [index]: true,
              }));
            }}
          />

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/55" />
        </div>
      ))}

      {/* Main Content */}
      <div className="relative z-20 flex h-full items-center justify-center px-5 sm:px-6">
        <div className="w-full max-w-5xl text-center text-white">
          {/* Since 1995 Badge */}
          <div className="mx-auto mb-6 inline-block max-w-full rounded-full border border-yellow-500/40 bg-black/40 px-5 py-3 backdrop-blur-md sm:px-6">
            <span className="text-xs font-medium uppercase tracking-[0.22em] text-yellow-300 sm:text-sm sm:tracking-[0.35em]">
              Since 1995 • Authentic Kashmiri Craftsmanship
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl md:text-7xl lg:text-8xl">
            {activeBanner.title}
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-lg text-yellow-300 sm:text-xl md:text-3xl">
            {activeBanner.subtitle}
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-wrap justify-center gap-4 sm:mt-10 sm:gap-6">
            <a
              href={
                activeBanner.buttonLink ||
                "#collections"
              }
              className="rounded-xl bg-yellow-500 px-6 py-3 font-bold text-black transition hover:bg-yellow-400 sm:px-8 sm:py-4"
            >
              {activeBanner.buttonText ||
                "View Collection"}
            </a>

            <a
              href="https://wa.me/917298129017"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl border-2 border-white px-6 py-3 font-bold text-white transition hover:border-green-500 hover:bg-green-600 sm:px-8 sm:py-4"
            >
              <FaWhatsapp size={22} />
              WhatsApp Order
            </a>
          </div>
        </div>
      </div>

      {/* Previous Button */}
      {banners.length > 1 && (
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Previous banner"
          className="absolute left-4 top-1/2 z-30 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white backdrop-blur-md transition hover:bg-yellow-500 hover:text-black sm:left-5 sm:p-4"
        >
          <FaChevronLeft size={20} />
        </button>
      )}

      {/* Next Button */}
      {banners.length > 1 && (
        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next banner"
          className="absolute right-4 top-1/2 z-30 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white backdrop-blur-md transition hover:bg-yellow-500 hover:text-black sm:right-5 sm:p-4"
        >
          <FaChevronRight size={20} />
        </button>
      )}

      {/* Slider Dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 gap-3">
          {banners.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrent(index)}
              aria-label={`Go to banner ${index + 1}`}
              className={`h-3 rounded-full transition-all duration-300 ${
                current === index
                  ? "w-10 bg-yellow-400"
                  : "w-3 bg-white/60"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}