let allProjects = [];
let visibleProjects = 4; 
const projectStep = 4; 
fetch("data/projects.json")
  .then(res => res.json())
  .then(data => {
    allProjects = data;
    renderProjects();
  })
  .catch(err => console.error("Erro ao carregar projetos:", err));

function renderProjects() {
  const container = document.getElementById("projects-container");
  const button = document.getElementById("load-more-projects");

  const fragment = document.createDocumentFragment();
  const projectsToShow = allProjects.slice(0, visibleProjects);

  container.innerHTML = "";

  projectsToShow.forEach(p => {
    const card = document.createElement("div");
    card.classList.add("project-card");

    card.innerHTML = `
      <img src="${p.image}" alt="${p.title}" 
           class="project-image" loading="lazy">

      <h3 class="project-title">${p.title}</h3>

      <p class="project-tech">
        ${p.tech.join(" • ")}
      </p>

      <div class="project-links">
        <a href="${p.github}" target="_blank">GitHub</a>
        ${p.demo ? `<a href="${p.demo}" target="_blank">Projeto</a>` : ""}
      </div>
    `;

    fragment.appendChild(card);
  });

  container.appendChild(fragment);

  if (visibleProjects >= allProjects.length) {
    button.style.display = "none";
  }
}

document.addEventListener("click", function(e) {
  if (e.target && e.target.id === "load-more-projects") {
    visibleProjects += projectStep;
    renderProjects();
  }
});