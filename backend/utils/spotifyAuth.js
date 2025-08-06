// 📁 backend/utils/spotifyAuth.js
const axios = require("axios");
const qs = require("qs");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

// Comprobación para asegurar que se han cargado las variables
if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
  console.error("❌ No se encontraron las credenciales de Spotify en el archivo .env");
} else {
  console.log("✅ CLIENT ID:", process.env.SPOTIFY_CLIENT_ID);
}

let cachedToken = null;
let tokenExpiration = null;

async function getSpotifyToken() {
  const now = new Date();

  if (cachedToken && tokenExpiration && now < tokenExpiration) {
    return cachedToken;
  }

  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;

  const authString = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64");

  const response = await axios.post(
    "https://accounts.spotify.com/api/token",
    qs.stringify({ grant_type: "client_credentials" }),
    {
      headers: {
        Authorization: `Basic ${authString}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  cachedToken = response.data.access_token;
  tokenExpiration = new Date(now.getTime() + response.data.expires_in * 1000);
  return cachedToken;
}

module.exports = { getSpotifyToken };