import { Employee } from '../models/Employee.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { getPaginationParams, formatPaginatedResponse } from '../utils/helpers.js';
import { HTTP_STATUS } from '../constants/enums.js';

export class EmployeeController {
  // Get all employees with filtering
  static async getAllEmployees(req, res, next) {
    try {
      const { name, cnic, role, isActive } = req.query;
      const { skip, limit } = getPaginationParams(req.query);

      let query = {};

      if (name) {
        query.name = { $regex: name, $options: 'i' };
      }

      if (cnic) {
        query.cnic = cnic;
      }

      if (role) {
        query.role = role;
      }

      if (isActive !== undefined) {
        query.isActive = isActive === 'true';
      }

      const total = await Employee.countDocuments(query);
      const employees = await Employee.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      return sendSuccess(res, 'Employees retrieved successfully',
        formatPaginatedResponse(employees, total, req.query.page || 1, limit)
      );
    } catch (error) {
      next(error);
    }
  }

  // Create new employee
  static async createEmployee(req, res, next) {
    try {
      const { name, cnic, phone, role, salary, joiningDate } = req.body;

      // Validate required fields
      if (!name || !cnic || !phone || !role || !salary || !joiningDate) {
        return sendError(res, 'All fields are required', HTTP_STATUS.BAD_REQUEST);
      }

      const employee = new Employee({
        name,
        cnic,
        phone,
        role,
        salary,
        joiningDate,
      });

      await employee.save();

      return sendSuccess(res, 'Employee created successfully', employee, HTTP_STATUS.CREATED);
    } catch (error) {
      next(error);
    }
  }

  // Update employee
  static async updateEmployee(req, res, next) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const employee = await Employee.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      });

      if (!employee) {
        return sendError(res, 'Employee not found', HTTP_STATUS.NOT_FOUND);
      }

      return sendSuccess(res, 'Employee updated successfully', employee);
    } catch (error) {
      next(error);
    }
  }

  // Delete employee (Hard delete - Admin only)
  static async deleteEmployee(req, res, next) {
    try {
      const { id } = req.params;

      const employee = await Employee.findByIdAndDelete(id);

      if (!employee) {
        return sendError(res, 'Employee not found', HTTP_STATUS.NOT_FOUND);
      }

      return sendSuccess(res, 'Employee deleted successfully', { deletedId: id });
    } catch (error) {
      next(error);
    }
  }
}

export default EmployeeController;
