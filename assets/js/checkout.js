document.addEventListener("DOMContentLoaded", () => {
  renderOrderSummary(document.getElementById("checkoutSummary"));

  const form = document.getElementById("checkoutForm");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    alert("Thank you! Your GlowCart order is on the way.");
    saveCart([]);
    form.reset();
    renderOrderSummary(document.getElementById("checkoutSummary"));
  });
});

