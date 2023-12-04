// FONCTION POUR CALL L'API
async function getResponseFromApi(endpoint, method, formData) {
  const baseUrl = "http://localhost:5678/api/" + endpoint;
  let params = {};

  if (method) {
    const token = sessionStorage.getItem("token");
    params = {
      method: method,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      accept: "application/json",
    };
    formData ? (params.body = formData) : null;
  }
  const responseJSON = await fetch(baseUrl, params ? params : {});
  return await responseJSON.json();
}

// AFFICHER LES ELEMENTS
async function getElementsFromApi() {
  const data = await getResponseFromApi("works", "GET");
  const gallery = document.querySelector(".gallery");

  for (const i of data) {
    const project = document.createElement("figure");

    const img = document.createElement("img");
    img.src = i.imageUrl;

    const imgTitle = document.createElement("figcaption");
    imgTitle.innerText = i.title;

    project.appendChild(img);
    project.appendChild(imgTitle);

    gallery.appendChild(project);
    project.classList.add("project");
    project.setAttribute("category", i.category.name);
  }

  return gallery;
}

getElementsFromApi();

// FILTRER LES PROJETS
async function filterMode(data) {
  data = await getResponseFromApi("categories", "GET");
  const filters = document.querySelectorAll(".filtres div");

  filters.forEach((filter) => {
    filter.addEventListener("click", () => {
      const filterName = filter.textContent.trim();
      const projects = document.querySelectorAll(".project");

      projects.forEach((project) => {
        const projectCategory = project.getAttribute("category");

        if (filterName !== "Tous" && filterName !== projectCategory) {
          project.style.display = "none";
        } else {
          project.style.display = "block";
        }
      });
    });
  });
}

filterMode();

// MODE CONNECTÉ + MODE EDITION
function isConnected() {
  return sessionStorage.getItem("token");
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
    modifbar.style.display = "block";
    filters.style.display = "none";
    modifBtn2.style.display = "block";
  }
}

EditionMode();

// MODALE DES PROJETS //
const buttonModif1 = document.querySelector(".modif_button");
const buttonModif2 = document.querySelector(".modif_button2");
const xmark = document.querySelector(".fa-xmark");
const modaleBackground = document.querySelector(".modale_bg");

// AFFICHER OU FERMER LA MODALE 1
function displayOrCloseEditMode(display) {
  const modale = document.querySelector(".modale_gallery");
  modale.style.display = display ? "block" : "none";
}

// BOUTON "MODE EDITION"
buttonModif1.addEventListener("click", () => {
  displayOrCloseEditMode(true);
});

// BOUTON "MODIFIER"
buttonModif2.addEventListener("click", () => {
  displayOrCloseEditMode(true);
});

// FERMER LA MODALE AVEC LA CROIX (sans recharge de page)
xmark.addEventListener("click", (event) => {
  event.preventDefault();
  displayOrCloseEditMode(false);
});

// FERMER LA MODALE AU CLIC EN DEHORS DE LA MODALE (sans recharge de page)
modaleBackground.addEventListener("click", (event) => {
  event.preventDefault();
  displayOrCloseEditMode(false);
});

function closeModale1() {
  const modale1 = document.querySelector(".modale1");
  modale1.style.display = "none";
}

async function updatePage() {
  const updateData = await getResponseFromApi("works", "GET");
  displayWorksOnPage(updateData);
}

// MISE A JOUR DE LA PAGE APRES AJOUT OU SUPP D'UN PROJET
function displayWorksOnPage(worksData) {
  const projectsContainer = document.querySelector(".gallery");
  // Effacer le contenu actuel du conteneur
  projectsContainer.innerHTML = "";

  // Parcourir les données des projets et les ajouter au conteneur
  worksData.forEach((work) => {
    const projectElement = document.createElement("figure");
    const imageElement = document.createElement("img");
    const titleElement = document.createElement("figcaption");

    titleElement.textContent = work.title;
    imageElement.src = work.imageUrl;

    projectElement.appendChild(imageElement);
    projectElement.appendChild(titleElement);
    projectsContainer.appendChild(projectElement);
  });
}

