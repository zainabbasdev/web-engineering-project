import express from 'express';
import ExpenseController from '../controllers/expenseController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';
import { USER_ROLES } from '../constants/enums.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get all expenses
router.get('/', roleMiddleware(USER_ROLES.ADMIN, USER_ROLES.ACCOUNTANT), ExpenseController.getAllExpenses);

// Create expense (Accountant and Admin)
router.post('/', roleMiddleware(USER_ROLES.ADMIN, USER_ROLES.ACCOUNTANT), ExpenseController.createExpense);

// Update expense (Accountant and Admin)
router.put('/:id', roleMiddleware(USER_ROLES.ADMIN, USER_ROLES.ACCOUNTANT), ExpenseController.updateExpense);

// Delete expense (Admin only)
router.delete('/:id', roleMiddleware(USER_ROLES.ADMIN), ExpenseController.deleteExpense);

export default router;
