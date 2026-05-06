import React, { useEffect, useState } from 'react';
import { GaugeCard } from '../components/ui/Charts';
import { Card, Loader } from '../components/ui/Card';
import { DataTable, DateCell } from '../components/ui/DataTable';
import { FilterDropdown } from '../components/shared/Filters';
import { FUEL_TYPES } from '../constants';
import apiClient from '../services/apiClient';

const LOW_STOCK_THRESHOLD = 1000;

export const StockPage = () => {
  const [snapshots, setSnapshots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFuel, setSelectedFuel] = useState(null);
  const [error, setError] = useState(null);

  /* =========================
     FETCH
  ========================= */
  const fetchStock = async () => {
    try {
      setError(null);
      const res = await apiClient.get('/stock-snapshot');

      if (res.data?.data) {
        setSnapshots(res.data.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load stock data');
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     EFFECT
  ========================= */
  useEffect(() => {
    fetchStock();

    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchStock();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  /* =========================
     FILTER
  ========================= */
  const filteredSnapshots = selectedFuel
    ? snapshots.filter((s) => s.fuelType === selectedFuel)
    : snapshots;

  /* =========================
     TABLE
  ========================= */
  const columns = [
    { key: 'fuelType', label: 'Fuel Type' },
    { key: 'stockOnHand', label: 'Stock (L)' },
    { key: 'totalAdded', label: 'Added (L)' },
    { key: 'totalSold', label: 'Sold (L)' },
    { key: 'date', label: 'Updated', render: (v) => <DateCell date={v} /> },
  ];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Stock Monitoring</h1>
        <p className="text-neutral-600">Real-time fuel stock levels</p>
      </div>

      {/* ERROR */}
      {error && (
        <Card className="p-4 border border-red-300 bg-red-50 text-red-700">
          {error}
        </Card>
      )}

      {/* FILTER */}
      <Card className="p-4">
        <FilterDropdown
          label="Fuel Type"
          options={FUEL_TYPES}
          value={selectedFuel}
          onChange={setSelectedFuel}
        />
      </Card>

      {/* LOADING */}
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader />
        </div>
      ) : (
        <>
          {/* GAUGES */}
          <div className="grid md:grid-cols-3 gap-6">
            {filteredSnapshots.map((s) => {
              const value = Math.round(s.stockOnHand || 0);
              const max = Math.max(value * 2, 5000);

              return (
                <GaugeCard
                  key={s._id}
                  title={s.fuelType}
                  value={value}
                  max={max}
                  unit="L"
                  color={value > LOW_STOCK_THRESHOLD ? 'success' : 'warning'}
                />
              );
            })}
          </div>

          {/* TABLE */}
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-4">Stock Movement</h2>
            <DataTable
              columns={columns}
              data={filteredSnapshots}
              loading={false}
            />
          </Card>

          {/* ALERT */}
          <Card className="p-6 border-l-4 border-warning-500 bg-warning-50">
            <h3 className="font-bold mb-2">⚠️ Low Stock Alert</h3>
            <p className="text-sm">
              {filteredSnapshots.some((s) => s.stockOnHand < LOW_STOCK_THRESHOLD)
                ? 'Low stock detected. Refill required.'
                : 'Stock levels are healthy.'}
            </p>
          </Card>
        </>
      )}
    </div>
  );
};

export default StockPage;