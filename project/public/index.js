// --- VARIABLES --------------------------------------------------------
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
const fetchStores = async () => {
  try {
    const response = await fetch("/stores");
    const storesDataFromAPI = await response.json();

    if (response.ok) {
      storesData = storesDataFromAPI; // Store the fetched stores data in the global variable
      console.log("Fetched stores:", storesData);
      displayStores(); // Pass the data to the display function
    } else {
      console.error("Error loading stores:", storesDataFromAPI.error);
    }
  } catch (error) {
    console.error("Failed to fetch stores:", error);
  }
};

//--- DISPLAY STORES ----------------------------------------
function displayStores() {
  const container = document.getElementById("store-container");
  container.innerHTML = ""; // Clear previous data

  // Sort based on current order
  const sortedStores = [...storesData].sort((a, b) => {
    return ascending
      ? a.name.localeCompare(b.name, "sv", { sensitivity: "base" }) // A-Z (Swedish alphabet) (base = case-insensitive)
      : b.name.localeCompare(a.name, "sv", { sensitivity: "base" }); // Z-A (Swedish alphabet)
  });

  // Create a card for each store
  sortedStores.forEach((store) => {
    const card = document.createElement("button");
    card.type = "button";
    card.classList.add("card", "collapsible");
    card.innerHTML = `
      <div>
      <div>
        <h3>${store.name}</h3>
        <p>${store.district ? store.district : ""}</p>
      </div>
        <button id="edit-button" class="edit-button material-symbols-outlined" data-id="${
          store.id
        }">
        edit
      </button>
      <button class="delete-button material-symbols-outlined" data-id="${
        store.id
      }">
        delete
      </button>
      </div>
      <div class="content">
        <p>${
          store.description ? store.description : "No description available"
        }</p>
        <br/>
        <p>${store.type ? store.type : "No opening hours available"}</p>
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

// Optional: Toggle sorting order when clicking a button or similar
function toggleSortOrder() {
  ascending = !ascending;
  displayStores(); // Re-render stores with the new sort order
}

//--- ADD ITEMS ----------------------------------------
const addButton = document.getElementById("add-button");
const body = document.body;
addButton.addEventListener("click", () => {
  const popUp = document.createElement("div");
  popUp.classList.add("popup-overlay");

  popUp.innerHTML = `
    <div class="pop-up">
      <div class="pop-up-head">
        <h2>Add Store</h2>
        <button id="close-popup" class="material-symbols-outlined sort-button">close</button>
      </div>
      <form id="addStoreForm" class="form">
        <label for="storeName">Store Name:</label>
        <input type="text" id="storeName" name="storeName" required>
        
        <label for="storeDistrict">Store District:</label>
        <input type="text" id="storeDistrict" name="storeDistrict">
        
        <label for="storeDescription">Store Description:</label>
        <input type="text" id="storeDescription" name="storeDescription">
        
        <label for="type">Type:</label>
        <input type="text" id="type" name="type">

        <label for="storeUrl">URL*:</label>
        <input type="text" id="storeUrl" name="storeUrl" required>
        
        <input type="submit" value="Submit">
      </form>
    </div>
  `;

  body.appendChild(popUp);

  document.getElementById("close-popup").addEventListener("click", () => {
    popUp.remove();
  });

  // Form submission handling
  const form = document.getElementById("addStoreForm");
  form.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent default form submission

    const storeData = {
      name: document.getElementById("storeName").value,
      district: document.getElementById("storeDistrict").value,
      description: document.getElementById("storeDescription").value,
      type: document.getElementById("type").value,
      url: document.getElementById("storeUrl").value,
    };

    try {
      const response = await fetch("/stores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Set the correct content type
        },
        body: JSON.stringify(storeData), // Send store data as JSON
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Store added:", result);
        alert("Store added successfully!");
        popUp.remove(); // Close the popup after successful submission
        fetchStores(); // Refresh the store list
      } else {
        console.error("Error adding store:", result.error);
        alert("Failed to add store.");
      }
    } catch (error) {
      console.error("Error during POST request:", error);
      alert("An error occurred while adding the store.");
    }
  });
});
//--- EDIT ITEMS ----------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("store-container");

  container.addEventListener("click", (event) => {
    const editButton = event.target.closest(".edit-button");
    if (editButton) {
      const storeId = editButton.dataset.id;
      const store = storesData.find((store) => store.id == storeId); // Find the correct store

      if (!store) {
        console.error("Store not found");
        return;
      }

      const popUp = document.createElement("div");
      popUp.classList.add("popup-overlay");

      popUp.innerHTML = `
      <div class="pop-up">
        <div class="pop-up-head">
          <h2>Edit Store</h2>
          <button class="material-symbols-outlined close-button">close</button>
        </div>
        <form class="form" id="edit-form">
          <label for="storeName">Store Name:</label>
          <input type="text" id="storeName" name="storeName" value="${
            store.name
          }">
          
          <label for="storeDistrict">Store District:</label>
          <input type="text" id="storeDistrict" name="storeDistrict" value="${
            store.district || ""
          }">
          
          <label for="storeDescription">Store Description:</label>
          <input type="text" id="storeDescription" name="storeDescription" value="${
            store.description || ""
          }">
          
          <label for="type">Type:</label>
          <input type="text" id="type" name="type" value="${store.type || ""}">

          <label for="storeUrl">URL:</label>
          <input type="text" id="storeUrl" name="storeUrl" value="${store.url}">
          
          <input type="submit" value="Save">
        </form>
      </div>`;

      document.body.appendChild(popUp);

      // Close button functionality
      popUp.querySelector(".close-button").addEventListener("click", () => {
        popUp.remove();
      });

      // Handle form submission
      document
        .getElementById("edit-form")
        .addEventListener("submit", async (e) => {
          e.preventDefault();

          const updatedStore = {
            name: document.getElementById("storeName").value,
            district: document.getElementById("storeDistrict").value,
            description: document.getElementById("storeDescription").value,
            type: document.getElementById("type").value,
            url: document.getElementById("storeUrl").value,
          };

          try {
            const response = await fetch(`/stores/${storeId}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(updatedStore),
            });

            if (!response.ok) {
              throw new Error("Failed to update store");
            }

            const updatedData = await response.json();
            storesData = storesData.map((store) =>
              store.id == storeId ? updatedData : store
            ); // Update UI data
            displayStores(); // Refresh the UI
            popUp.remove(); // Close popup
          } catch (error) {
            console.error("Error updating store:", error);
          }
        });
    }
  });
});

//--- DELETE ITEMS ----------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("store-container");

  container.addEventListener("click", (event) => {
    const deleteButton = event.target.closest(".delete-button");
    if (deleteButton) {
      const storeId = deleteButton.dataset.id;

      if (!storeId || isNaN(storeId)) {
        console.error("Invalid store ID:", storeId);
        return;
      }

      fetch(`/stores/${storeId}`, { method: "DELETE" })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to delete store");
          }
          return response.json();
        })
        .then((data) => {
          console.log(data.message);
          storesData = storesData.filter((store) => store.id != storeId);
          displayStores();
        })
        .catch((error) => console.error("Error deleting store:", error));
    }
  });
});

//--- INITIALIZE ----------------------------------------
fetchStores();
