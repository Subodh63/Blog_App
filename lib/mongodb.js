import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing Environment variable:"MONGODB');
}

const uri = process.env.MONGODB_URI;
const option = {};

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  // in development mode, use a globle varible so that the value.
  // is preserved across module reload caused by HMR (hot module replacement).

  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, option);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // in production mode, it is not required to keep the same client instance for every module in
  // the application
  client = new MongoClient(uri, option);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClint promise. by thi doing ina a
// separate module ,the client can be shared across function.

export default clientPromise;
