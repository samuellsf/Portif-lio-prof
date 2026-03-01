async function loadSection(id, file) {
  try {
    const res = await fetch(file);
    if (!res.ok) throw new Error(`Erro ao carregar ${file}`);
    
    document.getElementById(id).innerHTML = await res.text();

  
    if (id === "about" && typeof initMaze === "function") {
      initMaze();
    }

    if (id === "projects" && typeof loadProjects === "function") {
      loadProjects();
    }

    if (id === "certificates" && typeof loadCertificates === "function") {
      loadCertificates();
    }

  } catch (err) {
    console.error(err);
  }
}
loadSection("header", "sections/header.html");
loadSection("about", "sections/about.html");
loadSection("projects", "sections/projects.html");
loadSection("certificates", "sections/certificates.html");
loadSection("contact", "sections/contact.html");
loadSection("footer", "sections/footer.html");