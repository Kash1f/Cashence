import express from "express";
import dotenv from "dotenv";
import { sql } from "./config/db.js";

dotenv.config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

//function to initialize the database and create required tables
async function initDB() {
   try {
    //create the 'transactions' table if it doesn't exist
    //this ensures the table is ready before the app handles requests
    await sql`CREATE TABLE IF NOT EXISTS transactions(
      id SERIAL PRIMARY KEY,              -- Unique ID for each transaction
      user_id VARCHAR(255) NOT NULL,      -- ID of the user who made the transaction
      title VARCHAR(255) NOT NULL,        -- Title or description of the transaction
      amount DECIMAL(10,2) NOT NULL,      -- Amount involved in the transaction
      category VARCHAR(255) NOT NULL,     -- Category of the transaction (e.g., food, rent)
      created_at DATE NOT NULL DEFAULT CURRENT_DATE -- Date when the transaction was created
    )`;
    console.log("Database initialized successfully.");
  } catch (error) {
    console.log(error);
  }
}

app.get("/", (req, res) => {
  res.send("Backend setup is complete!");
});

//initialize the database, then start the serve
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
