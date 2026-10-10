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
  let translateX = 0;
  let translateY = 0;

  function createModal() {
    if (modal) return;

    modal = document.createElement("dialog");
    modal.id = "mermaid-modal";
    modal.setAttribute("aria-labelledby", "mermaid-modal-title");

    modal.innerHTML = `
      <header class="mermaid-modal-header">
        <div>
          <p class="mermaid-modal-eyebrow">DIAGRAMA · MERMAID</p>
          <h2 id="mermaid-modal-title">Vista ampliada</h2>
          <p class="mermaid-modal-hint">Usa la rueda del ratón para acercar el diagrama.</p>
        </div>
        <button class="mermaid-close" type="button">Cerrar vista</button>
      </header>
      <div class="mermaid-modal-content"></div>
      <div class="mermaid-zoom-controls">
        <button type="button" data-zoom="-0.1" aria-label="Reducir zoom" title="Reducir zoom">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" /></svg>
        </button>
        <span class="mermaid-zoom-label">Zoom</span>
        <button type="button" data-zoom="0.1" aria-label="Aumentar zoom" title="Aumentar zoom">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
        </button>
        <span class="mermaid-zoom-divider" aria-hidden="true"></span>
        <button type="button" data-reset aria-label="Restablecer zoom" title="Restablecer zoom">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20 11a8 8 0 0 0-14.9-3L3 11" />
            <path d="M3 5v6h6M4 13a8 8 0 0 0 14.9 3L21 13" />
          </svg>
        </button>
      </div>
    `;

    document.body.appendChild(modal);
    content = modal.querySelector(".mermaid-modal-content");

    modal.querySelector(".mermaid-close").onclick = () => {
      modal.close();
    };

    modal.querySelectorAll("[data-zoom]").forEach((button) => {
      button.onclick = () => {
        const bounds = content.getBoundingClientRect();
        zoomAt(
          scale + Number(button.dataset.zoom),
          bounds.left + bounds.width / 2,
          bounds.top + bounds.height / 2
        );
      };
    });

    modal.querySelector("[data-reset]").onclick = () => {
      scale = 1;
      translateX = 0;
      translateY = 0;
      updateZoom();
    };

    modal.onclick = (event) => {
      if (event.target === modal) modal.close();
    };

    content.addEventListener("wheel", (event) => {
      event.preventDefault();
      zoomAt(
        scale + (event.deltaY < 0 ? 0.1 : -0.1),
        event.clientX,
        event.clientY
      );
    }, { passive: false });
  }

  function zoomAt(nextScale, clientX, clientY) {
    const svg = content.querySelector("svg");
    const clampedScale = Math.max(0.3, Math.min(nextScale, 4));

    if (svg && clampedScale !== scale) {
      const bounds = svg.getBoundingClientRect();
      const scaleRatio = clampedScale / scale;
      translateX += (clientX - bounds.left) * (1 - scaleRatio);
      translateY += (clientY - bounds.top) * (1 - scaleRatio);
    }

    scale = clampedScale;
    updateZoom();
  }

  function updateZoom() {
    const svg = content.querySelector("svg");

    if (svg) {
      svg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    }
  }

  document.addEventListener("click", (event) => {
    const svg = event.target.closest?.(".mermaid svg");

    if (!svg) return;

    event.preventDefault();
    event.stopPropagation();

    createModal();

    content.replaceChildren(svg.cloneNode(true));
    scale = 1;
    translateX = 0;
    translateY = 0;
    updateZoom();

    modal.showModal();
  });
})();