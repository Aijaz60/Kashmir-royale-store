"use client";

import { useEffect, useState } from "react";
import ImageUploader from "../../components/admin/ImageUploader";

interface Banner {
  _id?: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  image: string;
  active: boolean;
}

export default function BannerManagerPage() {
  const [loading, setLoading] = useState(false);

  const [banners, setBanners] = useState<Banner[]>([]);

  const [banner, setBanner] = useState<Banner>({
    title: "",
    subtitle: "",
    buttonText: "",
    buttonLink: "",
    image: "",
    active: true,
  });

  useEffect(() => {
    loadBanners();
  }, []);

  async function loadBanners() {
    try {
      const res = await fetch("/api/banners");
      const data = await res.json();

      if (data.success) {
        setBanners(data.banners);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function saveBanner() {
    setLoading(true);

    try {
      const res = await fetch("/api/banners", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(banner),
      });

      const data = await res.json();

      if (data.success) {
        alert("✅ Banner Saved Successfully");

        setBanner({
          title: "",
          subtitle: "",
          buttonText: "",
          buttonLink: "",
          image: "",
          active: true,
        });

        loadBanners();
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }

    setLoading(false);
  }

  async function deleteBanner(id: string) {
  const ok = confirm("Are you sure you want to delete this banner?");

  if (!ok) return;

  try {
    const res = await fetch(`/api/banners?id=${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (data.success) {
      alert("✅ Banner Deleted");

      loadBanners();
    } else {
      alert(data.error);
    }
  } catch (error) {
    console.error(error);
    alert("Delete failed.");
  }
}
    return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-5xl rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="mb-8 text-4xl font-bold">
          Banner Manager
        </h1>

        <div className="mb-8">
          <ImageUploader
            label="Hero Banner"
            value={banner.image}
            onChange={(url: string) =>
              setBanner({
                ...banner,
                image: url,
              })
            }
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <input
            className="rounded-lg border p-3"
            placeholder="Banner Title"
            value={banner.title}
            onChange={(e) =>
              setBanner({
                ...banner,
                title: e.target.value,
              })
            }
          />

          <input
            className="rounded-lg border p-3"
            placeholder="Subtitle"
            value={banner.subtitle}
            onChange={(e) =>
              setBanner({
                ...banner,
                subtitle: e.target.value,
              })
            }
          />

          <input
            className="rounded-lg border p-3"
            placeholder="Button Text"
            value={banner.buttonText}
            onChange={(e) =>
              setBanner({
                ...banner,
                buttonText: e.target.value,
              })
            }
          />

          <input
            className="rounded-lg border p-3"
            placeholder="Button Link"
            value={banner.buttonLink}
            onChange={(e) =>
              setBanner({
                ...banner,
                buttonLink: e.target.value,
              })
            }
          />
        </div>

        <label className="mt-8 flex items-center gap-3">
          <input
            type="checkbox"
            checked={banner.active}
            onChange={(e) =>
              setBanner({
                ...banner,
                active: e.target.checked,
              })
            }
          />

          Active Banner
        </label>

        <button
          onClick={saveBanner}
          disabled={loading}
          className="mt-8 rounded-xl bg-yellow-600 px-8 py-3 font-bold text-white hover:bg-yellow-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Banner"}
        </button>

        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-bold">
            Existing Banners
          </h2>

          {banners.length === 0 ? (
            <p className="text-gray-500">
              No banners added yet.
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {banners.map((item) => (
                <div
                  key={item._id}
                  className="overflow-hidden rounded-2xl border bg-white shadow-md"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-56 w-full object-cover"
                  />

                  <div className="p-5">
                    <h3 className="text-xl font-bold">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-gray-600">
                      {item.subtitle}
                    </p>

                    <span
                      className={`mt-4 inline-block rounded-full px-3 py-1 text-sm font-semibold ${
                        item.active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.active ? "Active" : "Inactive"}
                    </span>
                    <div className="mt-5 flex gap-3">
  <button
    onClick={() => deleteBanner(item._id!)}
    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
  >
    🗑 Delete
  </button>
</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}