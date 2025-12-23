const renderFeatured = () => {
  const container = document.getElementById("featuredProducts");
  if (!container) return;

  const featured = products.slice(0, 4);
  container.innerHTML = featured
    .map(
      (item) => `
      <article class="card product-card">
        <img src="${item.image}" alt="${item.name}">
        <span class="tag">${item.category}</span>
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <div class="product-meta">
          <span>$${item.price.toFixed(2)}</span>
          <span>${item.skinType} skin</span>
        </div>
        <button class="btn btn-primary" data-add="${item.id}">Add to cart</button>
      </article>`
    )
    .join("");

  container.addEventListener("click", (event) => {
    const button = event.target.closest("[data-add]");
    if (!button) return;
    addToCart(Number(button.dataset.add));
  });
};

document.addEventListener("DOMContentLoaded", renderFeatured);

