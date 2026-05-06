import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../layouts/AdminLayout';
import { BarChartComponent } from '../components/ui/Charts';
import { Card, StatCard } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { FuelPriceWidget } from '../components/shared/Widgets';
import { formatCurrency } from '../constants';
import apiClient from '../services/apiClient';

/**
 * ReportsPage - Profit & Loss reports with analytics
 */
export const ReportsPage = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split('T')[0]
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  // Fetch report
  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/reports/profit-loss', {
          params: { startDate, endDate },
        });

        if (response.data?.data) {
          setReportData(response.data.data);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (startDate && endDate) {
      fetchReport();
    }
  }, [startDate, endDate]);

  if (loading) {
    return <div className="text-center py-12">Loading report...</div>;
  }

  if (!reportData) {
    return <div className="text-center py-12">No data available</div>;
  }

  const chartData = [
    {
      name: 'Revenue vs Expenses',
      Revenue: reportData.summary.totalRevenue,
      Expenses: reportData.summary.totalExpenses,
    },
  ];

  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Profit & Loss Reports</h1>
          <p className="text-neutral-600">Monthly financial analysis and insights</p>
        </div>

        {/* Date Filters */}
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <Input
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <Button onClick={() => window.print()}>
              Print Report
            </Button>
          </div>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            title="Total Revenue"
            value={formatCurrency(reportData.summary.totalRevenue)}
            icon={() => <span className="text-2xl">💵</span>}
          />
          <StatCard
            title="Total Expenses"
            value={formatCurrency(reportData.summary.totalExpenses)}
            icon={() => <span className="text-2xl">💳</span>}
          />
          <StatCard
            title="Gross Profit"
            value={formatCurrency(reportData.summary.grossProfit)}
            icon={() => <span className="text-2xl">📈</span>}
          />
          <StatCard
            title="Net Profit"
            value={formatCurrency(reportData.summary.netProfit)}
            icon={() => <span className="text-2xl">🎯</span>}
          />
        </div>

        {/* Chart */}
        <BarChartComponent
          data={chartData}
          title="Revenue vs Expenses"
          xAxisKey="name"
          bars={[
            { key: 'Revenue', color: '#16a34a' },
            { key: 'Expenses', color: '#dc2626' },
          ]}
          height={300}
        />

        {/* Expense Breakdown */}
        <Card className="p-6">
          <h2 className="text-lg font-bold text-neutral-900 mb-4">Expense Breakdown</h2>
          <div className="space-y-3">
            {reportData.expenses.byCategory.map((exp, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <span className="text-sm font-medium text-neutral-700">{exp._id}</span>
                <span className="text-sm font-bold text-primary-600">
                  PKR {exp.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Sales Details */}
        <Card className="p-6">
          <h2 className="text-lg font-bold text-neutral-900 mb-4">Sales Summary</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-neutral-50 rounded-lg">
              <p className="text-xs text-neutral-600 mb-2">Total Revenue</p>
              <p className="text-xl font-bold text-primary-600">
                PKR {reportData.sales.totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-neutral-50 rounded-lg">
              <p className="text-xs text-neutral-600 mb-2">Total Liters Sold</p>
              <p className="text-xl font-bold text-primary-600">
                {reportData.sales.totalLitersSold.toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-neutral-50 rounded-lg">
              <p className="text-xs text-neutral-600 mb-2">Transactions</p>
              <p className="text-xl font-bold text-primary-600">
                {reportData.sales.transactionCount}
              </p>
            </div>
          </div>
        </Card>

        {/* Fuel Prices Widget */}
        <FuelPriceWidget />
      </div>
  );
};

export default ReportsPage;
