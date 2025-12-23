document.addEventListener("DOMContentLoaded", () => {
  const body = document.getElementById("cartTableBody");
  const summary = document.getElementById("cartSummary");

  renderCartTable(body);
  renderOrderSummary(summary);

  body?.addEventListener("change", (event) => {
    const input = event.target.closest("[data-qty]");
    if (!input) return;
    updateQuantity(Number(input.dataset.qty), Number(input.value));
    renderCartTable(body);
    renderOrderSummary(summary);
  });

  body?.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-remove]");
    if (!btn) return;
    removeFromCart(Number(btn.dataset.remove));
    renderCartTable(body);
    renderOrderSummary(summary);
  });
});

