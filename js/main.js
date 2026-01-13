
async function loadSection(id, file) {
  const res = await fetch(file);
  document.getElementById(id).innerHTML = await res.text();
}

loadSection("header", "sections/header.html");
loadSection("about", "sections/about.html");
loadSection("projects", "sections/projects.html");
loadSection("certificates", "sections/certificates.html");
loadSection("contact", "sections/contact.html");
loadSection("footer", "sections/footer.html");
