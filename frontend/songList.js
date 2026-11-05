

// defines the variables 
let cart = [];
let cartSongs = document.getElementById("cart-songs");
let totalSongs = document.getElementById("total-songs");
let paymentTotal = document.getElementById("payment-total");
let songList = document.getElementById("song-list");
let searchElement = document.getElementById("songSearch");

// Empty Array to hold all flattened track data for the search filter
let allTracks = []; 

// Fetch the albums data from the JSON file and put it into the allTracks array
fetch("../db/albums.json")
    .then(response => response.json())
    .then(data => {
        // Flatten the nested JSON (albums -> tracks) into a single array
        data.albums.forEach(album => {
            album.tracks.forEach(track => {
                allTracks.push({
                    title: track.title,
                    artist: album.artist.name,
                    albumTitle: album.title
                });
            });
        });

        // Søgefunktion til at søge på order-songs.html siden
        if (searchElement) {
            searchElement.addEventListener("input", function () {
                let searchText = searchElement.value.toLowerCase();
                let results = allTracks.filter(track => {
                    return (
                        track.title.toLowerCase().includes(searchText) ||
                        track.artist.toLowerCase().includes(searchText)
                    );
                });
                showTracks(results); // Shows results from the search term
            });
        }

        // Check localStorage from the searchbar on index.html and trigger the search AFTER data is ready
        let savedSearchText = localStorage.getItem("pendingSearch");

        if (savedSearchText && searchElement) {
            searchElement.value = savedSearchText;
            searchElement.dispatchEvent(new Event("input")); // Triggers the listener above
            localStorage.removeItem("pendingSearch");
        } else {
            // If no search came from index.html, just show all songs by default
            showTracks(allTracks);
        }
    });

// Extracted rendering logic into a reusable function
function showTracks(tracksToDisplay) {
    songList.innerHTML = ""; // Clear existing list before rendering new results

    // Loop through the tracks and create a HTML div for each song
    tracksToDisplay.forEach(track => {
        let song = document.createElement("div");
        song.className = "song";

        // Text in each div for diaplying songs and a button for adding to cart
        song.innerHTML = `
            <h4>${track.title}</h4>
            <p>${track.artist}</p>
            <p>${track.albumTitle}</p>
            <button type="button" class="add-song-button">+</button>
        `;
        
        let button = song.querySelector("button");

        button.addEventListener("click", function () {
            if (cart.length >= 3) return;
            
            cart.push(track.title);

            let cartSong = document.createElement("p");
            cartSong.className = "cart-song";
            cartSong.textContent = track.title;
           
            // Button for removing a song from cart
            let deleteButton = document.createElement("button");
            deleteButton.textContent = "X";
            deleteButton.type = "button";

            cartSong.appendChild(deleteButton);
            cartSongs.appendChild(cartSong);

            // Updates the price for the songs in the cart
            deleteButton.addEventListener("click", function () {
                cart.splice(cart.indexOf(track.title), 1);
                cartSongs.removeChild(cartSong);
                updatePrice();
            });

            updatePrice();
        });

        songList.appendChild(song);
    });
}

// Function for calculating the price for songs in cart
function updatePrice() {
    let price = cart.length * 2;
    if (cart.length === 3) {
        price = 5;
    }

    totalSongs.textContent = "Total: " + price + " kr";
    if (paymentTotal) {
        paymentTotal.textContent = price + " kr";
    }
}

// --- Payment & Checkout Logic ---
let paymentButton = document.getElementById("payment-button");

if (paymentButton) {
    paymentButton.addEventListener("click", function () {
        console.log("Payment button clicked");
    });
}

let confirmPaymentBtn = document.getElementById("confirm-payment");

if (confirmPaymentBtn) {
    confirmPaymentBtn.addEventListener("click", function () {
        let savedQueue = JSON.parse(localStorage.getItem("songQueue")) || [];
        savedQueue.push(...cart);
        localStorage.setItem("songQueue", JSON.stringify(savedQueue));

        cartSongs.innerHTML = "";
        totalSongs.textContent = "";
        window.location.href = "index.html";
    });
}