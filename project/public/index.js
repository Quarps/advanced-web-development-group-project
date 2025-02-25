let ascending = true;
let storesData = [];

//--- SORTING BUTTON --------------------------------------------------------
document.getElementById("sort-button").addEventListener("click", function () {
  ascending = !ascending;
  displayStores();

  // Update the button text based on the sorting order
  const button = document.getElementById("sort-button");
  button.textContent = ascending ? "Sort A-Z" : "Sort Z-A";
});

//--- FETCHES STORES ----------------------------------------
function fetchStores() {
  fetch("/stores")
    .then((response) => response.json())
    .then((stores) => {
      storesData = stores; // Store data globally
      storesData.sort((a, b) => a.name.localeCompare(b.name)); // Default A-Z
      displayStores(); // Display sorted stores
    })
    .catch((error) => console.error("Error loading stores:", error));
}

//--- DISPLAY STORES ----------------------------------------
function displayStores() {
  const container = document.getElementById("store-container");
  container.innerHTML = ""; // Clear previous data

  // Sort based on current order
  const sortedStores = [...storesData].sort((a, b) => {
    return ascending
      ? a.name.localeCompare(b.name, "sv", { sensitivity: "base" }) // A-Z (swedish alphabet) (base = case-insensitive)
      : b.name.localeCompare(a.name, "sv", { sensitivity: "base" }); // Z-A (swedish alphabet) (base = case-insensitive)
  });

  // Create a card for each store
  sortedStores.forEach((store) => {
    const card = document.createElement("li");
    card.classList.add("card");
    card.innerHTML = `
      <div>
        <h3>${store.name}</h3>
        <p>${store.district ? store.district : ""}</p>
      </div>
      <div class="edit-button">
      <img class="icon" src="../img/icon.svg" alt="edit icon" />
      </div>
      <a href="https://${
        store.url
      }" target="_blank" class="button">More information</a>
    `;
    container.appendChild(card);
  });
}

fetchStores();
