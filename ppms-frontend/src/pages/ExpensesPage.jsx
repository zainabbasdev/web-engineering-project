import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DataTable } from '../components/ui/DataTable';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Input, Select, TextArea } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { useToast } from '../components/ui/Toast';
import { SearchBar, FilterDropdown } from '../components/shared/Filters';
import apiClient from '../services/apiClient';
import { EXPENSE_CATEGORIES } from '../constants';

/**
 * ExpensesPage - Operational expense management
 */
export const ExpensesPage = () => {
  const dispatch = useDispatch();
  const { data: expenses, loading, pagination } = useSelector((state) => state.expense);
  const { user } = useSelector((state) => state.auth);
  const { show: showToast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ category: null, month: null });
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, id: null });
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
  });

  // Fetch expenses
  useEffect(() => {
    fetchExpenses();
  }, [pagination.page, filters]);

  const fetchExpenses = async () => {
    try {
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...(searchTerm && { description: searchTerm }),
        ...(filters.category && { category: filters.category }),
        ...(filters.month && { month: filters.month }),
      });

      const response = await apiClient.get(`/expenses?${params}`);
      if (response.data?.success) {
        dispatch({
          type: 'expense/setExpenseData',
          payload: {
            data: response.data.data?.data || [],
            pagination: response.data.data?.pagination || pagination,
          },
        });
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to fetch expenses', 'error');
    }
  };

  const handleAddClick = () => {
    setEditingExpense(null);
    setFormData({
      category: '',
      description: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
    });
    setModalOpen(true);
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setFormData({
      category: expense.category || '',
      description: expense.description || '',
      amount: expense.amount || '',
      date: expense.date ? expense.date.split('T')[0] : new Date().toISOString().split('T')[0],
    });
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!confirmDialog.id) return;

    try {
      const response = await apiClient.delete(`/expenses/${confirmDialog.id}`);
      if (response.data?.success) {
        setExpenses(expenses.filter((e) => e._id !== confirmDialog.id));
        showToast('Expense deleted successfully', 'success');
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to delete expense', 'error');
    } finally {
      setConfirmDialog({ isOpen: false, id: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Convert numeric fields to numbers
      const submitData = {
        ...formData,
        amount: parseFloat(formData.amount) || 0,
      };

      if (editingExpense) {
        const response = await apiClient.put(`/expenses/${editingExpense._id}`, submitData);
        if (response.data?.success) {
          const updated = expenses.map((e) => (e._id === editingExpense._id ? response.data.data : e));
          setExpenses(updated);
          showToast('Expense updated successfully', 'success');
        }
      } else {
        const response = await apiClient.post('/expenses', submitData);
        if (response.data?.success) {
          const newExpense =
            response.data.data?.expense ||
            response.data.data ||
            response.data;

          setExpenses([newExpense, ...expenses]);
          showToast('Expense added successfully', 'success');
        }
      }
      setModalOpen(false);
    } catch (error) {
      showToast(error.response?.data?.message || 'Operation failed', 'error');
    }
  };

  const setExpenses = (newData) => {
    dispatch({ type: 'expense/setExpenseData', payload: { data: newData, pagination } });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Electricity': 'bg-warning-100 text-warning-700',
      'Maintenance': 'bg-primary-100 text-primary-700',
      'Salary': 'bg-success-100 text-success-700',
      'Miscellaneous': 'bg-neutral-100 text-neutral-700',
    };
    return colors[category] || 'bg-neutral-100 text-neutral-700';
  };

  const columns = [
    { key: 'date', label: 'Date', sortable: true, render: (val) => new Date(val).toLocaleDateString() },
    {
      key: 'category',
      label: 'Category',
      render: (val) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(val)}`}>
          {val}
        </span>
      ),
    },
    { key: 'description', label: 'Description', render: (val) => val || '—' },
    {
      key: 'amount',
      label: 'Amount (PKR)',
      render: (val) => `₨ ${val?.toLocaleString() || '0'}`,
    },
  ];

  const actions = [
    {
      label: 'Edit',
      onClick: (row) => handleEdit(row),
      visible: true,
    },
    {
      label: 'Delete',
      onClick: (row) => {
        if (user?.role === 'admin') {
          setConfirmDialog({ isOpen: true, id: row._id });
        } else {
          showToast('Only admins can delete expenses', 'warning');
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
          <h1 className="text-3xl font-bold text-neutral-900">Expenses</h1>
          <p className="text-neutral-600 text-sm mt-1">Track operational costs and expenditures</p>
        </div>
        <Button onClick={handleAddClick} className="btn-primary">
          + Add Expense
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex gap-4 flex-wrap">
          <SearchBar
            placeholder="Search by description..."
            onSearch={setSearchTerm}
          />
          <FilterDropdown
            label="Category"
            options={EXPENSE_CATEGORIES}
            value={filters.category}
            onChange={(value) => setFilters({ ...filters, category: value })}
          />
          <Input
            type="month"
            value={filters.month}
            onChange={(e) => setFilters({ ...filters, month: e.target.value })}
            placeholder="Select month"
          />
        </div>
      </Card>

      {/* Table */}
      <Card>
        <DataTable
          columns={columns}
          data={expenses}
          actions={actions}
          loading={loading}
          pagination={pagination}
          onPageChange={(page) => dispatch({ type: 'expense/setPagination', payload: { page } })}
        />
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingExpense ? 'Edit Expense' : 'Add Expense'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            options={EXPENSE_CATEGORIES}
            required
          />
          <TextArea
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="E.g., Monthly electricity bill, pump maintenance"
            required
          />
          <Input
            label="Amount (PKR)"
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            required
          />
          <Input
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1">
              {editingExpense ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Delete Expense"
        message="Are you sure you want to delete this expense? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setConfirmDialog({ isOpen: false, id: null })}
        isDanger
      />
    </div>
  );
};

export default ExpensesPage;
