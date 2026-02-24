require("dotenv").config();

const express = require("express");
const axios = require("axios");
const cron = require("node-cron");
const compression = require("compression");
const helmet = require("helmet");

const app = express();
app.use(compression()); // gzip compression
app.use(helmet()); // security headers

const PORT = process.env.PORT || 10000;
const CRICKET_API_KEY = process.env.CRICKET_API_KEY;

// In-memory cache
let cachedMatchData = {
  has_match: false,
  match_teams: "",
  match_time: "",
  match_venue: "",
  betting_odds: "India win par 1.8 ka rate",
};

let lastUpdated = null;

// Fetch match data from CricketData.org
async function fetchMatchData() {
  try {
    console.log("Fetching match data from CricketData API...");

    const response = await axios.get(
      `https://api.cricketdata.org/v1/matches?apikey=${CRICKET_API_KEY}&status=live`
    );

    const matches = response.data?.data;

    if (matches && matches.length > 0) {
      const match = matches[0];

      cachedMatchData = {
        has_match: true,
        match_teams: `${match.teamInfo[0].name} vs ${match.teamInfo[1].name}`,
        match_time: new Date(match.dateTimeGMT).toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        match_venue: match.venue,
        betting_odds: "India win par 1.8 ka rate",
      };
    } else {
      cachedMatchData.has_match = false;
    }

    lastUpdated = new Date();
    console.log("Match cache updated.");
  } catch (error) {
    console.error("Error fetching match data:", error.message);
  }
}

// 🔁 Refresh every 10 minutes (safe for free plan)
cron.schedule("*/10 * * * *", async () => {
  await fetchMatchData();
});

// Initial fetch on startup
fetchMatchData();

// 🚀 Single Production Endpoint
app.get("/precall-match", (req, res) => {
  res.set("Cache-Control", "public, max-age=60");

  res.status(200).json({
    ...cachedMatchData,
    last_updated: lastUpdated,
  });
});

// Health check (important for Render)
app.get("/", (req, res) => {
  res.send("AI Match Middleware Running 🚀");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});