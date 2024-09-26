import express from 'express';
import { authMiddleware } from '../middlewares/authMiddlewares.js';
import { addExpense, deleteExpense, showExpense, updateExpense } from '../controllers/expenseController.js';
const router = express.Router();

router.post("/",authMiddleware,addExpense)
router.get("/", authMiddleware,showExpense); 
router.put("/:expenseId",authMiddleware,updateExpense)
router.delete("/:expenseId",authMiddleware,deleteExpense)

export default router;