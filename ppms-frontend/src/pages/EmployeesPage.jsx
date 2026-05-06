import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DataTable } from '../components/ui/DataTable';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { useToast } from '../components/ui/Toast';
import { SearchBar, FilterDropdown } from '../components/shared/Filters';
import apiClient from '../services/apiClient';
import { EMPLOYEE_ROLES } from '../constants';
import { setEmployeeData, setPagination } from '../app/slices/employeeSlice';

export const EmployeesPage = () => {
  const dispatch = useDispatch();
  const { data: employees, loading, pagination } = useSelector((state) => state.employee);
  const { user } = useSelector((state) => state.auth);
  const { show: showToast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [filters, setFilters] = useState({
    role: null,
    isActive: true,
  });

  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, id: null });

  const [formData, setFormData] = useState({
    fullName: '',
    cnic: '',
    contactNumber: '',
    role: '',
    monthlySalary: '',
    joiningDate: new Date().toISOString().split('T')[0],
    isActive: true,
  });

  /* =========================
     DEBOUNCE SEARCH
  ========================= */
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      dispatch(setPagination({ page: 1 }));
    }, 400);

    return () => clearTimeout(t);
  }, [searchTerm]);

  /* =========================
     FETCH
  ========================= */
  const fetchEmployees = async () => {
    try {
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...(debouncedSearch && { name: debouncedSearch }),
        ...(filters.role && { role: filters.role }),
        ...(filters.isActive !== null && { isActive: filters.isActive }),
      });

      const res = await apiClient.get(`/employees?${params}`);

      if (res.data?.success) {
        dispatch(setEmployeeData({
          data: res.data.data.data || [],
          pagination: res.data.data.pagination || pagination,
        }));
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Fetch failed', 'error');
    }
  };

  /* =========================
     EFFECT
  ========================= */
  useEffect(() => {
    fetchEmployees();
  }, [pagination.page, debouncedSearch, filters]);

  /* =========================
     CRUD
  ========================= */
  const handleDelete = async () => {
    try {
      await apiClient.delete(`/employees/${confirmDialog.id}`);
      showToast('Deleted', 'success');
      fetchEmployees();
    } catch (err) {
      showToast('Delete failed', 'error');
    } finally {
      setConfirmDialog({ isOpen: false, id: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: formData.fullName,
      phone: formData.contactNumber,
      salary: Number(formData.monthlySalary),
      role: formData.role,
      cnic: formData.cnic,
      joiningDate: formData.joiningDate,
      isActive: formData.isActive,
    };

    try {
      if (editingEmployee) {
        await apiClient.put(`/employees/${editingEmployee._id}`, payload);
      } else {
        await apiClient.post('/employees', payload);
      }

      setModalOpen(false);
      fetchEmployees();

    } catch (err) {
      showToast('Operation failed', 'error');
    }
  };

  const handleEdit = (emp) => {
    setEditingEmployee(emp);

    setFormData({
      fullName: emp.name || '',
      cnic: emp.cnic || '',
      contactNumber: emp.phone || '',
      role: emp.role || '',
      monthlySalary: emp.salary || '',
      joiningDate: emp.joiningDate?.split('T')[0] || '',
      isActive: emp.isActive,
    });

    setModalOpen(true);
  };

  /* =========================
     TABLE
  ========================= */
  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'cnic', label: 'CNIC', render: v => v || '—' },
    { key: 'role', label: 'Role' },
    { key: 'phone', label: 'Phone' },
    { key: 'salary', label: 'Salary', render: v => `₨ ${v?.toLocaleString()}` },
    { key: 'isActive', label: 'Status', render: v => v ? 'Active' : 'Inactive' },
  ];

  return (
    <div className="space-y-6">

      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Employees</h1>
        <Button onClick={() => {
          setEditingEmployee(null);
          setFormData({
            fullName: '',
            cnic: '',
            contactNumber: '',
            role: '',
            monthlySalary: '',
            joiningDate: new Date().toISOString().split('T')[0],
            isActive: true,
          });
          setModalOpen(true);
        }}>+ Add</Button>
      </div>

      <Card className="p-4 flex gap-4 flex-wrap">
        <SearchBar placeholder="Search..." onSearch={setSearchTerm} />

        <FilterDropdown
          label="Role"
          options={EMPLOYEE_ROLES}
          value={filters.role}
          onChange={(v) => {
            setFilters(prev => ({ ...prev, role: v }));
            dispatch(setPagination({ page: 1 }));
          }}
        />

        <FilterDropdown
          label="Status"
          options={[
            { value: true, label: 'Active' },
            { value: false, label: 'Inactive' },
          ]}
          value={filters.isActive}
          onChange={(v) => {
            setFilters(prev => ({ ...prev, isActive: v }));
            dispatch(setPagination({ page: 1 }));
          }}
        />
      </Card>

      <Card>
        <DataTable
          columns={columns}
          data={employees}
          loading={loading}
          pagination={pagination}
          onPageChange={(p) => dispatch(setPagination({ page: p }))}
          rowActions={(row) => [
            { label: 'Edit', onClick: () => handleEdit(row) },
            user?.role === 'admin' && {
              label: 'Delete',
              onClick: () => setConfirmDialog({ isOpen: true, id: row._id }),
              isDanger: true,
            }
          ].filter(Boolean)}
        />
      </Card>

      <Modal isOpen={modalOpen} onClose={() => {
        setModalOpen(false);
        setEditingEmployee(null);
      }} title={editingEmployee ? 'Edit Employee' : 'Add Employee'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Full Name" value={formData.fullName}
            onChange={e => setFormData(p => ({ ...p, fullName: e.target.value }))} required />

          <Input label="CNIC (12345-1234567-1)" value={formData.cnic}
            onChange={e => setFormData(p => ({ ...p, cnic: e.target.value }))} required />

          <Input label="Phone" value={formData.contactNumber}
            onChange={e => setFormData(p => ({ ...p, contactNumber: e.target.value }))} required />

          <Select label="Role" value={formData.role}
            onChange={e => setFormData(p => ({ ...p, role: e.target.value }))} options={EMPLOYEE_ROLES} required />

          <Input label="Monthly Salary" type="number" value={formData.monthlySalary}
            onChange={e => setFormData(p => ({ ...p, monthlySalary: e.target.value }))} required />

          <Input label="Joining Date" type="date" value={formData.joiningDate}
            onChange={e => setFormData(p => ({ ...p, joiningDate: e.target.value }))} required />

          <Button type="submit" className="w-full">{editingEmployee ? 'Update' : 'Add'}</Button>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDialog({ isOpen: false, id: null })}
      />
    </div>
  );
};

export default EmployeesPage;