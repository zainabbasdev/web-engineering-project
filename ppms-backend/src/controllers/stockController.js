import { StockSnapshot } from '../models/StockSnapshot.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { HTTP_STATUS } from '../constants/enums.js';

export class StockController {
  // Get all stock snapshots
  static async getStockSnapshot(req, res, next) {
    try {
      const { fuelType } = req.query;

      let query = fuelType ? { fuelType } : {};
      const snapshots = await StockSnapshot.find(query);

      return sendSuccess(res, 'Stock snapshots retrieved successfully', snapshots);
    } catch (error) {
      next(error);
    }
  }

  // Get specific fuel type stock
  static async getStockByFuelType(req, res, next) {
    try {
      const { fuelType } = req.params;

      const snapshot = await StockSnapshot.findOne({ fuelType });

      if (!snapshot) {
        return sendError(res, 'Stock snapshot not found', HTTP_STATUS.NOT_FOUND);
      }

      return sendSuccess(res, 'Stock retrieved successfully', snapshot);
    } catch (error) {
      next(error);
    }
  }
}

export default StockController;
