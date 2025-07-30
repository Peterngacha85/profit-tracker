import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../api';
import { format } from 'date-fns';
import {
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  User,
  Calendar,
  DollarSign
} from 'lucide-react';
import toast from 'react-hot-toast';

const Debtors = () => {
  const [debtors, setDebtors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDebtor, setEditingDebtor] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    overdue: false,
    search: ''
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  useEffect(() => {
    fetchDebtors();
  }, [filters]);

  const fetchDebtors = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.status) {
        params.append('status', filters.status);
      }
      if (filters.overdue) {
        params.append('overdue', 'true');
      }
      if (filters.search) {
        params.append('search', filters.search);
      }
      const response = await api.get(`/api/debtors?${params}`);
      setDebtors(response.data.data);
    } catch (error) {
      console.error('Error fetching debtors:', error);
      toast.error('Failed to load debtors');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (editingDebtor) {
        await api.put(`/api/debtors/${editingDebtor._id}`, data);
        toast.success('Debtor updated successfully');
      } else {
        await api.post('/api/debtors', data);
        toast.success('Debtor created successfully');
      }
      
      setShowModal(false);
      setEditingDebtor(null);
      reset();
      fetchDebtors();
    } catch (error) {
      console.error('Error saving debtor:', error);
      toast.error('Failed to save debtor');
    }
  };

  const handleMarkAsPaid = async (id) => {
    try {
      await api.patch(`/api/debtors/${id}/mark-paid`);
      toast.success('Debtor marked as paid');
      fetchDebtors();
    } catch (error) {
      console.error('Error marking as paid:', error);
      toast.error('Failed to mark as paid');
    }
  };

  const handleEdit = (debtor) => {
    setEditingDebtor(debtor);
    reset({
      clientName: debtor.clientName,
      amount: debtor.amount,
      dueDate: format(new Date(debtor.dueDate), 'yyyy-MM-dd'),
      transactionDate: format(new Date(debtor.transactionDate), 'yyyy-MM-dd')
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this debtor?')) {
      try {
        await api.delete(`/api/debtors/${id}`);
        toast.success('Debtor deleted successfully');
        fetchDebtors();
      } catch (error) {
        console.error('Error deleting debtor:', error);
        toast.error('Failed to delete debtor');
      }
    }
  };

  const openModal = () => {
    setEditingDebtor(null);
    reset();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingDebtor(null);
    reset();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusBadge = (debtor) => {
    if (debtor.status === 'paid') {
      return <span className="badge badge-success">Paid</span>;
    }
    
    if (debtor.isOverdue) {
      return <span className="badge badge-danger">{debtor.daysOverdue} days overdue</span>;
    }
    
    return <span className="badge badge-warning">Unpaid</span>;
  };

  return (
    <div className="space-y-6 px-2 sm:px-0 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-y-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Debtors</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage clients who owe you money
          </p>
        </div>
        <button
          onClick={openModal}
          className="btn-primary mt-4 sm:mt-0"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Debtor
        </button>
      </div>

      {/* Filters */}
      <div className="card w-full">
        <div className="card-body">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="input"
              >
                <option value="">All Status</option>
                <option value="unpaid">Unpaid</option>
                <option value="paid">Paid</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search by Name
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={e => setFilters({ ...filters, search: e.target.value })}
                className="input"
                placeholder="Enter client name..."
              />
            </div>
            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.overdue}
                  onChange={(e) => setFilters({ ...filters, overdue: e.target.checked })}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">Show overdue only</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Debtors List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="space-y-4 w-full">
          {debtors.length === 0 ? (
            <div className="text-center py-12">
              <User className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">No debtors found</p>
            </div>
          ) : (
            [...debtors]
              .sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate))
              .map((debtor) => (
                <div key={debtor._id} className="card">
                <div className="card-body">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary-600" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{debtor.clientName}</h3>
                        <div className="flex items-center space-x-4 mt-1">
                          {getStatusBadge(debtor)}
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            Due: {format(new Date(debtor.dueDate), 'MMM dd, yyyy')}
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Transaction: {format(new Date(debtor.transactionDate), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-semibold text-gray-900">
                        {formatCurrency(debtor.amount)}
                      </span>
                      <div className="flex space-x-1">
                        {debtor.status === 'unpaid' && (
                          <button
                            onClick={() => handleMarkAsPaid(debtor._id)}
                            className="p-1 text-gray-400 hover:text-success-600"
                            title="Mark as paid"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleEdit(debtor)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(debtor._id)}
                          className="p-1 text-gray-400 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-2 sm:px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={closeModal}></div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full max-w-lg">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="card-header">
                  <h3 className="text-lg font-medium text-gray-900">
                    {editingDebtor ? 'Edit Debtor' : 'Add Debtor'}
                  </h3>
                </div>
                <div className="card-body space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Client Name</label>
                    <input
                      type="text"
                      {...register('clientName', { required: 'Client name is required' })}
                      className="input mt-1"
                      placeholder="Enter client name"
                    />
                    {errors.clientName && (
                      <p className="mt-1 text-sm text-danger-600">{errors.clientName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Amount</label>
                    <input
                      type="number"
                      step="0.01"
                      {...register('amount', { 
                        required: 'Amount is required',
                        min: { value: 0, message: 'Amount must be positive' }
                      })}
                      className="input mt-1"
                      placeholder="0.00"
                    />
                    {errors.amount && (
                      <p className="mt-1 text-sm text-danger-600">{errors.amount.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Due Date</label>
                    <input
                      type="date"
                      {...register('dueDate', { required: 'Due date is required' })}
                      className="input mt-1"
                    />
                    {errors.dueDate && (
                      <p className="mt-1 text-sm text-danger-600">{errors.dueDate.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Transaction Date</label>
                    <input
                      type="date"
                      {...register('transactionDate', { required: 'Transaction date is required' })}
                      className="input mt-1"
                    />
                    {errors.transactionDate && (
                      <p className="mt-1 text-sm text-danger-600">{errors.transactionDate.message}</p>
                    )}
                  </div>
                </div>
                <div className="card-header flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    {editingDebtor ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Debtors; 