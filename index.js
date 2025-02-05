import express from "express";
import { URL } from "url";
import dns from "dns";
import { promisify } from "util";

const app = express();
const port = 3000;
const dnsLookup = promisify(dns.lookup);

// Allow only specific domains
const allowedDomains = ["google.com", "github.com"];

async function isAllowedUrl(userUrl) {
  try {
    const parsedUrl = new URL(userUrl);
    const hostname = parsedUrl.hostname;

    // Deny private IPs
    const { address } = await dnsLookup(hostname);
    if (
      address.startsWith("127.") || // Loopback
      address.startsWith("10.") || // Private network
      address.startsWith("192.168.") // Private network
    ) {
      return false;
    }

    // Allow only specific domains
    if (!allowedDomains.some((domain) => hostname.endsWith(domain))) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}

async function checkUrl(url) {
  try {
    if (!(await isAllowedUrl(url))) {
      return "Invalid or unauthorized URL.";
    }

    const response = await fetch(url);
    return response.ok
      ? `${url} is up.`
      : `${url} is down. Status: ${response.status}`;
  } catch (error) {
    return `${url} is down. Error: ${error.message}`;
  }
}

app.get("/", async (req, res) => {
  const url = req.query.url;
  if (!url) {
    return res.status(400).send("URL query parameter is required.");
  }
  const result = await checkUrl(url);
  res.send(result);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
