import { FuelTopup } from '../models/FuelTopup.js';
import { StockService } from '../services/stockService.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { getPaginationParams, formatPaginatedResponse } from '../utils/helpers.js';
import { HTTP_STATUS } from '../constants/enums.js';

export class InventoryController {
  // Get all fuel topups with filtering
  static async getAllTopups(req, res, next) {
    try {
      const { fuelType, startDate, endDate } = req.query;
      const { skip, limit } = getPaginationParams(req.query);

      let query = {};

      if (fuelType) {
        query.fuelType = fuelType;
      }

      if (startDate || endDate) {
        query.date = {};
        if (startDate) query.date.$gte = new Date(startDate);
        if (endDate) query.date.$lte = new Date(endDate);
      }

      const total = await FuelTopup.countDocuments(query);
      const topups = await FuelTopup.find(query)
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit);

      return sendSuccess(res, 'Topups retrieved successfully', 
        formatPaginatedResponse(topups, total, req.query.page || 1, limit)
      );
    } catch (error) {
      next(error);
    }
  }

  // Create new topup
  static async createTopup(req, res, next) {
    try {
      const { fuelType, litersAdded, pricePerLiter, supplier, notes, date } = req.body;

      // Validate required fields
      if (!fuelType || !litersAdded || !pricePerLiter) {
        return sendError(res, 'Fuel type, liters added, and price per liter are required', 
          HTTP_STATUS.BAD_REQUEST);
      }

      const topup = new FuelTopup({
        fuelType,
        litersAdded,
        pricePerLiter,
        supplier,
        notes,
        date: date || new Date(),
      });

      await topup.save();

      // Update stock snapshot
      await StockService.updateStockSnapshot();

      return sendSuccess(res, 'Topup created successfully', topup, HTTP_STATUS.CREATED);
    } catch (error) {
      next(error);
    }
  }

  // Update topup
  static async updateTopup(req, res, next) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const topup = await FuelTopup.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      });

      if (!topup) {
        return sendError(res, 'Topup not found', HTTP_STATUS.NOT_FOUND);
      }

      // Update stock snapshot
      await StockService.updateStockSnapshot();

      return sendSuccess(res, 'Topup updated successfully', topup);
    } catch (error) {
      next(error);
    }
  }

  // Delete topup (Admin only)
  static async deleteTopup(req, res, next) {
    try {
      const { id } = req.params;

      const topup = await FuelTopup.findByIdAndDelete(id);

      if (!topup) {
        return sendError(res, 'Topup not found', HTTP_STATUS.NOT_FOUND);
      }

      // Update stock snapshot
      await StockService.updateStockSnapshot();

      return sendSuccess(res, 'Topup deleted successfully', { deletedId: id });
    } catch (error) {
      next(error);
    }
  }
}

export default InventoryController;
