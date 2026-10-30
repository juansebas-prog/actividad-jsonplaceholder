const POSTS_URL = "https://jsonplaceholder.typicode.com/posts";
const USERS_URL = "https://jsonplaceholder.typicode.com/users";

const postsContainer = document.getElementById("posts-container");
const statusMessage = document.getElementById("status");
const resultsCount = document.getElementById("results-count");
const modalOverlay = document.getElementById("modal-overlay");
const userDetails = document.getElementById("user-details");
const modalTitle = document.getElementById("modal-title");
const modalSubtitle = document.getElementById("modal-subtitle");
const closeModalButton = document.getElementById("close-modal");
const doneButton = document.getElementById("done-button");
const reloadButton = document.getElementById("reload-button");

let usersById = new Map();
let lastFocusedCard = null;

async function loadData() {
  statusMessage.className = "status";
  statusMessage.textContent = "Conectando con JSONPlaceholder...";
  postsContainer.replaceChildren();
  resultsCount.textContent = "Cargando publicaciones...";
  reloadButton.disabled = true;

  try {
    // Consultamos las publicaciones y los usuarios al mismo tiempo.
    const [postsResponse, usersResponse] = await Promise.all([
      fetch(POSTS_URL),
      fetch(USERS_URL)
    ]);

    if (!postsResponse.ok || !usersResponse.ok) {
      throw new Error("La API respondió con un error.");
    }

    const [posts, users] = await Promise.all([
      postsResponse.json(),
      usersResponse.json()
    ]);

    // Guardamos los usuarios en un mapa para encontrarlos por su ID.
    usersById = new Map(users.map(user => [user.id, user]));

    renderPosts(posts);
    resultsCount.textContent = `${posts.length} publicaciones disponibles`;
    statusMessage.textContent = "";
  } catch (error) {
    console.error("Error al cargar la API:", error);
    statusMessage.className = "status error";
    statusMessage.textContent =
      "No se pudieron cargar los datos. Revisa tu conexión a Internet e inténtalo de nuevo.";
    resultsCount.textContent = "No se pudieron cargar las publicaciones.";
  } finally {
    reloadButton.disabled = false;
  }
}

function renderPosts(posts) {
  const fragment = document.createDocumentFragment();

  posts.forEach(post => {
    const user = usersById.get(post.userId);
    const card = document.createElement("button");
    card.type = "button";
    card.className = "post-card";
    card.setAttribute("aria-label", `Ver información del autor de ${post.title}`);

    const number = document.createElement("span");
    number.className = "post-number";
    number.textContent = `#${post.id}`;

    const title = document.createElement("h3");
    title.textContent = post.title;

    const body = document.createElement("p");
    body.className = "post-body";
    body.textContent = post.body;

    const footer = document.createElement("div");
    footer.className = "card-footer";

    const avatar = document.createElement("span");
    avatar.className = "avatar";
    avatar.textContent = user ? user.name.charAt(0).toUpperCase() : "?";

    const author = document.createElement("span");
    author.textContent = user ? user.name : `Usuario ${post.userId}`;

    footer.append(avatar, author);
    card.append(number, title, body, footer);

    card.addEventListener("click", () => {
      lastFocusedCard = card;
      showUserModal(post.userId);
    });

    fragment.appendChild(card);
  });

  postsContainer.appendChild(fragment);
}

function showUserModal(userId) {
  const user = usersById.get(userId);

  if (!user) {
    statusMessage.className = "status error";
    statusMessage.textContent = "No se encontró la información de ese usuario.";
    return;
  }

  modalTitle.textContent = user.name;
  modalSubtitle.textContent = `Información del usuario #${user.id}`;

  const fields = [
    ["ID", String(user.id)],
    ["Name", user.name],
    ["Username", user.username],
    ["Email", user.email],
    ["Phone", user.phone],
    ["Website", user.website]
  ];

  userDetails.replaceChildren();

  fields.forEach(([label, value]) => {
    const row = document.createElement("div");
    row.className = "detail-row";

    const labelElement = document.createElement("span");
    labelElement.className = "detail-label";
    labelElement.textContent = label;

    const valueElement = document.createElement("span");
    valueElement.className = "detail-value";

    if (label === "Email") {
      const emailLink = document.createElement("a");
      emailLink.href = `mailto:${value}`;
      emailLink.textContent = value;
      valueElement.appendChild(emailLink);
    } else if (label === "Website") {
      const websiteLink = document.createElement("a");
      websiteLink.href = `https://${value}`;
      websiteLink.target = "_blank";
      websiteLink.rel = "noopener noreferrer";
      websiteLink.textContent = value;
      valueElement.appendChild(websiteLink);
    } else {
      valueElement.textContent = value;
    }

    row.append(labelElement, valueElement);
    userDetails.appendChild(row);
  });

  modalOverlay.hidden = false;
  closeModalButton.focus();
}

function closeModal() {
  modalOverlay.hidden = true;
  if (lastFocusedCard) lastFocusedCard.focus();
}

closeModalButton.addEventListener("click", closeModal);
doneButton.addEventListener("click", closeModal);
reloadButton.addEventListener("click", loadData);

// Cerrar al pulsar fuera de la ventana.
modalOverlay.addEventListener("click", event => {
  if (event.target === modalOverlay) closeModal();
});

// Cerrar con la tecla Escape.
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !modalOverlay.hidden) closeModal();
});

loadData();
