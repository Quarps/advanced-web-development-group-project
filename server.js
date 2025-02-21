const express = require("express");
const app = express();
const PORT = 8080;

//--- Server --------------------------------------------------------
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
