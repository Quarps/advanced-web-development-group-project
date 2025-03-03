//--- SERVER SETUP --------------------------------------------------
const express = require("express");
const app = express();
const PORT = 3000;
const fs = require("fs");
const { Client } = require("pg");

//--- MIDDLEWARE CONFIGURATION --------------------------------------
app.use(express.json());
app.use("/", express.static("public"));

//--- DATABASE -----------------------------------------------------
const client = new Client({
  host: "localhost",
  port: 5432,
  user: "myuser",
  password: "mypassword",
  database: "mystoresdb",
});

// Ensure the database connection is persistent
const connectDB = async () => {
  if (!client._connected) {
    try {
      await client.connect();
      console.log("Connected to the database");
      client._connected = true;
    } catch (err) {
      console.error("Failed to connect to the database", err);
    }
  }
};

connectDB(); // Ensures connection on first import

// Check if stores exist
const checkIfStoresExist = async () => {
  const query = "SELECT COUNT(*) FROM storesNew";
  try {
    const res = await client.query(query);
    return res.rows[0].count > 0;
  } catch (err) {
    console.error("Error checking if stores exist:", err.stack);
    return false;
  }
};

//-- Create stores table --
const createStoresTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS storesNew (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255),
      district VARCHAR(255),
      description TEXT,
      type VARCHAR(255),
      url VARCHAR(255)
    );
  `;
  try {
    await client.query(query);
    console.log("Stores table created!");
  } catch (err) {
    console.error("Error creating table:", err.stack);
  }
};

//-- Import stores from JSON file --
const importStores = async () => {
  const stores = JSON.parse(fs.readFileSync("stores.json", "utf8"));

  for (let store of stores) {
    const query = `
      INSERT INTO storesNew (name, district, description, type, url)
      VALUES ($1, $2, $3, $4, $5)
    `;
    const values = [
      store.name,
      store.district,
      store.description,
      store.type || null,
      store.url || null,
    ];

    try {
      await client.query(query, values);
      console.log(`Store ${store.name} added.`);
    } catch (err) {
      console.error("Error inserting store:", err.stack);
    }
  }
};

// Get all stores (Remove client.end())
const getStores = async () => {
  try {
    const res = await client.query("SELECT * FROM storesNew");
    console.log(res.rows);
    return res.rows; // Return stores instead of just logging
  } catch (err) {
    console.error("Error fetching stores:", err.stack);
    return [];
  }
};

// Run initial setup
const runSetup = async () => {
  await connectDB();
  const storesExist = await checkIfStoresExist();

  if (!storesExist) {
    console.log("No stores found. Proceeding with data import.");
    await createStoresTable();
    await importStores();
  }

  await getStores();
};

runSetup();

//--- GET STORES ------------------------------------------------------
app.get("/stores", async (req, res) => {
  try {
    console.log("Fetching stores from the database...");
    const result = await client.query("SELECT * FROM storesNew");
    res.json(result.rows);
  } catch (err) {
    console.error("Error executing query:", err);
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: err.message });
  }
});

//--- ADD STORE ------------------------------------------------------
app.post("/stores", async (req, res) => {
  const { name, district, description, type, url } = req.body;
  console.log("Received store data:", {
    name,
    district,
    description,
    type,
    url,
  });

  if (!name || !url) {
    return res.status(400).json({ error: "Name and URL are required fields" });
  }

  try {
    console.log("Inserting store:", {
      name,
      district,
      description,
      type,
      url,
    });

    const result = await client.query(
      "INSERT INTO storesNew (name, district, description, type, url) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, district, description, type, url]
    );

    console.log("Inserted successfully:", result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error inserting store:", err);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: err.message });
  }
});

//--- UPDATE STORE ---------------------------------------------------
app.put("/stores/:id", async (req, res) => {
  const storeId = req.params.id; // Extract store ID from URL params
  const { name, district, description, type, url } = req.body; // Extract updated fields

  console.log("Updating store:", {
    storeId,
    name,
    district,
    description,
    type,
    url,
  });

  try {
    const result = await client.query(
      `UPDATE storesNew 
       SET name = $1, district = $2, description = $3, type = $4, url = $5 
       WHERE id = $6 
       RETURNING *`,
      [name, district, description, type, url, storeId]
    );

    // Log the result of the query to ensure data is returned correctly
    console.log("Store updated successfully:", result.rows[0]);

    // Check if the store was updated successfully
    if (result.rows.length === 0) {
      console.error("No store found with the given ID.");
      return res.status(404).json({ error: "Store not found" });
    }

    // Send back the updated store data
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating store:", err);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: err.message });
  }
});
//--- DELETE STORE ---------------------------------------------------
app.delete("/stores/:id", async (req, res) => {
  const storeId = parseInt(req.params.id);

  if (isNaN(storeId)) {
    console.error("Invalid store ID received on server:", req.params.id);
    return res.status(400).json({ error: "Invalid store ID" });
  }

  try {
    const result = await client.query(
      "DELETE FROM storesNew WHERE id = $1 RETURNING *",
      [storeId]
    );

    if (result.rows.length === 0) {
      console.error("No store found with the given ID.");
      return res.status(404).json({ error: "Store not found" });
    }

    res.json({
      message: "Butiken har tagits bort",
      deletedStore: result.rows[0],
    });
  } catch (err) {
    console.error("Error deleting store:", err);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: err.message });
  }
});

//--- SERVER --------------------------------------------------------
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

//--- CLEANUP -------------------------------------------------------
process.on("SIGINT", async () => {
  await client.end();
  console.log("Database connection closed");
  process.exit(0);
});
