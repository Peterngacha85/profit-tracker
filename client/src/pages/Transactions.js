import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../api';
import { format } from 'date-fns';
import {
  Plus,
  Edit,
  Trash2,
  Filter,
  Calendar,
  DollarSign,
  FileText
} from 'lucide-react';
import toast from 'react-hot-toast';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    type: ''
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm();

  const selectedType = watch('type');

  useEffect(() => {
    fetchTransactions();
  }, [activeTab, filters]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (activeTab !== 'all') {
        params.append('type', activeTab);
      }
      
      if (filters.startDate) {
        params.append('startDate', filters.startDate);
      }
      
      if (filters.endDate) {
        params.append('endDate', filters.endDate);
      }

      const response = await api.get(`/api/transactions?${params}`);
      setTransactions(response.data.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      let submitData = { ...data };
      // Only send category for expense type
      if (submitData.type !== 'expense') {
        delete submitData.category;
      }
      if (editingTransaction) {
        await api.put(`/api/transactions/${editingTransaction._id}`, submitData);
        toast.success('Transaction updated successfully');
      } else {
        await api.post('/api/transactions', submitData);
        toast.success('Transaction created successfully');
      }
      
      setShowModal(false);
      setEditingTransaction(null);
      reset();
      fetchTransactions();
    } catch (error) {
      console.error('Error saving transaction:', error);
      toast.error('Failed to save transaction');
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    reset({
      type: transaction.type,
      category: transaction.category || '',
      amount: transaction.amount,
      description: transaction.description || '',
      transactionDate: format(new Date(transaction.transactionDate), 'yyyy-MM-dd')
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await api.delete(`/api/transactions/${id}`);
        toast.success('Transaction deleted successfully');
        fetchTransactions();
      } catch (error) {
        console.error('Error deleting transaction:', error);
        toast.error('Failed to delete transaction');
      }
    }
  };

  const openModal = () => {
    setEditingTransaction(null);
    reset();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTransaction(null);
    reset();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'sale':
        return 'bg-success-100 text-success-800';
      case 'delivery_fee':
        return 'bg-primary-100 text-primary-800';
      case 'expense':
        return 'bg-danger-100 text-danger-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const tabs = [
    { id: 'all', name: 'All Transactions' },
    { id: 'sale', name: 'Sales' },
    { id: 'delivery_fee', name: 'Delivery Fees' },
    { id: 'expense', name: 'Expenses' }
  ];

  // Dynamic category options based on selected type
  let categoryOptions = [];
  if (selectedType === 'sale') {
    categoryOptions = ['sales'];
  } else if (selectedType === 'delivery_fee') {
    categoryOptions = ['delivery_fee'];
  } else if (selectedType === 'expense') {
    categoryOptions = [
      'fuel',
      'driver',
      'car_owner',
      'turni boys',
      'repairs',
      'miscellaneous',
      'traffic_fines'
    ];
  }

  return (
    <div className="space-y-6 px-2 sm:px-0 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-y-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your sales, delivery fees, and expenses
          </p>
        </div>
        <button
          onClick={openModal}
          className="btn-primary mt-4 sm:mt-0"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Transaction
        </button>
      </div>

      {/* Filters */}
      <div className="card w-full">
        <div className="card-body">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className="input"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="input"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="input"
              >
                <option value="">All Types</option>
                <option value="sale">Sales</option>
                <option value="delivery_fee">Delivery Fees</option>
                <option value="expense">Expenses</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 overflow-x-auto">
        <nav className="-mb-px flex space-x-4 sm:space-x-8 w-full">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Transactions List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="space-y-4 w-full">
          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">No transactions found</p>
            </div>
          ) : (
            transactions.map((transaction) => (
              <div key={transaction._id} className="card">
                <div className="card-body">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <DollarSign className="h-5 w-5 text-primary-600" />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className={`badge ${getTypeColor(transaction.type)}`}>
                            {transaction.type.replace('_', ' ').toUpperCase()}
                          </span>
                          {transaction.category && (
                            <span className="badge badge-primary">
                              {transaction.category.replace('_', ' ').toUpperCase()}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {format(new Date(transaction.transactionDate), 'MMM dd, yyyy')}
                        </p>
                        {transaction.description && (
                          <p className="text-sm text-gray-600 mt-1">{transaction.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-semibold text-gray-900">
                        {formatCurrency(transaction.amount)}
                      </span>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleEdit(transaction)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(transaction._id)}
                          className="p-1 text-gray-400 hover:text-red-600"
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
                    {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
                  </h3>
                </div>
                <div className="card-body space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <select
                      {...register('type', { required: 'Type is required' })}
                      className="input mt-1"
                    >
                      <option value="">Select Type</option>
                      <option value="sale">Sale</option>
                      <option value="delivery_fee">Delivery Fee</option>
                      <option value="expense">Expense</option>
                    </select>
                    {errors.type && (
                      <p className="mt-1 text-sm text-danger-600">{errors.type.message}</p>
                    )}
                  </div>

                  {/* Category dropdown dynamically filtered by type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                      {...register('category', { required: selectedType === 'expense' })}
                      className="input mt-1"
                      disabled={!selectedType}
                    >
                      <option value="">{selectedType ? 'Select Category' : 'Select type first'}</option>
                      {categoryOptions.map((category) => (
                        <option key={category} value={category}>
                          {category.replace('_', ' ').replace('turni boys', 'Turni Boys').replace('sales', 'Sales').replace('delivery_fee', 'Delivery Fee').replace('fuel', 'Fuel').replace('driver', 'Driver').replace('car_owner', 'Car Owner').replace('repairs', 'Repairs').replace('miscellaneous', 'Miscellaneous').replace('traffic_fines', 'Traffic Fines')}
                        </option>
                      ))}
                    </select>
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
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      {...register('description')}
                      rows={3}
                      className="input mt-1"
                      placeholder="Optional description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Transaction Date</label>
                    <input
                      type="date"
                      {...register('transactionDate', { required: 'Date is required' })}
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
                    {editingTransaction ? 'Update' : 'Create'}
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

export default Transactions; 