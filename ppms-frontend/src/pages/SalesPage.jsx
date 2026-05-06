import React, { useEffect, useState } from 'react';
import { DataTable, DateCell, CurrencyCell } from '../components/ui/DataTable';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { FilterDropdown } from '../components/shared/Filters';
import { Card } from '../components/ui/Card';
import { SHIFTS, FUEL_TYPES } from '../constants';
import apiClient from '../services/apiClient';

export const SalesPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  const [filters, setFilters] = useState({
    fuelType: null,
    shift: null,
  });

  const [formData, setFormData] = useState({
    fuelType: '',
    litersSold: '',
    shift: '',
    nozzleNumber: '',
    date: new Date().toISOString().split('T')[0],
  });

  /* =========================
     FETCH
  ========================= */
  const fetchItems = async (page = pagination.page) => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page,
        limit: pagination.limit,
        ...(filters.fuelType && { fuelType: filters.fuelType }),
        ...(filters.shift && { shift: filters.shift }),
      });

      const res = await apiClient.get(`/sales?${params}`);

      if (res.data?.data) {
        setItems(res.data.data.data || []);
        setPagination((prev) => ({
          ...prev,
          page,
          total: res.data.data.pagination?.total || 0,
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     EFFECTS
  ========================= */
  useEffect(() => {
    fetchItems(1);
  }, [filters]);

  useEffect(() => {
    fetchItems(pagination.page);
  }, [pagination.page]);

  /* =========================
     SUBMIT
  ========================= */
  const handleSubmit = async (e) => {
  e.preventDefault();

  const payload = {
    fuelType: formData.fuelType,
    litersSold: Number(formData.litersSold),
    shift: formData.shift,
    nozzleNumber: formData.nozzleNumber || '',
    date: formData.date,
  };

  try {
    if (editingItem) {
      await apiClient.put(`/sales/${editingItem._id}`, payload);
    } else {
      await apiClient.post('/sales', payload);
    }

    setModalOpen(false);
    setEditingItem(null);

    setFormData({
      fuelType: '',
      litersSold: '',
      shift: '',
      nozzleNumber: '',
      date: new Date().toISOString().split('T')[0],
    });

    await fetchItems(1);
  } catch (err) {
    console.error(err.response?.data || err.message);
  }
};

  /* =========================
     DELETE
  ========================= */
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this record?')) return;

    try {
      await apiClient.delete(`/sales/${id}`);
      await fetchItems(); // ✅ sync with backend
    } catch (err) {
      console.error(err);
    }
  };

  /* =========================
     EDIT
  ========================= */
  const handleEdit = (row) => {
    setEditingItem(row);

    setFormData({
      fuelType: row.fuelType || '',
      litersSold: row.litersSold || '',
      shift: row.shift || '',
      nozzleNumber: row.nozzleNumber || '',
      date: row.date?.split('T')[0] || '',
    });

    setModalOpen(true);
  };

  /* =========================
     TABLE
  ========================= */
  const columns = [
    { key: 'date', label: 'Date', render: (v) => <DateCell date={v} /> },
    { key: 'fuelType', label: 'Fuel' },
    { key: 'shift', label: 'Shift' },
    { key: 'litersSold', label: 'Liters' },
    { key: 'pricePerLiter', label: 'Price', render: (v) => <CurrencyCell value={v} /> },
    { key: 'totalAmount', label: 'Revenue', render: (v) => <CurrencyCell value={v} /> },
  ];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Sales</h1>

        <Button
          onClick={() => {
            setEditingItem(null);
            setFormData({
              fuelType: '',
              litersSold: '',
              shift: '',
              nozzleNumber: '',
              date: new Date().toISOString().split('T')[0],
            });
            setModalOpen(true);
          }}
        >
          + Add
        </Button>
      </div>

      {/* FILTERS */}
      <Card className="p-4 grid md:grid-cols-2 gap-4">
        <FilterDropdown
          label="Fuel Type"
          options={FUEL_TYPES}
          value={filters.fuelType}
          onChange={(v) => setFilters((p) => ({ ...p, fuelType: v }))}
        />

        <FilterDropdown
          label="Shift"
          options={SHIFTS}
          value={filters.shift}
          onChange={(v) => setFilters((p) => ({ ...p, shift: v }))}
        />
      </Card>

      {/* TABLE */}
      <DataTable
        columns={columns}
        data={items}
        loading={loading}
        pagination={pagination}
        onPageChange={(p) => setPagination((prev) => ({ ...prev, page: p }))}
        rowActions={(row) => [
          { label: 'Edit', onClick: () => handleEdit(row) },
          { label: 'Delete', onClick: () => handleDelete(row._id), isDanger: true },
        ]}
      />

      {/* MODAL */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'Edit Sale' : 'Add Sale'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select label="Fuel Type" value={formData.fuelType}
            onChange={(e) => setFormData(p => ({ ...p, fuelType: e.target.value }))} options={FUEL_TYPES} />

          <Select label="Shift" value={formData.shift}
            onChange={(e) => setFormData(p => ({ ...p, shift: e.target.value }))} options={SHIFTS} />

          <Input label="Liters" type="number" value={formData.litersSold}
            onChange={(e) => setFormData(p => ({ ...p, litersSold: e.target.value }))} />

          <Input label="Nozzle" value={formData.nozzleNumber}
            onChange={(e) => setFormData(p => ({ ...p, nozzleNumber: e.target.value }))} />

          <Input label="Date" type="date" value={formData.date}
            onChange={(e) => setFormData(p => ({ ...p, date: e.target.value }))} />

          <Button type="submit" className="w-full">
            {editingItem ? 'Update' : 'Add'}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default SalesPage;