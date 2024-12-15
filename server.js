import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();
const PORT = process.env.PORT || 5000;
dotenv.config();

app.use(
  cors({
    origin: "https://btw.barisbalci.de",
    credentials: true,
  })
);

app.use(
  "/api",
  createProxyMiddleware({
    target: process.env.TARGET_API,
    changeOrigin: true,
    pathRewrite: {
      "^/api": "",
    },
    onProxyRes: (proxyRes, req, res) => {
      proxyRes.headers["Access-Control-Allow-Origin"] =
        "https://btw.barisbalci.de";
      proxyRes.headers["Access-Control-Allow-Credentials"] = "true";
    },
    onProxyReq: (proxyReq, req, res) => {
      if (req.method === "OPTIONS") {
        res.setHeader(
          "Access-Control-Allow-Origin",
          "https://btw.barisbalci.de"
        );
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader(
          "Access-Control-Allow-Methods",
          "GET, POST, PUT, DELETE, OPTIONS"
        );
        res.setHeader(
          "Access-Control-Allow-Headers",
          "Content-Type, Authorization"
        );
        res.status(200).end();
      }
    },
  })
);

// ONLY FOR TEST
app.get("/", async (req, res) => {
  res.send("Working!");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on port ${PORT}`);
});
