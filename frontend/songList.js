let cart = [];
let cartSongs = document.getElementById("cart-songs");
let totalSongs = document.getElementById("total-songs");
let paymentTotal = document.getElementById("payment-total");
let searchBar = document.getElementById("searchInput");

fetch("../db/albums.json")
    .then(response => response.json())
    .then(data => {
        let songList = document.getElementById("song-list");
        console.log(data);

        data.albums.forEach(function(album) {
            album.tracks.forEach(function(track) {
                console.log(track.title);
                let song = document.createElement("div");
                song.className = "song";

                song.innerHTML = `
                    <h4>${track.title}</h4>
                    <p>${album.artist.name}</p>
                    <p>${album.title}</p>
                    <button type="button class="add-song-button">+</button>
                `;
                let button = song.querySelector("button");

                button.addEventListener("click", function () {

                    if (cart.length >= 3) {
                        return;
                    }
                    
                    cart.push(track.title);


                    let cartSong = document.createElement("p");
                    cartSong.textContent = track.title;
                   
                    let deleteButton = document.createElement("button");
                    deleteButton.textContent = "X";
                    deleteButton.type = "button";

                    cartSong.appendChild(deleteButton);
                    cartSongs.appendChild(cartSong);

                    deleteButton.addEventListener("click", function () {

                        cart.splice(cart.indexOf(track.title), 1);

                        cartSongs.removeChild(cartSong);

                            let price = cart.length * 2;

                            if (cart.length === 3) {
                                price = 5;
                            }

                            totalSongs.textContent = "Total: " + price + " kr";

                            if (paymentTotal) {
                                paymentTotal.textContent = price + " kr";
                            }



                });

                    let price = cart.length * 2;

                    if (cart.length === 3) {
                        price = 5;
                    }

                    totalSongs.textContent = "Total:" + price + " kr";
                    
                    // Sørg for at prisen også opdateres inde i betalingsmodalen, hvis elementet findes
                    if (paymentTotal) {
                        paymentTotal.textContent = price + " kr";
                    }

                });

                songList.appendChild(song);
            });
        });
    });



let paymentButton = document.getElementById("payment-button");

if (paymentButton) {
    paymentButton.addEventListener("click", function () {
        console.log("Payment button clicked");
    });
}

// Lyt efter klik på "Confirm"-knappen inde i modalen
let confirmPaymentBtn = document.getElementById("confirm-payment");

if (confirmPaymentBtn) {
    confirmPaymentBtn.addEventListener("click", function () {
        // 1. Hent den eksisterende kø fra localStorage (eller start en tom liste)
        let savedQueue = JSON.parse(localStorage.getItem("songQueue")) || [];

        // 2. Læg sangene fra kurven over i køen
        savedQueue.push(...cart);

        // 3. Gem den opdaterede kø i browseren
        localStorage.setItem("songQueue", JSON.stringify(savedQueue));

        // 4. Nulstil kurven
        cartSongs.innerHTML = "";
        totalSongs.textContent = "";

        // 5. Send brugeren til forsiden (index.html) hvor køen vises
        window.location.href = "index.html";
    });
}

