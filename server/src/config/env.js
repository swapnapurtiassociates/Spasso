/**
 * env.js — Environment variable loader
 *
 * This MUST be the very first import in index.js.
 * It finds and loads the .env file regardless of which directory
 * the server is started from (fixes Windows path issues).
 *
 * Search order:
 *   1. server/.env          (recommended — put your credentials here)
 *   2. project root .env    (fallback)
 */

import { createRequire } from "module";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const require = createRequire(import.meta.url);
const dotenv = require("dotenv");

// server/src/config/env.js  →  go up 3 levels to reach server/
const serverDir = resolve(__dirname, "..", "..");        // server/
const rootDir   = resolve(__dirname, "..", "..", ".."); // project root (2/)

const result1 = dotenv.config({ path: resolve(serverDir, ".env") });
const result2 = dotenv.config({ path: resolve(rootDir, ".env") });

const loaded = (!result1.error ? resolve(serverDir, ".env") : null) ||
               (!result2.error ? resolve(rootDir, ".env") : null);

if (loaded) {
  console.log(`[env] ✅ Loaded environment from: ${loaded}`);
} else {
  console.warn("[env] ⚠️  No .env file found — using system environment variables only");
}

// Debug: confirm critical vars are loaded
const vars = ["MONGODB_URI", "JWT_SECRET", "SMTP_HOST", "SMTP_USER", "PORT"];
const missing = vars.filter((v) => !process.env[v]);
if (missing.length > 0) {
  console.warn("[env] ⚠️  Missing env vars:", missing.join(", "));
} else {
  console.log("[env] ✅ All critical environment variables loaded");
}
