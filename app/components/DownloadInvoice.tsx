"use client";

import jsPDF from "jspdf";

interface CartItem {
  title: string;
  price: number;
  quantity: number;
}

interface Customer {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

interface Order {
  orderId: string;
  paymentId: string;
  createdAt: string;
  total: number;
  cart: CartItem[];
  customer?: Customer;
}

export default function DownloadInvoice({
  order,
}: {
  order: Order;
}) {
  const downloadInvoice = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // ========= COLORS =========

    const GOLD: [number, number, number] = [212, 175, 55];
    const BLACK: [number, number, number] = [30, 30, 30];
    const WHITE: [number, number, number] = [255, 255, 255];
    const LIGHT: [number, number, number] = [246, 246, 246];
    const GRAY: [number, number, number] = [120, 120, 120];
    const GREEN: [number, number, number] = [40, 167, 69];

    // ========= HELPERS =========

    const money = (value: number) =>
      `Rs. ${value.toLocaleString("en-IN")}`;

    let y = 20;

    // ========= PAGE =========

    doc.setFillColor(...WHITE);
    doc.rect(0, 0, 210, 297, "F");

    // Gold Border
    doc.setDrawColor(...GOLD);
    doc.setLineWidth(0.8);
    doc.rect(8, 8, 194, 281);

    // ========= HEADER =========

    doc.setFillColor(...GOLD);
    doc.rect(8, 8, 194, 28, "F");

    doc.setTextColor(...BLACK);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);

    doc.text("KASHMIR ROYALE SHAWLS", 15, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    doc.text(
      "Authentic Kashmiri Shawls • Since 1995",
      15,
      28
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);

    doc.text("TAX INVOICE", 190, 20, {
      align: "right",
    });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    doc.text(
      new Date(order.createdAt).toLocaleDateString(),
      190,
      28,
      {
        align: "right",
      }
    );

    y = 48;
        // ==========================
    // CUSTOMER DETAILS
    // ==========================

    doc.setFillColor(...LIGHT);
    doc.roundedRect(12, y, 88, 48, 3, 3, "F");

    doc.setTextColor(...BLACK);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);

    doc.text("CUSTOMER DETAILS", 16, y + 8);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    doc.text(`Name: ${order.customer?.name || "Customer"}`, 16, y + 18);

    doc.text(
      `Email: ${order.customer?.email || "-"}`,
      16,
      y + 26
    );

    doc.text(
      `Phone: ${order.customer?.phone || "-"}`,
      16,
      y + 34
    );

    const address =
      order.customer?.address || "Address not available";

    const addressLines = doc.splitTextToSize(address, 78);

    doc.text(addressLines, 16, y + 42);

    // ==========================
    // PAYMENT DETAILS
    // ==========================

    doc.setFillColor(...LIGHT);
    doc.roundedRect(110, y, 88, 48, 3, 3, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);

    doc.text("PAYMENT DETAILS", 114, y + 8);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    doc.text(
      `Invoice: INV-${order.orderId}`,
      114,
      y + 18
    );

    doc.text(
      `Order ID: ${order.orderId}`,
      114,
      y + 26
    );

    doc.text(
      `Payment ID: ${order.paymentId}`,
      114,
      y + 34
    );

    // Paid Badge
    doc.setFillColor(...GREEN);
    doc.roundedRect(148, y + 38, 42, 8, 2, 2, "F");

