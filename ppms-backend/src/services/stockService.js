import { FuelTopup } from '../models/FuelTopup.js';
import { StockSnapshot } from '../models/StockSnapshot.js';
import { FUEL_TYPES } from '../constants/enums.js';

export class StockService {
  // Update stock snapshot after any inventory or sales change
  static async updateStockSnapshot() {
    try {
      for (const fuelType of Object.values(FUEL_TYPES)) {
        // Get all top-ups for this fuel type
        const topups = await FuelTopup.find({ fuelType });
        const totalAdded = topups.reduce((sum, t) => sum + t.litersAdded, 0);

        // We'll need to get total sold from Sales, so this might be called from there too
        let snapshot = await StockSnapshot.findOne({ fuelType });

        if (!snapshot) {
          snapshot = new StockSnapshot({
            fuelType,
            totalAdded,
            totalSold: 0,
            stockOnHand: totalAdded,
          });
        } else {
          snapshot.totalAdded = totalAdded;
          snapshot.stockOnHand = totalAdded - snapshot.totalSold;
        }

        await snapshot.save();
      }
    } catch (error) {
      console.error('Error updating stock snapshot:', error);
      throw error;
    }
  }

  // Update stock after a sale is added/removed
  static async updateStockAfterSale(fuelType, litersChange) {
    try {
      let snapshot = await StockSnapshot.findOne({ fuelType });

      if (!snapshot) {
        snapshot = new StockSnapshot({
          fuelType,
          totalSold: Math.max(0, litersChange),
          stockOnHand: -Math.max(0, litersChange),
        });
      } else {
        snapshot.totalSold += litersChange;
        snapshot.stockOnHand = snapshot.totalAdded - snapshot.totalSold;
        // Ensure stock doesn't go negative
        snapshot.stockOnHand = Math.max(0, snapshot.stockOnHand);
      }

      await snapshot.save();
      return snapshot;
    } catch (error) {
      console.error('Error updating stock after sale:', error);
      throw error;
    }
  }

  // Get current stock
  static async getStockSnapshot(fuelType) {
    try {
      if (fuelType) {
        return await StockSnapshot.findOne({ fuelType });
      }
      return await StockSnapshot.find();
    } catch (error) {
      console.error('Error getting stock snapshot:', error);
      throw error;
    }
  }
}

export default StockService;
