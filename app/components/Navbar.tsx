"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useContext,
  useEffect,
  useState,
  type FormEvent,
} from "react";
import { CartContext } from "../context/CartContext";
import {
  FaBars,
  FaHeart,
  FaSearch,
  FaShoppingCart,
  FaTimes,
  FaUser,
} from "react-icons/fa";

interface WebsiteSettings {
  websiteName: string;
  tagline: string;
  logo: string;

  phone: string;
  phone2: string;
  whatsapp: string;

  announcementEnabled: boolean;
  announcementText: string;

  freeShippingAbove: string;
}

interface SearchProduct {
  _id: string;
  title: string;
  price: number;
  image?: string;
  images?: string[];
  category?: string;
}

const defaultSettings: WebsiteSettings = {
  websiteName: "Kashmir Royale",
  tagline: "Authentic Kashmiri Shawls Since 1995",
  logo: "/logo.png",

  phone: "+91 7298129017",
  phone2: "+91 7006819881",
  whatsapp: "+91 7006819881",

  announcementEnabled: true,
  announcementText:
    "🚚 FREE SHIPPING ABOVE ₹5000 • 🌍 WORLDWIDE SHIPPING",

  freeShippingAbove: "5000",
};

export default function Navbar() {
  const { cart, wishlist } = useContext(CartContext);

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const [settings, setSettings] =
    useState(defaultSettings);

  const [search, setSearch] = useState("");

  const [products, setProducts] =
    useState<SearchProduct[]>([]);

  const [searchLoading, setSearchLoading] =
    useState(false);

  const [searchOpen, setSearchOpen] =
    useState(false);

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const wishlistCount = wishlist.length;

 useEffect(() => {
  let cancelled = false;

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();

      if (!cancelled && data.success) {
        setSettings({
          ...defaultSettings,
          ...data.settings,
        });
      }
    } catch (error) {
      if (!cancelled) {
        console.error("Failed to load settings:", error);
      }
    }
  };

  fetchSettings();

  return () => {
    cancelled = true;
  };
}, []);

 

  async function loadProducts() {
    if (products.length > 0) {
      return;
    }

    try {
      setSearchLoading(true);

      const res = await fetch("/api/products");

      const data = await res.json();

      if (Array.isArray(data)) {
        setProducts(data);
      }
    } catch (error) {
      console.error(
        "Failed to load products:",
        error
      );
    } finally {
      setSearchLoading(false);
    }
  }

  const filteredProducts = products
    .filter((product) => {
      if (!search.trim()) {
        return false;
      }

      return product.title
        .toLowerCase()
        .includes(search.toLowerCase());
    })
    .slice(0, 6);

  const handleSearchFocus = () => {
    setSearchOpen(true);
    loadProducts();
  };

  const handleSearchChange = (
    value: string
  ) => {
    setSearch(value);
    setSearchOpen(true);

    if (value.trim()) {
      loadProducts();
    }
  };

  const goToSearch = () => {
  const query = search.trim();

  if (!query) {
    return;
  }

  window.location.href = `/products?search=${encodeURIComponent(
    query
  )}`;
};

