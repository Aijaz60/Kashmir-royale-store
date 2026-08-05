import {
  PDFDocument,
  StandardFonts,
  rgb,
} from "pdf-lib";

interface CartItem {
  title?: string;
  price?: number;
  quantity?: number;
}

interface Customer {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

interface Order {
  orderId?: string;
  paymentId?: string;
  createdAt?: string;
  total?: number;
  cart?: CartItem[];
  customer?: Customer;
  status?: string;
}

export async function generateInvoice(order: Order) {
  const pdfDoc = await PDFDocument.create();

  const page = pdfDoc.addPage([595, 842]);

  const { width, height } = page.getSize();

  const font = await pdfDoc.embedFont(
    StandardFonts.Helvetica
  );

  const bold = await pdfDoc.embedFont(
    StandardFonts.HelveticaBold
  );

  const GOLD = rgb(0.83, 0.69, 0.21);
  const BLACK = rgb(0.1, 0.1, 0.1);
  const GRAY = rgb(0.45, 0.45, 0.45);
  const LIGHT = rgb(0.96, 0.96, 0.96);

  let y = height - 60;

  // Header Background

  page.drawRectangle({
    x: 0,
    y: height - 70,
    width,
    height: 70,
    color: GOLD,
  });

  page.drawText("KASHMIR ROYALE SHAWLS", {
    x: 35,
    y: height - 35,
    size: 22,
    font: bold,
    color: BLACK,
  });

  page.drawText(
    "Authentic Kashmiri Shawls • Since 1995",
    {
      x: 35,
      y: height - 55,
      size: 11,
      font,
      color: BLACK,
    }
  );

  page.drawText("INVOICE", {
    x: width - 120,
    y: height - 38,
    size: 20,
    font: bold,
    color: BLACK,
  });

  y -= 45;
  // ==========================
  // CUSTOMER DETAILS
  // ==========================

  y -= 10;

  page.drawText("CUSTOMER DETAILS", {
    x: 35,
    y,
    size: 14,
    font: bold,
    color: BLACK,
  });

  y -= 20;

  page.drawRectangle({
    x: 35,
    y: y - 55,
    width: 240,
    height: 65,
    color: LIGHT,
  });

  page.drawText(`Name: ${order.customer?.name ?? "-"}`, {
    x: 45,
    y: y - 10,
    size: 11,
    font,
    color: BLACK,
  });

  page.drawText(`Email: ${order.customer?.email ?? "-"}`, {
    x: 45,
    y: y - 25,
    size: 11,
    font,
    color: BLACK,
  });

  page.drawText(`Phone: ${order.customer?.phone ?? "-"}`, {
    x: 45,
    y: y - 40,
    size: 11,
    font,
    color: BLACK,
  });

  page.drawText(`Address: ${order.customer?.address ?? "-"}`, {
    x: 45,
    y: y - 55,
    size: 10,
    font,
    color: GRAY,
  });

  // ==========================
  // ORDER DETAILS
  // ==========================

  page.drawText("ORDER DETAILS", {
    x: 320,
    y,
    size: 14,
    font: bold,
    color: BLACK,
  });

  page.drawRectangle({
    x: 320,
    y: y - 55,
    width: 240,
    height: 65,
    color: LIGHT,
  });

  page.drawText(`Invoice : INV-${order.orderId ?? "-"}`, {
    x: 330,
    y: y - 10,
    size: 11,
    font,
  });

  page.drawText(`Order ID : ${order.orderId ?? "-"}`, {
    x: 330,
    y: y - 25,
    size: 11,
    font,
  });

  page.drawText(`Payment ID : ${order.paymentId ?? "-"}`, {
    x: 330,
    y: y - 40,
    size: 10,
    font,
  });

  page.drawText(`Status : ${order.status ?? "Pending"}`, {
    x: 330,
    y: y - 55,
    size: 11,
    font: bold,
    color: BLACK,
  });

  y -= 95;
  // ==========================
  // ORDER ITEMS
  // ==========================

  page.drawText("ORDER ITEMS", {
    x: 35,
    y,
    size: 14,
    font: bold,
    color: BLACK,
  });

  y -= 18;

  // Table Header
  page.drawRectangle({
    x: 35,
    y: y - 5,
    width: 525,
    height: 22,
    color: GOLD,
  });

  page.drawText("Product", {
    x: 45,
    y,
    size: 11,
    font: bold,
    color: BLACK,
  });

  page.drawText("Qty", {
    x: 340,
    y,
    size: 11,
    font: bold,
    color: BLACK,
  });

  page.drawText("Price", {
    x: 400,
    y,
    size: 11,
    font: bold,
    color: BLACK,
  });

  page.drawText("Total", {
    x: 500,
    y,
    size: 11,
    font: bold,
    color: BLACK,
  });

  y -= 28;

  let subtotal = 0;

  for (const item of order.cart ?? []) {
    const qty = item.quantity ?? 0;
    const price = item.price ?? 0;
    const total = qty * price;

    subtotal += total;

    page.drawRectangle({
      x: 35,
      y: y - 5,
      width: 525,
      height: 20,
      color: LIGHT,
    });

    page.drawText(item.title ?? "-", {
      x: 45,
      y,
      size: 10,
      font,
      color: BLACK,
    });

    page.drawText(String(qty), {
      x: 345,
      y,
      size: 10,
      font,
      color: BLACK,
    });

    page.drawText(`Rs. ${price}`, {
      x: 400,
      y,
      size: 10,
      font,
      color: BLACK,
    });

    page.drawText(`Rs. ${total}`, {
      x: 500,
      y,
      size: 10,
      font,
      color: BLACK,
    });

    y -= 24;
  }

  y -= 10;
  // ==========================
  // TOTALS
  // ==========================

  page.drawLine({
    start: { x: 35, y },
    end: { x: 560, y },
    thickness: 1,
    color: GRAY,
  });

  y -= 25;

  page.drawText(`Subtotal : Rs. ${subtotal}`, {
    x: 360,
    y,
    size: 11,
    font,
    color: BLACK,
  });

  y -= 18;

  page.drawText(`Grand Total : Rs. ${order.total ?? 0}`, {
    x: 360,
    y,
    size: 14,
    font: bold,
    color: GOLD,
  });

  y -= 40;

  // ==========================
  // THANK YOU
  // ==========================

  page.drawText(
    "Thank you for shopping with Kashmir Royale!",
    {
      x: 35,
      y,
      size: 16,
      font: bold,
      color: BLACK,
    }
  );

  y -= 18;

  page.drawText(
    "Every product is handcrafted with care and authenticity.",
    {
      x: 35,
      y,
      size: 10,
      font,
      color: GRAY,
    }
  );

  y -= 40;

  // ==========================
  // FOOTER
  // ==========================

  page.drawLine({
    start: { x: 35, y },
    end: { x: 560, y },
    thickness: 1,
    color: GOLD,
  });

  y -= 18;

  page.drawText("KASHMIR ROYALE SHAWLS", {
    x: 35,
    y,
    size: 12,
    font: bold,
    color: BLACK,
  });

  y -= 16;

  page.drawText("Srinagar, Jammu & Kashmir, India", {
    x: 35,
    y,
    size: 10,
    font,
    color: GRAY,
  });

  y -= 14;

  page.drawText("www.shopkashmirshawls.com", {
    x: 35,
    y,
    size: 10,
    font,
    color: GRAY,
  });

  y -= 14;

  page.drawText("support@shopkashmirshawls.com", {
    x: 35,
    y,
    size: 10,
    font,
    color: GRAY,
  });

  // ==========================
  // RETURN PDF BUFFER
  // ==========================

  const pdfBytes = await pdfDoc.save();

  return Buffer.from(pdfBytes);
}