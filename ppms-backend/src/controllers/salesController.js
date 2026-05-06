import { Sale } from '../models/Sale.js';
import { StockService } from '../services/stockService.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { getPaginationParams, formatPaginatedResponse } from '../utils/helpers.js';
import { HTTP_STATUS } from '../constants/enums.js';
import { FuelRate } from '../models/FuelRate.js';

export class SalesController {
  // Get all sales with filtering
  static async getAllSales(req, res, next) {
    try {
      const { fuelType, shift, startDate, endDate } = req.query;
      const { skip, limit } = getPaginationParams(req.query);

      let query = {};

      if (fuelType) query.fuelType = fuelType;
      if (shift) query.shift = shift;

      if (startDate || endDate) {
        query.date = {};
        if (startDate) query.date.$gte = new Date(startDate);
        if (endDate) query.date.$lte = new Date(endDate);
      }

      const total = await Sale.countDocuments(query);
      const sales = await Sale.find(query)
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit);

      return sendSuccess(res, 'Sales retrieved successfully',
        formatPaginatedResponse(sales, total, req.query.page || 1, limit)
      );
    } catch (error) {
      next(error);
    }
  }

static async createSale(req, res, next) {
  try {
    const { fuelType, litersSold, shift, nozzleNumber, date } = req.body;

    if (!fuelType || !litersSold || !shift) {
      return sendError(res, 'Required fields missing', 400);
    }

    // 🔥 GET RATE FROM DB
    const rateDoc = await FuelRate.findOne({ fuelType });

    if (!rateDoc) {
      return sendError(res, `Rate not set for ${fuelType}`, 400);
    }

    const pricePerLiter = rateDoc.price;

    const sale = new Sale({
      fuelType,
      litersSold,
      pricePerLiter,
      shift,
      nozzleNumber: nozzleNumber || '',
      date: date || new Date(),
    });

    await sale.save();

    await StockService.updateStockAfterSale(fuelType, litersSold);

    return sendSuccess(res, 'Sale created successfully', sale, 201);
  } catch (error) {
    next(error);
  }
}

  // Update sale
  static async updateSale(req, res, next) {
    try {
      const { id } = req.params;
      const updates = req.body;

      // Get old sale to calculate difference
      const oldSale = await Sale.findById(id);
      if (!oldSale) {
        return sendError(res, 'Sale not found', HTTP_STATUS.NOT_FOUND);
      }

      const sale = await Sale.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      });

      // If liters sold changed, update stock
      if (updates.litersSold && updates.litersSold !== oldSale.litersSold) {
        const difference = updates.litersSold - oldSale.litersSold;
        await StockService.updateStockAfterSale(sale.fuelType, difference);
      }

      return sendSuccess(res, 'Sale updated successfully', sale);
    } catch (error) {
      next(error);
    }
  }

  // Delete sale (Admin only)
  static async deleteSale(req, res, next) {
    try {
      const { id } = req.params;

      const sale = await Sale.findByIdAndDelete(id);

      if (!sale) {
        return sendError(res, 'Sale not found', HTTP_STATUS.NOT_FOUND);
      }

      // Reverse the stock update
      await StockService.updateStockAfterSale(sale.fuelType, -sale.litersSold);

      return sendSuccess(res, 'Sale deleted successfully', { deletedId: id });
    } catch (error) {
      next(error);
    }
  }
}

export default SalesController;
