"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

interface WebsiteSettings {
  websiteName: string;
  tagline: string;
  logo: string;

  phone: string;
  phone2: string;
  whatsapp: string;
  email: string;
  address: string;

  facebook: string;
  instagram: string;
  youtube: string;
  twitter: string;

  freeShippingAbove: string;
  indiaDeliveryDays: string;
  internationalDeliveryDays: string;
}

const defaultSettings: WebsiteSettings = {
  websiteName: "Kashmir Royale",
  tagline: "Authentic Kashmiri Shawls Since 1995",
  logo: "/logo.png",

  phone: "+91 7298129017",
  phone2: "+91 7006819881",
  whatsapp: "+91 7006819881",

  email: "info@kashmirroyale.com",
  address: "Srinagar, Jammu & Kashmir, India",

  facebook: "",
  instagram: "",
  youtube: "",
  twitter: "",

  freeShippingAbove: "5000",
  indiaDeliveryDays: "10",
  internationalDeliveryDays: "20",
};

export default function Footer() {
  const [settings, setSettings] =
    useState<WebsiteSettings>(defaultSettings);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();

      if (data.success) {
        setSettings({
          ...defaultSettings,
          ...data.settings,
        });
      }
    } catch (error) {
      console.error(error);
    }
  }
    return (
    <footer className="mt-20 border-t border-yellow-500/20 bg-black text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">

        {/* Brand */}
        <div>
          <h2 className="text-3xl font-bold text-yellow-500">
            {settings.websiteName}
          </h2>

          <p className="mt-4 leading-7 text-gray-400">
            {settings.tagline}
          </p>

          <div className="mt-6 space-y-3 text-gray-300">

            <div className="flex items-start gap-3">
              <FaMapMarkerAlt className="mt-1 text-yellow-500" />
              <span>{settings.address}</span>
            </div>

            <div className="flex items-center gap-3">
              <FaPhoneAlt className="text-yellow-500" />
              <span>{settings.phone}</span>
            </div>

            {settings.phone2 && (
              <div className="flex items-center gap-3">
                <FaPhoneAlt className="text-yellow-500" />
                <span>{settings.phone2}</span>
              </div>
            )}

            <div className="flex items-center gap-3">
              <FaEnvelope className="text-yellow-500" />
              <span>{settings.email}</span>
            </div>

          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="mb-5 text-xl font-semibold text-yellow-500">
            Quick Links
          </h3>

          <ul className="space-y-3">
            <li><Link href="/" className="hover:text-yellow-400">Home</Link></li>
            <li><Link href="/#collections" className="hover:text-yellow-400">Collections</Link></li>
            <li><Link href="/cart" className="hover:text-yellow-400">Cart</Link></li>
            <li><Link href="/contact" className="hover:text-yellow-400">Contact</Link></li>
          </ul>
        </div>

        {/* Shipping */}
        <div>
          <h3 className="mb-5 text-xl font-semibold text-yellow-500">
            Shipping
          </h3>

          <div className="space-y-4 text-gray-300">

            <p>
              🚚 Free Shipping Above ₹
              {settings.freeShippingAbove}
            </p>

            <p>
              🇮🇳 India Delivery:
              {" "}
              {settings.indiaDeliveryDays} Days
            </p>

            <p>
              🌍 International:
              {" "}
              {settings.internationalDeliveryDays} Days
            </p>

          </div>
        </div>

        {/* Social */}
        <div>
          <h3 className="mb-5 text-xl font-semibold text-yellow-500">
            Follow Us
          </h3>

          <div className="flex flex-wrap gap-4 text-2xl">

            {settings.facebook && (
              <a
                href={settings.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-yellow-400"
              >
                <FaFacebookF />
              </a>
            )}

            {settings.instagram && (
              <a
                href={settings.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-yellow-400"
              >
                <FaInstagram />
              </a>
            )}

            {settings.youtube && (
              <a
                href={settings.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-yellow-400"
              >
                <FaYoutube />
              </a>
            )}

            {settings.twitter && (
              <a
                href={settings.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-yellow-400"
              >
                <FaXTwitter />
              </a>
            )}

            <a
              href={`https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-green-400"
            >
              <FaWhatsapp />
            </a>

          </div>
        </div>

      </div>

      <div className="border-t border-gray-800 py-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} {settings.websiteName}. All Rights Reserved.
      </div>
    </footer>
  );
}
