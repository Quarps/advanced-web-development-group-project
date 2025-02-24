fetch("/stores") // This should call the '/stores' endpoint
  .then((response) => response.json())
  .then((stores) => {
    const container = document.getElementById("store-container");
    container.innerHTML = ""; // Clear previous data

    stores.forEach((store) => {
      const card = document.createElement("li");
      card.classList.add("card");
      card.innerHTML = `
        <h3>${store.name}</h3>
        <p>District: ${store.district}</p>
        <a href="https://${store.url}" target="_blank" class="button">Read more</a>
      `;
      container.appendChild(card);
    });
  })
  .catch((error) => console.error("Error loading stores:", error));