    doc.setTextColor(...WHITE);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);

    doc.text("PAID", 169, y + 43.5, {
      align: "center",
    });

    // Reset Text Color
    doc.setTextColor(...BLACK);

    y += 60;
        // ==========================
    // PRODUCTS TABLE
    // ==========================

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(...BLACK);

    doc.text("ORDER ITEMS", 12, y);

    y += 8;

    // Table Header
    doc.setFillColor(...GOLD);
    doc.roundedRect(12, y, 186, 10, 2, 2, "F");

    doc.setTextColor(...BLACK);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);

    doc.text("Product", 16, y + 6.5);
    doc.text("Qty", 122, y + 6.5);
    doc.text("Price", 145, y + 6.5);
    doc.text("Total", 188, y + 6.5, {
      align: "right",
    });

    y += 12;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    order.cart.forEach((item, index) => {

      if (index % 2 === 0) {
        doc.setFillColor(248, 248, 248);
      } else {
        doc.setFillColor(255, 255, 255);
      }

      doc.roundedRect(12, y - 4, 186, 10, 1, 1, "F");

      const lineTotal = item.price * item.quantity;

      doc.setTextColor(...BLACK);

      doc.text(
        item.title.length > 40
          ? item.title.substring(0, 40) + "..."
          : item.title,
        16,
        y + 2
      );

      doc.text(
        String(item.quantity),
        124,
        y + 2
      );

      doc.text(
        money(item.price),
        145,
        y + 2
      );

      doc.setFont("helvetica", "bold");

      doc.text(
        money(lineTotal),
        188,
        y + 2,
        {
          align: "right",
        }
      );

      doc.setFont("helvetica", "normal");

      y += 12;
    });

    y += 8;
        // ==========================
    // ORDER SUMMARY
    // ==========================

    const subtotal = order.cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const shipping = Math.max(0, order.total - subtotal);

    doc.setDrawColor(...GOLD);
    doc.setLineWidth(0.4);
    doc.line(12, y, 198, y);

    y += 10;

    // Summary Box
    doc.setFillColor(...LIGHT);
    doc.roundedRect(110, y, 88, 40, 3, 3, "F");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(...BLACK);

    doc.text("Subtotal", 116, y + 10);
    doc.text(money(subtotal), 192, y + 10, {
      align: "right",
    });

    doc.text("Shipping", 116, y + 20);
    doc.text(money(shipping), 192, y + 20, {
      align: "right",
    });

    doc.setDrawColor(200, 200, 200);
    doc.line(116, y + 24, 192, y + 24);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);

    doc.text("Grand Total", 116, y + 34);

    doc.setTextColor(...GREEN);

    doc.text(
      money(order.total),
      192,
      y + 34,
      {
        align: "right",
      }
    );

    doc.setTextColor(...BLACK);

    y += 55;
        // ==========================
    // THANK YOU SECTION
    // ==========================

    doc.setDrawColor(...GOLD);
    doc.setLineWidth(0.5);
    doc.line(12, y, 198, y);

    y += 12;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(...BLACK);

    doc.text(
      "Thank You For Shopping With Us!",
      105,
      y,
      {
        align: "center",
      }
    );

    y += 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...GRAY);

    doc.text(
      "Every Kashmir Royale Shawl is handcrafted with care and authenticity.",
      105,
      y,
      {
        align: "center",
      }
    );

    y += 7;

    doc.text(
      "Premium Kashmiri Craftsmanship Since 1995",
      105,
      y,
      {
        align: "center",
      }
    );

    y += 15;

    // ==========================
    // FOOTER
    // ==========================

    doc.setDrawColor(...GOLD);
    doc.line(12, y, 198, y);

    y += 8;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...BLACK);

    doc.text(
      "KASHMIR ROYALE SHAWLS",
      105,
      y,
      {
        align: "center",
      }
    );

    y += 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...GRAY);

    doc.text(
      "Srinagar, Jammu & Kashmir, India",
      105,
      y,
      {
        align: "center",
      }
    );

    y += 5;

    doc.text(
      "www.shopkashmirshawls.com",
      105,
      y,
      {
        align: "center",
      }
    );

    y += 5;

    doc.text(
      "support@shopkashmirshawls.com",
      105,
      y,
      {
        align: "center",
      }
    );

    // ==========================
    // SAVE PDF
    // ==========================

    doc.save(`Invoice-${order.orderId}.pdf`);
  };

  return (
    <button
      onClick={downloadInvoice}
      className="inline-flex items-center gap-2 rounded-lg bg-yellow-600 px-5 py-3 font-semibold text-white transition hover:bg-yellow-700"
    >
      📄 Download Invoice
    </button>
  );
}