const handleSearchSubmit = (
  event: FormEvent<HTMLFormElement>
) => {
  event.preventDefault();
  goToSearch();
};

  const clearSearch = () => {
    setSearch("");
    setSearchOpen(false);
  };

  const menuItems = [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Collections",
      href: "/#collections",
    },
    {
      title: "Contact",
      href: "/contact",
    },
  ];

  return (
    <>
      {/* Announcement Bar */}
      {settings.announcementEnabled && (
        <div className="fixed left-0 top-0 z-[60] w-full bg-yellow-500 px-4 py-2 text-center text-xs font-semibold text-black sm:text-sm">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <span>{settings.announcementText}</span>

            <span className="hidden md:inline">
              •
            </span>

            <span>📞 {settings.phone}</span>

            <span className="hidden md:inline">
              •
            </span>

            <span>{settings.phone2}</span>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav
        className={`fixed left-0 z-50 w-full border-b border-yellow-500/20 bg-black/90 text-white shadow-xl backdrop-blur-lg ${
          settings.announcementEnabled
            ? "top-10"
            : "top-0"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 sm:py-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex shrink-0 items-center gap-3"
          >
            <Image
              src={
                settings.logo || "/logo.png"
              }
              alt={settings.websiteName}
              width={70}
              height={70}
              priority
              className="h-12 w-12 object-contain sm:h-16 sm:w-16"
            />

            <div className="hidden sm:block">
              <h1 className="text-xl font-bold sm:text-2xl">
                {settings.websiteName}
              </h1>

              <p className="text-xs text-gray-300 sm:text-sm">
                {settings.tagline}
              </p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden items-center gap-6 xl:flex">
            {menuItems.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="whitespace-nowrap transition hover:text-yellow-400"
              >
                {item.title}
              </Link>
            ))}
          </div>

          {/* Desktop Search */}
          <div className="relative hidden min-w-0 flex-1 lg:block">
            <form
              onSubmit={handleSearchSubmit}
              className="relative"
            >
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  handleSearchChange(
                    e.target.value
                  )
                }
                onFocus={handleSearchFocus}
                placeholder="Search products..."
                className="w-full rounded-xl border border-white/20 bg-white/10 py-3 pl-11 pr-10 text-sm text-white outline-none transition placeholder:text-gray-400 focus:border-yellow-500 focus:bg-white/15"
              />

              {search && (
                <button
                  type="button"
                  onClick={clearSearch}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-white"
                >
                  <FaTimes />
                </button>
              )}
            </form>

            {/* Desktop Suggestions */}
            {searchOpen &&
              search.trim() && (
                <div
                  className="absolute left-0 right-0 top-full z-[70] mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white text-black shadow-2xl"
                  onMouseLeave={() =>
                    setSearchOpen(false)
                  }
                >
                  {searchLoading ? (
                    <div className="px-5 py-4 text-sm text-gray-500">
                      Searching products...
                    </div>
                  ) : filteredProducts.length >
                    0 ? (
                    <div className="max-h-[420px] overflow-y-auto">
                      {filteredProducts.map(
                        (product) => (
                          <Link
                            key={product._id}
                            href={`/product/${product._id}`}
                            onClick={() => {
                              setSearchOpen(false);
                              setSearch("");
                            }}
                            className="flex items-center gap-3 border-b border-gray-100 p-3 transition last:border-b-0 hover:bg-yellow-50"
                          >
                            <Image
                              src={
                                product.images?.[0] ||
                                product.image ||
                                "/placeholder.png"
                              }
                              alt={product.title}
                              width={55}
                              height={55}
                              className="h-14 w-14 rounded-lg object-cover"
                            />

                            <div className="min-w-0 flex-1">
                              <p className="line-clamp-1 font-semibold">
                                {product.title}
                              </p>

                              {product.category && (
                                <p className="text-xs text-gray-500">
                                  {product.category}
                                </p>
                              )}

                              <p className="mt-1 font-bold text-yellow-600">
                                ₹
                                {product.price.toLocaleString(
                                  "en-IN"
                                )}
                              </p>
                            </div>
                          </Link>
                        )
                      )}

                      <button
                        type="button"
                        onClick={goToSearch}
                        className="w-full bg-gray-50 px-4 py-3 text-sm font-bold text-yellow-700 transition hover:bg-yellow-50"
                      >
                        View all search results →
                      </button>
                    </div>
                  ) : (
                    <div className="px-5 py-5 text-center text-sm text-gray-500">
                      No products found.
                    </div>
                  )}
                </div>
              )}
          </div>

          {/* Desktop Right */}
          <div className="hidden items-center gap-4 lg:flex">
            <Link
              href="/wishlist"
              className="relative"
            >
              <FaHeart className="text-xl transition hover:text-yellow-400" />

              {wishlistCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              className="relative"
            >
              <FaShoppingCart className="text-xl transition hover:text-yellow-400" />

              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link href="/admin/login">
              <FaUser className="text-xl transition hover:text-yellow-400" />
            </Link>

            <Link href="/#collections">
              <span className="block rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 px-5 py-3 font-bold text-black transition hover:scale-105">
                Shop Now
              </span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen(
                !mobileMenuOpen
              )
            }
            aria-label="Toggle menu"
            className="ml-auto text-2xl lg:hidden"
          >
            {mobileMenuOpen ? (
              <FaTimes />
            ) : (
              <FaBars />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-yellow-500/20 bg-black/95 lg:hidden">
            <div className="flex flex-col px-4 py-5 sm:px-6">
              {/* Mobile Search */}
              <form
                onSubmit={handleSearchSubmit}
                className="relative mb-5"
              >
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    handleSearchChange(
                      e.target.value
                    )
                  }
                  onFocus={handleSearchFocus}
                  placeholder="Search products..."
                  className="w-full rounded-xl border border-white/20 bg-white/10 py-3 pl-11 pr-10 text-white outline-none placeholder:text-gray-400 focus:border-yellow-500"
                />

                {search && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    <FaTimes />
                  </button>
                )}
              </form>

              {/* Mobile Suggestions */}
              {searchOpen &&
                search.trim() && (
                  <div className="mb-5 overflow-hidden rounded-xl bg-white text-black shadow-xl">
                    {searchLoading ? (
                      <div className="px-4 py-4 text-sm text-gray-500">
                        Searching products...
                      </div>
                    ) : filteredProducts.length >
                      0 ? (
                      <div className="max-h-[350px] overflow-y-auto">
                        {filteredProducts.map(
                          (product) => (
                            <Link
                              key={product._id}
                              href={`/product/${product._id}`}
                              onClick={() => {
                                setSearchOpen(
                                  false
                                );
                                setSearch("");
                                setMobileMenuOpen(
                                  false
                                );
                              }}
                              className="flex items-center gap-3 border-b border-gray-100 p-3 last:border-b-0"
                            >
                              <Image
                                src={
                                  product.images?.[0] ||
                                  product.image ||
                                  "/placeholder.png"
                                }
                                alt={product.title}
                                width={50}
                                height={50}
                                className="h-12 w-12 rounded-lg object-cover"
                              />

                              <div className="min-w-0 flex-1">
                                <p className="line-clamp-1 font-semibold">
                                  {product.title}
                                </p>

                                <p className="text-sm font-bold text-yellow-600">
                                  ₹
                                  {product.price.toLocaleString(
                                    "en-IN"
                                  )}
                                </p>
                              </div>
                            </Link>
                          )
                        )}

                        <button
                          type="submit"
                          className="w-full bg-gray-50 px-4 py-3 text-sm font-bold text-yellow-700"
                        >
                          View all results →
                        </button>
                      </div>
                    ) : (
                      <div className="px-4 py-4 text-center text-sm text-gray-500">
                        No products found.
                      </div>
                    )}
                  </div>
                )}

              {/* Mobile Menu Links */}
              {menuItems.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  onClick={() =>
                    setMobileMenuOpen(false)
                  }
                  className="border-b border-gray-800 py-4 text-lg hover:text-yellow-400"
                >
                  {item.title}
                </Link>
              ))}

              {/* Mobile Wishlist */}
              <Link
                href="/wishlist"
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className="mt-5 flex items-center gap-3 rounded-xl border border-yellow-500/30 p-4"
              >
                <FaHeart />
                Wishlist ({wishlistCount})
              </Link>

              {/* Mobile Cart */}
              <Link
                href="/cart"
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className="mt-3 flex items-center gap-3 rounded-xl border border-yellow-500/30 p-4"
              >
                <FaShoppingCart />
                Cart ({cartCount})
              </Link>

              {/* Mobile Shop Now */}
              <Link
                href="/#collections"
                onClick={() =>
                  setMobileMenuOpen(false)
                }
              >
                <span className="mt-5 block w-full rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 py-4 text-center font-bold text-black">
                  Shop Now
                </span>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}