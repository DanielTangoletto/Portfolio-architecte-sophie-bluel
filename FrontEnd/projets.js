// Récupérer les projets de l'architecte Sophie Bluel, affiche les 11 élements sur la console //
fetch ('http://localhost:5678/api/works')
.then(response => response.json())
.then(json => console.log(json));

// Création des variables pour insérer les projets en JS //

let figure = document.createElement("figure")
let image = document.createElement('img')
let title = document.createElement('figcaption')

let gallery = document.querySelector('.gallery')

gallery.appendChild(figure)
figure.appendChild(image)
figure.appendChild(title)

image.src = "http://localhost:5678/images/abajour-tahina1651286843956.png"
title.innerText = "Abajour Tahina"