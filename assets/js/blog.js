const renderBlogPosts = () => {
  const container = document.getElementById("blogGrid");
  if (!container) return;

  container.innerHTML = blogPosts
    .map(
      (post) => `
      <article class="card blog-card">
        <img src="${post.image}" alt="${post.title}">
        <span class="tag">${post.category}</span>
        <h3>${post.title}</h3>
        <p>${post.summary}</p>
        <div class="blog-meta">${post.readTime}</div>
        <a class="btn btn-outline" href="${post.link}">Read guide</a>
      </article>`
    )
    .join("");
};

document.addEventListener("DOMContentLoaded", renderBlogPosts);

