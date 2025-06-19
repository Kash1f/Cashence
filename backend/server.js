import express from "express";
import dotenv from "dotenv";
import { sql } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

dotenv.config();

const app = express();

app.use(rateLimiter); //apply rate limiting middleware to all routes
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

app.get("/api/transactions/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const transactions = await sql`
    SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC
    `;

    res.status(200).json(transactions); //return the transactions of the user
  } catch (error) {
    console.log("Error getting transaction:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

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

app.delete("/api/transactions/:id", async (req, res) => {
  try {

    //delete the transaction with the given id from the request params
    const { id } = req.params;

    if(isNaN(parseInt(id))) {
      return res.status(400).json({ messagee: "Invalid transaction ID" });
    }

    const deletedTransaction = await sql`
    DELETE FROM transactions WHERE id = ${id} RETURNING *
    `;

    if (deletedTransaction.length === 0) {
      return res.status(404).json({ message: "Transaction not found" }); //if no transaction is deleted, return a 404 error
    }

    //if the transaction is deleted successfully, display a success message, we dont usually return the response body for delete requests
    res.status(200).json({ message: "Transaction deleted successfully" });
    
  } catch (error) {
    console.log("Error deleting transaction:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
})

//getting summary of transactions for a user
app.get("/api/transactions/summary/:userId", async (req, res) => {
   try {
    const { userId } = req.params;

    //here we will get the total balance, income and expense of the user to generate a summary of transactions
    const balanceResult = await sql`
      SELECT COALESCE(SUM(amount),0) AS balance FROM transactions WHERE user_id = ${userId}
      `
    
    const incomeResult = await sql`
      SELECT COALESCE(SUM(amount),0) AS income from transactions WHERE user_id = ${userId} AND amount > 0
    `;

    const expensesResult = await sql`
      SELECT COALESCE(SUM(amount),0) AS expenses from transactions WHERE user_id = ${userId} AND amount < 0
    `;

    //here we extract the calculated values from their respective query results to send the response (balance, income, expenses), if the amount is greated than 0 then it is income and if it is less than 0 it is expenses
    res.status(200).json({
      balance: balanceResult[0].balance, //[0] is used to get the first element of the array
      income: incomeResult[0].income,
      expenses: expensesResult[0].expenses
    });


  } catch (error) {
    console.log("Error getting transaction summary:", error);
    return res.status(500).json({ message: "Internal server error" });
    
  }
})

//initialize the database, then start the serve
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
