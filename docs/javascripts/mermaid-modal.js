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
  let panMode = false;
  let activePointerId = null;
  let pointerStartX = 0;
  let pointerStartY = 0;
  let translateStartX = 0;
  let translateStartY = 0;

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
          <p class="mermaid-modal-hint">Rueda para zoom · Activa la mano y arrastra para moverte.</p>
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
        <span class="mermaid-zoom-divider" aria-hidden="true"></span>
        <button type="button" data-pan aria-label="Activar desplazamiento" aria-pressed="false" title="Activar desplazamiento">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 12V5.5a1.5 1.5 0 0 1 3 0V11 4.5a1.5 1.5 0 0 1 3 0V11 6a1.5 1.5 0 0 1 3 0v6-2a1.5 1.5 0 0 1 3 0v5.5a6.5 6.5 0 0 1-6.5 6.5h-1.2a6 6 0 0 1-4.2-1.8L4.5 17a1.8 1.8 0 0 1 2.6-2.5L9 16.2" />
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

    const panButton = modal.querySelector("[data-pan]");
    panButton.onclick = () => {
      panMode = !panMode;
      panButton.setAttribute("aria-pressed", String(panMode));
      panButton.setAttribute(
        "aria-label",
        panMode ? "Desactivar desplazamiento" : "Activar desplazamiento"
      );
      panButton.title = panMode ? "Desactivar desplazamiento" : "Activar desplazamiento";
      content.classList.toggle("is-pan-mode", panMode);
    };

    modal.onclick = (event) => {
      if (event.target === modal) modal.close();
    };

    content.addEventListener("pointerdown", (event) => {
      if (!panMode || !event.target.closest?.("svg")) return;

      event.preventDefault();
      activePointerId = event.pointerId;
      pointerStartX = event.clientX;
      pointerStartY = event.clientY;
      translateStartX = translateX;
      translateStartY = translateY;
      content.setPointerCapture(event.pointerId);
      content.classList.add("is-panning");
    });

    content.addEventListener("pointermove", (event) => {
      if (event.pointerId !== activePointerId) return;

      translateX = translateStartX + event.clientX - pointerStartX;
      translateY = translateStartY + event.clientY - pointerStartY;
      updateZoom();
    });

    const stopPanning = (event) => {
      if (event.pointerId !== activePointerId) return;

      activePointerId = null;
      content.classList.remove("is-panning");
    };

    content.addEventListener("pointerup", stopPanning);
    content.addEventListener("pointercancel", stopPanning);

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
    panMode = false;
    activePointerId = null;
    content.classList.remove("is-pan-mode", "is-panning");
    modal.querySelector("[data-pan]").setAttribute("aria-pressed", "false");
    modal.querySelector("[data-pan]").setAttribute("aria-label", "Activar desplazamiento");
    modal.querySelector("[data-pan]").title = "Activar desplazamiento";
    updateZoom();

    modal.showModal();
  });
})();