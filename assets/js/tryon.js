const shades = [
  { name: "Rose Glow", hex: "#f5a3b7" },
  { name: "Peach Pop", hex: "#ffb191" },
  { name: "Berry Kiss", hex: "#b14668" },
  { name: "Nude Bloom", hex: "#d8a18e" },
  { name: "Coral Crush", hex: "#ff6f61" }
];

const renderSwatches = () => {
  const strip = document.getElementById("swatchStrip");
  if (!strip) return;
  strip.innerHTML = shades
    .map(
      (shade) => `
      <button class="swatch" style="background:${shade.hex}" data-shade="${shade.hex}" title="${shade.name}"></button>`
    )
    .join("");
};

document.addEventListener("DOMContentLoaded", () => {
  renderSwatches();
  const preview = document.getElementById("tryonPreview");
  const upload = document.getElementById("uploadInput");
  const fileLabel = document.getElementById("uploadLabel");

  document
    .getElementById("swatchStrip")
    ?.addEventListener("click", (event) => {
      const swatch = event.target.closest("[data-shade]");
      if (!swatch || !preview) return;
      preview.style.setProperty("--lip-color", swatch.dataset.shade);
      preview.querySelector(
        "[data-selected-shade]"
      ).textContent = `Selected Shade: ${swatch.title}`;
    });

  upload?.addEventListener("change", (event) => {
    const fileName = event.target.files?.[0]?.name || "No file chosen";
    if (fileLabel) fileLabel.textContent = fileName;
  });
});

