import { Sale } from '../models/Sale.js';
import { StockSnapshot } from '../models/StockSnapshot.js';

export class ReportService {
  // Get Profit & Loss report for a date range
  static async getProfitLossReport(startDate, endDate) {
    try {
      const pipeline = [
        {
          $match: {
            date: {
              $gte: new Date(startDate),
              $lte: new Date(endDate),
            },
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$totalAmount' },
            totalCost: { $sum: '$totalCost' },
            totalLitersSold: { $sum: '$litersSold' },
            salesCount: { $sum: 1 },
          },
        },
      ];

      const result = await Sale.aggregate(pipeline);

      if (!result || result.length === 0) {
        return {
          totalRevenue: 0,
          totalCost: 0,
          totalLitersSold: 0,
          netProfit: 0,
          salesCount: 0,
        };
      }

      const report = result[0];
      report.netProfit = report.totalRevenue - report.totalCost;

      return report;
    } catch (error) {
      console.error('Error generating profit/loss report:', error);
      throw error;
    }
  }

  // Get revenue by fuel type for a date range
  static async getRevenueByFuelType(startDate, endDate) {
    try {
      const pipeline = [
        {
          $match: {
            date: {
              $gte: new Date(startDate),
              $lte: new Date(endDate),
            },
          },
        },
        {
          $group: {
            _id: '$fuelType',
            totalRevenue: { $sum: '$totalAmount' },
            totalLitersSold: { $sum: '$litersSold' },
            avgPricePerLiter: { $avg: '$pricePerLiter' },
          },
        },
        {
          $sort: { totalRevenue: -1 },
        },
      ];

      return await Sale.aggregate(pipeline);
    } catch (error) {
      console.error('Error getting revenue by fuel type:', error);
      throw error;
    }
  }

  // Get daily sales summary
  static async getDailySalesSummary(days = 7) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const pipeline = [
        {
          $match: {
            date: { $gte: startDate },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$date' },
            },
            totalRevenue: { $sum: '$totalAmount' },
            totalLitersSold: { $sum: '$litersSold' },
            salesCount: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ];

      return await Sale.aggregate(pipeline);
    } catch (error) {
      console.error('Error getting daily sales summary:', error);
      throw error;
    }
  }
}

export default ReportService;
