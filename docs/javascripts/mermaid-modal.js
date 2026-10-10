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
    const svg = event.target.closest(".mermaid svg");

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