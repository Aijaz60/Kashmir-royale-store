"use client";

import { useEffect, useState } from "react";
import ImageUploader from "../../components/admin/ImageUploader";

interface WebsiteSettings {
  websiteName: string;
  tagline: string;
  sinceYear: string;
  logo: string;

  phone: string;
  phone2: string;
  whatsapp: string;
  email: string;
  address: string;

  announcementEnabled: boolean;
  announcementText: string;

  shippingCharge: string;
  freeShippingAbove: string;
  indiaDeliveryDays: string;
  internationalDeliveryDays: string;

  facebook: string;
  instagram: string;
  youtube: string;
  twitter: string;

  metaTitle: string;
  metaDescription: string;
  keywords: string;
}

const initialState: WebsiteSettings = {
  websiteName: "",
  tagline: "",
  sinceYear: "1995",
  logo: "",

  phone: "",
  phone2: "",
  whatsapp: "",
  email: "",
  address: "",

  announcementEnabled: true,
  announcementText:
    "🚚 FREE SHIPPING ABOVE ₹5000 • 🌍 WORLDWIDE SHIPPING",

  shippingCharge: "",
  freeShippingAbove: "5000",
  indiaDeliveryDays: "10",
  internationalDeliveryDays: "20",

  facebook: "",
  instagram: "",
  youtube: "",
  twitter: "",

  metaTitle: "",
  metaDescription: "",
  keywords: "",
};

