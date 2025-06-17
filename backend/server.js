import express from "express";
import dotenv from "dotenv";
import { sql } from "./config/db.js";

dotenv.config();

const app = express();

//built in middleware to parse JSON bodies
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
    console.log("Error initializing the database:", error);
    process.exit(1); //exit the process if database initialization fails, status code 1 means failure, 0 means success
  }
}

app.post("/api/transactions", async (req, res) => {
  try {
    //get the transaction details from the request body(from the client)
    const { title, amount, category, user_id } = req.body;

    if (!title || !category || !user_id || amount === undefined) {
      return res.status(400).json({ message: "Missing required fields" });
    }

  //insert the transaction into db, list the params required, VALUES means the values to be inserted into the table by the user
    const transaction = await sql`
    INSERT INTO transactions (user_id, title, amount, category)
    VALUES (${user_id}, ${title}, ${amount}, ${category})
    RETURNING *`; //return the inserted transaction

    //return the transaction details to the client, 201 means created successfully
    return res.status(201).json(transaction[0]);
  } catch (error) {
    console.log("Error processing transaction:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

//initialize the database, then start the serve
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
