import axios from 'axios';
import { formatInTimeZone } from 'date-fns-tz';



const API_KEY = process.env.CRICKET_API_KEY; 
const TARGET_SERIES = "World Cup"; // Or "IPL", "T20", "ODI"
const CACHE_SECONDS = 900; // 15 Minutes. (Keep this high to save money)

export default async function handler(req, res) {
    // 1. SETUP HEADERS FOR SCALABILITY
    // This tells Vercel's Edge Network to cache this response.
    // If 1000 people call in 1 second, Vercel serves the cached file without running this code 1000 times.
    res.setHeader('Cache-Control', `s-maxage=${CACHE_SECONDS}, stale-while-revalidate`);

    try {
        if (!API_KEY) throw new Error("Missing API Key");

        // 2. FETCH DATA FROM CRICKETDATA.ORG
        // We use the /matches endpoint to get upcoming/live games
        const apiUrl = `https://api.cricapi.com/v1/matches?apikey=${API_KEY}&offset=0`;
        
        console.log("Fetching fresh data from CricketData.org...");
        const response = await axios.get(apiUrl, { timeout: 4000 }); // 4s timeout prevents hanging
        
        if (response.data.status !== "success") {
            throw new Error("API Provider Error");
        }

        const matches = response.data.data;

        // 3. LOGIC: FIND THE BEST MATCH TO TALK ABOUT
        // Priority: 
        // A. Is there a match LIVE right now?
        // B. Is there a match UPCOMING in the next 24 hours?
        // C. Filter by Series (e.g., World Cup) or Big Teams (India)
        
        let selectedMatch = matches.find(m => 
            (m.series.includes(TARGET_SERIES) || m.name.includes("India")) && 
            m.matchStarted === true && 
            m.matchEnded === false
        );

        // If no live match, look for upcoming match (within 24 hours)
        if (!selectedMatch) {
            const now = new Date();
            const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
            
            selectedMatch = matches.find(m => 
                (m.series.includes(TARGET_SERIES) || m.name.includes("India")) &&
                new Date(m.dateTimeGMT) < tomorrow &&
                m.matchEnded === false
            );
        }

        // 4. PREPARE RESPONSE FOR HOOMAN LABS
        if (selectedMatch) {
            // Convert UTC Time to IST (Indian Standard Time) for the agent to speak
            const dateObj = new Date(selectedMatch.dateTimeGMT);
            const formattedDate = formatInTimeZone(dateObj, 'Asia/Kolkata', "do MMMM"); // e.g. 24th February
            const formattedTime = formatInTimeZone(dateObj, 'Asia/Kolkata', "h:mm a"); // e.g. 2:30 PM

            return res.status(200).json({
                has_match: true,
                match_teams: selectedMatch.name, // e.g. "India vs Pakistan"
                match_status: selectedMatch.matchStarted ? "live" : "upcoming",
                match_date: formattedDate,
                match_time: formattedTime,
                venue: selectedMatch.venue
            });
        }

        // 5. FALLBACK (No relevant matches found)
        return res.status(200).json({
            has_match: false,
            match_teams: "None",
            match_time: "None"
        });

    } catch (error) {
        console.error("Backend Error:", error.message);
        
        // FAIL SAFE: Never let the voice agent crash.
        // Return a valid JSON saying "no match" so the script continues smoothly.
        return res.status(200).json({
            has_match: false,
            error_log: "Data unavailable" 
        });
    }
}