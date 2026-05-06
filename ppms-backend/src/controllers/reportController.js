import { ReportService } from '../services/reportService.js';
import { Expense } from '../models/Expense.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { HTTP_STATUS } from '../constants/enums.js';
import axios from 'axios';

export class ReportController {
  // Get Profit & Loss report
  static async getProfitLossReport(req, res, next) {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return sendError(res, 'Start date and end date are required', HTTP_STATUS.BAD_REQUEST);
      }

      // Get sales data (revenue and cost)
      const salesReport = await ReportService.getProfitLossReport(startDate, endDate);

      // Get expenses data
      const expensesPipeline = [
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
            _id: '$category',
            amount: { $sum: '$amount' },
          },
        },
      ];

      const expensesByCategory = await Expense.aggregate(expensesPipeline);
      const totalExpenses = expensesByCategory.reduce((sum, exp) => sum + exp.amount, 0);

      // Calculate net profit/loss
      const netProfit = salesReport.totalRevenue - totalExpenses;

      return sendSuccess(res, 'Profit/Loss report retrieved successfully', {
        period: { startDate, endDate },
        sales: {
          totalRevenue: salesReport.totalRevenue,
          totalCost: salesReport.totalCost,
          totalLitersSold: salesReport.totalLitersSold,
          transactionCount: salesReport.salesCount,
        },
        expenses: {
          total: totalExpenses,
          byCategory: expensesByCategory,
        },
        summary: {
          totalRevenue: salesReport.totalRevenue,
          totalExpenses: totalExpenses,
          grossProfit: salesReport.totalRevenue - salesReport.totalCost,
          netProfit: netProfit,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Get revenue by fuel type
  static async getRevenueByFuelType(req, res, next) {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return sendError(res, 'Start date and end date are required', HTTP_STATUS.BAD_REQUEST);
      }

      const revenueData = await ReportService.getRevenueByFuelType(startDate, endDate);

      return sendSuccess(res, 'Revenue by fuel type retrieved successfully', revenueData);
    } catch (error) {
      next(error);
    }
  }

  // Get daily sales summary
  static async getDailySalesSummary(req, res, next) {
    try {
      const { days = 7 } = req.query;

      const summary = await ReportService.getDailySalesSummary(parseInt(days));

      return sendSuccess(res, 'Daily sales summary retrieved successfully', summary);
    } catch (error) {
      next(error);
    }
  }

  // Get fuel prices from external API (proxy)
  static async getFuelPrices(req, res, next) {
    try {
      const response = await axios.get('https://api.collectapi.com/gasPrice/allRegion', {
        headers: {
          'authorization': `apikey ${process.env.COLLECT_API_KEY}`,
        },
      });

      if (response.data?.result) {
        return sendSuccess(res, 'Fuel prices retrieved successfully', response.data.result);
      } else {
        throw new Error('Invalid response format from fuel prices API');
      }
    } catch (error) {
      console.error('Error fetching fuel prices:', error.message);
      return sendError(res, `Failed to fetch fuel prices: ${error.message}`, HTTP_STATUS.SERVICE_UNAVAILABLE);
    }
  }
}

export default ReportController;
