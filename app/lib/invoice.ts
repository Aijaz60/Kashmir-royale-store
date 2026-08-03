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

  const page = pdfDoc.addPage([595, 842]); // A4

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

  let y = height - 60;

  // ======================
  // HEADER
  // ======================

  page.drawRectangle({
    x: 0,
    y: height - 70,
    width,
    height: 70,
    color: GOLD,
  });

  page.drawText("KASHMIR ROYALE SHAWLS", {
    x: 40,
    y: height - 35,
    size: 22,
    font: bold,
    color: BLACK,
  });

  page.drawText(
    "Authentic Kashmiri Shawls • Since 1995",
    {
      x: 40,
      y: height - 55,
      size: 11,
      font,
      color: BLACK,
    }
  );

  y -= 40;

  // ======================
  // CUSTOMER DETAILS
  // ======================

  page.drawText("CUSTOMER DETAILS", {
    x: 40,
    y,
    size: 14,
    font: bold,
    color: BLACK,
  });

  y -= 25;

  page.drawText(
    `Name: ${order.customer?.name ?? "-"}`,
    {
      x: 40,
      y,
      size: 11,
      font,
      color: BLACK,
    }
  );

  y -= 18;

  page.drawText(
    `Email: ${order.customer?.email ?? "-"}`,
    {
      x: 40,
      y,
      size: 11,
      font,
      color: BLACK,
    }
  );

  y -= 18;

  page.drawText(
    `Phone: ${order.customer?.phone ?? "-"}`,
    {
      x: 40,
      y,
      size: 11,
      font,
      color: BLACK,
    }
  );

  y -= 18;

  page.drawText(
    `Address: ${order.customer?.address ?? "-"}`,
    {
      x: 40,
      y,
      size: 11,
      font,
      color: GRAY,
      maxWidth: 500,
    }
  );

  y -= 40;

  // Continue in Part 2...
  // ======================
// ORDER DETAILS
// ======================

page.drawText("ORDER DETAILS", {
  x: 40,
  y,
  size: 14,
  font: bold,
  color: BLACK,
});

y -= 25;

page.drawText(`Invoice : INV-${order.orderId ?? "-"}`, {
  x: 40,
  y,
  size: 11,
  font,
  color: BLACK,
});

y -= 18;

page.drawText(`Order ID : ${order.orderId ?? "-"}`, {
  x: 40,
  y,
  size: 11,
  font,
  color: BLACK,
});

y -= 18;

page.drawText(`Payment ID : ${order.paymentId ?? "-"}`, {
  x: 40,
  y,
  size: 11,
  font,
  color: BLACK,
});

y -= 18;

page.drawText(`Status : ${order.status ?? "Paid"}`, {
  x: 40,
  y,
  size: 11,
  font,
  color: BLACK,
});

y -= 40;

// ======================
// PRODUCTS TABLE
// ======================

page.drawText("ORDER ITEMS", {
  x: 40,
  y,
  size: 14,
  font: bold,
  color: BLACK,
});

y -= 20;

// Header
page.drawRectangle({
  x: 40,
  y: y - 5,
  width: 515,
  height: 20,
  color: GOLD,
});

page.drawText("Product", {
  x: 50,
  y,
  size: 11,
  font: bold,
});

page.drawText("Qty", {
  x: 330,
  y,
  size: 11,
  font: bold,
});

page.drawText("Price", {
  x: 390,
  y,
  size: 11,
  font: bold,
});

page.drawText("Total", {
  x: 500,
  y,
  size: 11,
  font: bold,
});

y -= 30;

let subtotal = 0;

(order.cart ?? []).forEach((item) => {
  const qty = item.quantity ?? 0;
  const price = item.price ?? 0;
  const total = qty * price;

  subtotal += total;

  page.drawText(item.title ?? "-", {
    x: 50,
    y,
    size: 10,
    font,
  });

  page.drawText(String(qty), {
    x: 335,
    y,
    size: 10,
    font,
  });

  page.drawText(`₹${price}`, {
    x: 390,
    y,
    size: 10,
    font,
  });

  page.drawText(`₹${total}`, {
    x: 500,
    y,
    size: 10,
    font,
  });

  y -= 20;
});

y -= 20;

page.drawLine({
  start: { x: 40, y },
  end: { x: 555, y },
  thickness: 1,
  color: GRAY,
});

y -= 25;

page.drawText(`Subtotal : ₹${subtotal}`, {
  x: 360,
  y,
  size: 11,
  font,
});

y -= 18;

page.drawText(`Grand Total : ₹${order.total ?? 0}`, {
  x: 360,
  y,
  size: 13,
  font: bold,
  color: GOLD,
});

y -= 40;

// Continue in Part 3...
// ======================
// THANK YOU
// ======================

page.drawText(
  "Thank you for shopping with Kashmir Royale!",
  {
    x: 40,
    y,
    size: 18,
    font: bold,
    color: BLACK,
  }
);

y -= 25;

page.drawText(
  "Every Kashmir Royale product is handcrafted with care and authenticity.",
  {
    x: 40,
    y,
    size: 11,
    font,
    color: GRAY,
    maxWidth: 500,
  }
);

y -= 40;

// ======================
// FOOTER
// ======================

page.drawLine({
  start: { x: 40, y },
  end: { x: 555, y },
  thickness: 1,
  color: GOLD,
});

y -= 20;

page.drawText(
  "KASHMIR ROYALE SHAWLS",
  {
    x: 40,
    y,
    size: 13,
    font: bold,
    color: BLACK,
  }
);

y -= 18;

page.drawText(
  "Srinagar, Jammu & Kashmir, India",
  {
    x: 40,
    y,
    size: 10,
    font,
    color: GRAY,
  }
);

y -= 15;

page.drawText(
  "www.shopkashmirshawls.com",
  {
    x: 40,
    y,
    size: 10,
    font,
    color: GRAY,
  }
);

y -= 15;

page.drawText(
  "support@shopkashmirshawls.com",
  {
    x: 40,
    y,
    size: 10,
    font,
    color: GRAY,
  }
);

// ======================
// RETURN PDF BUFFER
// ======================

const pdfBytes = await pdfDoc.save();

return Buffer.from(pdfBytes);
}