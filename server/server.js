require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_SECRET = process.env.ADMIN_SECRET || "your_secure_password";

app.use(helmet());
app.use(compression());
app.use(express.json({ limit: "10kb" }));
app.use(cors({
  origin: (origin, cb) => (!origin || ["https://exchangemarket-aitoflo-livematch-1.onrender.com"].includes(origin)) ? cb(null, true) : cb(new Error("CORS Error")),
  methods: ["GET", "POST"]
}));

const IPL_SCHEDULE = [
// MARCH MATCHES
{ start: "2026-03-28T14:00:00Z", end: "2026-03-28T18:30:00Z", data: { has_match: true, match_teams: "Sunrisers Hyderabad vs Royal Challengers Bengaluru", match_time: "07:30   par  ", match_venue: "M. Chinnaswamy Stadium, Bengaluru", betting_odds: "Match Completed" }},
{ start: "2026-03-29T14:00:00Z", end: "2026-03-29T18:30:00Z", data: { has_match: true, match_teams: "Kolkata Knight Riders vs Mumbai Indians", match_time: "07:30   par  ", match_venue: "Wankhede Stadium, Mumbai", betting_odds: "Match Completed" }},
{ start: "2026-03-30T14:00:00Z", end: "2026-03-30T18:30:00Z", data: { has_match: true, match_teams: "Chennai Super Kings vs Rajasthan Royals", match_time: "07:30   par  ", match_venue: "Barsapara Cricket Stadium, Guwahati", betting_odds: "Match Completed" }},
{ start: "2026-03-31T14:00:00Z", end: "2026-03-31T18:30:00Z", data: { has_match: true, match_teams: "Punjab Kings vs Gujarat Titans", match_time: "07:30   par  ", match_venue: "Maharaja Yadavindra Singh International Cricket Stadium, Mullanpur", betting_odds: "Available in Play" }},
// APRIL MATCHES
{ start: "2026-04-01T14:00:00Z", end: "2026-04-01T18:30:00Z", data: { has_match: true, match_teams: "Lucknow Super Giants vs Delhi Capitals", match_time: "07:30   par  ", match_venue: "Ekana Cricket Stadium, Lucknow", betting_odds: "Available in Play" }},
{ start: "2026-04-02T14:00:00Z", end: "2026-04-02T18:30:00Z", data: { has_match: true, match_teams: "Kolkata Knight Riders vs Sunrisers Hyderabad", match_time: "07:30   par  ", match_venue: "Eden Gardens, Kolkata", betting_odds: "Available in Play" }},
{ start: "2026-04-03T14:00:00Z", end: "2026-04-03T18:30:00Z", data: { has_match: true, match_teams: "Chennai Super Kings vs Punjab Kings", match_time: "07:30   par  ", match_venue: "MA Chidambaram Stadium, Chennai", betting_odds: "Available in Play" }},
{ start: "2026-04-04T10:00:00Z", end: "2026-04-04T14:30:00Z", data: { has_match: true, match_teams: "Delhi Capitals vs Mumbai Indians", match_time: "03:30   par  ", match_venue: "Arun Jaitley Stadium, Delhi", betting_odds: "Available in Play" }},
{ start: "2026-04-04T14:00:00Z", end: "2026-04-04T18:30:00Z", data: { has_match: true, match_teams: "Gujarat Titans vs Rajasthan Royals", match_time: "07:30   par  ", match_venue: "Narendra Modi Stadium, Ahmedabad", betting_odds: "Available in Play" }},
{ start: "2026-04-05T10:00:00Z", end: "2026-04-05T14:30:00Z", data: { has_match: true, match_teams: "Sunrisers Hyderabad vs Lucknow Super Giants", match_time: "03:30   par  ", match_venue: "Rajiv Gandhi International Stadium, Hyderabad", betting_odds: "Available in Play" }},
{ start: "2026-04-05T14:00:00Z", end: "2026-04-05T18:30:00Z", data: { has_match: true, match_teams: "Royal Challengers Bengaluru vs Chennai Super Kings", match_time: "07:30   par  ", match_venue: "M. Chinnaswamy Stadium, Bengaluru", betting_odds: "Available in Play" }},
{ start: "2026-04-06T14:00:00Z", end: "2026-04-06T18:30:00Z", data: { has_match: true, match_teams: "Kolkata Knight Riders vs Punjab Kings", match_time: "07:30   par  ", match_venue: "Eden Gardens, Kolkata", betting_odds: "Available in Play" }},
{ start: "2026-04-07T14:00:00Z", end: "2026-04-07T18:30:00Z", data: { has_match: true, match_teams: "Rajasthan Royals vs Mumbai Indians", match_time: "07:30   par  ", match_venue: "Barsapara Cricket Stadium, Guwahati", betting_odds: "Available in Play" }},
{ start: "2026-04-08T14:00:00Z", end: "2026-04-08T18:30:00Z", data: { has_match: true, match_teams: "Delhi Capitals vs Gujarat Titans", match_time: "07:30   par  ", match_venue: "Arun Jaitley Stadium, Delhi", betting_odds: "Available in Play" }},
{ start: "2026-04-09T14:00:00Z", end: "2026-04-09T18:30:00Z", data: { has_match: true, match_teams: "Kolkata Knight Riders vs Lucknow Super Giants", match_time: "07:30   par  ", match_venue: "Eden Gardens, Kolkata", betting_odds: "Available in Play" }},
{ start: "2026-04-10T14:00:00Z", end: "2026-04-10T18:30:00Z", data: { has_match: true, match_teams: "Rajasthan Royals vs Royal Challengers Bengaluru", match_time: "07:30   par  ", match_venue: "Barsapara Cricket Stadium, Guwahati", betting_odds: "Available in Play" }},
{ start: "2026-04-11T10:00:00Z", end: "2026-04-11T14:30:00Z", data: { has_match: true, match_teams: "Punjab Kings vs Sunrisers Hyderabad", match_time: "03:30   par  ", match_venue: "Mullanpur, Chandigarh", betting_odds: "Available in Play" }},
{ start: "2026-04-11T14:00:00Z", end: "2026-04-11T18:30:00Z", data: { has_match: true, match_teams: "Chennai Super Kings vs Delhi Capitals", match_time: "07:30   par  ", match_venue: "MA Chidambaram Stadium, Chennai", betting_odds: "Available in Play" }},
{ start: "2026-04-12T10:00:00Z", end: "2026-04-12T14:30:00Z", data: { has_match: true, match_teams: "Lucknow Super Giants vs Gujarat Titans", match_time: "03:30   par  ", match_venue: "Ekana Cricket Stadium, Lucknow", betting_odds: "Available in Play" }},
{ start: "2026-04-12T14:00:00Z", end: "2026-04-12T18:30:00Z", data: { has_match: true, match_teams: "Mumbai Indians vs Royal Challengers Bengaluru", match_time: "07:30   par  ", match_venue: "Wankhede Stadium, Mumbai", betting_odds: "Available in Play" }},
{ start: "2026-04-13T14:00:00Z", end: "2026-04-13T18:30:00Z", data: { has_match: true, match_teams: "Sunrisers Hyderabad vs Rajasthan Royals", match_time: "07:30   par  ", match_venue: "Rajiv Gandhi Stadium, Hyderabad", betting_odds: "Available in Play" }},
{ start: "2026-04-14T14:00:00Z", end: "2026-04-14T18:30:00Z", data: { has_match: true, match_teams: "Chennai Super Kings vs Kolkata Knight Riders", match_time: "07:30   par  ", match_venue: "MA Chidambaram Stadium, Chennai", betting_odds: "Available in Play" }},
{ start: "2026-04-15T14:00:00Z", end: "2026-04-15T18:30:00Z", data: { has_match: true, match_teams: "Royal Challengers Bengaluru vs Lucknow Super Giants", match_time: "07:30   par  ", match_venue: "M. Chinnaswamy Stadium, Bengaluru", betting_odds: "Available in Play" }},
{ start: "2026-04-16T14:00:00Z", end: "2026-04-16T18:30:00Z", data: { has_match: true, match_teams: "Mumbai Indians vs Punjab Kings", match_time: "07:30   par  ", match_venue: "Wankhede Stadium, Mumbai", betting_odds: "Available in Play" }},
{ start: "2026-04-17T14:00:00Z", end: "2026-04-17T18:30:00Z", data: { has_match: true, match_teams: "Gujarat Titans vs Kolkata Knight Riders", match_time: "07:30   par  ", match_venue: "Narendra Modi Stadium, Ahmedabad", betting_odds: "Available in Play" }},
{ start: "2026-04-18T10:00:00Z", end: "2026-04-18T14:30:00Z", data: { has_match: true, match_teams: "Royal Challengers Bengaluru vs Delhi Capitals", match_time: "03:30   par  ", match_venue: "M. Chinnaswamy Stadium, Bengaluru", betting_odds: "Available in Play" }},
{ start: "2026-04-18T14:00:00Z", end: "2026-04-18T18:30:00Z", data: { has_match: true, match_teams: "Sunrisers Hyderabad vs Chennai Super Kings", match_time: "07:30   par  ", match_venue: "Rajiv Gandhi Stadium, Hyderabad", betting_odds: "Available in Play" }},
{ start: "2026-04-19T10:00:00Z", end: "2026-04-19T14:30:00Z", data: { has_match: true, match_teams: "Kolkata Knight Riders vs Rajasthan Royals", match_time: "03:30   par  ", match_venue: "Eden Gardens, Kolkata", betting_odds: "Available in Play" }},
{ start: "2026-04-19T14:00:00Z", end: "2026-04-19T18:30:00Z", data: { has_match: true, match_teams: "Punjab Kings vs Lucknow Super Giants", match_time: "07:30   par  ", match_venue: "Mullanpur, Chandigarh", betting_odds: "Available in Play" }},
{ start: "2026-04-20T14:00:00Z", end: "2026-04-20T18:30:00Z", data: { has_match: true, match_teams: "Gujarat Titans vs Mumbai Indians", match_time: "07:30   par  ", match_venue: "Narendra Modi Stadium, Ahmedabad", betting_odds: "Available in Play" }},
{ start: "2026-04-21T14:00:00Z", end: "2026-04-21T18:30:00Z", data: { has_match: true, match_teams: "Sunrisers Hyderabad vs Delhi Capitals", match_time: "07:30   par  ", match_venue: "Rajiv Gandhi Stadium, Hyderabad", betting_odds: "Available in Play" }},
{ start: "2026-04-22T14:00:00Z", end: "2026-04-22T18:30:00Z", data: { has_match: true, match_teams: "Lucknow Super Giants vs Rajasthan Royals", match_time: "07:30   par  ", match_venue: "Ekana Cricket Stadium, Lucknow", betting_odds: "Available in Play" }},
{ start: "2026-04-23T14:00:00Z", end: "2026-04-23T18:30:00Z", data: { has_match: true, match_teams: "Mumbai Indians vs Chennai Super Kings", match_time: "07:30   par  ", match_venue: "Wankhede Stadium, Mumbai", betting_odds: "Available in Play" }},
{ start: "2026-04-24T14:00:00Z", end: "2026-04-24T18:30:00Z", data: { has_match: true, match_teams: "Royal Challengers Bengaluru vs Gujarat Titans", match_time: "07:30   par  ", match_venue: "M. Chinnaswamy Stadium, Bengaluru", betting_odds: "Available in Play" }},
{ start: "2026-04-25T10:00:00Z", end: "2026-04-25T14:30:00Z", data: { has_match: true, match_teams: "Delhi Capitals vs Punjab Kings", match_time: "03:30   par  ", match_venue: "Arun Jaitley Stadium, Delhi", betting_odds: "Available in Play" }},
{ start: "2026-04-25T14:00:00Z", end: "2026-04-25T18:30:00Z", data: { has_match: true, match_teams: "Rajasthan Royals vs Sunrisers Hyderabad", match_time: "07:30   par  ", match_venue: "Sawai Mansingh Stadium, Jaipur", betting_odds: "Available in Play" }},
{ start: "2026-04-26T10:00:00Z", end: "2026-04-26T14:30:00Z", data: { has_match: true, match_teams: "Gujarat Titans vs Chennai Super Kings", match_time: "03:30   par  ", match_venue: "Narendra Modi Stadium, Ahmedabad", betting_odds: "Available in Play" }},
{ start: "2026-04-26T14:00:00Z", end: "2026-04-26T18:30:00Z", data: { has_match: true, match_teams: "Lucknow Super Giants vs Kolkata Knight Riders", match_time: "07:30   par  ", match_venue: "Ekana Cricket Stadium, Lucknow", betting_odds: "Available in Play" }},
{ start: "2026-04-27T14:00:00Z", end: "2026-04-27T18:30:00Z", data: { has_match: true, match_teams: "Delhi Capitals vs Royal Challengers Bengaluru", match_time: "07:30   par  ", match_venue: "Arun Jaitley Stadium, Delhi", betting_odds: "Available in Play" }},
{ start: "2026-04-28T14:00:00Z", end: "2026-04-28T18:30:00Z", data: { has_match: true, match_teams: "Punjab Kings vs Rajasthan Royals", match_time: "07:30   par  ", match_venue: "Mullanpur, Chandigarh", betting_odds: "Available in Play" }},
{ start: "2026-04-29T14:00:00Z", end: "2026-04-29T18:30:00Z", data: { has_match: true, match_teams: "Mumbai Indians vs Sunrisers Hyderabad", match_time: "07:30   par  ", match_venue: "Wankhede Stadium, Mumbai", betting_odds: "Available in Play" }},
{ start: "2026-04-30T14:00:00Z", end: "2026-04-30T18:30:00Z", data: { has_match: true, match_teams: "Gujarat Titans vs Royal Challengers Bengaluru", match_time: "07:30   par  ", match_venue: "Narendra Modi Stadium, Ahmedabad", betting_odds: "Available in Play" }},
// MAY MATCHES
{ start: "2026-05-01T14:00:00Z", end: "2026-05-01T18:30:00Z", data: { has_match: true, match_teams: "Rajasthan Royals vs Delhi Capitals", match_time: "07:30   par  ", match_venue: "Sawai Mansingh Stadium, Jaipur", betting_odds: "Available in Play" }},
{ start: "2026-05-02T14:00:00Z", end: "2026-05-02T18:30:00Z", data: { has_match: true, match_teams: "Chennai Super Kings vs Mumbai Indians", match_time: "07:30   par  ", match_venue: "MA Chidambaram Stadium, Chennai", betting_odds: "Available in Play" }},
{ start: "2026-05-03T10:00:00Z", end: "2026-05-03T14:30:00Z", data: { has_match: true, match_teams: "Sunrisers Hyderabad vs Kolkata Knight Riders", match_time: "03:30   par  ", match_venue: "Rajiv Gandhi Stadium, Hyderabad", betting_odds: "Available in Play" }},
{ start: "2026-05-03T14:00:00Z", end: "2026-05-03T18:30:00Z", data: { has_match: true, match_teams: "Gujarat Titans vs Punjab Kings", match_time: "07:30   par  ", match_venue: "Narendra Modi Stadium, Ahmedabad", betting_odds: "Available in Play" }},
{ start: "2026-05-04T14:00:00Z", end: "2026-05-04T18:30:00Z", data: { has_match: true, match_teams: "Mumbai Indians vs Lucknow Super Giants", match_time: "07:30   par  ", match_venue: "Wankhede Stadium, Mumbai", betting_odds: "Available in Play" }},
{ start: "2026-05-05T14:00:00Z", end: "2026-05-05T18:30:00Z", data: { has_match: true, match_teams: "Delhi Capitals vs Chennai Super Kings", match_time: "07:30   par  ", match_venue: "Arun Jaitley Stadium, Delhi", betting_odds: "Available in Play" }},
{ start: "2026-05-06T14:00:00Z", end: "2026-05-06T18:30:00Z", data: { has_match: true, match_teams: "Sunrisers Hyderabad vs Punjab Kings", match_time: "07:30   par  ", match_venue: "Rajiv Gandhi Stadium, Hyderabad", betting_odds: "Available in Play" }},
{ start: "2026-05-07T14:00:00Z", end: "2026-05-07T18:30:00Z", data: { has_match: true, match_teams: "Lucknow Super Giants vs Royal Challengers Bengaluru", match_time: "07:30   par  ", match_venue: "Ekana Cricket Stadium, Lucknow", betting_odds: "Available in Play" }},
{ start: "2026-05-08T14:00:00Z", end: "2026-05-08T18:30:00Z", data: { has_match: true, match_teams: "Delhi Capitals vs Kolkata Knight Riders", match_time: "07:30   par  ", match_venue: "Arun Jaitley Stadium, Delhi", betting_odds: "Available in Play" }},
{ start: "2026-05-09T14:00:00Z", end: "2026-05-09T18:30:00Z", data: { has_match: true, match_teams: "Rajasthan Royals vs Gujarat Titans", match_time: "07:30   par  ", match_venue: "Sawai Mansingh Stadium, Jaipur", betting_odds: "Available in Play" }},
{ start: "2026-05-10T10:00:00Z", end: "2026-05-10T14:30:00Z", data: { has_match: true, match_teams: "Chennai Super Kings vs Lucknow Super Giants", match_time: "03:30   par  ", match_venue: "MA Chidambaram Stadium, Chennai", betting_odds: "Available in Play" }},
{ start: "2026-05-10T14:00:00Z", end: "2026-05-10T18:30:00Z", data: { has_match: true, match_teams: "Royal Challengers Bengaluru vs Mumbai Indians", match_time: "07:30   par  ", match_venue: "Shaheed Veer Narayan Singh Stadium, Raipur", betting_odds: "Available in Play" }},
{ start: "2026-05-11T14:00:00Z", end: "2026-05-11T18:30:00Z", data: { has_match: true, match_teams: "Punjab Kings vs Delhi Capitals", match_time: "07:30   par  ", match_venue: "HPCA Stadium, Dharamsala", betting_odds: "Available in Play" }},
{ start: "2026-05-12T14:00:00Z", end: "2026-05-12T18:30:00Z", data: { has_match: true, match_teams: "Gujarat Titans vs Sunrisers Hyderabad", match_time: "07:30   par  ", match_venue: "Narendra Modi Stadium, Ahmedabad", betting_odds: "Available in Play" }},
{ start: "2026-05-13T14:00:00Z", end: "2026-05-13T18:30:00Z", data: { has_match: true, match_teams: "Royal Challengers Bengaluru vs Kolkata Knight Riders", match_time: "07:30   par  ", match_venue: "Shaheed Veer Narayan Singh Stadium, Raipur", betting_odds: "Available in Play" }},
{ start: "2026-05-14T14:00:00Z", end: "2026-05-14T18:30:00Z", data: { has_match: true, match_teams: "Punjab Kings vs Mumbai Indians", match_time: "07:30   par  ", match_venue: "HPCA Stadium, Dharamsala", betting_odds: "Available in Play" }},
{ start: "2026-05-15T14:00:00Z", end: "2026-05-15T18:30:00Z", data: { has_match: true, match_teams: "Lucknow Super Giants vs Chennai Super Kings", match_time: "07:30   par  ", match_venue: "Ekana Cricket Stadium, Lucknow", betting_odds: "Available in Play" }},
{ start: "2026-05-16T14:00:00Z", end: "2026-05-16T18:30:00Z", data: { has_match: true, match_teams: "Kolkata Knight Riders vs Gujarat Titans", match_time: "07:30   par  ", match_venue: "Eden Gardens, Kolkata", betting_odds: "Available in Play" }},
{ start: "2026-05-17T10:00:00Z", end: "2026-05-17T14:30:00Z", data: { has_match: true, match_teams: "Punjab Kings vs Royal Challengers Bengaluru", match_time: "03:30   par  ", match_venue: "HPCA Stadium, Dharamsala", betting_odds: "Available in Play" }},
{ start: "2026-05-17T14:00:00Z", end: "2026-05-17T18:30:00Z", data: { has_match: true, match_teams: "Delhi Capitals vs Rajasthan Royals", match_time: "07:30   par  ", match_venue: "Arun Jaitley Stadium, Delhi", betting_odds: "Available in Play" }},
{ start: "2026-05-18T14:00:00Z", end: "2026-05-18T18:30:00Z", data: { has_match: true, match_teams: "Chennai Super Kings vs Sunrisers Hyderabad", match_time: "07:30   par  ", match_venue: "MA Chidambaram Stadium, Chennai", betting_odds: "Available in Play" }},
{ start: "2026-05-19T14:00:00Z", end: "2026-05-19T18:30:00Z", data: { has_match: true, match_teams: "Rajasthan Royals vs Lucknow Super Giants", match_time: "07:30   par  ", match_venue: "Sawai Mansingh Stadium, Jaipur", betting_odds: "Available in Play" }},
{ start: "2026-05-20T14:00:00Z", end: "2026-05-20T18:30:00Z", data: { has_match: true, match_teams: "Kolkata Knight Riders vs Mumbai Indians", match_time: "07:30   par  ", match_venue: "Eden Gardens, Kolkata", betting_odds: "Available in Play" }},
{ start: "2026-05-21T14:00:00Z", end: "2026-05-21T18:30:00Z", data: { has_match: true, match_teams: "Chennai Super Kings vs Gujarat Titans", match_time: "07:30   par  ", match_venue: "MA Chidambaram Stadium, Chennai", betting_odds: "Available in Play" }},
{ start: "2026-05-22T14:00:00Z", end: "2026-05-22T18:30:00Z", data: { has_match: true, match_teams: "Sunrisers Hyderabad vs Royal Challengers Bengaluru", match_time: "07:30   par  ", match_venue: "Rajiv Gandhi Stadium, Hyderabad", betting_odds: "Available in Play" }},
{ start: "2026-05-23T14:00:00Z", end: "2026-05-23T18:30:00Z", data: { has_match: true, match_teams: "Lucknow Super Giants vs Punjab Kings", match_time: "07:30   par  ", match_venue: "Ekana Cricket Stadium, Lucknow", betting_odds: "Available in Play" }},
{ start: "2026-05-24T10:00:00Z", end: "2026-05-24T14:30:00Z", data: { has_match: true, match_teams: "Mumbai Indians vs Rajasthan Royals", match_time: "03:30   par  ", match_venue: "Wankhede Stadium, Mumbai", betting_odds: "Available in Play" }},
{ start: "2026-05-24T14:00:00Z", end: "2026-05-24T18:30:00Z", data: { has_match: true, match_teams: "Kolkata Knight Riders vs TBA", match_time: "07:30   par  ", match_venue: "Eden Gardens, Kolkata", betting_odds: "Available in Play" }},
];


