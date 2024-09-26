import express from 'express';
import { authMiddleware } from '../middlewares/authMiddlewares.js';
import { getDashboardOverview, getDashData } from '../controllers/dashController.js';
const router = express.Router();

router.get("/",authMiddleware,getDashData)
router.get("/overview",authMiddleware,getDashboardOverview)

export default router;