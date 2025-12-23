const QUIZ_STORAGE_KEY = "glowcart-quiz-result";

const renderQuizQuestions = () => {
  const container = document.getElementById("quizQuestions");
  if (!container) return;

  container.innerHTML = quizQuestions
    .map(
      (q) => `
      <div class="quiz-question">
        <h4>${q.question}</h4>
        ${q.answers
          .map(
            (ans) => `
            <label>
              <input type="radio" name="${q.id}" value="${ans.value}" required>
              <span>${ans.label}</span>
            </label>`
          )
          .join("")}
      </div>`
    )
    .join("");
};

const scoreQuiz = (formData) => {
  const skinType = formData.get("skinType") || "All";
  const goal = formData.get("skinGoal");

  let matches = products.filter(
    (item) => item.skinType === skinType || item.skinType === "All"
  );

  const goalFilters = {
    hydration: (item) => /hydrat|mist|moistur/i.test(item.name),
    oilControl: (item) => /matte|powder|oil/i.test(item.name),
    brightening: (item) => /glow|serum|bright/i.test(item.name),
    calm: (item) => /calm|barrier|cleanser/i.test(item.name)
  };

  if (goal && goalFilters[goal]) {
    const goalMatches = matches.filter(goalFilters[goal]);
    if (goalMatches.length) matches = goalMatches;
  }

  if (matches.length < 3) {
    matches = [
      ...matches,
      ...products
        .filter((item) => !matches.includes(item))
        .slice(0, 3 - matches.length)
    ];
  }

  return matches.slice(0, 3);
};

const showQuizResult = (answers, recommendations) => {
  const resultBox = document.getElementById("quizResult");
  if (!resultBox) return;

  resultBox.innerHTML = `
    <div class="summary-card">
      <h3>Your Glow Guide</h3>
      <p>Skin type: <strong>${answers.get("skinType")}</strong></p>
      <div class="cards-grid">
        ${recommendations
          .map(
            (item) => `
              <article class="card product-card">
                <img src="${item.image}" alt="${item.name}">
                <h4>${item.name}</h4>
                <p>${item.description}</p>
                <button class="btn btn-primary" data-add="${item.id}">Add to cart</button>
              </article>`
          )
          .join("")}
      </div>
      <button class="btn btn-outline" data-nav="products.html">See all products</button>
    </div>
  `;
};

const persistQuiz = (answers, recommendations) => {
  const payload = {
    answers: Object.fromEntries(answers.entries()),
    recommendations: recommendations.map((item) => item.id)
  };
  localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(payload));
};

const hydrateFromStorage = () => {
  const raw = localStorage.getItem(QUIZ_STORAGE_KEY);
  if (!raw) return;
  const parsed = JSON.parse(raw);
  if (!parsed?.recommendations) return;
  const answers = new Map(Object.entries(parsed.answers || {}));
  const recs = parsed.recommendations
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean);
  if (answers.size && recs.length) showQuizResult(answers, recs);
};

document.addEventListener("DOMContentLoaded", () => {
  renderQuizQuestions();
  hydrateFromStorage();

  const form = document.getElementById("quizForm");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const recommendations = scoreQuiz(formData);
    showQuizResult(formData, recommendations);
    persistQuiz(formData, recommendations);
  });

  document
    .getElementById("quizResult")
    ?.addEventListener("click", (event) => {
      const btn = event.target.closest("[data-add]");
      if (!btn) return;
      addToCart(Number(btn.dataset.add));
    });
});

