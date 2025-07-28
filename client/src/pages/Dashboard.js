import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [debtorAnalytics, setDebtorAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');

  useEffect(() => {
    fetchDashboardData();
  }, [period]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, debtorRes] = await Promise.all([
        axios.get(`/api/transactions/analytics?period=${period}`),
        axios.get('/api/debtors/analytics')
      ]);

      setAnalytics(analyticsRes.data.data);
      setDebtorAnalytics(debtorRes.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6', '#06b6d4'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!analytics || !debtorAnalytics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  const { summary, expenseBreakdown, dailyData } = analytics;
  const { summary: debtorSummary, overdueDebtors } = debtorAnalytics;

  // Prepare data for charts
  const expenseChartData = Object.entries(expenseBreakdown).map(([category, amount]) => ({
    name: category.replace('_', ' ').toUpperCase(),
    value: amount
  }));

  const dailyChartData = dailyData.slice(-7); // Last 7 days

  const summaryCards = [
    {
      title: 'Total Income',
      value: formatCurrency(summary.totalIncome),
      change: '+12.5%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'bg-success-500'
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(summary.totalExpenses),
      change: '+8.2%',
      changeType: 'negative',
      icon: TrendingDown,
      color: 'bg-danger-500'
    },
    {
      title: 'Net Profit',
      value: formatCurrency(summary.netProfit),
      change: summary.netProfit >= 0 ? '+15.3%' : '-5.2%',
      changeType: summary.netProfit >= 0 ? 'positive' : 'negative',
      icon: TrendingUp,
      color: summary.netProfit >= 0 ? 'bg-success-500' : 'bg-danger-500'
    },
    {
      title: 'Outstanding Debt',
      value: formatCurrency(debtorSummary.totalDebt),
      change: debtorSummary.overdueCount > 0 ? `${debtorSummary.overdueCount} overdue` : 'All paid',
      changeType: debtorSummary.overdueCount > 0 ? 'negative' : 'positive',
      icon: Users,
      color: debtorSummary.overdueCount > 0 ? 'bg-warning-500' : 'bg-success-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Overview of your delivery business performance
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="input w-full sm:w-auto"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-y-4 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {summaryCards.map((card, index) => (
          <div key={index} className="card w-full">
            <div className="card-body">
              <div className="flex items-center">
                <div className={`flex-shrink-0 p-3 rounded-lg ${card.color}`}>
                  <card.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-500">{card.title}</p>
                  <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center">
                {card.changeType === 'positive' ? (
                  <ArrowUpRight className="h-4 w-4 text-success-500" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-danger-500" />
                )}
                <span
                  className={`ml-1 text-sm font-medium ${
                    card.changeType === 'positive' ? 'text-success-600' : 'text-danger-600'
                  }`}
                >
                  {card.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-y-4 lg:grid-cols-2 gap-6 w-full">
        {/* Income vs Expenses Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Income vs Expenses</h3>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => format(new Date(date), 'MMM dd')}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value) => formatCurrency(value)}
                  labelFormatter={(date) => format(new Date(date), 'MMM dd, yyyy')}
                />
                <Bar dataKey="income" fill="#10b981" name="Income" />
                <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Profit Trend Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Profit Trend</h3>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => format(new Date(date), 'MMM dd')}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value) => formatCurrency(value)}
                  labelFormatter={(date) => format(new Date(date), 'MMM dd, yyyy')}
                />
                <Line 
                  type="monotone" 
                  dataKey="profit" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Profit"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Expense Breakdown and Overdue Debtors */}
      <div className="grid grid-cols-1 gap-y-4 lg:grid-cols-2 gap-6 w-full">
        {/* Expense Breakdown */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Expense Breakdown</h3>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expenseChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Overdue Debtors */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Overdue Debtors</h3>
          </div>
          <div className="card-body">
            {overdueDebtors.length > 0 ? (
              <div className="space-y-4">
                {overdueDebtors.map((debtor) => (
                  <div key={debtor._id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{debtor.clientName}</p>
                      <p className="text-sm text-gray-500">
                        Due: {format(new Date(debtor.dueDate), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-red-600">
                        {formatCurrency(debtor.amount)}
                      </p>
                      <p className="text-xs text-red-500">
                        {debtor.daysOverdue} days overdue
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">No overdue debtors</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 