export default function WebsiteSettingsPage() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] =
    useState<WebsiteSettings>(initialState);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;

        if (data.success && data.settings) {
          setForm({
            ...initialState,
            ...data.settings,
          });
        }
      })
      .catch((error) => {
        if (!cancelled) {
          console.error(
            "Failed to load website settings:",
            error
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function saveSettings() {
    setLoading(true);

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        alert("✅ Website Settings Saved");
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-7xl rounded-2xl bg-white p-8 shadow-xl">

        <h1 className="mb-2 text-4xl font-bold">
          Website Settings
        </h1>

        <p className="mb-10 text-gray-500">
          Manage your store information, contact details,
          shipping, announcement bar and SEO.
        </p>

        {/* Store Information */}
        <div className="mb-10 rounded-2xl border bg-gray-50 p-6">

          <h2 className="mb-6 text-2xl font-bold">
            🏪 Store Information
          </h2>

          <div className="mb-8">
            <ImageUploader
              label="Website Logo"
              value={form.logo}
              onChange={(url) =>
                setForm({
                  ...form,
                  logo: url,
                })
              }
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">

            <input
              className="rounded-lg border p-3"
              placeholder="Website Name"
              value={form.websiteName}
              onChange={(e) =>
                setForm({
                  ...form,
                  websiteName: e.target.value,
                })
              }
            />

            <input
              className="rounded-lg border p-3"
              placeholder="Tagline"
              value={form.tagline}
              onChange={(e) =>
                setForm({
                  ...form,
                  tagline: e.target.value,
                })
              }
            />

            <input
              className="rounded-lg border p-3"
              placeholder="Since Year"
              value={form.sinceYear}
              onChange={(e) =>
                setForm({
                  ...form,
                  sinceYear: e.target.value,
                })
              }
            />

          </div>

        </div>

        {/* Contact Information */}
        <div className="mb-10 rounded-2xl border bg-gray-50 p-6">

          <h2 className="mb-6 text-2xl font-bold">
            📞 Contact Information
          </h2>

          <div className="grid gap-6 md:grid-cols-2">

            <input
              className="rounded-lg border p-3"
              placeholder="Phone Number 1"
              value={form.phone}
              onChange={(e) =>
                setForm({
                  ...form,
                  phone: e.target.value,
                })
              }
            />

            <input
              className="rounded-lg border p-3"
              placeholder="Phone Number 2"
              value={form.phone2}
              onChange={(e) =>
                setForm({
                  ...form,
                  phone2: e.target.value,
                })
              }
            />

            <input
              className="rounded-lg border p-3"
              placeholder="WhatsApp Number"
              value={form.whatsapp}
              onChange={(e) =>
                setForm({
                  ...form,
                  whatsapp: e.target.value,
                })
              }
            />

            <input
              className="rounded-lg border p-3"
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
            />

            <textarea
              rows={4}
              className="rounded-lg border p-3 md:col-span-2"
              placeholder="Business Address"
              value={form.address}
              onChange={(e) =>
                setForm({
                  ...form,
                  address: e.target.value,
                })
              }
            />

          </div>

        </div>

        {/* Announcement Bar */}
        <div className="mb-10 rounded-2xl border bg-gray-50 p-6">

          <h2 className="mb-6 text-2xl font-bold">
            📢 Announcement Bar
          </h2>

          <div className="grid gap-6">

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={form.announcementEnabled}
                onChange={(e) =>
                  setForm({
                    ...form,
                    announcementEnabled:
                      e.target.checked,
                  })
                }
              />

              Enable Announcement Bar
            </label>

            <textarea
              rows={3}
              className="rounded-lg border p-3"
              placeholder="Announcement Text"
              value={form.announcementText}
              onChange={(e) =>
                setForm({
                  ...form,
                  announcementText: e.target.value,
                })
              }
            />

          </div>

        </div>

        {/* Social Media */}
        <div className="mb-10 rounded-2xl border bg-gray-50 p-6">

          <h2 className="mb-6 text-2xl font-bold">
            🌐 Social Media
          </h2>

          <div className="grid gap-6 md:grid-cols-2">

            <input
              className="rounded-lg border p-3"
              placeholder="Facebook URL"
              value={form.facebook}
              onChange={(e) =>
                setForm({
                  ...form,
                  facebook: e.target.value,
                })
              }
            />

            <input
              className="rounded-lg border p-3"
              placeholder="Instagram URL"
              value={form.instagram}
              onChange={(e) =>
                setForm({
                  ...form,
                  instagram: e.target.value,
                })
              }
            />

            <input
              className="rounded-lg border p-3"
              placeholder="YouTube URL"
              value={form.youtube}
              onChange={(e) =>
                setForm({
                  ...form,
                  youtube: e.target.value,
                })
              }
            />

            <input
              className="rounded-lg border p-3"
              placeholder="X (Twitter) URL"
              value={form.twitter}
              onChange={(e) =>
                setForm({
                  ...form,
                  twitter: e.target.value,
                })
              }
            />

          </div>

        </div>

        {/* Shipping Settings */}
        <div className="mb-10 rounded-2xl border bg-gray-50 p-6">

          <h2 className="mb-6 text-2xl font-bold">
            🚚 Shipping Settings
          </h2>

          <div className="grid gap-6 md:grid-cols-2">

            <input
              className="rounded-lg border p-3"
              placeholder="Shipping Charge (₹)"
              value={form.shippingCharge}
              onChange={(e) =>
                setForm({
                  ...form,
                  shippingCharge: e.target.value,
                })
              }
            />

            <input
              className="rounded-lg border p-3"
              placeholder="Free Shipping Above (₹)"
              value={form.freeShippingAbove}
              onChange={(e) =>
                setForm({
                  ...form,
                  freeShippingAbove: e.target.value,
                })
              }
            />

            <input
              className="rounded-lg border p-3"
              placeholder="India Delivery Days"
              value={form.indiaDeliveryDays}
              onChange={(e) =>
                setForm({
                  ...form,
                  indiaDeliveryDays: e.target.value,
                })
              }
            />

            <input
              className="rounded-lg border p-3"
              placeholder="International Delivery Days"
              value={form.internationalDeliveryDays}
              onChange={(e) =>
                setForm({
                  ...form,
                  internationalDeliveryDays: e.target.value,
                })
              }
            />

          </div>

        </div>

        {/* SEO Settings */}
        <div className="mb-10 rounded-2xl border bg-gray-50 p-6">

          <h2 className="mb-6 text-2xl font-bold">
            🔍 SEO Settings
          </h2>

          <div className="grid gap-6">

            <input
              className="rounded-lg border p-3"
              placeholder="Meta Title"
              value={form.metaTitle}
              onChange={(e) =>
                setForm({
                  ...form,
                  metaTitle: e.target.value,
                })
              }
            />

            <textarea
              rows={4}
              className="rounded-lg border p-3"
              placeholder="Meta Description"
              value={form.metaDescription}
              onChange={(e) =>
                setForm({
                  ...form,
                  metaDescription: e.target.value,
                })
              }
            />

            <textarea
              rows={3}
              className="rounded-lg border p-3"
              placeholder="SEO Keywords (comma separated)"
              value={form.keywords}
              onChange={(e) =>
                setForm({
                  ...form,
                  keywords: e.target.value,
                })
              }
            />

          </div>

        </div>

        {/* Save Button */}
        <div className="flex justify-end">

          <button
            onClick={saveSettings}
            disabled={loading}
            className="rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 px-10 py-4 font-bold text-black transition-all duration-300 hover:scale-105 hover:from-yellow-400 hover:to-yellow-500 disabled:opacity-60"
          >
            {loading
              ? "Saving..."
              : "💾 Save Website Settings"}
          </button>

        </div>

      </div>
    </main>
  );
}