import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("MONGODB_URI is required");
  process.exit(1);
}

console.log("Connecting...");

mongoose
  .connect(uri)
  .then(() => {
    console.log("✅ CONNECTED");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ FAILED");
    console.error(err);
    process.exit(1);
  });