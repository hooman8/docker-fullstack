import express from "express";
import fetch from "node-fetch";

const app = express();
const port = 3000;

async function checkUrl(url) {
  try {
    const response = await fetch(url);
    if (response.ok) {
      return `${url} is up.`;
    } else {
      return `${url} is down. Status: ${response.status}`;
    }
  } catch (error) {
    return `${url} is down. Error: ${error.message}`;
  }
}

app.get("/", async (req, res) => {
  const url = req.query.url;
  if (!url) {
    return res.status(400).send("URL query parameter is required");
  }
  const result = await checkUrl(url);
  res.send(result);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
