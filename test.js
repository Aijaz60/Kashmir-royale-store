const dns = require("node:dns");
dns.setServers(["1.1.1.1"]);

const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = "mongodb+srv://miraijaz2611_db_user:Zubair1234@cluster0.0ndtcfn.mongodb.net/kashmir-shawls?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  tls: true,
  tlsAllowInvalidCertificates: true,
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Connected");
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run();