"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();

  const { cart, clearCart } = useContext(CartContext);

  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const total = cart.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0
  );

  const getBase64Image = () =>
    new Promise<string>((resolve) => {
      const img = new Image();

      img.src = "/logo.png";

      img.onload = () => {
        const canvas = document.createElement("canvas");

        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");

        ctx?.drawImage(img, 0, 0);

        resolve(canvas.toDataURL("image/png"));
      };
    });

  const generateInvoice = async () => {
    const doc = new jsPDF();

    const logo = await getBase64Image();

    doc.setFillColor(212, 175, 55);
    doc.rect(0, 0, 210, 35, "F");

    doc.addImage(logo, "PNG", 12, 5, 22, 22);

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Kashmir Royale", 42, 16);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text("Luxury Kashmiri Shawls", 42, 24);

    doc.setFontSize(9);
    doc.text("Srinagar, Jammu & Kashmir", 138, 12);
    doc.text("support@kashmirroyale.com", 138, 18);
    doc.text("+91 72981 29017", 138, 24);
    doc.text("+91 7006819881", 138, 30);

    doc.setTextColor(0, 0, 0);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("INVOICE", 150, 48);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    doc.text(`Invoice No: INV-${Date.now()}`, 15, 48);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 15, 55);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Customer Details", 15, 72);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    doc.text(`Name: ${name}`, 15, 80);
    doc.text(`Email: ${email}`, 15, 87);
    doc.text(`Phone: ${phone}`, 15, 94);
    doc.text(`Address: ${address}`, 15, 101);

    autoTable(doc, {
      startY: 112,
      head: [["Product", "Qty", "Price", "Total"]],
      body: cart.map((item: any) => [
        item.title,
        item.quantity,
        `₹${item.price}`,
        `₹${item.price * item.quantity}`,
      ]),
      theme: "grid",
      headStyles: {
        fillColor: [212, 175, 55],
      },
    });

    const finalY = (doc as any).lastAutoTable.finalY + 15;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.text(`Grand Total: ₹${total}`, 15, finalY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(
      "Thank you for shopping with Kashmir Royale ❤️",
      15,
      finalY + 15
    );

    doc.save(`Invoice-${Date.now()}.pdf`);
  };
    const handlePayment = async () => {
    if (!name || !email || !phone || !address) {
      alert("Please fill in all customer details.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: total,
        }),
      });

      const order = await response.json();

      if (order.error) {
        alert(order.error);
        setLoading(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Kashmir Royale",
        description: "Order Payment",
        order_id: order.id,

        handler: async function (response: any) {
          try {
            const verifyResponse = await fetch("/api/verify-payment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyResult = await verifyResponse.json();

            if (!verifyResult.success) {
              alert("❌ Payment Verification Failed");
              return;
            }

            const saveResponse = await fetch("/api/save-order", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                customer: {
                  name,
                  email,
                  phone,
                  address,
                },
                cart,
                total,
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
              }),
            });

            const saveResult = await saveResponse.json();

            if (saveResponse.ok && saveResult.success) {
              await generateInvoice();

              clearCart();

              router.push("/success");
            } else {
              alert("❌ Save Order Failed");
              alert(JSON.stringify(saveResult));
            }
          } catch (error) {
            console.error(error);
            alert("Something went wrong while saving the order.");
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

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }

    setLoading(false);
  };
    return (
    <main className="min-h-screen bg-gray-50 pt-32 px-8">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">

        {/* Checkout Form */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h1 className="text-4xl font-bold mb-8">
            Checkout
          </h1>

          <div className="space-y-5">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg px-4 py-3"
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg px-4 py-3"
            />

            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border rounded-lg px-4 py-3"
            />

            <textarea
              rows={4}
              placeholder="Shipping Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow-md p-8 h-fit">
          <h2 className="text-3xl font-bold mb-8">
            Order Summary
          </h2>

          {cart.length === 0 ? (
            <p className="text-gray-500">
              Your cart is empty.
            </p>
          ) : (
            <>
              <div className="space-y-5">
                {cart.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex justify-between border-b pb-4"
                  >
                    <div>
                      <h3 className="font-semibold">
                        {item.title}
                      </h3>

                      <p className="text-gray-500 text-sm">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    <p className="font-bold">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex justify-between text-2xl font-bold mt-8">
                <span>Total</span>
                <span>₹{total}</span>
              </div>

              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full mt-8 bg-yellow-500 hover:bg-yellow-400 py-4 rounded-xl font-bold transition disabled:opacity-50"
              >
                {loading ? "Please Wait..." : "Proceed to Payment"}
              </button>
            </>
          )}
        </div>

      </div>
    </main>
  );
}
