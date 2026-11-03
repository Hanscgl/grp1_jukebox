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
    <button type="button">+</button>
`;
let button = song.querySelector("button");

button.addEventListener("click", function () {
    console.log(track.title);
});
songList.appendChild(song);
            });
        });
    });
    let paymentButton = document.getElementById("payment-button");

paymentButton.addEventListener("click", function () {
    console.log("Payment button clicked");
});