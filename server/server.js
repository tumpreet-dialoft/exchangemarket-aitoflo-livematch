// server.js

require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const compression = require("compression");

const app = express();
const cors = require("cors");

const allowedOrigins = [
  "https://exchangemarket-aitoflo-livematch-1.onrender.com"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow curl / server-to-server
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
const PORT = process.env.PORT || 3000;

// ====== CONFIG ======
const ADMIN_SECRET = process.env.ADMIN_SECRET;
if (!ADMIN_SECRET) {
  console.error("ADMIN_SECRET is missing in environment variables.");
  process.exit(1);
}

// ====== MIDDLEWARE ======
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: "10kb" }));
app.disable("x-powered-by");

// ====== IN-MEMORY STORE ======
let matchData = {
  has_match: false,
  match_teams: "",
  match_time: "",
  match_venue: "",
  betting_odds: "",
  last_updated: new Date().toISOString(),
};

// ====== VALIDATION ======
function isValidPayload(body) {
  return (
    typeof body.has_match === "boolean" &&
    typeof body.match_teams === "string" &&
    typeof body.match_time === "string" &&
    typeof body.match_venue === "string" &&
    typeof body.betting_odds === "string"
  );
}

// ====== POST (ADMIN UPDATE) ======
app.post("/precall-match", (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || authHeader !== `Bearer ${ADMIN_SECRET}`) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!isValidPayload(req.body)) {
      return res.status(400).json({ error: "Invalid payload format" });
    }

    matchData = {
      ...req.body,
      last_updated: new Date().toISOString(),
    };

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// ====== HIGH-PERFORMANCE GET ======
app.get("/precall-match", (req, res) => {
  // Zero logic, direct memory read (can handle thousands of req/sec)
  res.setHeader("Cache-Control", "public, max-age=5");
  return res.json(matchData);
});

// ====== START ======
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});