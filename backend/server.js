import express, { json, urlencoded } from "express";
import { createServer as createHttpsServer } from "https";
import { createServer as createHttpServer } from "http";
import cors from "cors";
import fs from "fs";
import mainRoutes from "./routes/main_routes.js";
import { NODE_ENV, PORT } from "./config/config.js";
import "./commons/AddTrackingQuestionCorn.js";
import "./commons/AddToolsQuestionCorn.js";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3002",
      "http://192.168.0.120:3002",
      "https://brahmalyf.com",
      "https://www.brahmalyf.com",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(json({ limit: "100mb" }));
app.use(urlencoded({ extended: true, limit: "100mb" }));

app.use("/uploads", express.static("uploads"));

mainRoutes(app);

let server;

if (NODE_ENV === "production") {
  const sslOptions = {
    key: fs.readFileSync("/etc/letsencrypt/live/brahmalyf.com/privkey.pem"),
    cert: fs.readFileSync("/etc/letsencrypt/live/brahmalyf.com/fullchain.pem"),
  };

  // HTTPS server
  createHttpsServer(sslOptions, app).listen(443, () => {
    console.log("✅ HTTPS Server running on port 443");
  });

  // HTTP redirect server
  createHttpServer((req, res) => {
    res.writeHead(301, {
      Location: "https://" + req.headers.host + req.url,
    });
    res.end();
  }).listen(80);
} else {
  createHttpServer(app).listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 HTTP Server running on port ${PORT}`);
  });
}
