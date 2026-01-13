fetch("data/certificates.json")
  .then(res => {
    if (!res.ok) throw new Error("Erro ao carregar certificates.json");
    return res.json();
  })
  .then(certificates => {
    const container = document.getElementById("certificates-container");

    certificates.forEach(cert => {
      container.innerHTML += `
        <div class="certificate-card">
          <img src="${cert.image}" alt="${cert.title}">
          <h4>${cert.title}</h4>
        </div>
      `;
    });
  })
  .catch(err => console.error(err));
