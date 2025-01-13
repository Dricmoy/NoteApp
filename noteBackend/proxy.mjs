import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3001;
const SANITY_TOKEN = process.env.SANITY_TOKEN;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Sanity query endpoint
app.get("/proxy", async (req, res) => {
  const sanityUrl = "https://qejur137.api.sanity.io/v2023-01-01/data/query/production";
  const query = req.query.query;

  try {
    const response = await fetch(`${sanityUrl}?query=${encodeURIComponent(query)}`, {
      headers: {
        Authorization: `Bearer ${SANITY_TOKEN}`,
      },
    });

    if (!response.ok) {
      console.error(`Sanity API error: ${response.status}`);
      return res.status(response.status).json({ error: "Sanity API Error" });
    }

    const data = await response.json();
    console.log("Parsed Data:", data);

    res.json(data);
  } catch (err) {
    console.error("Error fetching data from Sanity:", err);
    res.status(500).json({ error: "Failed to fetch data from Sanity API" });
  }
});

// Sanity mutation endpoint
app.post("/proxy/mutate", express.json(), async (req, res) => {
  const sanityMutationUrl = "https://qejur137.api.sanity.io/v2023-01-01/data/mutate/production";
  const mutationBody = req.body;

  try {
    const response = await fetch(sanityMutationUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SANITY_TOKEN}`,
      },
      body: JSON.stringify(mutationBody),
    });

    if (!response.ok) {
      console.error(`Sanity API error: ${response.status}`);
      return res.status(response.status).json({ error: "Sanity API Error" });
    }

    const data = await response.json();
    console.log("Parsed Data:", data);

    res.json(data);
  } catch (err) {
    console.error("Error performing mutation:", err);
    res.status(500).json({ error: "Failed to perform mutation in Sanity API" });
  }
});

app.listen(port, () => {
  console.log(`Proxy server running at http://localhost:${port}`);
});