const DEFAULT_STATE = { has_match: false, match_teams: "Season Completed", match_time: "Check back next year", match_venue: "N/A", betting_odds: "N/A" };
let manualOverride = null;

function getActiveMatch() {
  if (manualOverride) return manualOverride;
  const now = new Date();
  
  // 1. Search for Live
  const liveMatch = IPL_SCHEDULE.find(m => now >= new Date(m.start) && now <= new Date(m.end));
  if (liveMatch) return liveMatch.data;

  // 2. Search for Next Upcoming
  const upcomingMatch = IPL_SCHEDULE.find(m => now < new Date(m.start));
  if (upcomingMatch) return upcomingMatch.data;

  return DEFAULT_STATE;
}

app.get("/precall-match", (req, res) => {
  res.setHeader("Cache-Control", "public, max-age=10");
  return res.json(getActiveMatch());
});

app.post("/precall-match", (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || authHeader !== `Bearer ${ADMIN_SECRET}`) return res.status(401).json({ error: "Unauthorized" });
  if (req.body.reset) { manualOverride = null; return res.json({ success: true }); }
  manualOverride = { ...req.body, last_updated: new Date().toISOString() };
  return res.status(200).json({ success: true });
});

app.listen(PORT, () => console.log(`Server Live on Port ${PORT}`));