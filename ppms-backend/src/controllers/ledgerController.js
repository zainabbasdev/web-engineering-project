import { CustomerLedger } from '../models/CustomerLedger.js';
import { LedgerService } from '../services/ledgerService.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { getPaginationParams, formatPaginatedResponse } from '../utils/helpers.js';
import { HTTP_STATUS } from '../constants/enums.js';

export class LedgerController {
  // Get all customers
  static async getAllCustomers(req, res, next) {
    try {
      const { name, phoneNumber } = req.query;
      const { skip, limit } = getPaginationParams(req.query);

      let query = {};

      if (name) {
        query.personName = { $regex: name, $options: 'i' };
      }

      if (phoneNumber) {
        query.phoneNumber = phoneNumber;
      }

      const total = await CustomerLedger.countDocuments(query);
      const customers = await CustomerLedger.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-transactions'); // Don't fetch transactions in list view

      return sendSuccess(res, 'Customers retrieved successfully',
        formatPaginatedResponse(customers, total, req.query.page || 1, limit)
      );
    } catch (error) {
      next(error);
    }
  }

  // Get customer with all transactions
  static async getCustomerById(req, res, next) {
    try {
      const { id } = req.params;

      const customer = await CustomerLedger.findById(id);

      if (!customer) {
        return sendError(res, 'Customer not found', HTTP_STATUS.NOT_FOUND);
      }

      return sendSuccess(res, 'Customer retrieved successfully', customer);
    } catch (error) {
      next(error);
    }
  }

  // Create new customer
  static async createCustomer(req, res, next) {
    try {
      const { personName, phoneNumber, address } = req.body;

      // Validate required fields
      if (!personName || !phoneNumber) {
        return sendError(res, 'Name and phone number are required', HTTP_STATUS.BAD_REQUEST);
      }

      const customer = new CustomerLedger({
        personName,
        phoneNumber,
        address,
        balance: 0,
        transactions: [],
      });

      await customer.save();

      return sendSuccess(res, 'Customer created successfully', customer, HTTP_STATUS.CREATED);
    } catch (error) {
      next(error);
    }
  }

  // Add transaction
  static async addTransaction(req, res, next) {
    try {
      const { id } = req.params;
      const { transactionType, description, amount, date } = req.body;

      // Validate required fields
      if (!transactionType || !description || !amount) {
        return sendError(res, 'Transaction type, description, and amount are required',
          HTTP_STATUS.BAD_REQUEST);
      }

      const customer = await LedgerService.addTransaction(
        id,
        transactionType,
        amount,
        description,
        date
      );

      return sendSuccess(res, 'Transaction added successfully', customer);
    } catch (error) {
      next(error);
    }
  }

  // Delete transaction
  static async deleteTransaction(req, res, next) {
    try {
      const { id, txId } = req.params;

      const customer = await LedgerService.deleteTransaction(id, txId);

      return sendSuccess(res, 'Transaction deleted successfully', customer);
    } catch (error) {
      next(error);
    }
  }

  // Delete customer (Admin only)
  static async deleteCustomer(req, res, next) {
    try {
      const { id } = req.params;

      const customer = await CustomerLedger.findByIdAndDelete(id);

      if (!customer) {
        return sendError(res, 'Customer not found', HTTP_STATUS.NOT_FOUND);
      }

      return sendSuccess(res, 'Customer deleted successfully', { deletedId: id });
    } catch (error) {
      next(error);
    }
  }
}

export default LedgerController;
