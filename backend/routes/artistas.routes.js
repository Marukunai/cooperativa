const express = require("express");
const router = express.Router();
const { getArtistData } = require("../utils/spotify");

// Reemplaza estos IDs por los reales de tus amigos
const ARTIST_IDS = [
  "1Xyo4u8uXC1ZmMpatF05PJ", // Ejemplo: The Weeknd
  "6eUKZXaKkcviH0Ku9w2n3V", // Ejemplo: Ed Sheeran
  "66CXWjxzNUsdJxJ2JdwvnR"  // Ejemplo: Ariana Grande
];

router.get("/", async (req, res) => {
  try {
    const artists = await Promise.all(ARTIST_IDS.map(getArtistData));
    res.json(artists);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener artistas de Spotify" });
  }
});

module.exports = router;
