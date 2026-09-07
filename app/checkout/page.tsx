"use client";

import Image from "next/image";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import { CartContext } from "../context/CartContext";

interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
}

interface RazorpayPaymentResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key?: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (
    response: RazorpayPaymentResponse
  ) => void | Promise<void>;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
}

interface RazorpayInstance {
  open: () => void;
}

interface RazorpayConstructor {
  new (
    options: RazorpayOptions
  ): RazorpayInstance;
}

declare global {
  interface Window {
    Razorpay: RazorpayConstructor;
  }
}

export default function CheckoutPage() {
  const router = useRouter();

  const { cart, clearCart } =
    useContext(CartContext);

  const [loading, setLoading] =
    useState(false);

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [address, setAddress] =
    useState("");

  const [city, setCity] =
    useState("");

  const [state, setState] =
    useState("");

  const [pincode, setPincode] =
    useState("");

  const [paymentMethod, setPaymentMethod] =

    useState("razorpay");
const [qrImageUrl, setQrImageUrl] =
  useState("");

const [qrOrderId, setQrOrderId] =
  useState("");

const [qrPaymentStatus, setQrPaymentStatus] =
  useState("Pending");

  const qrCompletedRef = useRef(false);

  const cartItems = cart as CartItem[];

  const total = cartItems.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );

  const shippingCharge =
    total >= 5000 ? 0 : 199;

  const grandTotal =
    total + shippingCharge;

  const getBase64Image = () =>
    new Promise<string>((resolve) => {
      const img = new window.Image();

      img.src = "/logo.png";

      img.onload = () => {
        const canvas =
          document.createElement("canvas");

        canvas.width = img.width;
        canvas.height = img.height;

        const ctx =
          canvas.getContext("2d");

        ctx?.drawImage(
          img,
          0,
          0
        );

        resolve(
          canvas.toDataURL("image/png")
        );
      };
    });

 const generateInvoice = async (
  orderId: string,
  paymentMethod: string,
  paymentStatus: string
) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const BLACK: [number, number, number] = [25, 25, 25];
  const GRAY: [number, number, number] = [90, 90, 90];
  const BORDER: [number, number, number] = [100, 100, 100];
  const LIGHT: [number, number, number] = [247, 247, 247];
  const WHITE: [number, number, number] = [255, 255, 255];

  const today = new Date().toLocaleDateString("en-IN");

  const money = (value: number) =>
    `Rs. ${Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const drawText = (
    value: string,
    x: number,
    y: number,
    size = 8,
    bold = false,
    align: "left" | "center" | "right" = "left",
    color: [number, number, number] = BLACK
  ) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    doc.setTextColor(...color);
    doc.text(value, x, y, { align });
  };

  const drawBox = (
    x: number,
    y: number,
    width: number,
    height: number,
    filled = false
  ) => {
    doc.setLineWidth(0.3);
    doc.setDrawColor(...BORDER);

    if (filled) {
      doc.setFillColor(...LIGHT);
      doc.rect(x, y, width, height, "FD");
    } else {
      doc.rect(x, y, width, height, "S");
    }
  };

  // White page
  doc.setFillColor(...WHITE);
  doc.rect(0, 0, 210, 297, "F");

  // Outer border
  doc.setDrawColor(...BORDER);
  doc.setLineWidth(0.4);
  doc.rect(8, 8, 194, 281);

  // =====================================================
  // HEADER — NO GOLD BACKGROUND
  // =====================================================

  drawText("KASHMIR ROYALE SHAWLS", 12, 19, 16, true);
  drawText(
    "Premium Kashmiri Handcrafted Shawls",
    12,
    26,
    8,
    false,
    "left",
    GRAY
  );

  drawText("INVOICE", 198, 19, 15, true, "right");

  doc.setDrawColor(...BORDER);
  doc.line(12, 34, 198, 34);

  // =====================================================
  // SHIP TO / BILL TO
  // =====================================================

  let y = 40;

  const boxWidth = 93;
  const boxHeight = 48;

  drawBox(12, y, boxWidth, boxHeight);
  drawBox(105, y, boxWidth, boxHeight);

  drawText("Ship To", 16, y + 8, 10, true);
  drawText("Bill To", 109, y + 8, 10, true);

  drawText(name || "Customer", 16, y + 16, 8, true);
  drawText(name || "Customer", 109, y + 16, 8, true);

  const fullAddress = [
    address,
    city,
    state,
    pincode,
  ]
    .filter(Boolean)
    .join(", ");

  const shipAddressLines = doc.splitTextToSize(
    fullAddress || "-",
    82
  );

  const billAddressLines = doc.splitTextToSize(
    fullAddress || "-",
    82
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...BLACK);

  doc.text(shipAddressLines, 16, y + 23);
  doc.text(billAddressLines, 109, y + 23);

  drawText(`Phone: ${phone || "-"}`, 16, y + 41, 8, false, "left", GRAY);
  drawText(`Phone: ${phone || "-"}`, 109, y + 41, 8, false, "left", GRAY);

  // =====================================================
  // ORDER DETAILS
  // =====================================================

  y += boxHeight;

  drawBox(12, y, 186, 34);

  drawText("Order ID", 16, y + 8, 8, true);
  drawText("Order Date", 72, y + 8, 8, true);
  drawText("Invoice Date", 124, y + 8, 8, true);

  drawText("Invoice Number", 16, y + 23, 8, true);
  drawText("Payment Method", 72, y + 23, 8, true);
  drawText("Payment Status", 145, y + 23, 8, true);

  drawText(orderId, 16, y + 14, 8);
  drawText(today, 72, y + 14, 8);
  drawText(today, 124, y + 14, 8);

  drawText(`INV-${orderId}`, 16, y + 29, 8);
  drawText(
    paymentMethod === "razorpay"
      ? "Online Payment"
      : "Cash on Delivery",
    72,
    y + 29,
    8
  );

  drawText(
    paymentStatus,
    145,
    y + 29,
    8,
    true,
    "left",
    paymentStatus.toLowerCase() === "paid"
      ? [35, 125, 55]
      : [170, 95, 20]
  );

  // =====================================================
  // SELLER DETAILS
  // =====================================================

  y += 34;

  drawBox(12, y, 186, 32);

  drawText("Sold By:", 16, y + 8, 8, true);
  drawText("Kashmir Royale Shawls", 16, y + 15, 8);

  drawText("Ship-from Address:", 16, y + 23, 8, true);
  drawText(
    "Srinagar, Jammu & Kashmir, India",
    16,
    y + 29,
    8
  );

  drawText("Total Items:", 145, y + 8, 8, true);
  drawText(String(cartItems.length), 178, y + 8, 8);

  // =====================================================
  // PRODUCT TABLE — FLIPKART STYLE
  // =====================================================

  y += 40;

  autoTable(doc, {
    startY: y,

    margin: {
      left: 12,
      right: 12,
    },

    head: [
      [
        "Product Title",
        "Qty",
        "Price",
        "Total",
      ],
    ],

    body: cartItems.map((item) => [
      item.title,
      String(item.quantity),
      money(item.price),
      money(item.price * item.quantity),
    ]),

    theme: "grid",

    styles: {
      font: "helvetica",
      fontSize: 8,
      textColor: BLACK,
      lineColor: BORDER,
      lineWidth: 0.25,
      cellPadding: 4,
      valign: "middle",
    },

    headStyles: {
      fillColor: LIGHT,
      textColor: BLACK,
      fontStyle: "bold",
      lineColor: BORDER,
      lineWidth: 0.3,
    },

    alternateRowStyles: {
      fillColor: WHITE,
    },

    columnStyles: {
      0: {
        cellWidth: 104,
        halign: "left",
      },
      1: {
        cellWidth: 18,
        halign: "center",
      },
      2: {
        cellWidth: 30,
        halign: "right",
      },
      3: {
        cellWidth: 34,
        halign: "right",
      },
    },
  });

  const pdfWithTable = doc as jsPDF & {
    lastAutoTable?: {
      finalY: number;
    };
  };

  const finalY = pdfWithTable.lastAutoTable?.finalY || y + 30;

  // =====================================================
  // TOTAL SUMMARY
  // =====================================================

  let summaryY = finalY + 18;

  drawText("Subtotal", 145, summaryY, 8);
  drawText(money(total), 195, summaryY, 8, false, "right");

  drawText("Shipping", 145, summaryY + 8, 8);
  drawText(
    money(shippingCharge),
    195,
    summaryY + 8,
    8,
    false,
    "right"
  );

  doc.setDrawColor(...BORDER);
  doc.line(140, summaryY + 13, 198, summaryY + 13);

  drawText("Grand Total", 145, summaryY + 23, 11, true);
  drawText(
    money(grandTotal),
    195,
    summaryY + 23,
    11,
    true,
    "right"
  );

  // =====================================================
  // SIGNATURE / RETURN POLICY
  // =====================================================

  summaryY += 42;

  drawText("Signature", 16, summaryY, 9, true);

  drawText(
    "This is a computer generated invoice. No signature required.",
    16,
    summaryY + 7,
    8,
    false,
    "left",
    GRAY
  );

  drawText("Returns Policy", 16, summaryY + 22, 9, true);

  const returnPolicy =
    "Please keep this invoice for your records. For returns or exchanges, " +
    "the original invoice and product packaging may be required. " +
    "Terms and conditions apply.";

  const returnLines = doc.splitTextToSize(
    returnPolicy,
    178
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...GRAY);
  doc.text(returnLines, 16, summaryY + 29);

  // =====================================================
  // FOOTER
  // =====================================================

  doc.setDrawColor(...BORDER);
  doc.line(12, 274, 198, 274);

  drawText(
    "KASHMIR ROYALE SHAWLS",
    105,
    282,
    9,
    true,
    "center"
  );

  drawText(
    "Srinagar, Jammu & Kashmir, India",
    105,
    287,
    7,
    false,
    "center",
    GRAY
  );

  doc.save(`Invoice-${orderId}.pdf`);
};

  useEffect(() => {
    if (!qrOrderId || !phone || qrPaymentStatus === "Paid") {
      return;
    }

    let stopped = false;

    const checkPayment = async () => {
      try {
        const response = await fetch(
          "/api/track-order",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              orderId: qrOrderId,
              phone,
            }),
          }
        );

        if (!response.ok || stopped) {
          return;
        }

        const result = await response.json();
        const status = String(
          result.paymentStatus || "Pending"
        );

        setQrPaymentStatus(status);

        if (
          status.toLowerCase() === "paid" &&
          !qrCompletedRef.current
        ) {
          qrCompletedRef.current = true;
          stopped = true;

          await generateInvoice(
  qrOrderId,
  "UPI / Bank Transfer",
  "Paid"
);
          clearCart();
          router.push("/success");
        }
      } catch (error) {
        console.error(
          "QR PAYMENT CHECK ERROR:",
          error
        );
      }
    };

    checkPayment();
    const interval = window.setInterval(
      checkPayment,
      3000
    );

    return () => {
      stopped = true;
      window.clearInterval(interval);
    };
  }, [
    qrOrderId,
    phone,
    qrPaymentStatus,
    clearCart,
    router,
  ]);

  useEffect(() => {
    if (paymentMethod !== "upi") {
      setQrImageUrl("");
      setQrOrderId("");
      setQrPaymentStatus("Pending");
      qrCompletedRef.current = false;
    }
  }, [paymentMethod]);

  const handlePayment = async () => {
    if (
      !name ||
      !email ||
      !phone ||
      !address ||
      !city ||
      !state ||
      !pincode
    ) {
      alert(
        "Please fill in all customer details."
      );
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    /*
     * Cash on Delivery
     */
    if (paymentMethod === "cod") {
      setLoading(true);

      try {
        const saveResponse = await fetch(
          "/api/save-order",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              customer: {
                name,
                email,
                phone,
                address,
                city,
                state,
                pincode,
              },
              cart: cartItems,
              total: grandTotal,
              paymentMethod:
                "Cash on Delivery",
              paymentStatus: "Pending",
              orderStatus: "Pending",
            }),
          }
        );

        const saveResult =
          await saveResponse.json();

        if (
          saveResponse.ok &&
          saveResult.success
        ) {
          await generateInvoice(
  saveResult.orderId,
  "Cash on Delivery",
  "Pending"
);
          clearCart();
          router.push("/success");
        } else {
          alert("Failed to save COD order.");
        }
      } catch (error) {
        console.error(error);
        alert("Something went wrong.");
      } finally {
        setLoading(false);
      }

      return;
    }

    /*
     * Razorpay Dynamic UPI QR
     */
    if (paymentMethod === "upi") {
      setLoading(true);
      qrCompletedRef.current = false;
      setQrImageUrl("");
      setQrOrderId("");
      setQrPaymentStatus("Pending");

      try {
        /*
         * 1. Create the website order first.
         */
        const saveResponse = await fetch(
          "/api/save-order",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              customer: {
                name,
                email,
                phone,
                address,
                city,
                state,
                pincode,
              },
              cart: cartItems,
              total: grandTotal,
              paymentMethod:
                "Razorpay UPI QR",
              paymentStatus: "Pending",
              orderStatus: "Pending",
            }),
          }
        );

        const saveResult =
          await saveResponse.json();

        if (
          !saveResponse.ok ||
          !saveResult.success
        ) {
          alert(
            saveResult.error ||
              "Failed to create order."
          );
          setLoading(false);
          return;
        }

        /*
         * 2. Ask Razorpay to create a fixed-amount
         * single-use QR for this exact order.
         */
        const qrResponse = await fetch(
          "/api/create-qr",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              amount: grandTotal,
              orderId: saveResult.orderId,
            }),
          }
        );

        const qrResult =
          await qrResponse.json();

        if (
          !qrResponse.ok ||
          !qrResult.success ||
          !qrResult.imageUrl
        ) {
          alert(
            qrResult.error ||
              "Failed to create payment QR."
          );
          setLoading(false);
          return;
        }

        /*
         * 3. Show QR and start webhook-status polling.
         */
        setQrOrderId(saveResult.orderId);
        setQrImageUrl(qrResult.imageUrl);
        setQrPaymentStatus("Pending");
        setLoading(false);
      } catch (error) {
        console.error(
          "UPI QR ERROR:",
          error
        );
        alert(
          "Something went wrong while creating the QR payment."
        );
        setLoading(false);
      }

      return;
    }

    /*
     * Razorpay Checkout
     */
    setLoading(true);

    try {
      const response = await fetch(
        "/api/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            amount: grandTotal,
          }),
        }
      );

      const order = await response.json();

      if (order.error) {
        alert(order.error);
        setLoading(false);
        return;
      }

      const options: RazorpayOptions = {
        key:
          process.env
            .NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Kashmir Royale",
        description: "Order Payment",
        order_id: order.id,

        handler: async function (
          paymentResponse
        ) {
          try {
            const verifyResponse =
              await fetch(
                "/api/verify-payment",
                {
                  method: "POST",
                  headers: {
                    "Content-Type":
                      "application/json",
                  },
                  body: JSON.stringify({
                    razorpay_order_id:
                      paymentResponse.razorpay_order_id,
                    razorpay_payment_id:
                      paymentResponse.razorpay_payment_id,
                    razorpay_signature:
                      paymentResponse.razorpay_signature,
                  }),
                }
              );

            const verifyResult =
              await verifyResponse.json();

            if (!verifyResult.success) {
              alert(
                "❌ Payment Verification Failed"
              );
              return;
            }

            const saveResponse =
              await fetch(
                "/api/save-order",
                {
                  method: "POST",
                  headers: {
                    "Content-Type":
                      "application/json",
                  },
                  body: JSON.stringify({
                    customer: {
                      name,
                      email,
                      phone,
                      address,
                      city,
                      state,
                      pincode,
                    },
                    cart: cartItems,
                    total: grandTotal,
                    paymentId:
                      paymentResponse.razorpay_payment_id,
                    orderId:
                      paymentResponse.razorpay_order_id,
                    paymentMethod: "Razorpay",
                    paymentStatus: "Paid",
                    orderStatus: "Confirmed",
                  }),
                }
              );

            const saveResult =
              await saveResponse.json();

            if (
              saveResponse.ok &&
              saveResult.success
            ) {
              
              await generateInvoice(
  paymentResponse.razorpay_order_id,
  "Razorpay",
  "Paid"
);
              clearCart();
              router.push("/success");
            } else {
              alert("❌ Save Order Failed");
              alert(
                JSON.stringify(saveResult)
              );
            }
          } catch (error) {
            console.error(error);
            alert(
              "Something went wrong while saving the order."
            );
          }
        },

        prefill: {
          name,
          email,
          contact: phone,
        },

        theme: {
          color: "#D4AF37",
        },
      };

      const razorpay =
        new window.Razorpay(options);

      razorpay.open();
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-8 pt-32">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">

        {/* Checkout Form */}
        <div className="rounded-2xl bg-white p-8 shadow-md">

          <h1 className="mb-8 text-4xl font-bold">
            Checkout
          </h1>

          <div className="space-y-5">

            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              className="w-full rounded-lg border px-4 py-3"
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              className="w-full rounded-lg border px-4 py-3"
            />

            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) =>
                setPhone(
                  e.target.value
                )
              }
              className="w-full rounded-lg border px-4 py-3"
            />

            <textarea
              rows={4}
              placeholder="Shipping Address"
              value={address}
              onChange={(e) =>
                setAddress(
                  e.target.value
                )
              }
              className="w-full rounded-lg border px-4 py-3"
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

              <input
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) =>
                  setCity(
                    e.target.value
                  )
                }
                className="w-full rounded-lg border px-4 py-3"
              />

              <input
                type="text"
                placeholder="State"
                value={state}
                onChange={(e) =>
                  setState(
                    e.target.value
                  )
                }
                className="w-full rounded-lg border px-4 py-3"
              />

              <input
                type="text"
                placeholder="Pincode"
                value={pincode}
                onChange={(e) =>
                  setPincode(
                    e.target.value
                  )
                }
                className="w-full rounded-lg border px-4 py-3"
              />

            </div>

            <div className="rounded-xl border p-4">

              <h3 className="mb-4 text-lg font-bold">
                Payment Method
              </h3>

              <label className="mb-3 flex cursor-pointer items-center gap-3">
                <input
                  type="radio"
                  name="payment"
                  value="razorpay"
                  checked={
                    paymentMethod ===
                    "razorpay"
                  }
                  onChange={(e) =>
                    setPaymentMethod(
                      e.target.value
                    )
                  }
                />

                <span>
                  💳 Razorpay (Online Payment)
                </span>
              </label>

              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={
                    paymentMethod ===
                    "cod"
                  }
                  onChange={(e) =>
                    setPaymentMethod(
                      e.target.value
                    )
                  }
                />

                <span>
                  💵 Cash on Delivery
                </span>
              </label>
                            <label className="mt-3 flex cursor-pointer items-center gap-3">
                <input
                  type="radio"
                  name="payment"
                  value="upi"
                  checked={
                    paymentMethod ===
                    "upi"
                  }
                  onChange={(e) =>
                    setPaymentMethod(
                      e.target.value
                    )
                  }
                />

                <span>
                  📱 UPI / Bank Transfer
                </span>
              </label>

            </div>

          </div>
        </div>

        {/* Order Summary */}
        <div className="h-fit rounded-2xl bg-white p-8 shadow-md">

          <h2 className="mb-8 text-3xl font-bold">
            Order Summary
          </h2>

          {cartItems.length === 0 ? (
            <p className="text-gray-500">
              Your cart is empty.
            </p>
          ) : (
            <>
              <div className="space-y-5">

                {cartItems.map(
                  (item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between border-b pb-4"
                    >

                      <div className="flex items-center gap-4">

                        <Image
                          src={
                            item.image ||
                            "/images/placeholder.jpg"
                          }
                          alt={item.title}
                          width={64}
                          height={64}
                          className="h-16 w-16 rounded-lg border object-cover"
                        />

                        <div>

                          <h3 className="font-semibold">
                            {item.title}
                          </h3>

                          <p className="text-sm text-gray-500">
                            Qty:{" "}
                            {item.quantity}
                          </p>

                          <p className="text-sm font-semibold text-yellow-600">
                            ₹{item.price}
                          </p>

                        </div>
                      </div>

                      <p className="font-bold">
                        ₹
                        {item.price *
                          item.quantity}
                      </p>

                    </div>
                  )
                )}

              </div>

              <div className="mt-8 space-y-3 border-t pt-5">

                <div className="flex justify-between">
                  <span>
                    Subtotal
                  </span>

                  <span>
                    ₹{total}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>
                    Shipping
                  </span>

                  <span className="font-semibold">
                    {shippingCharge ===
                    0 ? (
                      <span className="text-green-600">
                        FREE
                      </span>
                    ) : (
                      `₹${shippingCharge}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between border-t pt-4 text-2xl font-bold">
                  <span>
                    Grand Total
                  </span>

                  <span>
                    ₹{grandTotal}
                  </span>
                </div>

              </div>

              {paymentMethod === "upi" && qrImageUrl && (
                <div className="mt-8 rounded-2xl border-2 border-yellow-400 bg-yellow-50 p-6 text-center shadow-sm">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Scan & Pay
                  </h3>

                  <p className="mt-2 text-gray-600">
                    Scan this QR with any UPI app and pay the exact amount.
                  </p>

                  <div className="mx-auto mt-5 flex w-fit rounded-2xl bg-white p-4 shadow">
                    <img
                      src={qrImageUrl}
                      alt="Razorpay UPI payment QR code"
                      className="h-64 w-64 object-contain"
                    />
                  </div>

                  <p className="mt-4 text-lg font-bold">
                    Amount: ₹{grandTotal}
                  </p>

                  <p className="mt-1 break-all text-sm text-gray-500">
                    Order ID: {qrOrderId}
                  </p>

                  <div className="mt-5 rounded-xl bg-white p-4">
                    <p className="font-semibold text-gray-900">
                      Payment Status
                    </p>
                    <p
                      className={`mt-2 text-lg font-bold ${
                        qrPaymentStatus.toLowerCase() === "paid"
                          ? "text-green-600"
                          : "text-amber-600"
                      }`}
                    >
                      {qrPaymentStatus.toLowerCase() === "paid"
                        ? "✅ Paid"
                        : "⏳ Waiting for payment..."}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      This page checks the payment automatically. Please keep this page open after scanning.
                    </p>
                  </div>
                </div>
              )}

              <button
                onClick={handlePayment}
                disabled={loading || (paymentMethod === "upi" && !!qrImageUrl)}
                className="mt-8 w-full rounded-xl bg-yellow-500 py-4 font-bold transition hover:bg-yellow-400 disabled:opacity-50"
              >
                {loading
                  ? "Please Wait..."
                  : "Proceed to Payment"}
              </button>

            </>
          )}

        </div>

      </div>
    </main>
  );
}