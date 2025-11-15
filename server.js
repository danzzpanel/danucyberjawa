const express = require("express");
const fetch = require("node-fetch").default;
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// ambil ENV dari file .env
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = "tiktok-video-downloader-api.p.rapidapi.com";

if (!RAPIDAPI_KEY) {
    console.log(`
⚠️ RAPIDAPI_KEY belum diisi!
Buat file .env lalu tambah:

RAPIDAPI_KEY=ace85d7d86msh03c5be96d7bd343p1cc227jsn4f2e51454626
`);
}

app.post("/api/download", async (req, res) => {
    const { videoUrl } = req.body || {};

    if (!videoUrl) {
        return res.status(400).json({ error: "videoUrl wajib diisi" });
    }

    try {
        const endpoint = `https://${RAPIDAPI_HOST}/media?videoUrl=${encodeURIComponent(videoUrl)}`;

        const response = await fetch(endpoint, {
            method: "GET",
            headers: {
                "x-rapidapi-key": RAPIDAPI_KEY,
                "x-rapidapi-host": RAPIDAPI_HOST,
            },
        });

        const result = await response.json();
        res.json(result);

    } catch (err) {
        res.status(500).json({
            error: "SERVER_ERROR",
            details: err.message,
        });
    }
});

app.get("/", (req, res) => {
    res.send("Server TikTok Downloader Berjalan ✔️");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server berjalan di port", PORT);
});