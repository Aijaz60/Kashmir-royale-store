"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

interface Product {
  title: string;
  description: string;

  price: number;
  oldPrice: number;

  discount: string;
  rating: number;

  category: string;

  stock: number;

  images: string[];

  featured: boolean;
  newArrival: boolean;
  bestSeller: boolean;
  active: boolean;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();

  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [product, setProduct] = useState<Product>({
    title: "",
    description: "",

    price: 0,
    oldPrice: 0,

    discount: "",
    rating: 5,

    category: "Shawls",

    stock: 0,

    images: [],

    featured: false,
    newArrival: false,
    bestSeller: false,
    active: true,
  });

  useEffect(() => {
    loadProduct();
  }, []);

  async function loadProduct() {
    try {
      const res = await fetch(`/api/product/${id}`);

      const data = await res.json();

      setProduct({
        title: data.title || "",
        description: data.description || "",

        price: Number(data.price || 0),
        oldPrice: Number(data.oldPrice || 0),

        discount: data.discount || "",
        rating: isNaN(Number(data.rating))
  ? 5
  : Number(data.rating),

        category: data.category || "Shawls",

        stock: Number(data.stock || 0),

        images:
  data.images?.length > 0
    ? data.images
    : data.image
    ? [data.image]
    : [],

        featured: data.featured || false,
        newArrival: data.newArrival || false,
        bestSeller: data.bestSeller || false,
        active: data.active ?? true,
      });
    } catch (error) {
      console.error(error);
      alert("Failed to load product.");
    } finally {
      setLoading(false);
    }
  }
    async function uploadImages(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const files = e.target.files;

    if (!files?.length) return;

    setSaving(true);

    try {
      const uploaded: string[] = [];

      for (const file of Array.from(files)) {
        const reader = new FileReader();

        const image = await new Promise<string>((resolve) => {
          reader.onloadend = () =>
            resolve(reader.result as string);

          reader.readAsDataURL(file);
        });

        const res = await fetch("/api/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image,
          }),
        });

        const data = await res.json();

        if (data.success) {
          uploaded.push(data.url);
        }
      }

      setProduct((prev) => ({
        ...prev,
        images: [...prev.images, ...uploaded],
      }));
    } catch (error) {
      console.error(error);
      alert("Image upload failed.");
    } finally {
      setSaving(false);
    }
  }

  function removeImage(index: number) {
    setProduct((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  }

  return (
    <main className="min-h-screen bg-gray-100 px-8 pt-32">
      <div className="mx-auto max-w-5xl rounded-2xl bg-white p-8 shadow-xl">

        <h1 className="mb-8 text-4xl font-bold">
          Edit Product
        </h1>

        {loading ? (
          <div className="py-20 text-center text-lg">
            Loading...
          </div>
        ) : (

          <div className="space-y-6">

            <input
              className="w-full rounded-xl border p-3"
              placeholder="Product Name"
              value={product.title}
              onChange={(e) =>
                setProduct({
                  ...product,
                  title: e.target.value,
                })
              }
            />

            <div className="grid gap-5 md:grid-cols-2">

              <input
                type="number"
                className="rounded-xl border p-3"
                placeholder="Price"
                value={product.price}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    price: Number(e.target.value),
                  })
                }
              />

              <input
                type="number"
                className="rounded-xl border p-3"
                placeholder="Old Price"
                value={product.oldPrice}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    oldPrice: Number(e.target.value),
                  })
                }
              />

            </div>

            <textarea
              rows={5}
              className="w-full rounded-xl border p-3"
              placeholder="Description"
              value={product.description}
              onChange={(e) =>
                setProduct({
                  ...product,
                  description: e.target.value,
                })
              }
            />

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={uploadImages}
              className="w-full rounded-xl border p-3"
            />

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {product.images.map((image, index) => (
                <div
                  key={index}
                  className="relative"
                >
                  <Image
                    src={image}
                    alt=""
                    width={250}
                    height={250}
                    className="h-44 w-full rounded-xl object-cover"
                  />

                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute right-2 top-2 rounded-full bg-red-600 px-2 py-1 text-xs text-white"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
                        <div className="grid gap-5 md:grid-cols-2">

              <select
                className="rounded-xl border p-3"
                value={product.category}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    category: e.target.value,
                  })
                }
              >
                <option value="Shawls">Shawls</option>
                <option value="Pashmina">Pashmina</option>
                <option value="Suits">Suits</option>
                <option value="Stoles">Stoles</option>
              </select>

              <input
                type="number"
                className="rounded-xl border p-3"
                placeholder="Stock"
                value={product.stock}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    stock: Number(e.target.value),
                  })
                }
              />

              <input
                type="number"
                step="0.1"
                className="rounded-xl border p-3"
                placeholder="Rating"
                value={Number.isNaN(product.rating) ? "" : product.rating}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    rating: Number(e.target.value),
                  })
                }
              />

              <input
                className="rounded-xl border p-3"
                placeholder="Discount"
                value={product.discount}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    discount: e.target.value,
                  })
                }
              />

            </div>

            <div className="grid gap-4 md:grid-cols-2">

              <label className="flex items-center gap-3 rounded-xl border p-4">
                <input
                  type="checkbox"
                  checked={product.featured}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      featured: e.target.checked,
                    })
                  }
                />
                Featured Product
              </label>

              <label className="flex items-center gap-3 rounded-xl border p-4">
                <input
                  type="checkbox"
                  checked={product.newArrival}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      newArrival: e.target.checked,
                    })
                  }
                />
                New Arrival
              </label>

              <label className="flex items-center gap-3 rounded-xl border p-4">
                <input
                  type="checkbox"
                  checked={product.bestSeller}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      bestSeller: e.target.checked,
                    })
                  }
                />
                Best Seller
              </label>

              <label className="flex items-center gap-3 rounded-xl border p-4">
                <input
                  type="checkbox"
                  checked={product.active}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      active: e.target.checked,
                    })
                  }
                />
                Active Product
              </label>

            </div>

            <button
              type="button"
              disabled={saving}
              onClick={async () => {
                try {
                  setSaving(true);

                  const res = await fetch(
                    `/api/update-product/${id}`,
                    {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify(product),
                    }
                  );

                  const data = await res.json();

                  if (data.success) {
                    alert("✅ Product Updated Successfully");
                    router.push("/admin/products");
                  } else {
                    alert("❌ Failed to update product");
                  }
                } catch (error) {
                  console.error(error);
                  alert("Something went wrong");
                } finally {
                  setSaving(false);
                }
              }}
              className="w-full rounded-xl bg-yellow-500 py-4 text-lg font-bold text-black transition hover:bg-yellow-400 disabled:opacity-50"
            >
              {saving ? "Updating..." : "Update Product"}
            </button>

          </div>
        )}

      </div>
    </main>
  );
}
