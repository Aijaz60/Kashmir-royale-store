"use client";

import { useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

interface CartItem {
  title?: string;
  price?: number;
  quantity?: number;
  sku?: string;
  hsn?: string;
}

interface Customer {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

interface Order {
  _id?: string;
  orderId?: string;
  paymentId?: string;
  createdAt?: string;
  total?: number;
  cart?: CartItem[];
  customer?: Customer;
  status?: string;
}

type Props = {
  order: Order;
};

export default function DownloadInvoice({ order }: Props) {
  const downloadInvoice = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const PAGE_WIDTH = 210;
    const PAGE_HEIGHT = 297;
    const LEFT = 12;
    const RIGHT = 198;
    const WIDTH = RIGHT - LEFT;

    const BLACK: [number, number, number] = [20, 20, 20];
    const GRAY: [number, number, number] = [85, 85, 85];
    const BORDER: [number, number, number] = [95, 95, 95];
    const LIGHT: [number, number, number] = [247, 247, 247];
    const WHITE: [number, number, number] = [255, 255, 255];

    const money = (value: number) =>
      `Rs. ${Number(value || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;

    const formatDate = (value?: string) => {
      if (!value) {
        return new Date().toLocaleDateString("en-IN");
      }

      const parsedDate = new Date(value);

      if (Number.isNaN(parsedDate.getTime())) {
        return new Date().toLocaleDateString("en-IN");
      }

      return parsedDate.toLocaleDateString("en-IN");
    };

    const text = (
      value: string,
      x: number,
      y: number,
      options?: {
        size?: number;
        bold?: boolean;
        color?: [number, number, number];
        align?: "left" | "center" | "right";
      }
    ) => {
      doc.setFont("helvetica", options?.bold ? "bold" : "normal");
      doc.setFontSize(options?.size || 8);
      doc.setTextColor(...(options?.color || BLACK));

      doc.text(value, x, y, {
        align: options?.align || "left",
      });
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

    const wrappedText = (
      value: string,
      x: number,
      y: number,
      width: number,
      lineHeight = 4
    ) => {
      const lines = doc.splitTextToSize(value || "-", width);
      doc.text(lines, x, y);
      return lines.length * lineHeight;
    };

    const customer = order.customer || {};
    const items = order.cart || [];

    const orderNumber =
      order.orderId || order._id || "KR-ORDER";

    const invoiceNumber = `INV-${orderNumber}`;
    const invoiceDate = formatDate(order.createdAt);
    const orderDate = formatDate(order.createdAt);

    const customerName = customer.name || "Customer";
    const customerPhone = customer.phone || "-";

    const address = [
      customer.address,
      customer.city,
      customer.state || "Jammu and Kashmir",
      customer.pincode,
    ]
      .filter(Boolean)
      .join(", ");

    const subtotal = items.reduce((sum, item) => {
      return (
        sum +
        Number(item.price || 0) * Number(item.quantity || 0)
      );
    }, 0);

    const grandTotal = Number(order.total ?? subtotal);
    const shipping = Math.max(0, grandTotal - subtotal);

    const paymentMethod = order.paymentId
      ? "Online Payment"
      : "Cash on Delivery";

    const paymentStatus =
      order.status?.toLowerCase() === "paid" ||
      order.status?.toLowerCase() === "delivered"
        ? "Paid"
        : "Pending";

    // =====================================================
    // PAGE
    // =====================================================

    doc.setFillColor(...WHITE);
    doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, "F");

    doc.setDrawColor(...BORDER);
    doc.setLineWidth(0.4);
    doc.rect(8, 8, 194, 281);

    // =====================================================
    // HEADER
    // =====================================================

    text("KASHMIR ROYALE SHAWLS", LEFT, 20, {
      size: 16,
      bold: true,
    });

    text("Premium Kashmiri Handcrafted Shawls", LEFT, 27, {
      size: 8,
      color: GRAY,
    });

    text("INVOICE", RIGHT, 20, {
      size: 15,
      bold: true,
      align: "right",
    });

    text("E. & O.E.", RIGHT, 27, {
      size: 7,
      color: GRAY,
      align: "right",
    });

    doc.setDrawColor(...BORDER);
    doc.line(LEFT, 34, RIGHT, 34);

    // =====================================================
    // SHIP TO / BILL TO
    // =====================================================

    let y = 40;

    const addressHeight = 47;
    const halfWidth = WIDTH / 2;

    drawBox(LEFT, y, halfWidth, addressHeight);
    drawBox(LEFT + halfWidth, y, halfWidth, addressHeight);

    text("Ship To", LEFT + 4, y + 8, {
      size: 10,
      bold: true,
    });

    text("Bill To", LEFT + halfWidth + 4, y + 8, {
      size: 10,
      bold: true,
    });

    text(customerName, LEFT + 4, y + 16, {
      size: 8,
      bold: true,
    });

    text(customerName, LEFT + halfWidth + 4, y + 16, {
      size: 8,
      bold: true,
    });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...BLACK);

    wrappedText(
      address || "-",
      LEFT + 4,
      y + 23,
      halfWidth - 8,
      4
    );

    wrappedText(
      address || "-",
      LEFT + halfWidth + 4,
      y + 23,
      halfWidth - 8,
      4
    );

    text(`Phone: ${customerPhone}`, LEFT + 4, y + 41, {
      size: 8,
      color: GRAY,
    });

    text(
      `Phone: ${customerPhone}`,
      LEFT + halfWidth + 4,
      y + 41,
      {
        size: 8,
        color: GRAY,
      }
    );

    // =====================================================
    // ORDER DETAILS
    // =====================================================

    y += addressHeight;

    const orderDetailsHeight = 34;

    drawBox(LEFT, y, WIDTH, orderDetailsHeight);

    text("Order ID", LEFT + 4, y + 8, {
      size: 8,
      bold: true,
    });

    text("Order Date", 72, y + 8, {
      size: 8,
      bold: true,
    });

    text("Invoice Date", 124, y + 8, {
      size: 8,
      bold: true,
    });

    text("Invoice Number", LEFT + 4, y + 23, {
      size: 8,
      bold: true,
    });

    text("Payment Method", 72, y + 23, {
      size: 8,
      bold: true,
    });

    text("Payment Status", 145, y + 23, {
      size: 8,
      bold: true,
    });

    text(orderNumber, LEFT + 4, y + 14, {
      size: 8,
    });

    text(orderDate, 72, y + 14, {
      size: 8,
    });

    text(invoiceDate, 124, y + 14, {
      size: 8,
    });

    text(invoiceNumber, LEFT + 4, y + 29, {
      size: 8,
    });

    text(paymentMethod, 72, y + 29, {
      size: 8,
    });

    text(paymentStatus, 145, y + 29, {
      size: 8,
      bold: true,
      color:
        paymentStatus === "Paid"
          ? [35, 125, 55]
          : [170, 95, 20],
    });

    // =====================================================
    // SELLER DETAILS
    // =====================================================

    y += orderDetailsHeight;

    const sellerHeight = 32;

    drawBox(LEFT, y, WIDTH, sellerHeight);

    text("Sold By:", LEFT + 4, y + 8, {
      size: 8,
      bold: true,
    });

    text("Kashmir Royale Shawls", LEFT + 4, y + 15, {
      size: 8,
    });

    text("Ship-from Address:", LEFT + 4, y + 23, {
      size: 8,
      bold: true,
    });

    text("Srinagar, Jammu & Kashmir, India", LEFT + 4, y + 29, {
      size: 8,
    });

    text("Total Items:", 145, y + 8, {
      size: 8,
      bold: true,
    });

    text(String(items.length), 178, y + 8, {
      size: 8,
    });

    // =====================================================
    // PRODUCT TABLE
    // =====================================================

    y += sellerHeight + 8;

    const productWidth = 104;
    const quantityWidth = 18;
    const priceWidth = 30;
    const totalWidth = 34;

    const headerHeight = 16;

    drawBox(LEFT, y, WIDTH, headerHeight, true);

    text("Product Title", LEFT + 4, y + 6, {
      size: 8,
      bold: true,
    });

    text("Qty", LEFT + productWidth + quantityWidth / 2, y + 9, {
      size: 8,
      bold: true,
      align: "center",
    });

    text(
      "Price",
      LEFT + productWidth + quantityWidth + priceWidth - 4,
      y + 9,
      {
        size: 8,
        bold: true,
        align: "right",
      }
    );

    text("Total", RIGHT - 4, y + 9, {
      size: 8,
      bold: true,
      align: "right",
    });

    y += headerHeight;

    items.forEach((item, index) => {
      const quantity = Number(item.quantity || 0);
      const price = Number(item.price || 0);
      const lineTotal = quantity * price;

      const productTitle = item.title || "Kashmiri Shawl";

      const productLines = doc.splitTextToSize(
        productTitle,
        productWidth - 8
      );

      const rowHeight = Math.max(
        18,
        productLines.length * 4 + 8
      );

      doc.setFillColor(...(index % 2 === 0 ? WHITE : LIGHT));
      doc.setDrawColor(...BORDER);
      doc.rect(LEFT, y, WIDTH, rowHeight, "FD");

      text(productLines[0] || "Kashmiri Shawl", LEFT + 4, y + 7, {
        size: 8,
      });

      if (productLines.length > 1) {
        text(productLines[1], LEFT + 4, y + 12, {
          size: 7,
          color: GRAY,
        });
      }

      text(
        String(quantity),
        LEFT + productWidth + quantityWidth / 2,
        y + 9,
        {
          size: 8,
          align: "center",
        }
      );

      text(
        money(price),
        LEFT + productWidth + quantityWidth + priceWidth - 4,
        y + 9,
        {
          size: 8,
          align: "right",
        }
      );

      text(money(lineTotal), RIGHT - 4, y + 9, {
        size: 8,
        bold: true,
        align: "right",
      });

      y += rowHeight;
    });

    const totalQuantity = items.reduce(
      (sum, item) => sum + Number(item.quantity || 0),
      0
    );

    drawBox(LEFT, y, WIDTH, 15, true);

    text("Total", LEFT + 4, y + 9, {
      size: 8,
      bold: true,
    });

    text(
      String(totalQuantity),
      LEFT + productWidth + quantityWidth / 2,
      y + 9,
      {
        size: 8,
        bold: true,
        align: "center",
      }
    );

    text(money(subtotal), RIGHT - 4, y + 9, {
      size: 8,
      bold: true,
      align: "right",
    });

    // =====================================================
    // GRAND TOTAL
    // =====================================================

    y += 25;

    text("Subtotal", 145, y, {
      size: 8,
    });

    text(money(subtotal), RIGHT - 4, y, {
      size: 8,
      align: "right",
    });

    text("Shipping", 145, y + 8, {
      size: 8,
    });

    text(money(shipping), RIGHT - 4, y + 8, {
      size: 8,
      align: "right",
    });

    doc.setDrawColor(...BORDER);
    doc.line(140, y + 13, RIGHT, y + 13);

    text("Grand Total", 145, y + 23, {
      size: 11,
      bold: true,
    });

    text(money(grandTotal), RIGHT - 4, y + 23, {
      size: 11,
      bold: true,
      align: "right",
    });

    // =====================================================
    // SIGNATURE
    // =====================================================

    y += 39;

    text("Signature", LEFT + 4, y, {
      size: 9,
      bold: true,
    });

    text(
      "This is a computer generated invoice. No signature required.",
      LEFT + 4,
      y + 7,
      {
        size: 8,
        color: GRAY,
      }
    );

    // =====================================================
    // RETURNS POLICY
    // =====================================================

    y += 20;

    text("Returns Policy", LEFT + 4, y, {
      size: 9,
      bold: true,
    });

    const policy =
      "Please keep this invoice for your records. For returns or exchanges, " +
      "the original invoice and product packaging may be required. " +
      "Terms and conditions apply.";

    wrappedText(policy, LEFT + 4, y + 7, WIDTH - 8, 4);

    // =====================================================
    // FOOTER
    // =====================================================

    y += 24;

    doc.setDrawColor(...BORDER);
    doc.line(LEFT, y, RIGHT, y);

    text("KASHMIR ROYALE SHAWLS", 105, y + 8, {
      size: 9,
      bold: true,
      align: "center",
    });

    text(
      "Srinagar, Jammu & Kashmir, India",
      105,
      y + 14,
      {
        size: 7,
        color: GRAY,
        align: "center",
      }
    );

    text("E. & O.E.", RIGHT - 3, y + 21, {
      size: 7,
      bold: true,
      align: "right",
    });

    // Save
    doc.save(`Invoice-${orderNumber}.pdf`);
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