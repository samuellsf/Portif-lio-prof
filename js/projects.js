fetch("data/projects.json")
  .then(res => res.json())
  .then(projects => {
    const container = document.getElementById("projects-container");
    container.innerHTML = "";

    projects.forEach(p => {
      container.innerHTML += `
        <div class="project-card">
          <img src="${p.image}" alt="${p.title}" class="project-image">

          <h3>${p.title}</h3>

          <p class="project-tech">${p.tech.join(" • ")}</p>

          <div class="project-links">
            <a href="${p.github}" target="_blank">GitHub</a>
            ${p.demo ? `<a href="${p.demo}" target="_blank">Projeto</a>` : ""}
          </div>
        </div>
      `;
    });
  })
  .catch(err => console.error("Erro ao carregar projetos:", err));
