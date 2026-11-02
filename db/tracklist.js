// constructor funktion til at oprette albums
function Album(id, title, released, artist) {
    this.id = id;
    this.title = title;
    this.released = released;
    this.artist = artist;

    this.present = function (parentElement) {
        let wrapper = document.createElement("div");
        let header = document.createElement("h1");
        let info = document.createElement("p");

        wrapper.id = this.id;
        header.innerHTML = this.title;
        info.innerHTML = "Udgivet den: " + this.released

        wrapper.appendChild(header);
        wrapper.appendChild(info);
        parentElement.appendChild(wrapper);
    };
};
