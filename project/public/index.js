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
    const card = document.createElement("button");
    card.type = "button";
    card.classList.add("card", "collapsible");
    card.innerHTML = `
      <div>
        <h3>${store.name}</h3>
        <p>${store.district ? store.district : ""}</p>
      </div>
      <div class="edit-button">
        <img class="icon" src="../img/icon.svg" alt="edit icon" />
      </div>
      <div class="content">
        <p>${store.description}</p>
        <br/>
        <p>${store.openingHours}</p>
      </div>
      <a href="https://${store.url}" target="_blank" class="button">Website</a>
    `;

    // Show content on hover
    card.addEventListener("mouseenter", () => {
      const content = card.querySelector(".content");
      content.style.display = "block"; // Show the content
    });

    // Hide content when hover stops
    card.addEventListener("mouseleave", () => {
      const content = card.querySelector(".content");
      content.style.display = "none"; // Hide the content
    });

    container.appendChild(card);
  });
}

//--- ADD ITEMS ----------------------------------------
const addButton = document.getElementById("add-button");
const body = document.body;
addButton.addEventListener("click", () => {
  const popUp = document.createElement("div");
  popUp.classList.add("popup-overlay");
  console.log("hej");
  popUp.innerHTML = `
  <div class="pop-up">
  <div class="pop-up-head">
      <h3>Add Store</h3>
      <button class="material-symbols-outlined">close</button>
      </div>
      <form class="form">
      <label for="storeName">Store name:</label><br>
  <input type="text" id="storeName" name="storeName"><br>
  <label for="storeUrl">URL:</label><br>
  <input type="text" id="storeUrl" name="storeUrl"><br>
  <label for="storeDistrict">Store district:</label><br>
  <input type="text" id="storeDistrict" name="storeDistrict"><br>
  <label for="storeDescription">Store description:</label><br>
  <input type="text" id="storeDescription" name="storeDescription"><br>
  <label for="storeOpenHours">Open hours:</label><br>
  <input type="text" id="storeOpenHours" name="storeOpenHours"><br>
  
      </form>
      </div>
    `;
    console.log(popUp)
    body.appendChild(popUp);

})

fetchStores();
