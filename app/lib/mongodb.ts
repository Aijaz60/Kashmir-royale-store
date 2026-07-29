import dns from "node:dns";

// Force Node.js to use public DNS servers
dns.setServers(["1.1.1.1", "8.8.8.8"]);

import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;

if (!uri) {
  throw new Error("Please add MONGODB_URI to .env.local");
}

const client = new MongoClient(uri);

const clientPromise = client.connect();

export default clientPromise;