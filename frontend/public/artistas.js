async function cargarArtistas() {
  const contenedor = document.getElementById("artistas");

  const ARTIST_IDS = [
    "7N2acqBH3hYNE7LF67N53y", // WNK
    "5Txb1Eoi4buQ8XQSLLQvil", // G.Aguiar
    "0fr32bvI5zFYxkrQ3GkBzy"  // Sousa
  ];

  const res = await fetch(`/api/artistas?ids=${ARTIST_IDS.join(",")}`);
  const artistas = await res.json();

  artistas.forEach(artista => {
    const iframes = artista.topTracks.map(track => {
      const trackId = track.spotify_url.split("/track/")[1];
      return `
        <div style="margin-bottom: 12px;">
          <iframe style="border-radius:12px"
                  src="https://open.spotify.com/embed/track/${trackId}?utm_source=cooperativa"
                  width="100%" height="80" frameBorder="0" allowfullscreen
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy">
          </iframe>
        </div>`;
    }).join("");

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front">
          <img src="${artista.imagen}" alt="${artista.nombre}" />
          <h2>${artista.nombre}</h2>
          <a href="${artista.urlSpotify}" target="_blank">Spotify</a>
        </div>
        <div class="card-back" style="background-image: url('${artista.imagen}'); background-size: cover;">
          <div class="overlay">
            <h3>${artista.nombre}</h3>
            <p>Géneros:</p>
            <ul>${artista.generos.map(g => `<li>${g}</li>`).join("")}</ul>
            <p><strong>Top canciones:</strong></p>
            ${iframes}
            <button onclick="event.stopPropagation(); flipCard(this.closest('.card'))">Cerrar</button>
          </div>
        </div>
      </div>
    `;
    card.addEventListener("click", () => flipCard(card));
    contenedor.appendChild(card);
  });
}