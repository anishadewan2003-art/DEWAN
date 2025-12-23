let filteredProducts = [...products];

const populateFilters = () => {
  const skinSelect = document.getElementById("filterSkin");
  const categorySelect = document.getElementById("filterCategory");
  if (!skinSelect || !categorySelect) return;

  const skinTypes = ["All", ...new Set(products.map((p) => p.skinType))];
  skinSelect.innerHTML = skinTypes
    .map((type) => `<option value="${type}">${type}</option>`)
    .join("");

  const categories = ["All", ...new Set(products.map((p) => p.category))];
  categorySelect.innerHTML = categories
    .map((cat) => `<option value="${cat}">${cat}</option>`)
    .join("");
};

const renderProductGrid = () => {
  const grid = document.getElementById("productsGrid");
  const summary = document.getElementById("resultCount");
  if (!grid) return;

  if (!filteredProducts.length) {
    grid.innerHTML =
      '<div class="empty-state">No matches found. Try adjusting filters!</div>';
    if (summary) summary.textContent = "0 products";
    return;
  }

  grid.innerHTML = filteredProducts
    .map(
      (item) => `
      <article class="card product-card">
        <img src="${item.image}" alt="${item.name}">
        <div class="product-meta">
          <span>${item.name}</span>
          <span>$${item.price.toFixed(2)}</span>
        </div>
        <p>${item.description}</p>
        <div class="product-meta">
          <span class="badge-pill">${item.category}</span>
          <span>${item.skinType}</span>
        </div>
        <button class="btn btn-primary" data-add="${item.id}">Add to cart</button>
      </article>`
    )
    .join("");

  if (summary) summary.textContent = `${filteredProducts.length} products`;
};

const applyFilters = () => {
  const searchTerm = (
    document.getElementById("searchInput")?.value.trim() || ""
  ).toLowerCase();
  const skinType = document.getElementById("filterSkin")?.value || "All";
  const category = document.getElementById("filterCategory")?.value || "All";
  const priceSort = document.getElementById("filterPrice")?.value || "default";

  filteredProducts = products.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm);
    const matchesSkin = skinType === "All" || item.skinType === skinType;
    const matchesCategory = category === "All" || item.category === category;
    return matchesSearch && matchesSkin && matchesCategory;
  });

  if (priceSort === "asc") {
    filteredProducts.sort((a, b) => a.price - b.price);
  }

  renderProductGrid();
};

const bindProductEvents = () => {
  document.getElementById("searchInput")?.addEventListener("input", applyFilters);
  document.getElementById("filterSkin")?.addEventListener("change", applyFilters);
  document
    .getElementById("filterCategory")
    ?.addEventListener("change", applyFilters);
  document.getElementById("filterPrice")?.addEventListener("change", applyFilters);

  const grid = document.getElementById("productsGrid");
  grid?.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-add]");
    if (!btn) return;
    addToCart(Number(btn.dataset.add));
  });
};

document.addEventListener("DOMContentLoaded", () => {
  populateFilters();
  bindProductEvents();
  applyFilters();
});

