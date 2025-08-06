const axios = require("axios");
const { getSpotifyToken } = require("../utils/spotifyAuth");

const getArtistInfo = async (req, res) => {
  let artistIds = req.query.ids;
  artistIds = Array.isArray(artistIds) ? artistIds.join(",") : artistIds;

  console.log("📥 IDs recibidos:", artistIds);

  if (!artistIds) {
    console.log("⚠️ No se proporcionaron IDs de artistas");
    return res.status(400).json({ error: "Faltan IDs de artistas" });
  }

  try {
    const token = await getSpotifyToken();
    console.log("🔑 Token de Spotify obtenido correctamente");

    const url = "https://api.spotify.com/v1/artists";
    const params = { ids: artistIds };
    const headers = { Authorization: `Bearer ${token}` };

    console.log("📤 Llamando a Spotify con:");
    console.log("URL:", url);
    console.log("Params:", params);
    console.log("Headers:", headers);

    const response = await axios.get(url, {
      headers,
      params,
    });

    console.log("✅ Respuesta recibida de Spotify");

    const artistas = response.data.artists.map((artista) => ({
      id: artista.id,
      nombre: artista.name,
      imagen: artista.images?.[0]?.url || "",
      generos: artista.genres,
      oyentes: artista.followers.total,
      urlSpotify: artista.external_urls.spotify,
    }));

    res.json(artistas);
  } catch (error) {
    console.error("❌ Error obteniendo info de artistas:", error.message);

    // Debug extra
    if (error.response) {
      console.error("➡️ Código de estado:", error.response.status);
      console.error("➡️ Datos del error:", error.response.data);
    }

    res.status(500).json({ error: "Error al obtener los artistas desde Spotify" });
  }
};

module.exports = { getArtistInfo };