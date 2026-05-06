import express from 'express';
import SalesController from '../controllers/salesController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';
import { USER_ROLES } from '../constants/enums.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get all sales
router.get('/', SalesController.getAllSales);

// Create sale (Manager and Admin)
router.post('/', roleMiddleware(USER_ROLES.ADMIN, USER_ROLES.MANAGER), SalesController.createSale);

// Update sale (Manager and Admin)
router.put('/:id', roleMiddleware(USER_ROLES.ADMIN, USER_ROLES.MANAGER), SalesController.updateSale);

// Delete sale (Admin only)
router.delete('/:id', roleMiddleware(USER_ROLES.ADMIN), SalesController.deleteSale);

export default router;
