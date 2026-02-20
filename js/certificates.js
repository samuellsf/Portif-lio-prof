fetch("data/certificates.json")
  .then(res => res.json())
  .then(certificates => {
    const container = document.getElementById("certificates-container");

    container.innerHTML = `
      <div class="certificates-grid">
        ${certificates.map(cert => `
          <div class="certificate-card">
            <img 
              src="${cert.image}" 
              alt="${cert.title}" 
              class="certificate-image"
            >
            <p class="certificate-title">${cert.title}</p>
            <p class="certificate-description">${cert.learned}</p>
          </div>
        `).join("")}
      </div>
    `;
  })
  .catch(err => console.error("Erro ao carregar certificados:", err));