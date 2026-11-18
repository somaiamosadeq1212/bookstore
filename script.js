"use strict";

document.documentElement.classList.add("js");

const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");

function closeNavigation() {
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open navigation menu");
  siteNav.classList.remove("is-open");
}

navToggle.addEventListener("click", () => {
  const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!isExpanded));
  navToggle.setAttribute("aria-label", isExpanded ? "Open navigation menu" : "Close navigation menu");
  siteNav.classList.toggle("is-open", !isExpanded);
});

siteNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeNavigation();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeNavigation();
    document.querySelector(".basket").open = false;
  }
});

const searchInput = document.querySelector("#book-search");
const bookCards = [...document.querySelectorAll(".book-card")];
const bookResults = document.querySelector("#book-results");

searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLocaleLowerCase();
  let visibleCount = 0;

  for (const card of bookCards) {
    const matches = card.textContent.toLocaleLowerCase().includes(query);
    card.hidden = !matches;
    if (matches) visibleCount += 1;
  }

  bookResults.textContent = query
    ? `${visibleCount} ${visibleCount === 1 ? "book" : "books"} found.`
    : `Showing all ${bookCards.length} books.`;
});

const basketCount = document.querySelector("#basket-count");
const basketSummary = document.querySelector(".basket summary");
const basketItems = document.querySelector("#basket-items");
const basketEmpty = document.querySelector("#basket-empty");
const basketTotal = document.querySelector("#basket-total");
const checkoutLink = document.querySelector("#basket-checkout");
const basketFeedback = document.querySelector("#basket-feedback");
const basket = new Map();
const storageKey = "paper-books-basket";
const formatPrice = (amount) => `${new Intl.NumberFormat("en-AF").format(amount)} AFN`;

function saveBasket() {
  try {
    localStorage.setItem(storageKey, JSON.stringify([...basket]));
    return true;
  } catch {
    return false;
  }
}

function renderBasket() {
  basketItems.replaceChildren();
  let itemCount = 0;
  let total = 0;
  const orderLines = [];

  for (const [title, item] of basket) {
    itemCount += item.quantity;
    total += item.price * item.quantity;
    orderLines.push(`${item.quantity} x ${title} — ${formatPrice(item.price * item.quantity)}`);

    const row = document.createElement("li");
    const description = document.createElement("span");
    description.textContent = `${title} × ${item.quantity} — ${formatPrice(item.price * item.quantity)}`;
    const removeButton = document.createElement("button");
    removeButton.className = "basket-remove";
    removeButton.type = "button";
    removeButton.textContent = "Remove";
    removeButton.setAttribute("aria-label", `Remove ${title} from basket`);
    removeButton.addEventListener("click", () => {
      basket.delete(title);
      const saved = saveBasket();
      renderBasket();
      basketFeedback.textContent = saved
        ? `${title} removed from your basket.`
        : "Your basket is available for this visit but could not be saved on this device.";
    });
    row.append(description, removeButton);
    basketItems.append(row);
  }

  basketCount.textContent = String(itemCount);
  basketSummary.setAttribute("aria-label", `Shopping basket, ${itemCount} ${itemCount === 1 ? "item" : "items"}`);
  basketEmpty.hidden = itemCount > 0;
  basketTotal.textContent = formatPrice(total);
  checkoutLink.hidden = itemCount === 0;

  if (itemCount > 0) {
    const subject = encodeURIComponent("Paper Books order");
    const body = encodeURIComponent(`${orderLines.join("\n")}\n\nTotal: ${formatPrice(total)}`);
    checkoutLink.href = `mailto:hello@paperbooks.af?subject=${subject}&body=${body}`;
  } else {
    checkoutLink.removeAttribute("href");
  }
}

function restoreBasket() {
  try {
    const saved = localStorage.getItem(storageKey);
    if (!saved) return;

    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) throw new TypeError("Saved basket must be an array.");

    for (const entry of parsed) {
      if (
        Array.isArray(entry) &&
        typeof entry[0] === "string" &&
        entry[1] &&
        Number.isSafeInteger(entry[1].price) &&
        entry[1].price >= 0 &&
        Number.isSafeInteger(entry[1].quantity) &&
        entry[1].quantity > 0
      ) {
        basket.set(entry[0], { price: entry[1].price, quantity: entry[1].quantity });
      }
    }
  } catch {
    basket.clear();
    basketFeedback.textContent = "Your saved basket could not be read, so it has been cleared.";
  }
}

for (const card of bookCards) {
  card.querySelector(".add-to-basket").addEventListener("click", () => {
    const title = card.querySelector("h3").textContent.trim();
    const priceText = card.querySelector(".book-price strong").textContent;
    const price = Number(priceText.replace(/[^\d]/g, ""));
    const existing = basket.get(title);

    basket.set(title, { price, quantity: existing ? existing.quantity + 1 : 1 });
    const saved = saveBasket();
    renderBasket();
    basketFeedback.textContent = saved
      ? `${title} added to your basket.`
      : `${title} added for this visit, but the basket could not be saved on this device.`;
  });
}

restoreBasket();
renderBasket();

document.querySelector(".newsletter-form").addEventListener("submit", (event) => {
  event.preventDefault();
  document.querySelector("#newsletter-feedback").textContent =
    "Thanks for your interest. Newsletter sign-up is not connected yet, so your email was not sent.";
});
