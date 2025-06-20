import {neon} from "@neondatabase/serverless";

import "dotenv/config";

//creates SQL connection using our DB URL, sql is the function we will use to run queries
export const sql = neon(process.env.DATABASE_URL)

//function to initialize the database and create required tables
export async function initDB() {
  try {
    //create the 'transactions' table if it doesn't exist, this ensures the table is ready before the app handles requests
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
