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
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front">
          <img src="${artista.imagen}" alt="${artista.nombre}" />
          <h2>${artista.nombre}</h2>
          <p>Oyentes mensuales: ${artista.oyentes.toLocaleString()}</p>
          <a href="${artista.urlSpotify}" target="_blank">Spotify</a>
        </div>
        <div class="card-back" style="background-image: url('${artista.imagen}'); background-size: cover;">
          <div class="overlay">
            <h3>${artista.nombre}</h3>
            <p>Géneros:</p>
            <ul>${artista.generos.map(g => `<li>${g}</li>`).join("")}</ul>
            <button onclick="event.stopPropagation(); flipCard(this.closest('.card'))">Cerrar</button>
          </div>
        </div>
      </div>
    `;
    card.addEventListener("click", () => flipCard(card));
    contenedor.appendChild(card);
  });
}