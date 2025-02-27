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
      <button id="edit-button" class="edit-button">
        <img class="icon" src="../img/icon.svg" alt="edit icon" />
      </button>
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
      <h2>Add Store</h2>
      <button class="material-symbols-outlined sort-button">close</button>
    </div>
    <form class="form">
      <label for="storeName">Store Name:</label>
      <input type="text" id="storeName" name="storeName">
      
      <label for="storeDistrict">Store District:</label>
      <input type="text" id="storeDistrict" name="storeDistrict">
      
      <label for="storeDescription">Store Description:</label>
      <input type="text" id="storeDescription" name="storeDescription">
      
      <label for="storeOpenHours">Open Hours:</label>
      <input type="text" id="storeOpenHours" name="storeOpenHours">

      <label for="storeUrl">URL:</label>
      <input type="text" id="storeUrl" name="storeUrl">
      
      <input type="submit" value="Submit">
    </form>
  </div>
    `;
  console.log(popUp);
  body.appendChild(popUp);
});

fetchStores();
const container = document.getElementById("store-container");

container.addEventListener("click", (event) => {
  // Check if the clicked element is an edit button (inside a store card)
  if (event.target && event.target.classList.contains("edit-button")) {
    const popUp = document.createElement("div");
    popUp.classList.add("popup-overlay");
    console.log("hej");
    popUp.innerHTML = `
    <div class="pop-up">
      <div class="pop-up-head">
        <h2>Edit Store</h2>
        <button class="material-symbols-outlined sort-button">close</button>
      </div>
      <form class="form">
        <label for="storeName">Store Name:</label>
        <input type="text" id="storeName" name="storeName">
        
        <label for="storeDistrict">Store District:</label>
        <input type="text" id="storeDistrict" name="storeDistrict">
        
        <label for="storeDescription">Store Description:</label>
        <input type="text" id="storeDescription" name="storeDescription">
        
        <label for="storeOpenHours">Open Hours:</label>
        <input type="text" id="storeOpenHours" name="storeOpenHours">

        <label for="storeUrl">URL:</label>
        <input type="text" id="storeUrl" name="storeUrl">
        
        <input type="submit" value="Submit">
      </form>
    </div>
    `;
    console.log(popUp);
    body.appendChild(popUp);
  }
});
