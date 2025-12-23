// Shared UI behaviors
const setActiveNav = () => {
  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((link) => {
    const href = link.getAttribute("href");
    if (
      (path === "" && href === "index.html") ||
      path === href ||
      (path === "index.html" && href === "./")
    ) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
};

const bindCtas = () => {
  document.querySelectorAll("[data-nav]").forEach((btn) => {
    btn.addEventListener("click", () => {
      window.location.href = btn.dataset.nav;
    });
  });
};

document.addEventListener("DOMContentLoaded", () => {
  setActiveNav();
  bindCtas();
});

