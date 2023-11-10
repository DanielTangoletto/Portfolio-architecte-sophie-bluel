/* AFFICHER LES PROJETS VIA L'API */

fetch("http://localhost:5678/api/works")
  .then(response => {
    if (!response.ok) {
      throw new Error('Erreur de requête réseau');
    }
    return response.json();
  })
  .then(data => {
    for (let i = 0; i < data.length; i++) {
      let elements = data[i]

      const gallery = document.querySelector(".gallery")


      /* Creation des elements */
      const project = document.createElement("figure")
      const img = document.createElement("img")
      img.src = elements.imageUrl
      const imgTitle = document.createElement("figcaption")
      imgTitle.innerText = elements.title

      gallery.appendChild(project)
      project.appendChild(img)
      project.appendChild(imgTitle)

      project.classList.add("project");
      project.setAttribute("category", elements.category.name);

    }
  })

  /* FILTRER PAR PROJETS */

fetch("http://localhost:5678/api/categories")
.then(response => {
  if (!response.ok) {
    throw new Error('Erreur de requête réseau');
  }
  return response.json();
})

.then(dataCategory => {
  // Récupérez la liste des filtres
  const filters = document.querySelectorAll('.filtres div');

  // Écoutez les clics sur les boutons de filtre
  filters.forEach(filter => {
    filter.addEventListener('click', () => {
      // Récupérez le nom de la catégorie du filtre cliqué
      const filterName = filter.textContent.trim(); // Utilisez le contenu textuel du filtre comme catégorie

      // Filtrage des projets en fonction du nom de la catégorie
      const projects = document.querySelectorAll('.project');

      projects.forEach(project => {
        const projectCategory = project.getAttribute('category');

        if (filterName !== 'Tous' && filterName !== projectCategory) {
          project.style.display = 'none';
        } else {
          project.style.display = 'block';
        }
      });
    });
  });
})
.catch(error => {
  console.error('Une erreur s\'est produite lors de la récupération des catégories : ', error);
});


/* MODE CONNECTÉ */

function isConnected() {
  if (sessionStorage.getItem("token")) return true;
  else return false;
}

function EditionMode() {

  const modifbar = document.querySelector(".barre_modification");
  const login_Logout = document.querySelector(".login_logout");
  const filters = document.querySelector(".filtres");
  const modifBtn2 = document.querySelector(".modif_button2");

  if (isConnected() === true) {
    login_Logout.innerText = "logout";
    login_Logout.addEventListener("click", () => {
      sessionStorage.removeItem("token");
      window.location.replace("index.html");
    });
    modifbar.style.display = 'block';
    filters.style.display = 'none';
    modifBtn2.style.display = 'block';
  }
}

EditionMode()



// Modale pour afficher les projets //

//Affichage de la modale au clic des bouton modif

const buttonModif1 = document.querySelector('.modif_button');
const buttonModif2 = document.querySelector('.modif_button2');

/* Bouton Mode Edition */
buttonModif1.addEventListener('click', () => {
  const modale = document.querySelector('.modale_gallery');
  modale.style.display = 'block';
})

/* Bouton Modifier */
buttonModif2.addEventListener('click', () => {
  const modale = document.querySelector('.modale_gallery');
  modale.style.display = 'block';
})

//Fermeture de la modale au clic de la croix (sans recharge de la page)

const xmark = document.querySelector('.fa-xmark')

xmark.addEventListener('click', (event) => {
  // location.reload(true);
  event.preventDefault();
  const modale = document.querySelector('.modale_gallery');
  modale.style.display = 'none';
})

//Fermeture de la modale au clic du background (sans recharge de la page)

const modaleBackground = document.querySelector('.modale_bg')

modaleBackground.addEventListener('click', (event) => {
  event.preventDefault();
  const modale = document.querySelector('.modale_gallery');
  modale.style.display = 'none';
});

//Affichage des projets dans la modale

