import mongoose from "mongoose";

const uri =
  "mongodb+srv://REQ:ozO7O7wARsarzuhn@cluster0.lvfpel0.mongodb.net/swapnapurti?retryWrites=true&w=majority&appName=Cluster0";

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