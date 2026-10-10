(() => {
  if (!window.mermaid) {
    console.error("Mermaid failed to load; diagrams cannot be rendered.");
    return;
  }

  window.mermaid.initialize({ startOnLoad: false });

  function renderMermaid() {
    document.querySelectorAll("pre.mermaid").forEach((codeBlock) => {
      const diagram = document.createElement("div");
      diagram.className = "mermaid";
      diagram.textContent = codeBlock.textContent;
      codeBlock.replaceWith(diagram);
    });

    return window.mermaid.run({ querySelector: ".mermaid" });
  }

  document$.subscribe(() => {
    renderMermaid().catch((error) => {
      console.error("Mermaid failed to render diagrams.", error);
    });
  });

  let modal;
  let content;
  let scale = 1;

  function createModal() {
    if (modal) return;

    modal = document.createElement("dialog");
    modal.id = "mermaid-modal";

    modal.innerHTML = `
      <button class="mermaid-close" type="button">×</button>
      <div class="mermaid-zoom-controls">
        <button type="button" data-zoom="-0.1">−</button>
        <button type="button" data-zoom="0.1">+</button>
        <button type="button" data-reset>100%</button>
      </div>
      <div class="mermaid-modal-content"></div>
    `;

    document.body.appendChild(modal);
    content = modal.querySelector(".mermaid-modal-content");

    modal.querySelector(".mermaid-close").onclick = () => {
      modal.close();
    };

    modal.querySelectorAll("[data-zoom]").forEach((button) => {
      button.onclick = () => {
        scale += Number(button.dataset.zoom);
        scale = Math.max(0.3, Math.min(scale, 4));
        updateZoom();
      };
    });

    modal.querySelector("[data-reset]").onclick = () => {
      scale = 1;
      updateZoom();
    };

    modal.onclick = (event) => {
      if (event.target === modal) modal.close();
    };

    content.addEventListener("wheel", (event) => {
      event.preventDefault();
      scale += event.deltaY < 0 ? 0.1 : -0.1;
      scale = Math.max(0.3, Math.min(scale, 4));
      updateZoom();
    }, { passive: false });
  }

  function updateZoom() {
    const svg = content.querySelector("svg");

    if (svg) {
      svg.style.transform = `scale(${scale})`;
    }
  }

  document.addEventListener("click", (event) => {
    const svg = event.target.closest(".mermaid svg");

    if (!svg) return;

    event.preventDefault();
    event.stopPropagation();

    createModal();

    content.replaceChildren(svg.cloneNode(true));
    scale = 1;
    updateZoom();

    modal.showModal();
  });
})();