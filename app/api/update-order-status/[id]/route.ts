import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongodb";

const SHIPROCKET_BASE_URL =
  "https://apiv2.shiprocket.in/v1/external";

const ORDERS_COLLECTION = "orders";

type RouteContext = {
  params: Promise<{ id: string }>;
};

async function getShiprocketToken(): Promise<string> {
  const email = process.env.SHIPROCKET_EMAIL;
  const password = process.env.SHIPROCKET_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "SHIPROCKET_EMAIL ya SHIPROCKET_PASSWORD .env.local mein missing hai"
    );
  }

  const response = await fetch(
    `${SHIPROCKET_BASE_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
      cache: "no-store",
    }
  );

  const rawText = await response.text();

  let data: any;

  try {
    data = JSON.parse(rawText);
  } catch {
    throw new Error(
      `Shiprocket login invalid response. HTTP ${response.status}`
    );
  }

  if (!response.ok || !data?.token) {
    throw new Error(
      `Shiprocket login failed. HTTP ${response.status}: ${
        data?.message || rawText
      }`
    );
  }

  return data.token;
}

function getFirstValue(...values: any[]) {
  return values.find(
    (value) =>
      value !== undefined &&
      value !== null &&
      String(value).trim() !== ""
  );
}

async function updateOrderStatus(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid order ID",
        },
        { status: 400 }
      );
    }

    let body: any = {};

    try {
      body = await request.json();
    } catch {
      body = {};
    }

    const rawOrderStatus =
      body?.orderStatus ||
      body?.status ||
      body?.newStatus;

    const orderStatus = String(rawOrderStatus || "").trim();
    const normalizedStatus = orderStatus.toLowerCase();

    if (!orderStatus) {
      return NextResponse.json(
        {
          success: false,
          message: "Order status is required",
        },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const database = client.db("kashmir-shawls");
    const ordersCollection = database.collection(
      ORDERS_COLLECTION
    );

    const orderObjectId = new ObjectId(id);

    const order = await ordersCollection.findOne({
      _id: orderObjectId,
    });

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found",
        },
        { status: 404 }
      );
    }

    /*
     * Shipped ke ilawa normal status update.
     * Shiprocket sirf tab call hoga jab status "Shipped" ho,
     * chahe frontend se shipped, SHIPPED ya " Shipped " aaye.
     */
    if (normalizedStatus !== "shipped") {
      const updateResult = await ordersCollection.updateOne(
        {
          _id: orderObjectId,
        },
        {
          $set: {
            orderStatus,
            updatedAt: new Date(),
          },
        }
      );

      return NextResponse.json({
        success: updateResult.acknowledged,
        message: "Order status updated successfully",
        orderStatus,
      });
    }

    /*
     * Duplicate Shiprocket shipment prevent karein.
     */
    if (
      order.shiprocketOrderId ||
      order.shiprocketShipmentId
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This order has already been sent to Shiprocket",
          shiprocketOrderId:
            order.shiprocketOrderId || null,
          shiprocketShipmentId:
            order.shiprocketShipmentId || null,
        },
        { status: 409 }
      );
    }

    console.log(
      "[SHIPROCKET DEBUG] Step 1: Getting token"
    );

    const token = await getShiprocketToken();

    console.log(
      "[SHIPROCKET DEBUG] Step 2: Token obtained"
    );

    const shippingAddress =
  order.shippingAddress ||
  order.address ||
  order.customer ||
  {};
   const rawItems = Array.isArray(order.items)
  ? order.items
  : Array.isArray(order.cart)
    ? order.cart
    : [];

    const orderItems = rawItems.map(
      (item: any, index: number) => ({
       name: String(
  getFirstValue(
    item.name,
    item.title,
    item.productName,
    "Product"
  )
),

        sku: String(
          getFirstValue(
            item.sku,
            item.productId,
            item._id,
            `SKU-${index + 1}`
          )
        ),

        units: Math.max(
          1,
          Number(
            getFirstValue(
              item.quantity,
              item.qty,
              1
            )
          )
        ),

        selling_price: Number(
          getFirstValue(
            item.price,
            item.sellingPrice,
            0
          )
        ),

        discount: 0,
        tax: 0,
        hsn: String(item.hsn || ""),
      })
    );

    if (orderItems.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Order mein koi product item nahi mila",
        },
        { status: 400 }
      );
    }

    const customerName = String(
      getFirstValue(
        shippingAddress.firstName,
        shippingAddress.name,
        order.customerName,
        "Customer"
      )
    );

    const customerLastName = String(
      getFirstValue(
        shippingAddress.lastName,
        ""
      )
    );

    const customerAddress = String(
      getFirstValue(
        shippingAddress.address,
        shippingAddress.addressLine1,
        shippingAddress.street,
        ""
      )
    );

    const customerAddress2 = String(
      getFirstValue(
        shippingAddress.addressLine2,
        ""
      )
    );

    const customerCity = String(
      getFirstValue(
        shippingAddress.city,
        ""
      )
    );

    const customerPincode = String(
      getFirstValue(
        shippingAddress.pincode,
        shippingAddress.postalCode,
        shippingAddress.zip,
        ""
      )
    );

    const customerState = String(
      getFirstValue(
        shippingAddress.state,
        ""
      )
    );

    const customerCountry = String(
      getFirstValue(
        shippingAddress.country,
        "India"
      )
    );

   const customerEmail = String(
  getFirstValue(
    shippingAddress.email,
    order.customer?.email,
    order.email,
    order.customerEmail,
    ""
  )
);

   const customerPhone = String(
  getFirstValue(
    shippingAddress.phone,
    order.customer?.phone,
    order.phone,
    order.customerPhone,
    ""
  )
);

    if (
      !customerAddress ||
      !customerCity ||
      !customerPincode ||
      !customerState ||
      !customerPhone
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Shipping address incomplete hai. Address, city, pincode, state aur phone check karein.",
        },
        { status: 400 }
      );
    }

    const paymentMethod =
      String(
        getFirstValue(
          order.paymentMethod,
          "COD"
        )
      ).toUpperCase() === "COD"
        ? "COD"
        : "Prepaid";

    const subtotal = Number(
      getFirstValue(
        order.subtotal,
        order.subTotal,
        order.totalAmount,
        order.amount,
        order.total,
        0
      )
    );

    const createdAt = order.createdAt
      ? new Date(order.createdAt)
      : new Date();

    /*
     * IMPORTANT:
     * "Home" ko Shiprocket dashboard ke pickup-location
     * ke exact naam se replace karein agar naam different hai.
     */
    const pickupLocation =
      process.env.SHIPROCKET_PICKUP_LOCATION || "Home";

    const shiprocketPayload = {
      order_id: String(order._id),

      order_date: createdAt
        .toISOString()
        .slice(0, 19)
        .replace("T", " "),

      pickup_location: pickupLocation,

      billing_customer_name: customerName,
      billing_last_name: customerLastName,
      billing_address: customerAddress,
      billing_address_2: customerAddress2,
      billing_city: customerCity,
      billing_pincode: customerPincode,
      billing_state: customerState,
      billing_country: customerCountry,
      billing_email: customerEmail,
      billing_phone: customerPhone,

      shipping_is_billing: true,

      shipping_customer_name: customerName,
      shipping_last_name: customerLastName,
      shipping_address: customerAddress,
      shipping_address_2: customerAddress2,
      shipping_city: customerCity,
      shipping_pincode: customerPincode,
      shipping_state: customerState,
      shipping_country: customerCountry,
      shipping_email: customerEmail,
      shipping_phone: customerPhone,

      order_items: orderItems,
      payment_method: paymentMethod,
      sub_total: subtotal,

      length: 10,
      breadth: 10,
      height: 10,
      weight: 0.5,
    };

    console.log(
      "[SHIPROCKET DEBUG] Step 3: Sending request to Shiprocket"
    );
console.log("[SHIPROCKET DEBUG] Request started");
    const shiprocketResponse = await fetch(
      
      `${SHIPROCKET_BASE_URL}/orders/create/adhoc`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(shiprocketPayload),
        cache: "no-store",
      }
    );

    console.log(
      "[SHIPROCKET DEBUG] Step 4: HTTP Status:",
      shiprocketResponse.status,
      shiprocketResponse.statusText
    );

    const rawText = await shiprocketResponse.text();

    let shiprocketData: any;

    try {
      shiprocketData = JSON.parse(rawText);
    } catch {
      console.error(
        "[SHIPROCKET DEBUG] Invalid JSON response:",
        rawText
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Shiprocket returned an invalid response",
          httpStatus: shiprocketResponse.status,
        },
        { status: 502 }
      );
    }

    console.log(
      "[SHIPROCKET DEBUG] Step 5: Raw response:",
      shiprocketData
    );

    if (
      !shiprocketResponse.ok ||
      !shiprocketData?.order_id
    ) {
      console.error(
        "[SHIPROCKET DEBUG] Shiprocket rejected the order:",
        shiprocketData
      );

      return NextResponse.json(
        {
          success: false,
          message:
            shiprocketData?.message ||
            "Shiprocket rejected the order",
          httpStatus: shiprocketResponse.status,
          shiprocketResponse: shiprocketData,
        },
        {
          status:
            shiprocketResponse.status || 502,
        }
      );
    }

    console.log(
      "[SHIPROCKET DEBUG] Step 7: Shiprocket order created successfully"
    );

    await ordersCollection.updateOne(
      {
        _id: orderObjectId,
      },
      {
        $set: {
          shiprocketOrderId:
            shiprocketData.order_id,

          shiprocketShipmentId:
            shiprocketData.shipment_id || null,

          shiprocketResponse: shiprocketData,

          orderStatus: "Shipped",

          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({
      success: true,
      message:
        "Order shipped through Shiprocket successfully",

      orderStatus: "Shipped",

      shiprocketOrderId:
        shiprocketData.order_id,

      shiprocketShipmentId:
        shiprocketData.shipment_id || null,
    });
  } catch (error: any) {
    console.error(
      "[SHIPROCKET DEBUG] Server error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error?.message ||
          "Failed to update order status",
      },
      { status: 500 }
    );
  }
}

/*
 * Frontend agar PATCH bheje.
 */
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  return updateOrderStatus(request, context);
}

/*
 * Frontend agar POST bheje.
 */
export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  return updateOrderStatus(request, context);
}
/*
 * Frontend agar PUT bheje.
 */
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  return updateOrderStatus(request, context);
}