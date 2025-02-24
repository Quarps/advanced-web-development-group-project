const express = require("express");
const app = express();
const PORT = 8080;

// const db = require("./db");

//--- Middleware ----------------------------------------------------
app.use(express.json());
app.use("/", express.static("public"));

//--- Routes --------------------------------------------------------
app.get("/", (req, res) => {
  res.json(stores);
  const container = document.getElementById("store-container");
  container.innerHTML = "";

  stores.forEach((store) => {
    const card = document.createElement("li");
    card.classList.add("card");
    card.innerHTML = `
            <h3>${store.storeName}</h3>
            <p>${store.storeDistrict}</p>
            <button onclick="window.open('${store.storeURL}', '_blank')">Read more</button>
        `;
    container.appendChild(card);
  });
});

/*
  db.all("SELECT * FROM storeName", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});
*/

//--- Server --------------------------------------------------------
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
