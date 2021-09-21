const SEARCH_SIDE_BAR_SHOW_HIDE_ANIMATION_DURATION = 150; // in ms

window.addEventListener("DOMContentLoaded", () => {
  setSearchHiderFunctions();
  setSearchObserver();
});

function setSearchObserver() {
  const searchToggler = document.querySelector("#search-toggle");
  const observer = new MutationObserver(() => {
    searchExpandStateChanged();
  });

  observer.observe(searchToggler, {
    attributes: true,
    attributeFilter: ["aria-expanded"],
    childList: false,
    characterData: false,
  });

  searchExpandStateChanged();
}

function setSearchHiderFunctions() {
  const searchPopup = document.querySelector("#search-popup-closer");
  const test = document.querySelector("#search-popup-closer-button");

  searchPopup.addEventListener("click", searchOriginalCloseFunctionTrigger);
  test.addEventListener("click", searchOriginalCloseFunctionTrigger);
}

function searchOriginalCloseFunctionTrigger() {
  const searchWrapper = document.querySelector("#search-wrapper");
  const searchToggler = document.querySelector("#search-toggle");
  searchToggler.setAttribute("aria-expanded", "false");
  searchWrapper.classList.add("hidden");
}

function searchExpandStateChanged() {
  const searchToggler = document.querySelector("#search-toggle");
  const popup = document.querySelector(".search-popup");
  const isActive =
    searchToggler.hasAttribute("aria-expanded") &&
    searchToggler.getAttribute("aria-expanded") === "true";

  if (!isActive && !popup.classList.contains("hidden")) hideSearchPopup();
  else if (isActive && popup.classList.contains("hidden")) showSearchPopup();
}

function hideSearchPopup() {
  const popup = document.querySelector(".search-popup");
  popup.setAttribute("is-visible", "false");
  setTimeout(() => {
    popup.classList.add("hidden");
  }, SEARCH_SIDE_BAR_SHOW_HIDE_ANIMATION_DURATION);
}

function showSearchPopup() {
  const popup = document.querySelector(".search-popup");
  const searchInput = document.querySelector("#searchbar");
  popup.classList.remove("hidden");
  setTimeout(() => {
    popup.setAttribute("is-visible", "true");
  }, 1);
  searchInput.focus();
}
