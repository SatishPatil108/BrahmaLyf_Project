import express, { json, urlencoded } from "express";
import { createServer as createHttpsServer } from "https";
import cors from "cors";
import fs from "fs";
import mainRoutes from "./routes/main_routes.js";
import { NODE_ENV, PORT } from "./config/config.js";

const app = express();
const allowedOrigins = [
  "http://localhost:5173",        // ✅ Vite dev (MUST)
  "http://localhost:3002",        // local dev (if used)
  "http://192.168.0.115:3002",    // LAN dev
  "https://brahmalyf.com",        // production
  "https://www.brahmalyf.com"     // www
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow mobile apps / Postman

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(json({ limit: "100mb" }));
app.use(urlencoded({ extended: true, limit: "100mb" }));

app.use("/uploads", express.static("uploads"));
let server;
if (NODE_ENV === "production") {
  // ---------- PRODUCTION (SERVER) HTTPS ----------
  const sslOptions = {
    key: fs.readFileSync("/etc/letsencrypt/live/brahmalyf.com/privkey.pem"),
    cert: fs.readFileSync("/etc/letsencrypt/live/brahmalyf.com/fullchain.pem"),
  };

  server = createHttpsServer(sslOptions, app);
  console.log("🔐 Running in PRODUCTION mode (HTTPS enabled)");
} else {
  // ---------- LOCAL (DEVELOPMENT) HTTP ----------
  server = app;
  console.log("🌐 Running in DEVELOPMENT mode (HTTP only)");
}
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

mainRoutes(app);