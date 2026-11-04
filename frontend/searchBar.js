// SØGEFUNKTION

let allAlbums = [];

// Fetch the JSON data (replace 'albums.json' with your actual file path)
fetch('../db/albums.json')
  .then(response => response.json())
  .then(data => {
    allAlbums = data.albums;
  })
  .catch(error => console.log('Error loading JSON:', error));

// Select DOM elements
const searchInput = document.getElementById('songSearch');
const resultsContainer = document.getElementById('song-list');

// Listen for input events
searchInput.addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase().trim();

  // Clear results if search bar is empty
  if (searchTerm === '') {
    resultsContainer.innerHTML = '';
    return;
  }

  // Filter tracks across all albums
  const matchedTracks = [];

  allAlbums.forEach(album => {
    album.tracks.forEach(track => {
      const matchTitle = track.title.toLowerCase().includes(searchTerm);
      const matchArtist = album.artist.name.toLowerCase().includes(searchTerm);
      const matchAlbum = album.title.toLowerCase().includes(searchTerm);

      // If title, artist, or album matches, include it
      if (matchTitle || matchArtist || matchAlbum) {
        matchedTracks.push({
          song: track.title,
          artist: album.artist.name,
          album: album.title,
          genre: track.genre.name,
          price: track.price_usd
        });
      }
    });
  });

  // Display the results on the website
  displayResults(matchedTracks);
});

// Render function
function displayResults(tracks) {
  resultsContainer.innerHTML = ''; // Clear previous results

  if (tracks.length === 0) {
    resultsContainer.innerHTML = '<p>No songs found.</p>';
    return;
  }

  tracks.forEach(t => {
    let songDiv = document.createElement("div");
    songDiv.className = "song";
    songDiv.innerHTML = `
      <h4>${t.song}</h4>
      <p>${t.artist}</p>
      <p>${t.album}</p>
      <button type="button">+</button>
    `;

    let button = songDiv.querySelector("button");
    button.addEventListener("click", function () {
      console.log("Added to cart:", t.song);
      addToCheckout(t); // Connects to checkout array in mainScript.js
    });

    resultsContainer.appendChild(songDiv);
  });
}