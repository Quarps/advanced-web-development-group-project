const express = require("express");
const app = express();
const PORT = 8080;

const stores = [
  {
    storeName: "Tech Hub",
    storeDescription: "Best gadgets in town",
    storeType: "Electronics",
  },
  {
    storeName: "Book Haven",
    storeDescription: "A paradise for book lovers",
    storeType: "Books",
  },
  {
    storeName: "Fashion Forward",
    storeDescription: "Trendy clothes for everyone",
    storeType: "Clothing",
  },
];
// const db = require("./db");

//--- Middleware ----------------------------------------------------
app.use(express.json());
app.use("/", express.static("public"));

//--- Routes --------------------------------------------------------
app.get("/stores", (req, res) => {
  res.json(stores);
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
