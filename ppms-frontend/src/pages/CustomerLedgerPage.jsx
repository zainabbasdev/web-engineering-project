import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '../components/ui/DataTable';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { useToast } from '../components/ui/Toast';
import { SearchBar } from '../components/shared/Filters';
import apiClient from '../services/apiClient';

/**
 * CustomerLedgerPage - Customer credit ledger management
 */
export const CustomerLedgerPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { customers, loading, pagination } = useSelector((state) => state.ledger);
  const { user } = useSelector((state) => state.auth);
  const { show: showToast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, id: null });
  const [formData, setFormData] = useState({
    personName: '',
    phoneNumber: '',
    address: '',
  });

  // Fetch customers
  useEffect(() => {
    fetchCustomers();
  }, [pagination.page, searchTerm]);

const fetchCustomers = async () => {
  try {
    const params = new URLSearchParams({
      page: pagination.page,
      limit: pagination.limit,
      ...(searchTerm && { search: searchTerm }),
    });

    const response = await apiClient.get(`/ledger?${params}`);
    const customersData = response.data?.data?.data || [];
    const paginationData = response.data?.data?.pagination || pagination;

    dispatch({
      type: 'ledger/setCustomersData',
      payload: {
        data: customersData,
        pagination: paginationData,
      },
    });

  } catch (error) {
    showToast(error.response?.data?.message || 'Failed to fetch customers', 'error');
  }
};

  const handleAddClick = () => {
    setFormData({ personName: '', phoneNumber: '', address: '' });
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!confirmDialog.id) return;

    try {
      await apiClient.delete(`/ledger/${confirmDialog.id}`);

      setCustomers(customers.filter((c) => c._id !== confirmDialog.id));

      showToast('Customer deleted successfully', 'success');
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to delete customer', 'error');
    } finally {
      setConfirmDialog({ isOpen: false, id: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await apiClient.post('/ledger', formData);

      const newCustomer = response.data?.data || response.data;

      await fetchCustomers();   // always sync with server

      showToast('Customer added successfully', 'success');

      setModalOpen(false);
      setFormData({ personName: '', phoneNumber: '', address: '' });
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to add customer', 'error');
    }
  };

  const setCustomers = (newData) => {
    dispatch({
      type: 'ledger/setCustomersData',
      payload: { data: newData, pagination },
    });
  };

  const getBalanceColor = (balance) => {
    if (balance > 0) return 'text-danger-600';
    if (balance < 0) return 'text-success-600';
    return 'text-neutral-600';
  };

  const columns = [
    { key: 'personName', label: 'Customer Name', sortable: true },
    { key: 'phoneNumber', label: 'Phone', render: (val) => val || '—' },
    {
      key: 'balance',
      label: 'Outstanding Balance (PKR)',
      render: (val) => (
        <span className={`font-semibold ${getBalanceColor(val)}`}>
          ₨ {val?.toLocaleString() || '0'}
        </span>
      ),
    },
  ];

  const actions = [
    {
      label: 'View Details',
      onClick: (row) => navigate(`/ledger/${row._id}`),
      visible: true,
    },
    {
      label: 'Delete',
      onClick: (row) => {
        if (user?.role === 'admin') {
          setConfirmDialog({ isOpen: true, id: row._id });
        } else {
          showToast('Only admins can delete customers', 'warning');
        }
      },
      visible: user?.role === 'admin',
      isDanger: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Customer Ledger</h1>
          <p className="text-neutral-600 text-sm mt-1">Manage customer credit accounts (Khata)</p>
        </div>
        <Button onClick={handleAddClick} className="btn-primary">
          + New Customer
        </Button>
      </div>

      {/* Search */}
      <Card className="p-4">
        <SearchBar
          placeholder="Search by name or phone..."
          onSearch={setSearchTerm}
        />
      </Card>

      {/* Table */}
      <Card>
        <DataTable
          columns={columns}
          data={customers}
          actions={actions}
          loading={loading}
          pagination={pagination}
          onPageChange={(page) =>
            dispatch({ type: 'ledger/setPagination', payload: { page } })
          }
        />
      </Card>

      {/* Add Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setFormData({ personName: '', phoneNumber: '', address: '' });
        }}
        title="Add New Customer"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Customer Name"
            type="text"
            value={formData.personName}
            onChange={(e) => setFormData({ ...formData, personName: e.target.value })}
            required
          />
          <Input
            label="Phone Number"
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            required
          />
          <Input
            label="Address"
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="Optional"
          />
          <Button type="submit" className="w-full">
            Add Customer
          </Button>
        </form>
      </Modal>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Delete Customer"
        message="Are you sure you want to delete this customer? All transactions will be removed."
        onConfirm={handleDelete}
        onCancel={() => setConfirmDialog({ isOpen: false, id: null })}
        isDanger
      />
    </div>
  );
};

export default CustomerLedgerPage;