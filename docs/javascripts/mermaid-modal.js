document$.subscribe(() => {
  if (document.querySelector("#mermaid-modal")) return;

  const modal = document.createElement("dialog");
  modal.id = "mermaid-modal";

  modal.innerHTML = `
    <button class="mermaid-close" aria-label="Cerrar">×</button>
    <div class="mermaid-zoom-controls">
      <button data-zoom="-0.1">−</button>
      <button data-zoom="0.1">+</button>
      <button data-reset>Restablecer</button>
    </div>
    <div class="mermaid-modal-content"></div>
  `;

  document.body.appendChild(modal);

  const content = modal.querySelector(".mermaid-modal-content");
  let scale = 1;

  function applyZoom() {
    const svg = content.querySelector("svg");
    if (svg) svg.style.transform = `scale(${scale})`;
  }

  document.querySelectorAll(".mermaid svg").forEach((svg) => {
    svg.style.cursor = "zoom-in";

    svg.addEventListener("click", () => {
      content.replaceChildren(svg.cloneNode(true));
      scale = 1;
      applyZoom();
      modal.showModal();
    });
  });

  modal.querySelector(".mermaid-close").addEventListener("click", () => {
    modal.close();
  });

  modal.querySelectorAll("[data-zoom]").forEach((button) => {
    button.addEventListener("click", () => {
      scale += Number(button.dataset.zoom);
      scale = Math.max(0.3, Math.min(scale, 4));
      applyZoom();
    });
  });

  modal.querySelector("[data-reset]").addEventListener("click", () => {
    scale = 1;
    applyZoom();
  });

  content.addEventListener("wheel", (event) => {
    event.preventDefault();
    scale += event.deltaY < 0 ? 0.1 : -0.1;
    scale = Math.max(0.3, Math.min(scale, 4));
    applyZoom();
  }, { passive: false });

  modal.addEventListener("click", (event) => {
    if (event.target === modal) modal.close();
  });
});