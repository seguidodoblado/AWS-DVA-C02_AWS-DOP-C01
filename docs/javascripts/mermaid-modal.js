(() => {
  if (!window.mermaid) {
    console.error("Mermaid failed to load; diagrams cannot be rendered.");
    return;
  }

  window.mermaid.initialize({
    startOnLoad: false,
    themeVariables: {
      fontFamily: '"Ubuntu Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }
  });

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
  let minimumScale = 0.3;
  let translateX = 0;
  let translateY = 0;

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
          <p class="mermaid-modal-hint">Rueda para zoom · Arrastra para moverte.</p>
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
      fitDiagram();
    };

    modal.onclick = (event) => {
      if (event.target === modal) modal.close();
    };

    content.addEventListener("pointerdown", (event) => {
      if (!event.target.closest?.("svg")) return;

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
    const clampedScale = Math.max(minimumScale, Math.min(nextScale, 4));

    if (svg && clampedScale !== scale) {
      const bounds = svg.getBoundingClientRect();
      const scaleRatio = clampedScale / scale;
      translateX += (clientX - bounds.left) * (1 - scaleRatio);
      translateY += (clientY - bounds.top) * (1 - scaleRatio);
    }

    scale = clampedScale;
    updateZoom();
  }

  function fitDiagram() {
    const svg = content.querySelector("svg");

    if (!svg) return;

    const viewBox = svg.viewBox.baseVal;
    const svgWidth = viewBox.width;
    const svgHeight = viewBox.height;

    if (!svgWidth || !svgHeight) return;

    svg.style.width = `${svgWidth}px`;
    svg.style.height = `${svgHeight}px`;
    svg.style.transform = "none";
    const availableWidth = content.clientWidth;
    const availableHeight = content.clientHeight;

    if (!availableWidth || !availableHeight) return;

    scale = Math.min(1, availableWidth / svgWidth, availableHeight / svgHeight);
    minimumScale = Math.min(0.3, scale);
    const initialX = Math.max(0, (availableWidth - svgWidth) / 2);
    const initialY = Math.max(0, (availableHeight - svgHeight) / 2);
    translateX = (availableWidth - svgWidth * scale) / 2 - initialX;
    translateY = (availableHeight - svgHeight * scale) / 2 - initialY;
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
    minimumScale = 0.3;
    translateX = 0;
    translateY = 0;
    activePointerId = null;
    content.classList.remove("is-panning");
    modal.showModal();
    requestAnimationFrame(fitDiagram);
  });

  /* ───────────────────────────────────────────────
   *  Modal de imágenes con clase "zoomable"
   * ─────────────────────────────────────────────── */

  let imgModal;
  let imgContent;
  let imgScale = 1;
  let imgMinScale = 0.3;
  let imgTranslateX = 0;
  let imgTranslateY = 0;
  let imgActivePointerId = null;
  let imgPointerStartX = 0;
  let imgPointerStartY = 0;
  let imgTranslateStartX = 0;
  let imgTranslateStartY = 0;

  function createImageModal() {
    if (imgModal) return;

    imgModal = document.createElement("dialog");
    imgModal.id = "image-modal";
    imgModal.setAttribute("aria-labelledby", "image-modal-title");

    imgModal.innerHTML = `
      <header class="image-modal-header">
        <div>
          <p class="image-modal-eyebrow">IMAGEN</p>
          <h2 id="image-modal-title">Vista ampliada</h2>
          <p class="image-modal-hint">Rueda para zoom · Arrastra para moverte.</p>
        </div>
        <button class="image-close" type="button">Cerrar vista</button>
      </header>
      <div class="image-modal-content"></div>
      <div class="image-zoom-controls">
        <button type="button" data-img-zoom="-0.1" aria-label="Reducir zoom" title="Reducir zoom">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" /></svg>
        </button>
        <span class="image-zoom-label">Zoom</span>
        <button type="button" data-img-zoom="0.1" aria-label="Aumentar zoom" title="Aumentar zoom">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
        </button>
        <span class="image-zoom-divider" aria-hidden="true"></span>
        <button type="button" data-img-reset aria-label="Restablecer zoom" title="Restablecer zoom">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20 11a8 8 0 0 0-14.9-3L3 11" />
            <path d="M3 5v6h6M4 13a8 8 0 0 0 14.9 3L21 13" />
          </svg>
        </button>
      </div>
    `;

    document.body.appendChild(imgModal);
    imgContent = imgModal.querySelector(".image-modal-content");

    imgModal.querySelector(".image-close").onclick = () => {
      imgModal.close();
    };

    imgModal.querySelectorAll("[data-img-zoom]").forEach((button) => {
      button.onclick = () => {
        const bounds = imgContent.getBoundingClientRect();
        imgZoomAt(
          imgScale + Number(button.dataset.imgZoom),
          bounds.left + bounds.width / 2,
          bounds.top + bounds.height / 2
        );
      };
    });

    imgModal.querySelector("[data-img-reset]").onclick = () => {
      fitImage();
    };

    imgModal.onclick = (event) => {
      if (event.target === imgModal) imgModal.close();
    };

    imgContent.addEventListener("pointerdown", (event) => {
      const img = event.target.closest?.("img");
      if (!img) return;

      event.preventDefault();
      imgActivePointerId = event.pointerId;
      imgPointerStartX = event.clientX;
      imgPointerStartY = event.clientY;
      imgTranslateStartX = imgTranslateX;
      imgTranslateStartY = imgTranslateY;
      imgContent.setPointerCapture(event.pointerId);
      imgContent.classList.add("is-panning");
    });

    imgContent.addEventListener("pointermove", (event) => {
      if (event.pointerId !== imgActivePointerId) return;

      imgTranslateX = imgTranslateStartX + event.clientX - imgPointerStartX;
      imgTranslateY = imgTranslateStartY + event.clientY - imgPointerStartY;
      updateImageZoom();
    });

    const stopImgPanning = (event) => {
      if (event.pointerId !== imgActivePointerId) return;

      imgActivePointerId = null;
      imgContent.classList.remove("is-panning");
    };

    imgContent.addEventListener("pointerup", stopImgPanning);
    imgContent.addEventListener("pointercancel", stopImgPanning);

    imgContent.addEventListener("wheel", (event) => {
      event.preventDefault();
      imgZoomAt(
        imgScale + (event.deltaY < 0 ? 0.1 : -0.1),
        event.clientX,
        event.clientY
      );
    }, { passive: false });
  }

  function imgZoomAt(nextScale, clientX, clientY) {
    const img = imgContent.querySelector("img");
    const clampedScale = Math.max(imgMinScale, Math.min(nextScale, 4));

    if (img && clampedScale !== imgScale) {
      const bounds = img.getBoundingClientRect();
      const scaleRatio = clampedScale / imgScale;
      imgTranslateX += (clientX - bounds.left) * (1 - scaleRatio);
      imgTranslateY += (clientY - bounds.top) * (1 - scaleRatio);
    }

    imgScale = clampedScale;
    updateImageZoom();
  }

  function fitImage() {
    const img = imgContent.querySelector("img");

    if (!img) return;

    const naturalW = img.naturalWidth;
    const naturalH = img.naturalHeight;

    if (!naturalW || !naturalH) return;

    img.style.width = `${naturalW}px`;
    img.style.height = `${naturalH}px`;
    img.style.transform = "none";

    const availableWidth = imgContent.clientWidth;
    const availableHeight = imgContent.clientHeight;

    if (!availableWidth || !availableHeight) return;

    imgScale = Math.min(1, availableWidth / naturalW, availableHeight / naturalH);
    imgMinScale = Math.min(0.3, imgScale);
    imgTranslateX = (availableWidth - naturalW * imgScale) / 2;
    imgTranslateY = (availableHeight - naturalH * imgScale) / 2;
    updateImageZoom();
  }

  function updateImageZoom() {
    const img = imgContent.querySelector("img");

    if (img) {
      img.style.transform = `translate(${imgTranslateX}px, ${imgTranslateY}px) scale(${imgScale})`;
    }
  }

  document.addEventListener("click", (event) => {
    const img = event.target.closest?.("img.zoomable");

    if (!img) return;

    event.preventDefault();
    event.stopPropagation();

    createImageModal();

    const clone = img.cloneNode(true);
    clone.removeAttribute("width");
    clone.removeAttribute("height");
    clone.style.maxWidth = "none";
    imgContent.replaceChildren(clone);

    const title = img.alt || "Vista ampliada";
    imgModal.querySelector("#image-modal-title").textContent = title;

    imgScale = 1;
    imgMinScale = 0.3;
    imgTranslateX = 0;
    imgTranslateY = 0;
    imgActivePointerId = null;
    imgContent.classList.remove("is-panning");

    imgModal.showModal();

    if (clone.complete) {
      requestAnimationFrame(fitImage);
    } else {
      clone.onload = () => requestAnimationFrame(fitImage);
    }
  });
})();