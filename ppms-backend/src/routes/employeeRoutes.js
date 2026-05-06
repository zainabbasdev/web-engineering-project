import express from 'express';
import EmployeeController from '../controllers/employeeController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';
import { USER_ROLES } from '../constants/enums.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get all employees (Accountant excluded)
router.get('/', roleMiddleware(USER_ROLES.ADMIN, USER_ROLES.MANAGER), EmployeeController.getAllEmployees);

// Create employee (Admin and Manager)
router.post('/', roleMiddleware(USER_ROLES.ADMIN, USER_ROLES.MANAGER), EmployeeController.createEmployee);

// Update employee (Admin and Manager)
router.put('/:id', roleMiddleware(USER_ROLES.ADMIN, USER_ROLES.MANAGER), EmployeeController.updateEmployee);

// Delete employee (Admin only)
router.delete('/:id', roleMiddleware(USER_ROLES.ADMIN), EmployeeController.deleteEmployee);

export default router;
