import { Expense } from '../models/Expense.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { getPaginationParams, formatPaginatedResponse } from '../utils/helpers.js';
import { HTTP_STATUS } from '../constants/enums.js';

export class ExpenseController {
  // Get all expenses with filtering
  static async getAllExpenses(req, res, next) {
    try {
      const { category, description, startDate, endDate } = req.query;
      const { skip, limit } = getPaginationParams(req.query);

      let query = {};

      if (category) {
        query.category = category;
      }

      if (description) {
        query.description = { $regex: description, $options: 'i' };
      }

      if (startDate || endDate) {
        query.date = {};
        if (startDate) query.date.$gte = new Date(startDate);
        if (endDate) query.date.$lte = new Date(endDate);
      }

      const total = await Expense.countDocuments(query);
      const expenses = await Expense.find(query)
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit);

      return sendSuccess(res, 'Expenses retrieved successfully',
        formatPaginatedResponse(expenses, total, req.query.page || 1, limit)
      );
    } catch (error) {
      next(error);
    }
  }

  // Create new expense
  static async createExpense(req, res, next) {
    try {
      const { category, description, amount, date } = req.body;

      // Validate required fields
      if (!category || !description || !amount) {
        return sendError(res, 'Category, description, and amount are required', 
          HTTP_STATUS.BAD_REQUEST);
      }

      const expense = new Expense({
        category,
        description,
        amount,
        date: date || new Date(),
      });

      await expense.save();

      return sendSuccess(res, 'Expense created successfully', expense, HTTP_STATUS.CREATED);
    } catch (error) {
      next(error);
    }
  }

  // Update expense
  static async updateExpense(req, res, next) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const expense = await Expense.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      });

      if (!expense) {
        return sendError(res, 'Expense not found', HTTP_STATUS.NOT_FOUND);
      }

      return sendSuccess(res, 'Expense updated successfully', expense);
    } catch (error) {
      next(error);
    }
  }

  // Delete expense (Admin only)
  static async deleteExpense(req, res, next) {
    try {
      const { id } = req.params;

      const expense = await Expense.findByIdAndDelete(id);

      if (!expense) {
        return sendError(res, 'Expense not found', HTTP_STATUS.NOT_FOUND);
      }

      return sendSuccess(res, 'Expense deleted successfully', { deletedId: id });
    } catch (error) {
      next(error);
    }
  }
}

export default ExpenseController;
