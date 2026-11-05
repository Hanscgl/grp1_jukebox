

// defines the variables -- 
let cart = [];
let cartSongs = document.getElementById("cart-songs");
let totalSongs = document.getElementById("total-songs");
let paymentTotal = document.getElementById("payment-total");
let songList = document.getElementById("song-list");
let searchElement = document.getElementById("songSearch"); // Ensure this ID matches your HTML input

// 1. Array to hold all flattened track data for the search filter
let allTracks = []; 

fetch("../db/albums.json")
    .then(response => response.json())
    .then(data => {
        // 2. Flatten the nested JSON (albums -> tracks) into a single array
        data.albums.forEach(album => {
            album.tracks.forEach(track => {
                allTracks.push({
                    title: track.title,
                    artist: album.artist.name,
                    albumTitle: album.title
                });
            });
        });

        if (searchElement) {
            searchElement.addEventListener("input", function () {
                let searchText = searchElement.value.toLowerCase();
                let results = allTracks.filter(track => {
                    return (
                        track.title.toLowerCase().includes(searchText) ||
                        track.artist.toLowerCase().includes(searchText)
                    );
                });
                showTracks(results);
            });
        }

        // NOW check localStorage and trigger the search AFTER data is ready
        let savedSearchText = localStorage.getItem("pendingSearch");

        if (savedSearchText && searchElement) {
            searchElement.value = savedSearchText;
            searchElement.dispatchEvent(new Event("input")); // Triggers the listener above
            localStorage.removeItem("pendingSearch");
        } else {
            // If no search came from index.html, just show everything
            showTracks(allTracks);
        }
    });

// 3. Extracted rendering logic into a reusable function
function showTracks(tracksToDisplay) {
    songList.innerHTML = ""; // Clear existing list before rendering new results

    tracksToDisplay.forEach(track => {
        let song = document.createElement("div");
        song.className = "song";

        // Fixed missing quotation mark in the button type attribute
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
           
            let deleteButton = document.createElement("button");
            deleteButton.textContent = "X";
            deleteButton.type = "button";

            cartSong.appendChild(deleteButton);
            cartSongs.appendChild(cartSong);

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

// 4. Extracted price calculation to avoid duplication
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


// Get the search bar on the order page
/*
let orderSearchInput = document.getElementById("songSearch"); 

if (orderSearchInput) {
    // Check if there is a pending search saved in localStorage
    let savedSearchText = localStorage.getItem("pendingSearch");

    if (savedSearchText) {
        // Insert the saved text into the search bar
        orderSearchInput.value = savedSearchText;

        // Trigger the 'input' event to automatically run the search filter function
        orderSearchInput.dispatchEvent(new Event("input"));

        // Remove the saved text so it doesn't trigger again on normal page reloads
        localStorage.removeItem("pendingSearch");
    }
}


// Search event listener setup
if (searchElement) {
    // Changed "searchInput" to standard "input" event for real-time filtering
    searchElement.addEventListener("input", function () {
        
        let searchText = searchElement.value.toLowerCase();

        let results = allTracks.filter(track => {
            return (
                track.title.toLowerCase().includes(searchText) ||
                track.artist.toLowerCase().includes(searchText)
            );
        });

        // Re-render list with filtered results
        showTracks(results);
    });
}
*/

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