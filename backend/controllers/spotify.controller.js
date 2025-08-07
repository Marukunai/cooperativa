const axios = require("axios");
const { getSpotifyToken } = require("../utils/spotifyAuth");

const getArtistInfo = async (req, res) => {
  let artistIds = req.query.ids;
  artistIds = Array.isArray(artistIds) ? artistIds.join(",") : artistIds;

  if (!artistIds) {
    return res.status(400).json({ error: "Faltan IDs de artistas" });
  }

  try {
    const token = await getSpotifyToken();
    const headers = { Authorization: `Bearer ${token}` };

    // 1. Obtener info básica
    const artistResponse = await axios.get("https://api.spotify.com/v1/artists", {
      headers,
      params: { ids: artistIds },
    });

    const artistasRaw = artistResponse.data.artists;

    // 2. Obtener top tracks por artista
    const artistas = await Promise.all(artistasRaw.map(async (artista) => {
      const topTracksRes = await axios.get(`https://api.spotify.com/v1/artists/${artista.id}/top-tracks?market=ES`, { headers });
      const topTracks = topTracksRes.data.tracks.slice(0, 5).map(track => ({
        nombre: track.name,
        preview_url: track.preview_url,
        spotify_url: track.external_urls.spotify,
      }));

      return {
        id: artista.id,
        nombre: artista.name,
        imagen: artista.images?.[0]?.url || "",
        generos: artista.genres,
        oyentes: artista.followers.total,
        urlSpotify: artista.external_urls.spotify,
        topTracks
      };
    }));

    res.json(artistas);
  } catch (error) {
    console.error("❌ Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Error al obtener artistas desde Spotify" });
  }
};

module.exports = { getArtistInfo };