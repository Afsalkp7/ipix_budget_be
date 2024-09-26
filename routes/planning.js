import express from 'express';
import {
    addPlanning,
    getAllPlannings,
    updatePlanning,
    deletePlanning
} from '../controllers/planningController.js';
import { authMiddleware } from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.post('/',authMiddleware, addPlanning); 
router.get('/',authMiddleware, getAllPlannings);
router.put('/:planId',authMiddleware, updatePlanning);
router.delete('/:planId',authMiddleware, deletePlanning);

export default router;
