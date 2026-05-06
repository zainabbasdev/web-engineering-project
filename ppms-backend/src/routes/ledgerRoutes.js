import express from 'express';
import LedgerController from '../controllers/ledgerController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';
import { USER_ROLES } from '../constants/enums.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Restrict to Accountant and Admin
router.use(roleMiddleware(USER_ROLES.ADMIN, USER_ROLES.ACCOUNTANT));

// Get all customers
router.get('/', LedgerController.getAllCustomers);

// Create customer
router.post('/', LedgerController.createCustomer);

// Get customer with transactions
router.get('/:id', LedgerController.getCustomerById);

// Add transaction to customer
router.post('/:id/transaction', LedgerController.addTransaction);

// Delete transaction from customer
router.delete('/:id/transaction/:txId', LedgerController.deleteTransaction);

// Delete customer (Admin only)
router.delete('/:id', roleMiddleware(USER_ROLES.ADMIN), LedgerController.deleteCustomer);

export default router;