// AFFICHAGE DES PROJETS DANS LA MODALE
async function displayModaleMode() {
  const data = await getResponseFromApi("works", "GET");
  const galleryModale = document.querySelector(".project-modale");

  galleryModale.innerHTML = "";

  data.forEach((i) => {
    const projectModale = createProjectModale(i);
    galleryModale.appendChild(projectModale);
  });

  return galleryModale;
}

function createProjectModale(i) {
  const projectModale = document.createElement("figure");
  const img = document.createElement("img");
  const imgTitle = document.createElement("figcaption");
  const corbeille = createCorbeille(i);

  img.src = i.imageUrl;
  imgTitle.innerText = i.title;

  projectModale.appendChild(img);
  projectModale.appendChild(imgTitle);
  projectModale.appendChild(corbeille);

  projectModale.classList.add("project");
  projectModale.setAttribute("data-category", i.category.name);

  return projectModale;
}

async function removeElementsFromApi(projectId) {
await getResponseFromApi(`works/${projectId}`, "DELETE");
await displayWorksOnPage();
alert("Projet supprimé avec succès !");
closeModale1();
}


// AJOUT DE LA CORBEILLE
function createCorbeille(i) {

  const corbeille = document.createElement("i");
  corbeille.classList.add("fa-solid", "fa-trash-can");

  const contentCorbeille = document.createElement("div");
  contentCorbeille.appendChild(corbeille);

  const clickCorbeille = async () => {
    const confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer ce projet ?");
    if (confirmation) {
      await removeElementsFromApi(i.id);
    }
  };

  contentCorbeille.addEventListener("click", (clickCorbeille));
  return contentCorbeille;
}



displayModaleMode();


// AFFICHAGE DE LA MODALE 2 ET SWITCH ENTRE LES DEUX

const btnAjouter = document.querySelector(".button1");
const leftArrow = document.querySelector(".fa-arrow-left");
const modale = document.querySelector(".modale_gallery");
const modale2 = document.querySelector(".modale_content");

function switchModales(modale, modale2) {
  modale.style.display = "none";
  modale2.style.display = "block";
}

btnAjouter.addEventListener("click", () => {
  switchModales(modale, modale2);
});

leftArrow.addEventListener("click", () => {
  switchModales(modale2, modale);
});

// FERMETURE DE LA MODALE 2

const xmark2 = document.querySelector(".xmark2");
const modaleBackground2 = document.querySelector(".modale_bg2");

function closeModale2() {
  const modale = document.querySelector(".modale_content");
  modale.style.display = "none";
}

xmark2.addEventListener("click", (event) => {
  event.preventDefault();
  closeModale2();
});

modaleBackground2.addEventListener("click", (event) => {
  event.preventDefault();
  closeModale2();
});

// PREVISUALISER PHOTO SELECTIONNÉE

function displayPreview(element) {
  element.style.display = "none";
}

const btnAddPhoto = document.querySelector(".button3");
const inputPhoto = document.querySelector("#file");
const addPhoto = document.querySelector(".ajoutPhoto");
const addPhotoIcon = document.querySelector(".fa-image");
const addPhotoInstructions = document.querySelector(".instruction");

btnAddPhoto.addEventListener("change", () => {
  if (inputPhoto.files.length > 0) {
    const photo = inputPhoto.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.classList.add("uploaded-photo");
      addPhoto.appendChild(img);
    };

    reader.readAsDataURL(photo);
    displayPreview(btnAddPhoto);
    displayPreview(inputPhoto);
    displayPreview(addPhotoIcon);
    displayPreview(addPhotoInstructions);
  }
});

// Envoi des nouveaux projets
async function postMode() {
  const titleInput = document.getElementById("title");
  const categorySelect = document.querySelector("select");
  const fileInput = document.getElementById("file");

  const title = titleInput.value;
  const category = categorySelect.value;
  const imageFile = fileInput.files[0];

  const formData = new FormData();
  formData.append("title", title);
  formData.append("category", category);
  formData.append("image", imageFile);

  response = await getResponseFromApi("works", "POST", formData);
}


const addButton = document.querySelector(".button2");
addButton.addEventListener("click", async (e) => {
  await postMode();
  displayModaleMode();
  alert("Projet rajouté avec succès !");
  closeModale2();
  await updatePage();
  e.preventDefault();
});


