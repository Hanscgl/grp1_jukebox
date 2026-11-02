// tomt array til at gemme albums
let albumsArray = [];

let parentElement = document.getElementById("albums");

//Bruger funktionen fetchData til at hente info fra albums.json
fetchData("albums.json").then(function (albums) {
    albums.albums.forEach (function (v) {
        // pusher data fra albums.json til det tomme array på linje 2
        albumsArray.push(new Album(v.id, v.title, v.released, v.artist));
    });

    console.log(albumsArray);

    for (let i in albumsArray) {
        albumsArray[i].present(parentElement);
        }
    });

//henter data fra albums.json
async function fetchData(url) {
    let request = await fetch(url);
    let json = await request.json();
    return json;
}