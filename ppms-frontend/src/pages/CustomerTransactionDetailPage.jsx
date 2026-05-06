import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Input, Select, TextArea } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { useToast } from '../components/ui/Toast';
import apiClient from '../services/apiClient';

export const CustomerTransactionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentCustomer, transactions } = useSelector((state) => state.ledger);
  const { user } = useSelector((state) => state.auth);
  const { show: showToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, txId: null });

  const [formData, setFormData] = useState({
    transactionType: 'Udhar', // FIXED
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (id) fetchCustomerData();
  }, [id]);

  const fetchCustomerData = async () => {
    try {
      setLoading(true);

      const response = await apiClient.get(`/ledger/${id}`);
      console.log(response.data)
      const payload = response.data?.data;

      if (!payload) {
        throw new Error('No data returned');
      }

      // backend returns customer directly
      dispatch({
        type: 'ledger/setCurrentCustomer',
        payload: payload,
      });

      // transactions are inside customer
      dispatch({
        type: 'ledger/setTransactions',
        payload: payload.transactions || [],
      });

    } catch (error) {
      showToast('Customer not found', 'error');
      navigate('/ledger');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = () => {
    setFormData({
      transactionType: 'Udhar',
      description: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        amount: Number(formData.amount),
      };

      const response = await apiClient.post(`/ledger/${id}/transaction`, payload);

      if (response.data?.success) {
        const { transaction, newBalance } = response.data.data;

        dispatch({
          type: 'ledger/setTransactions',
          payload: [...(transactions || []), transaction],
        });

        dispatch({
          type: 'ledger/setCurrentCustomer',
          payload: {
            ...currentCustomer,
            balance: newBalance,
          },
        });

        showToast('Transaction added successfully', 'success');
        setModalOpen(false);
      }
    } catch (error) {
      showToast('Failed to add transaction', 'error');
    }
  };

  const handleDeleteTransaction = async () => {
    if (!confirmDialog.txId) return;

    try {
      const response = await apiClient.delete(`/ledger/${id}/transaction/${confirmDialog.txId}`);

      if (response.data?.success) {
        const { newBalance } = response.data.data;

        dispatch({
          type: 'ledger/setTransactions',
          payload: transactions.filter((t) => t._id !== confirmDialog.txId),
        });

        dispatch({
          type: 'ledger/setCurrentCustomer',
          payload: {
            ...currentCustomer,
            balance: newBalance,
          },
        });

        showToast('Transaction deleted successfully', 'success');
      }
    } catch {
      showToast('Failed to delete transaction', 'error');
    } finally {
      setConfirmDialog({ isOpen: false, txId: null });
    }
  };

  const getTransactionColor = (type) => {
    const colors = {
      Udhar: 'bg-danger-50 text-danger-700',
      Wapsi: 'bg-success-50 text-success-700',
      NIL: 'bg-neutral-50 text-neutral-700',
    };
    return colors[type] || 'bg-neutral-50 text-neutral-700';
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!currentCustomer) {
    return <div className="text-center py-12">Customer not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button onClick={() => navigate('/ledger')} className="btn-secondary">
          ← Back
        </Button>
        <div>
          {/* FIXED */}
          <h1 className="text-3xl font-bold text-neutral-900">
            {currentCustomer.personName}
          </h1>
          <p className="text-neutral-600 text-sm mt-1">
            {currentCustomer.phoneNumber}
          </p>
        </div>
      </div>

      <Card className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-neutral-600 text-sm font-medium">Current Balance</p>
            <p className={`text-4xl font-bold mt-2 ${currentCustomer.balance > 0 ? 'text-danger-600' :
                currentCustomer.balance < 0 ? 'text-success-600' :
                  'text-neutral-600'
              }`}>
              ₨ {currentCustomer.balance?.toLocaleString() || '0'}
            </p>
          </div>
          <Button onClick={handleAddTransaction} className="btn-primary">
            + Add Transaction
          </Button>
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold">Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold">Description</th>
                <th className="px-6 py-3 text-right text-xs font-semibold">Amount</th>
                <th className="px-6 py-3 text-right text-xs font-semibold">Balance</th>
                <th className="px-6 py-3 text-center text-xs font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-6">No transactions</td>
                </tr>
              ) : (
                (transactions || [])
                  .filter(Boolean)
                  .map((tx) => (
                    <tr key={tx._id}>
                      <td className="px-6 py-4">{new Date(tx.date).toLocaleDateString()}</td>

                      {/* FIXED */}
                      <td className="px-6 py-4">
                        <span className={getTransactionColor(tx.transactionType)}>
                          {tx.transactionType}
                        </span>
                      </td>

                      <td className="px-6 py-4">{tx.description}</td>
                      <td className="px-6 py-4 text-right">₨ {tx.amount}</td>
                      <td className="px-6 py-4 text-right">{tx.netBalance}</td>

                      <td className="px-6 py-4 text-center">
                        {user?.role === 'admin' && (
                          <button
                            onClick={() => setConfirmDialog({ isOpen: true, txId: tx._id })}
                            className="text-danger-600 text-xs"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Transaction">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Type"
            value={formData.transactionType}
            onChange={(e) => setFormData({ ...formData, transactionType: e.target.value })}
            options={[
              { value: 'Udhar', label: 'Udhar' },
              { value: 'Wapsi', label: 'Wapsi' },
              { value: 'NIL', label: 'NIL' },
            ]}
          />
          <TextArea
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
          <Input
            label="Amount"
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
          />
          <Button type="submit">Create</Button>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Delete Transaction"
        message="Are you sure?"
        onConfirm={handleDeleteTransaction}
        onCancel={() => setConfirmDialog({ isOpen: false, txId: null })}
        isDanger
      />
    </div>
  );
};

export default CustomerTransactionDetailPage;