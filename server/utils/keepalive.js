// keepAlive.js
// Pings this server every 14 minutes so Render free tier doesn't spin down.
// Called once from index.js after server starts.

const https = require("https");
const http = require("http");

const RENDER_URL = process.env.RENDER_EXTERNAL_URL || "";

const keepAlive = () => {
  if (!RENDER_URL) {
    // Not on Render — skip
    return;
  }

  const interval = 14 * 60 * 1000; // 14 minutes

  setInterval(() => {
    const url = `${RENDER_URL}/api/health`;
    const client = url.startsWith("https") ? https : http;

    const req = client.get(url, (res) => {
      console.log(`[KeepAlive] Pinged ${url} → ${res.statusCode}`);
    });

    req.on("error", (err) => {
      console.warn(`[KeepAlive] Ping failed: ${err.message}`);
    });

    req.end();
  }, interval);

  console.log(` KeepAlive active — pinging every 14 min (${RENDER_URL})`);
};

module.exports = keepAlive;
