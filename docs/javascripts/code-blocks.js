(() => {
  const codeBlockScriptUrl = document.currentScript.src;

  const languageLogos = {
    bash: "bash",
    "c#": "csharp",
    csharp: "csharp",
    java: "java",
    json: "json",
    jsonc: "json",
    py: "python",
    python: "python",
    sh: "bash",
    shell: "bash",
    toml: "toml",
    yaml: "yaml",
    yml: "yaml"
  };

  const languageNames = {
    bash: "Shell",
    c: "C",
    "c#": "C#",
    cpp: "C++",
    csharp: "C#",
    css: "CSS",
    go: "Go",
    html: "HTML",
    java: "Java",
    javascript: "JavaScript",
    json: "JSON",
    jsonc: "JSON",
    py: "Python",
    powershell: "PowerShell",
    python: "Python",
    rust: "Rust",
    sh: "Shell",
    shell: "Shell",
    sql: "SQL",
    text: "Texto",
    toml: "TOML",
    ts: "TypeScript",
    typescript: "TypeScript",
    yaml: "YAML",
    yml: "YAML"
  };

  function addCodeBlockHeaders() {
    document.querySelectorAll(".md-typeset .highlight").forEach((block) => {
      if (block.dataset.codeBlockHeader === "true") return;

      const pre = block.querySelector(":scope > pre");
      const languageClass = Array.from(block.classList).find((className) =>
        className.startsWith("language-")
      );

      if (!pre || !languageClass) return;

      const language = languageClass.slice("language-".length).toLowerCase();
      block.dataset.codeLanguage = language;
      const languageName =
        languageNames[language] ??
        language.charAt(0).toUpperCase() + language.slice(1);
      const header = document.createElement("div");
      const meta = document.createElement("div");
      const icon = document.createElement("span");
      const label = document.createElement("span");
      const controls = document.createElement("div");
      const copyButton = block.querySelector(".md-clipboard, .md-code__button");
      const collapseButton = document.createElement("button");

      header.className = "code-block-header";
      meta.className = "code-block-meta";
      icon.className = "code-block-icon";
      icon.setAttribute("aria-hidden", "true");
      label.className = "code-block-language";
      label.textContent = languageName;
      controls.className = "code-block-controls";
      collapseButton.className = "code-block-collapse";
      collapseButton.type = "button";
      collapseButton.setAttribute("aria-expanded", "true");
      collapseButton.setAttribute("aria-label", "Plegar bloque de código");
      collapseButton.title = "Plegar bloque de código";
      collapseButton.innerHTML =
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>';

      const logoName = languageLogos[language];
      if (logoName) {
        const logo = document.createElement("img");
        logo.src = new URL(
          `../assets/code-icons/${logoName}.svg`,
          codeBlockScriptUrl
        ).href;
        logo.alt = "";
        icon.append(logo);
      } else {
        icon.innerHTML =
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5H5v14h14v-3M9 15l3-3-3-3m4 6h4" /></svg>';
      }

      meta.append(icon, label);

      const title = block.querySelector(".filename");
      if (title) {
        title.classList.add("code-block-title");
        meta.append(title);
      }

      if (copyButton) {
        copyButton.setAttribute(
          "aria-label",
          copyButton.getAttribute("aria-label") ?? "Copiar código"
        );
        controls.append(copyButton);
      } else {
        const copyCodeButton = document.createElement("button");
        copyCodeButton.className = "code-block-copy";
        copyCodeButton.type = "button";
        copyCodeButton.setAttribute("aria-label", "Copiar código");
        copyCodeButton.title = "Copiar código";
        copyCodeButton.innerHTML =
          '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" /></svg>';
        copyCodeButton.addEventListener("click", async () => {
          try {
            await navigator.clipboard.writeText(pre.innerText);
            copyCodeButton.setAttribute("aria-label", "Código copiado");
            copyCodeButton.title = "Código copiado";
          } catch (error) {
            console.error("No se pudo copiar el bloque de código.", error);
            copyCodeButton.setAttribute("aria-label", "No se pudo copiar el código");
            copyCodeButton.title = "No se pudo copiar el código";
          }
        });
        controls.append(copyCodeButton);
      }

      controls.append(collapseButton);
      header.append(meta, controls);
      block.insertBefore(header, pre);
      block.dataset.codeBlockHeader = "true";

      collapseButton.addEventListener("click", () => {
        const isExpanded = collapseButton.getAttribute("aria-expanded") === "true";
        block.classList.toggle("code-block-collapsed", isExpanded);
        collapseButton.setAttribute("aria-expanded", String(!isExpanded));
        collapseButton.setAttribute(
          "aria-label",
          isExpanded ? "Expandir bloque de código" : "Plegar bloque de código"
        );
        collapseButton.title = isExpanded
          ? "Expandir bloque de código"
          : "Plegar bloque de código";
      });
    });
  }

  document$.subscribe(addCodeBlockHeaders);
})();
