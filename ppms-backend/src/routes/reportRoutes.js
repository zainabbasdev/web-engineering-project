import express from 'express';
import ReportController from '../controllers/reportController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';
import { USER_ROLES } from '../constants/enums.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Restrict to Accountant and Admin
router.use(roleMiddleware(USER_ROLES.ADMIN, USER_ROLES.ACCOUNTANT));

// Get Profit & Loss report
router.get('/profit-loss', ReportController.getProfitLossReport);

// Get revenue by fuel type
router.get('/revenue-by-fuel', ReportController.getRevenueByFuelType);

// Get daily sales summary
router.get('/daily-summary', ReportController.getDailySalesSummary);

// Get fuel prices (proxy)
router.get('/fuel-prices', ReportController.getFuelPrices);

export default router;
