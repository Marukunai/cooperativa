const axios = require("axios");
const { getSpotifyToken } = require("../utils/spotifyAuth");

// Config: tus artistas
const ARTIST_IDS = [
  "7N2acqBH3hYNE7LF67N53y", // WNK
  "5Txb1Eoi4buQ8XQSLLQvil", // G.Aguiar
  "0fr32bvI5zFYxkrQ3GkBzy"  // Sousa
];

// Opcional: presave por álbum (cuando lo tengáis del distribuidor)
const PRESAVE_LINKS = {
  // "ALBUM_SPOTIFY_ID": "https://tulink-de-presave.com/xxxx"
};

function parseReleaseDate(d, precision) {
  // precision: "day" | "month" | "year"
  if (precision === "day") return new Date(d);
  if (precision === "month") return new Date(`${d}-01`);
  if (precision === "year") return new Date(`${d}-01-01`);
  return new Date(d);
}

async function getArtistReleases(artistId, headers) {
  // Traemos singles y albums visibles en ES, máx 20 por tipo
  const url = `https://api.spotify.com/v1/artists/${artistId}/albums`;
  const params = { include_groups: "album,single", market: "ES", limit: 20 };

  const res = await axios.get(url, { headers, params });
  // Eliminamos duplicados por album_group (Spotify duplica por markets)
  const seen = new Set();
  const items = res.data.items.filter(a => {
    if (seen.has(a.id)) return false;
    seen.add(a.id);
    return true;
  });

  // Añadimos releaseDate real
  return items.map(a => ({
    id: a.id,
    name: a.name,
    type: a.album_type, // "album" | "single"
    release_date: a.release_date,
    release_date_precision: a.release_date_precision,
    images: a.images,
    url: a.external_urls.spotify,
    artistId,
  }));
}

const getNovedades = async (req, res) => {
  try {
    const token = await getSpotifyToken();
    const headers = { Authorization: `Bearer ${token}` };

    const all = (await Promise.all(
      ARTIST_IDS.map(id => getArtistReleases(id, headers))
    )).flat();

    // Clasificación por fechas
    const now = new Date();
    const days30 = 30 * 24 * 60 * 60 * 1000;

    const withDates = all.map(a => {
      const d = parseReleaseDate(a.release_date, a.release_date_precision);
      return { ...a, _date: d.getTime() };
    });

    const recent = withDates
      .filter(a => a._date <= now.getTime() && (now.getTime() - a._date) <= days30)
      .sort((x, y) => y._date - x._date);

    const upcoming = withDates
      .filter(a => a._date > now.getTime())
      .sort((x, y) => x._date - y._date);

    // Destacado: el más reciente de todos (si hay)
    const featured = recent[0] || null;

    // Para el destacado, si es single y quieres embed de track en vez de album
    // podemos dejar embed de álbum/ single igualmente:
    const mapItem = (a) => ({
      id: a.id,
      name: a.name,
      type: a.type,
      releaseDate: a.release_date,
      image: a.images?.[0]?.url || "",
      url: a.url,
      presave: PRESAVE_LINKS[a.id] || null,
      embedType: a.type === "single" ? "album" : "album", // usamos embed de álbum en ambos casos
      // nota: si quisieras "track" para single, habría que consultar el track; mantengo album por simplicidad
    });

    res.json({
      featured: featured ? mapItem(featured) : null,
      recent: recent.slice(0, 12).map(mapItem),
      upcoming: upcoming.slice(0, 12).map(mapItem),
    });
  } catch (err) {
    console.error("❌ Error en getNovedades:", err.response?.data || err.message);
    res.status(500).json({ error: "No se pudieron obtener novedades" });
  }
};

module.exports = { getNovedades };