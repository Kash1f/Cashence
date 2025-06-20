import { sql } from "../config/db.js";

export async function getTransactionbyUserId(req, res) {
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
}

export async function createTransaction(req, res) {
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
}

export async function deleteTransaction(req, res) {
  try {
    //delete the transaction with the given id from the request params
    const { id } = req.params;

    if (isNaN(parseInt(id))) {
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
}

//getting summary of transactions for a user
export async function getTransactionSummary(req, res) {
  try {
    const { userId } = req.params;

    //here we will get the total balance, income and expense of the user to generate a summary of transactions
    const balanceResult = await sql`
          SELECT COALESCE(SUM(amount),0) AS balance FROM transactions WHERE user_id = ${userId}
          `;

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
      expenses: expensesResult[0].expenses,
    });
  } catch (error) {
    console.log("Error getting transaction summary:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
