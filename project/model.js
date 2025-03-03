const { Client } = require("pg");
const fs = require("fs");

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
  const query = "SELECT COUNT(*) FROM stores";
  try {
    const res = await client.query(query);
    return res.rows[0].count > 0;
  } catch (err) {
    console.error("Error checking if stores exist:", err.stack);
    return false;
  }
};

// Create stores table
const createStoresTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS stores (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255),
      district VARCHAR(255),
      description TEXT,
      openinghours JSONB,
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

// Import stores from JSON file
const importStores = async () => {
  const stores = JSON.parse(fs.readFileSync("stores.json", "utf8"));

  for (let store of stores) {
    const query = `
      INSERT INTO stores (name, district, description, openinghours, url)
      VALUES ($1, $2, $3, $4, $5)
    `;
    const values = [
      store.name,
      store.district,
      store.description,
      store.openinghours || null,
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
    const res = await client.query("SELECT * FROM stores");
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

module.exports = client;
