import { app, connectDB } from "../server/src/index.js";

let databasePromise;

export default async function handler(req, res) {
  databasePromise ??= connectDB();
  await databasePromise;
  return app(req, res);
}