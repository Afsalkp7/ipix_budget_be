import express from 'express';
import { addIncome, deleteIncome, showIncome, updateIncome } from '../controllers/incomeCotroller.js';
import { authMiddleware } from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.post("/",authMiddleware,addIncome)
router.get("/", authMiddleware, showIncome); 
router.put("/:incomeId",authMiddleware,updateIncome)
router.delete("/:incomeId",authMiddleware,deleteIncome)

export default router;