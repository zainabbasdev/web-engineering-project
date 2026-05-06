import React, { useEffect, useState } from 'react';
import { DataTable, DateCell, CurrencyCell } from '../components/ui/DataTable';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Input, Select, TextArea } from '../components/ui/Input';
import { SearchBar, FilterDropdown } from '../components/shared/Filters';
import { Card } from '../components/ui/Card';
import { FUEL_TYPES } from '../constants';
import apiClient from '../services/apiClient';

export const InventoryPage = () => {
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
    supplier: '',
  });

  const [formData, setFormData] = useState({
    fuelType: '',
    litersAdded: '',
    pricePerLiter: '',
    supplier: '',
    notes: '',
    date: new Date().toISOString().split('T')[0],
  });

  /* =========================
     FETCH FUNCTION (centralized)
  ========================= */
  const fetchItems = async (page = pagination.page) => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page,
        limit: pagination.limit,
        ...(filters.fuelType && { fuelType: filters.fuelType }),
        ...(filters.supplier && { supplier: filters.supplier }),
      });

      const res = await apiClient.get(`/inventory?${params}`);

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
    fetchItems(1); // reset page on filter change
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
      ...formData,
      litersAdded: Number(formData.litersAdded),
      pricePerLiter: Number(formData.pricePerLiter),
    };

    try {
      if (editingItem) {
        await apiClient.put(`/inventory/${editingItem._id}`, payload);
      } else {
        await apiClient.post('/inventory', payload);
      }

      setModalOpen(false);
      setEditingItem(null);

      setFormData({
        fuelType: '',
        litersAdded: '',
        pricePerLiter: '',
        supplier: '',
        notes: '',
        date: new Date().toISOString().split('T')[0],
      });

      await fetchItems(1); // ✅ FORCE refresh
    } catch (err) {
      console.error(err);
    }
  };

  /* =========================
     DELETE
  ========================= */
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;

    try {
      await apiClient.delete(`/inventory/${id}`);
      await fetchItems(); // ✅ REAL sync
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
      litersAdded: row.litersAdded || '',
      pricePerLiter: row.pricePerLiter || '',
      supplier: row.supplier || '',
      notes: row.notes || '',
      date: row.date?.split('T')[0] || '',
    });

    setModalOpen(true);
  };

  /* =========================
     TABLE
  ========================= */
  const columns = [
    { key: 'date', label: 'Date', render: (v) => <DateCell date={v} /> },
    { key: 'fuelType', label: 'Fuel Type' },
    { key: 'litersAdded', label: 'Liters' },
    { key: 'pricePerLiter', label: 'Price', render: (v) => <CurrencyCell value={v} /> },
    { key: 'totalCost', label: 'Total', render: (v) => <CurrencyCell value={v} /> },
    { key: 'supplier', label: 'Supplier' },
  ];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Fuel Inventory</h1>

        <Button
          onClick={() => {
            setEditingItem(null);
            setFormData({
              fuelType: '',
              litersAdded: '',
              pricePerLiter: '',
              supplier: '',
              notes: '',
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
        <SearchBar
          placeholder="Supplier..."
          onSearch={(v) =>
            setFilters((prev) => ({ ...prev, supplier: v }))
          }
        />

        <FilterDropdown
          label="Fuel Type"
          options={FUEL_TYPES}
          value={filters.fuelType}
          onChange={(v) =>
            setFilters((prev) => ({ ...prev, fuelType: v }))
          }
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
        title={editingItem ? 'Edit' : 'Add'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Fuel Type"
            value={formData.fuelType}
            onChange={(e) =>
              setFormData((p) => ({ ...p, fuelType: e.target.value }))
            }
            options={FUEL_TYPES}
            required
          />

          <Input
            label="Liters"
            type="number"
            value={formData.litersAdded}
            onChange={(e) =>
              setFormData((p) => ({ ...p, litersAdded: e.target.value }))
            }
            required
          />

          <Input
            label="Price"
            type="number"
            value={formData.pricePerLiter}
            onChange={(e) =>
              setFormData((p) => ({ ...p, pricePerLiter: e.target.value }))
            }
            required
          />

          <Input
            label="Supplier"
            value={formData.supplier}
            onChange={(e) =>
              setFormData((p) => ({ ...p, supplier: e.target.value }))
            }
          />

          <TextArea
            label="Notes"
            value={formData.notes}
            onChange={(e) =>
              setFormData((p) => ({ ...p, notes: e.target.value }))
            }
          />

          <Input
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) =>
              setFormData((p) => ({ ...p, date: e.target.value }))
            }
          />

          <Button type="submit" className="w-full">
            {editingItem ? 'Update' : 'Add'}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default InventoryPage;