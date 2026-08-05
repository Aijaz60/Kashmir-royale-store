import clientPromise from "./mongodb";

export interface WebsiteSettings {
  logo: string;
  websiteName: string;
  tagline: string;

  phone: string;
  whatsapp: string;
  email: string;
  address: string;

  instagram: string;
  facebook: string;
  youtube: string;
  twitter: string;

  shippingCharge: string;
  freeShippingAbove: string;

  indiaDeliveryDays: string;
  internationalDeliveryDays: string;
}

const DEFAULT_SETTINGS: WebsiteSettings = {
  logo: "",

  websiteName: "Kashmir Royale",
  tagline: "Authentic Kashmiri Shawls",

  phone: "",
  whatsapp: "",
  email: "",
  address: "",

  instagram: "",
  facebook: "",
  youtube: "",
  twitter: "",

  shippingCharge: "0",
  freeShippingAbove: "0",

  indiaDeliveryDays: "10",
  internationalDeliveryDays: "20",
};

export async function getWebsiteSettings(): Promise<WebsiteSettings> {
  try {
    const client = await clientPromise;

    const db = client.db("kashmir-shawls");

    const settings = await db
      .collection<any>("settings")
      .findOne({
        _id: "website-settings",
      });

    if (!settings) {
      return DEFAULT_SETTINGS;
    }

    return {
      ...DEFAULT_SETTINGS,
      ...settings,
    };
  } catch (error) {
    console.error("SETTINGS ERROR:", error);

    return DEFAULT_SETTINGS;
  }
}