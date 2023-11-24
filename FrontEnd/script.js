/* AFFICHER LES PROJETS SUR LE SITE VIA L'API (avec function async/await/try/catch) */
async function displayMode() {
  try {
    const responseJSON = await fetch("http://localhost:5678/api/works");
    const responseJS = await responseJSON.json();
    console.log(responseJS); 

    if (responseJS) {
      const gallery = document.querySelector(".gallery");

      responseJS.forEach((data) => {
      const project = document.createElement("figure");
        
      const img = document.createElement("img");
      img.src = data.imageUrl;
      project.appendChild(img);

      const imgTitle = document.createElement("figcaption");
      imgTitle.innerText = data.title;
      project.appendChild(imgTitle);

      gallery.appendChild(project);
      project.classList.add("project");
      project.setAttribute("category", data.category.name);
    })
  }}

  catch(error) {
    console.log(error, "Erreur de requête réseau");
}}

displayMode();

  /* FILTRER PAR PROJETS (async/await/try/catch) */

async function filterMode() {
  try {
  const responseJSON = await fetch("http://localhost:5678/api/categories");
  const responseJS = await responseJSON.json();

  if(responseJS) {
  const filters = document.querySelectorAll('.filtres div');
  filters.forEach(filter => {
        filter.addEventListener('click', () => {
          const filterName = filter.textContent.trim();
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
}}

catch(error) {
  console.log(error, "Erreur de requête réseau");
}}

filterMode();


/* Mode Connecté */

function isConnected() {
  if (sessionStorage.getItem("token"))
  return true;
}

function EditionMode() {

  const modifbar = document.querySelector(".barre_modification");
  const login_Logout = document.querySelector(".login_logout");
  const filters = document.querySelector(".filtres");
  const modifBtn2 = document.querySelector(".modif_button2");

  if (isConnected()) {
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

// Afficher/Fermer la modale des projets //

const buttonModif1 = document.querySelector('.modif_button');
const buttonModif2 = document.querySelector('.modif_button2');
const xmark = document.querySelector('.fa-xmark');
const modaleBackground = document.querySelector('.modale_bg');

function displayEditMode() {
  const modale = document.querySelector('.modale_gallery');
  modale.style.display = 'block';
}

function closeEditMode() {
  const modale = document.querySelector('.modale_gallery');
  modale.style.display = 'none';
}

/* Bouton Mode Edition */
buttonModif1.addEventListener('click', () => {
  displayEditMode();
})

/* Bouton Modifier */
buttonModif2.addEventListener('click', () => {
  displayEditMode();
})

//Fermer la modale au clic de la croix (sans recharge de la page)
xmark.addEventListener('click', (event) => {
  event.preventDefault();
  closeEditMode();
})

//Fermer la modale au clic du background (sans recharge de la page)
modaleBackground.addEventListener('click', (event) => {
  event.preventDefault();
  closeEditMode();
});

// Afficher les projets dans la modale

async function displayModaleMode() {
    try {
        const responseJSON = await fetch('http://localhost:5678/api/works');
        const responseJS = await responseJSON.json();

    if (responseJS) {
        const galleryModale = document.querySelector(".project-modale");

      responseJS.forEach((data) => {
        const projectModale = document.createElement("figure");
        const img = document.createElement("img");
        const imgTitle = document.createElement("figcaption");

        const corbeille = document.createElement("i");
        const contentCorbeille = document.createElement("div");
  
        img.src = data.imageUrl;
        imgTitle.innerText = data.title;
  
        galleryModale.appendChild(projectModale);
        projectModale.appendChild(img);
        projectModale.appendChild(imgTitle);

        corbeille.classList.add("fa-solid", "fa-trash-can");
        contentCorbeille.appendChild(corbeille);
        projectModale.appendChild(contentCorbeille);
  
        projectModale.classList.add("project");
        projectModale.setAttribute("data-category", data.category.name);  

        contentCorbeille.addEventListener("click", () => {
          const confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer ce projet ?");
        
          if (confirmation) {
            const token = sessionStorage.getItem("token");
            if (token) {
                 fetch(`http://localhost:5678/api/works/${data.id}`, {
                    method: "DELETE",
                    headers: {
                    'Authorization': `Bearer ${token}`
                    },
                    accept: "application/json",
                    })
                    .then(() => {
                      alert('Projet supprimé avec succès !');
                       projectModale.remove();
                       location.reload(true);
                       })
                }
          }
        })
    })}
}
  catch(error) {
    console.log(error, "Erreur de requête réseau");
}}

displayModaleMode();


// affichage de la modale2

const btnAjouter = document.querySelector(".button1");
const leftArrow = document.querySelector(".fa-arrow-left")

btnAjouter.addEventListener('click', () => {
  const modale = document.querySelector('.modale_gallery');
  const modale2 = document.querySelector('.modale_content');
  modale.style.display = 'none';
  modale2.style.display = 'block';
})

// Retour en arriere de la modale 2
leftArrow.addEventListener('click', () => {
  const modale = document.querySelector('.modale_gallery');
  const modale2 = document.querySelector('.modale_content');
  modale2.style.display = 'none';
  modale.style.display = 'block';
})

// Fermeture de la seconde modale avec la seconde croix (sans recharge de la page)

const xmark2 = document.querySelector('.xmark2');
const modaleBackground2 = document.querySelector('.modale_bg2');

function closeEditMode2() {
  const modale = document.querySelector('.modale_content');
  modale.style.display = 'none';
}

xmark2.addEventListener('click', (event) => {
  event.preventDefault();
  closeEditMode2();
})

//Fermeture de la modale au clic du background2 (sans recharge de la page)
modaleBackground2.addEventListener('click', (event) => {
  event.preventDefault();
  closeEditMode2();
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

  const formData = new FormData()
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

      .then(data => {
        alert('Projet ajouté avec succès !');
        console.log(data);
        location.reload(true);
        })

  }
});