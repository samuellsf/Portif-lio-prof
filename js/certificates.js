fetch("data/certificates.json")
  .then(res => res.json())
  .then(certificates => {
    const container = document.getElementById("certificates-container");

    const grouped = certificates.reduce((acc, cert) => {
      acc[cert.category] = acc[cert.category] || [];
      acc[cert.category].push(cert);
      return acc;
    }, {});

    Object.keys(grouped).forEach(category => {
      const section = document.createElement("div");
      section.classList.add("certificate-category");

      section.innerHTML = `
        <h3>${category}</h3>
        <div class="certificates-grid">
          ${grouped[category].map(cert => `
            <div class="certificate-card">
              <img src="${cert.image}" alt="${cert.title}">
              <p>${cert.title}</p>
            </div>
          `).join("")}
        </div>
      `;

      container.appendChild(section);
    });
  })
  .catch(err => console.error("Erro ao carregar certificados:", err));
