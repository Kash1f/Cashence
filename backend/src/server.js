import express from "express";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import transactionRoutes from "./routes/transactionRoutes.js";

dotenv.config();

const app = express();

app.use(rateLimiter); //apply rate limiting middleware to all routes
app.use(express.json());

const PORT = process.env.PORT || 3000;

//when a request is made to the /api/transactions route, it will be handled by the transactionRoutes router
app.use("/api/transactions", transactionRoutes);

//initialize the database, then start the serve
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
