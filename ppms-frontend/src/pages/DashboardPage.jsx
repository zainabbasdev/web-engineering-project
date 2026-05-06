import React, { useEffect, useState } from 'react';
import { LineChartComponent } from '../components/ui/Charts';
import { Card, Loader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { WeatherWidget, FuelPriceWidget } from '../components/shared/Widgets';
import apiClient from '../services/apiClient';

export const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* =========================
     RATE MODAL STATE
  ========================= */
  const [rateModalOpen, setRateModalOpen] = useState(false);
  const [rateForm, setRateForm] = useState({
    fuelType: 'Petrol',
    price: '',
  });

  /* =========================
     HELPERS
  ========================= */
  const getLocalDate = () => {
    const d = new Date();
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
      .toISOString()
      .split('T')[0];
  };

  /* =========================
     FETCH DATA
  ========================= */
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const today = getLocalDate();

      const [salesRes, stockRes, chartRes, ratesRes] = await Promise.all([
        apiClient.get('/sales', { params: { startDate: today, limit: 100 } }),
        apiClient.get('/stock-snapshot'),
        apiClient.get('/reports/daily-summary', { params: { days: 7 } }),
        apiClient.get('/fuel-rates'),
      ]);

      /* ---- SALES ---- */
      const sales = salesRes.data?.data?.data || [];

      const totalSales = sales.reduce((sum, s) => sum + (s.totalAmount || 0), 0);
      const totalLiters = sales.reduce((sum, s) => sum + (s.litersSold || 0), 0);

      /* ---- STOCK ---- */
      const stock = { petrol: 0, diesel: 0, cng: 0 };

      (stockRes.data?.data || []).forEach((item) => {
        const key = item.fuelType?.toLowerCase().replace(' ', '');
        if (stock[key] !== undefined) {
          stock[key] = Number(item.stockOnHand) || 0;
        }
      });

      /* ---- FUEL RATES (SAFE PARSE) ---- */
      const rates = { petrol: 0, diesel: 0, cng: 0 };

      let rateList = [];
      const rawRates = ratesRes.data?.data;

      if (Array.isArray(rawRates)) {
        rateList = rawRates;
      } else if (Array.isArray(rawRates?.rates)) {
        rateList = rawRates.rates;
      } else if (Array.isArray(ratesRes.data?.rates)) {
        rateList = ratesRes.data.rates;
      }

      rateList.forEach((r) => {
        const key = r.fuelType?.toLowerCase();
        if (rates[key] !== undefined) {
          rates[key] = Number(r.price) || 0;
        }
      });

      /* ---- SET STATE ---- */
      setStats({
        todaySales: totalSales,
        litersSoldToday: totalLiters,
        currentStock: stock,
        totalEntries: sales.length,
        fuelRates: rates,
      });

      /* ---- CHART ---- */
      if (Array.isArray(chartRes.data?.data)) {
        setChartData(
          chartRes.data.data.map((d) => ({
            name: d._id,
            revenue: d.totalRevenue || 0,
            liters: d.totalLitersSold || 0,
          }))
        );
      }

    } catch (err) {
      console.error(err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* =========================
     RATE SUBMIT
  ========================= */
  const handleRateSubmit = async (e) => {
    e.preventDefault();

    try {
      await apiClient.post('/fuel-rates', {
        fuelType: rateForm.fuelType,
        price: Number(rateForm.price),
      });

      await fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setRateModalOpen(false);
      setRateForm({ fuelType: 'Petrol', price: '' });
    }
  };

  /* =========================
     UI STATES
  ========================= */
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <Card className="p-6 text-red-600">
        {error || 'No data available'}
      </Card>
    );
  }

  const totalStock =
    stats.currentStock.petrol +
    stats.currentStock.diesel +
    stats.currentStock.cng;

  /* =========================
     RENDER
  ========================= */
  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-neutral-500">
            {new Date().toLocaleDateString()}
          </p>
        </div>
        <Button onClick={() => setRateModalOpen(true)}>
          Add Rate
        </Button>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-5">
          <p className="text-sm text-neutral-500">Revenue</p>
          <p className="text-xl font-bold">
            ₨ {stats.todaySales.toLocaleString()}
          </p>
        </Card>

        <Card className="p-5">
          <p className="text-sm text-neutral-500">Liters Sold</p>
          <p className="text-xl font-bold">
            {stats.litersSoldToday.toLocaleString()}
          </p>
        </Card>

        <Card className="p-5">
          <p className="text-sm text-neutral-500">Stock</p>
          <p className="text-xl font-bold">
            {totalStock.toLocaleString()} L
          </p>
        </Card>

        <Card className="p-5">
          <p className="text-sm text-neutral-500">Transactions</p>
          <p className="text-xl font-bold">
            {stats.totalEntries}
          </p>
        </Card>
      </div>

      {/* FUEL RATES DISPLAY (IMPORTANT FIX) */}
      <Card className="p-5">
        <h3 className="text-sm font-semibold mb-3">Current Fuel Rates</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-neutral-500">Petrol</p>
            <p className="text-lg font-bold">₨ {stats.fuelRates.petrol}</p>
          </div>
          <div>
            <p className="text-xs text-neutral-500">Diesel</p>
            <p className="text-lg font-bold">₨ {stats.fuelRates.diesel}</p>
          </div>
          <div>
            <p className="text-xs text-neutral-500">CNG</p>
            <p className="text-lg font-bold">₨ {stats.fuelRates.cng}</p>
          </div>
        </div>
      </Card>

      {/* CHART + WEATHER */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2">
          <LineChartComponent
            data={chartData}
            dataKey="revenue"
            height={300}
          />
        </Card>

        <WeatherWidget city="Islamabad" />
      </div>

      {/* EXTRA */}
      <div className="grid lg:grid-cols-2 gap-6">
        <FuelPriceWidget />

        <Card className="p-6">
          <h3 className="text-sm font-semibold mb-4">Stock Levels</h3>

          {Object.entries(stats.currentStock).map(([fuel, amount]) => {
            const percent = totalStock
              ? (amount / totalStock) * 100
              : 0;

            return (
              <div key={fuel} className="mb-3">
                <div className="flex justify-between text-sm">
                  <span>{fuel}</span>
                  <span>{amount.toLocaleString()} L</span>
                </div>

                <div className="h-2 bg-neutral-200 rounded">
                  <div
                    className="h-2 bg-primary-600 rounded"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </Card>
      </div>

      {/* RATE MODAL */}
      <Modal
        isOpen={rateModalOpen}
        onClose={() => setRateModalOpen(false)}
        title="Set Fuel Rate"
      >
        <form onSubmit={handleRateSubmit} className="space-y-4">

          <select
            className="w-full border rounded p-2"
            value={rateForm.fuelType}
            onChange={(e) =>
              setRateForm((p) => ({ ...p, fuelType: e.target.value }))
            }
          >
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="CNG">CNG</option>
          </select>

          <input
            type="number"
            placeholder="Enter price"
            className="w-full border rounded p-2"
            value={rateForm.price}
            onChange={(e) =>
              setRateForm((p) => ({ ...p, price: e.target.value }))
            }
            required
          />

          <Button type="submit" className="w-full">
            Save Rate
          </Button>
        </form>
      </Modal>

    </div>
  );
};

export default DashboardPage;