fetch("http://localhost:5678/api/works")
  .then(response => {
    if (!response.ok) {
      throw new Error('Erreur de requête réseau');
    }
    return response.json();
  })
  .then(data => {
    for (let i = 0; i < data.length; i++) {
      let elements = data[i]

      const galleryModale = document.querySelector(".project-modale")

      // Creation des elements 
      const projectModale = document.createElement("figure")
      const img = document.createElement("img")
      img.src = elements.imageUrl
      const imgTitle = document.createElement("figcaption")
      imgTitle.innerText = elements.title

      galleryModale.appendChild(projectModale)
      projectModale.appendChild(img)
      projectModale.appendChild(imgTitle)

      projectModale.classList.add("project");
      projectModale.setAttribute("data-category", elements.category.name);

      // Suppression des projets
      const corbeille = document.createElement("i");
      const contentCorbeille = document.createElement("div");
      corbeille.classList.add("fa-solid", "fa-trash-can");
      contentCorbeille.appendChild(corbeille);
      projectModale.appendChild(contentCorbeille);

      contentCorbeille.addEventListener("click", () => {
        // Demander une confirmation avant de supprimer le projet
        const confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer ce projet ?");

        if (confirmation) {
          const token = sessionStorage.getItem("token");
          if (token) {
            fetch(`http://localhost:5678/api/works/${elements.id}`, {
              method: "DELETE",
              headers: {
                'Authorization': `Bearer ${token}`
              },
              accept: "application/json",
            })
              .then(response => {
                if (!response.ok) {
                  throw new Error("Erreur de requête réseau");
                }
                return response;
              })
              .then(data => {
                projectModale.remove();
              })
              .catch(error => {
                console.error(error);
              });
          }
        }
      });
    }
  })


// affichage de la modale2

const boutonAjouter = document.querySelector(".button1")

boutonAjouter.addEventListener('click', () => {
  const modale = document.querySelector('.modale_gallery');
  const modale2 = document.querySelector('.modale_content');
  modale.style.display = 'none';
  modale2.style.display = 'block';
})

// Retour en arriere modale2
const leftArrow = document.querySelector(".fa-arrow-left")

leftArrow.addEventListener('click', () => {
  const modale = document.querySelector('.modale_gallery');
  const modale2 = document.querySelector('.modale_content');
  modale2.style.display = 'none';
  modale.style.display = 'block';
})

// Fermeture de la seconde modale avec la seconde croix (sans recharge de la page)

const xmark2 = document.querySelector('.xmark2')

xmark2.addEventListener('click', (event) => {
  event.preventDefault();
  const modale = document.querySelector('.modale_content');
  modale.style.display = 'none';
})

//Fermeture de la modale au clic du background2 (sans recharge de la page)

const modaleBackground2 = document.querySelector('.modale_bg2')

modaleBackground2.addEventListener('click', (event) => {
  event.preventDefault();
  const modale = document.querySelector('.modale_content');
  modale.style.display = 'none';
})

// Previsualiser photo

const btnAddPhoto = document.querySelector('.button3');
const inputPhoto = document.querySelector('#file');

btnAddPhoto.addEventListener('change', () => {
  const addPhoto = document.querySelector('.ajoutPhoto');
  const addPhotoIcon = document.querySelector('.fa-image');
  const addPhotoInstructions = document.querySelector('.instruction');

  console.log(inputPhoto.files.length)
  if (inputPhoto.files.length > 0) {
    const photo = inputPhoto.files[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.src = e.target.result
      img.classList.add("uploaded-photo")
      addPhoto.appendChild(img)
    }

    reader.readAsDataURL(photo)
    addPhotoIcon.style.display = "none"
    inputPhoto.style.display = "none"
    addPhotoInstructions.style.display = "none"
    btnAddPhoto.style.display = "none"
  }
});

// Envoi des nouveaux projets

const titleInput = document.getElementById('title');
const categorySelect = document.querySelector('select');
const fileInput = document.getElementById('file');
const addButton = document.querySelector('.button2');

addButton.addEventListener('click', () => {


  const title = titleInput.value;
  const category = categorySelect.value;
  const imageFile = fileInput.files[0];

  const formData = new FormData();
  formData.append('title', title);
  formData.append('category', category);
  formData.append('image', imageFile);

  const token = sessionStorage.getItem("token");
  if (token) {
    fetch('http://localhost:5678/api/works', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${token}`
      },
      accept: 'application/json',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erreur de requête réseau');
        }
        return response.json();
      })
      .then(data => {
        alert('Projet ajouté avec succès !');
        location.reload(true);
      })
      .catch(error => {
        console.error(error);
        alert('Erreur lors de l\'ajout du projet.');
      });
  }
});