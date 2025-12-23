// Cart utilities shared across pages
const CART_KEY = "glowcart-items";

const getCart = () => JSON.parse(localStorage.getItem(CART_KEY) || "[]");

const saveCart = (items) => {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  updateCartBadge();
};

const updateCartBadge = () => {
  const count = getCart().reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.querySelector("[data-cart-count]");
  if (badge) {
    badge.textContent = count;
  }
};

const addToCart = (productId) => {
  const product = products.find((item) => item.id === Number(productId));
  if (!product) return;

  const cart = getCart();
  const existing = cart.find((item) => item.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart(cart);
  alert(`${product.name} added to cart!`);
};

const removeFromCart = (productId) => {
  const filtered = getCart().filter((item) => item.id !== Number(productId));
  saveCart(filtered);
};

const updateQuantity = (productId, qty) => {
  const cart = getCart();
  const target = cart.find((item) => item.id === Number(productId));
  if (!target) return;

  target.quantity = Math.max(1, qty);
  saveCart(cart);
};

const getCartTotal = () =>
  getCart().reduce((sum, item) => sum + item.price * item.quantity, 0);

const renderCartTable = (tableBody) => {
  if (!tableBody) return;
  const cartItems = getCart();
  if (!cartItems.length) {
    tableBody.innerHTML =
      '<tr><td colspan="5"><div class="empty-state">Cart feels lonely. Add a product to glow!</div></td></tr>';
    return;
  }

  tableBody.innerHTML = cartItems
    .map(
      (item) => `
      <tr>
        <td>
          <div class="product-meta">
            <span>${item.name}</span>
            <span class="tag">${item.skinType}</span>
          </div>
        </td>
        <td>$${item.price.toFixed(2)}</td>
        <td>
          <input type="number" min="1" value="${item.quantity}" data-qty="${item.id}">
        </td>
        <td>$${(item.price * item.quantity).toFixed(2)}</td>
        <td><button class="btn btn-outline" data-remove="${item.id}">Remove</button></td>
      </tr>`
    )
    .join("");
};

const renderOrderSummary = (container) => {
  if (!container) return;
  const subtotal = getCartTotal();
  const shipping = subtotal ? 6.5 : 0;
  const total = subtotal + shipping;

  container.innerHTML = `
    <div><span>Subtotal</span><span>$${subtotal.toFixed(2)}</span></div>
    <div><span>Shipping</span><span>$${shipping.toFixed(2)}</span></div>
    <div><span>Total</span><span>$${total.toFixed(2)}</span></div>
  `;
};

document.addEventListener("DOMContentLoaded", updateCartBadge);

