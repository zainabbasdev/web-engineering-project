import express from 'express';
import StockController from '../controllers/stockController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get all stock snapshots
router.get('/', StockController.getStockSnapshot);

// Get stock for specific fuel type
router.get('/:fuelType', StockController.getStockByFuelType);

export default router;
