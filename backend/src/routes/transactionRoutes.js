import express from "express";
import { sql } from "../config/db.js";
import {
  createTransaction,
  deleteTransaction,
  getTransactionbyUserId,
  getTransactionSummary,
} from "../controllers/transcationController.js";

const router = express.Router();

router.get("/:userId", getTransactionbyUserId);
router.post("", createTransaction);
router.delete("/:id", deleteTransaction);
router.get("/summary/:userId", getTransactionSummary);

export default router;
