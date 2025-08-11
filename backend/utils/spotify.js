const axios = require("axios");
const qs = require("querystring");
require("dotenv").config();

let accessToken = null;

async function getSpotifyAccessToken() {
  const data = {grant_type: "client_credentials",};

  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization:
      "Basic " +
      Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
      ).toString("base64"),
  };

  const response = await axios.post(
    "https://accounts.spotify.com/api/token",
    qs.stringify(data),
    { headers }
  );

  accessToken = response.data.access_token;
  return accessToken;
}

async function getArtistData(artistId) {
  if (!accessToken) await getSpotifyAccessToken();

  const response = await axios.get(`https://api.spotify.com/v1/artists/${artistId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return {
    id: response.data.id,
    name: response.data.name,
    image: response.data.images[0]?.url,
    genres: response.data.genres,
    followers: response.data.followers.total,
    spotifyUrl: response.data.external_urls.spotify,
  };
}

module.exports = { getArtistData };