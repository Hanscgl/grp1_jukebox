let queue = JSON.parse(localStorage.getItem("songQueue")) || [];
let checkout = [];
let queueDiv = document.getElementById("queue");

if (queueDiv) {
    queueDiv.className = "list-group";
    queueDiv.innerHTML = ""; 

    queue.forEach(function (songTitle) {
        let item = document.createElement("div");
        item.className = "list-group-item list-group-item-action bg-dark text-white border-secondary mb-1 rounded";
        item.textContent = songTitle;
        queueDiv.appendChild(item);
    });
}

function addToCheckout(song) {
    checkout.push(song);
}

if (queue.length > 0) {
    let currentSongTitle = queue[0];

    fetch("../db/albums.json")
        .then(response => response.json())
        .then(data => {
            let foundTrack = null;
            let foundAlbum = null;

            data.albums.forEach(album => {
                album.tracks.forEach(track => {
                    if (track.title === currentSongTitle) {
                        foundTrack = track;
                        foundAlbum = album;
                    }
                });
            });

            if (foundTrack && foundAlbum) {
                let titleEl = document.getElementById("title-song");
                let artistEl = document.getElementById("artist-song");
                let albumEl = document.getElementById("album-song");

                if (titleEl) titleEl.textContent = foundTrack.title;
                if (artistEl) artistEl.textContent = foundAlbum.artist.name;
                if (albumEl) albumEl.textContent = foundAlbum.title;

                let durationSeconds = Math.floor(foundTrack.duration_ms / 1000);
                let currentSeconds = 0;

                let progressBar = document.getElementById("song-progress");
                let currentTimeEl = document.getElementById("current-time");
                let totalTimeEl = document.getElementById("total-time");

                if (progressBar) {
                    progressBar.max = durationSeconds;
                    progressBar.value = 0;
                }

                if (totalTimeEl) {
                    totalTimeEl.textContent = formatTime(durationSeconds);
                }

                let songTimer = setInterval(function () {
                    currentSeconds++;

                    if (progressBar) {
                        progressBar.value = currentSeconds;
                    }

                    if (currentTimeEl) {
                        currentTimeEl.textContent = formatTime(currentSeconds);
                    }

                    if (currentSeconds >= durationSeconds) {
                        clearInterval(songTimer);
                        queue.shift();
                        localStorage.setItem("songQueue", JSON.stringify(queue));
                        window.location.reload();
                    }
                }, 1000);
            }
        });
} else {
    let titleEl = document.getElementById("title-song");
    if (titleEl) titleEl.textContent = "No song queued";
}

let clickCount = 0;
let clickTimer = null;

let adminTrigger = document.getElementById('admin-trigger');
if (adminTrigger) {
    adminTrigger.addEventListener('click', function() {
        clickCount++;
                 
        if (clickCount === 1) {
            clickTimer = setTimeout(function() {
                clickCount = 0;
            }, 600);
        } else if (clickCount === 3) {
            clearTimeout(clickTimer);
            clickCount = 0;

            let pin = prompt("Indtast 4-cifret kode:");
            if (pin === "1234") {
                var adminModal = new bootstrap.Modal(document.getElementById('adminModal'));
                adminModal.show();
            } else if (pin !== null) {
                alert("Forkert kodeord!");
            }
        }
    });
}

let searchInput = document.getElementById("searchInput");
if (searchInput) {
    searchInput.addEventListener("input", function () {
        let searchText = this.value.trim();
        if (searchText !== "") {
            console.log(searchText);
        }
    });

    searchInput.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            let searchText = this.value.trim();
            if (searchText !== "") {
                window.location.href = "order-songs.html?search=" + encodeURIComponent(searchText);
            }
        }
    });
}

let resetQueueBtn = document.getElementById("reset-queue");
if (resetQueueBtn) {
    resetQueueBtn.addEventListener("click", function () {
        localStorage.removeItem("songQueue");
        window.location.reload();
    });
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}