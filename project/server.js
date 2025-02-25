const express = require("express");
const app = express();
const PORT = 8080;

const stores = require("./stores.json");
// const db = require("./db");

//--- Middleware ----------------------------------------------------
app.use(express.json());
app.use("/", express.static("public"));

//--- REST API --------------------------------------------------------
app.get("/stores", (req, res) => {
  res.json(stores);
});

app.delete("/stores/:id", (req, res) => {});

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
