import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createProxyMiddleware } from "http-proxy-middleware";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
const nodeEnv = process.env.NODE_ENV;
const clientURL =
  nodeEnv === "prod" ? process.env.CLIENT_URL_PROD : process.env.CLIENT_URL_DEV;
const apiURL =
  nodeEnv === "prod" ? process.env.API_URL_PROD : process.env.API_URL_DEV;

app.use(
  cors({
    origin: clientURL,
    credentials: true,
  })
);

app.use(
  "/api",
  createProxyMiddleware({
    target: apiURL,
    changeOrigin: true,
    pathRewrite: {
      "^/api": "",
    },
    onProxyReq: (proxyReq, req) => {
      if (req.headers.cookie) {
        proxyReq.setHeader("Cookie", req.headers.cookie);
      }

      if (req.headers.authorization) {
        proxyReq.setHeader("Authorization", req.headers.authorization);
      }
    },
  })
);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on port ${PORT}`);
});
