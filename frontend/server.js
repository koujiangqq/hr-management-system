const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const path = require("path");

const app = express();

console.log("Starting HR Management System Frontend Server...");

// API proxy middleware
const apiProxy = createProxyMiddleware("/api", {
  target: "http://backend:8080",
  changeOrigin: true,
  logLevel: "info"
});

// Use API proxy
app.use("/api", apiProxy);

// Static file serving
app.use(express.static(path.join(__dirname, "dist")));
app.use(express.static(path.join(__dirname, ".")));

// SPA routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`HR Management System Frontend running on port ${PORT}`);
});