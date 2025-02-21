const express = require("express");
const app = express();
const PORT = 8080;

//--- Middleware ----------------------------------------------------
app.use(express.json());
app.use("/", express.static("public"));

//--- Routes --------------------------------------------------------
app.get("/", (req, res) => {
  res.send("Hello World!");
});

//--- Server --------------------------------------------------------
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
