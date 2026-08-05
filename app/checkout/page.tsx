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
  const [city, setCity] = useState("");
const [state, setState] = useState("");
const [pincode, setPincode] = useState("");
const [paymentMethod, setPaymentMethod] = useState("razorpay");

  const total = cart.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0
  );
  const shippingCharge = total >= 5000 ? 0 : 199;
const grandTotal = total + shippingCharge;

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
    doc.text(`City: ${city}`, 15, 108);
doc.text(`State: ${state}`, 15, 115);
doc.text(`Pincode: ${pincode}`, 15, 122);

    autoTable(doc, {
      startY: 135,
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
   if (
  !name ||
  !email ||
  !phone ||
  !address ||
  !city ||
  !state ||
  !pincode
) {
  alert("Please fill in all customer details.");
  return;
}
if (paymentMethod === "cod") {
  alert("Cash on Delivery order placed successfully.");

  clearCart();
  router.push("/success");

  return;
}

if (paymentMethod === "cod") {
  try {
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
          city,
          state,
          pincode,
        },
        cart,
        total: grandTotal,
        paymentMethod: "Cash on Delivery",
        paymentStatus: "Pending",
        orderStatus: "Pending",
      }),
    });

    const saveResult = await saveResponse.json();

    if (saveResponse.ok && saveResult.success) {
      await generateInvoice();
      clearCart();
      router.push("/success");
    } else {
      alert("Failed to save COD order.");
    }
  } catch (error) {
    console.error(error);
    alert("Something went wrong.");
  }

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
  amount: grandTotal,
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
  city,
  state,
  pincode,
},
                cart,
                total: grandTotal,
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

  <input
    type="text"
    placeholder="City"
    value={city}
    onChange={(e) => setCity(e.target.value)}
    className="w-full border rounded-lg px-4 py-3"
  />

  <input
    type="text"
    placeholder="State"
    value={state}
    onChange={(e) => setState(e.target.value)}
    className="w-full border rounded-lg px-4 py-3"
  />

  <input
    type="text"
    placeholder="Pincode"
    value={pincode}
    onChange={(e) => setPincode(e.target.value)}
    className="w-full border rounded-lg px-4 py-3"
  />
  <div className="rounded-xl border p-4">

  <h3 className="mb-4 text-lg font-bold">
    Payment Method
  </h3>

  <label className="mb-3 flex cursor-pointer items-center gap-3">
    <input
      type="radio"
      name="payment"
      value="razorpay"
      checked={paymentMethod === "razorpay"}
      onChange={(e) => setPaymentMethod(e.target.value)}
    />
    <span>💳 Razorpay (Online Payment)</span>
  </label>

  <label className="flex cursor-pointer items-center gap-3">
    <input
      type="radio"
      name="payment"
      value="cod"
      checked={paymentMethod === "cod"}
      onChange={(e) => setPaymentMethod(e.target.value)}
    />
    <span>💵 Cash on Delivery</span>
  </label>

</div>

</div>
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
    className="flex justify-between items-center border-b pb-4"
  >
    <div className="flex items-center gap-4">

      <img
        src={item.image || "/images/placeholder.jpg"}
        alt={item.title}
        className="h-16 w-16 rounded-lg border object-cover"
      />

      <div>
        <h3 className="font-semibold">
          {item.title}
        </h3>

        <p className="text-sm text-gray-500">
          Qty: {item.quantity}
        </p>

        <p className="text-sm font-semibold text-yellow-600">
          ₹{item.price}
        </p>
      </div>

    </div>

    <p className="font-bold">
      ₹{item.price * item.quantity}
    </p>
  </div>
))}
              </div>

             <div className="mt-8 space-y-3 border-t pt-5">

  <div className="flex justify-between">
    <span>Subtotal</span>
    <span>₹{total}</span>
  </div>

  <div className="flex justify-between">
    <span>Shipping</span>

    <span className="font-semibold">
      {shippingCharge === 0 ? (
        <span className="text-green-600">
          FREE
        </span>
      ) : (
        `₹${shippingCharge}`
      )}
    </span>
  </div>

  <div className="flex justify-between border-t pt-4 text-2xl font-bold">
    <span>Grand Total</span>
    <span>₹{grandTotal}</span>
  </div>

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
