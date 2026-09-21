import { app, connectDB } from "../server/src/index.js";

let databasePromise;

export default async function handler(req, res) {
  try {
    databasePromise ??= connectDB();
    await databasePromise;
    return app(req, res);
  } catch (error) {
    databasePromise = undefined;
    console.error("[api] Backend initialization failed:", error.message);
    return res.status(503).json({ message: "The enquiry service is temporarily unavailable. Please try again shortly." });
  }
}