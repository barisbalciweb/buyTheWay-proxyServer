import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();
const PORT = process.env.PORT || 5000;
dotenv.config();

app.use(cors());

app.use(
  "/api",
  createProxyMiddleware({
    target: process.env.TARGET_API,
    changeOrigin: true,
    pathRewrite: {
      "^/api": "",
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
