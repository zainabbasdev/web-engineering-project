import express from 'express';
import InventoryController from '../controllers/inventoryController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';
import { USER_ROLES } from '../constants/enums.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get all topups
router.get('/', InventoryController.getAllTopups);

// Create topup (Manager and Admin)
router.post('/', roleMiddleware(USER_ROLES.ADMIN, USER_ROLES.MANAGER), InventoryController.createTopup);

// Update topup (Manager and Admin)
router.put('/:id', roleMiddleware(USER_ROLES.ADMIN, USER_ROLES.MANAGER), InventoryController.updateTopup);

// Delete topup (Admin only)
router.delete('/:id', roleMiddleware(USER_ROLES.ADMIN), InventoryController.deleteTopup);

export default router;
