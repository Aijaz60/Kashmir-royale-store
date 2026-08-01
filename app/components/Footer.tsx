"use client";

import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-20 border-t border-yellow-600">
      <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-4 gap-10">

        {/* Brand */}
        <div>
          <h2 className="text-3xl font-bold text-yellow-500">
            Kashmir Royale
          </h2>

          <p className="mt-4 text-gray-400 leading-7">
            Premium Kashmiri Shawls & Pashmina handcrafted with tradition,
            elegance and luxury since 1995.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold text-yellow-500 mb-4">
            Quick Links
          </h3>

          <ul className="space-y-3">
            <li>
              <Link href="/" className="hover:text-yellow-400">
                Home
              </Link>
            </li>

            <li>
              <Link href="/#collections" className="hover:text-yellow-400">
                Collections
              </Link>
            </li>

            <li>
              <Link href="/cart" className="hover:text-yellow-400">
                Cart
              </Link>
            </li>

            <li>
              <Link href="/contact" className="hover:text-yellow-400">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-xl font-semibold text-yellow-500 mb-4">
            Contact
          </h3>

          <div className="space-y-4 text-gray-300">

            <div className="flex gap-3">
              <FaMapMarkerAlt className="mt-1 text-yellow-500" />
              <span>Srinagar, Jammu & Kashmir</span>
            </div>

            <div className="flex gap-3">
              <FaPhoneAlt className="mt-1 text-yellow-500" />
              <span>+91 72981 29017</span>
            </div>

            <div className="flex gap-3">
              <FaEnvelope className="mt-1 text-yellow-500" />
              <span>info@kashmirroyale.com</span>
            </div>

          </div>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-xl font-semibold text-yellow-500 mb-4">
            Follow Us
          </h3>

          <div className="flex gap-4 text-2xl">

            <a href="#" className="hover:text-yellow-400">
              <FaFacebookF />
            </a>

            <a href="#" className="hover:text-yellow-400">
              <FaInstagram />
            </a>

            <a
              href="https://wa.me/917298129017"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-400"
            >
              <FaWhatsapp />
            </a>

          </div>
        </div>

      </div>

      <div className="border-t border-gray-800 py-6 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} Kashmir Royale. All Rights Reserved.
      </div>
    </footer>
  );
}