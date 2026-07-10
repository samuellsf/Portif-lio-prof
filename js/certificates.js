let allCertificates = [];
let visibleCount = 4; 
const step = 4; 

fetch("data/certificates.json")
  .then(res => res.json())
  .then(data => {
    allCertificates = data;
    renderCertificates();
  })
  .catch(err => console.error("Erro ao carregar certificados:", err));

function renderCertificates() {
  const container = document.getElementById("certificates-container");
  const button = document.getElementById("load-more-btn");

  const fragment = document.createDocumentFragment();

  const certificatesToShow = allCertificates.slice(0, visibleCount);

  container.innerHTML = "";

  certificatesToShow.forEach(c => {
    const card = document.createElement("div");
    card.classList.add("certificate-card");
card.innerHTML = `
  <img src="${c.image}" alt="${c.title}" 
       class="certificate-image" 
       loading="lazy">

  <h3 class="certificate-title">
    ${c.title}
  </h3>

  <p class="certificate-description">
    ${c.learned}
  </p>
`;
    fragment.appendChild(card);
  });

  container.appendChild(fragment);

  if (visibleCount >= allCertificates.length) {
    button.style.display = "none";
  }
}

document.addEventListener("click", function(e) {
  if (e.target && e.target.id === "load-more-btn") {
    visibleCount += step;
    renderCertificates();
  }
});