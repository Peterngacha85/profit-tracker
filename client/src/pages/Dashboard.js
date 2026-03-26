import React, { useState, useEffect } from 'react';
import api from '../api';
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
        api.get(`/api/transactions/analytics?period=${period}`),
        api.get('/api/debtors/analytics')
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
      color: 'text-success-500',
      bgColor: 'bg-success-50'
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(summary.totalExpenses),
      change: '+8.2%',
      changeType: 'negative',
      icon: TrendingDown,
      color: 'text-red-500',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Net Profit',
      value: formatCurrency(summary.netProfit),
      change: summary.netProfit >= 0 ? '+15.3%' : '-5.2%',
      changeType: summary.netProfit >= 0 ? 'positive' : 'negative',
      icon: TrendingUp,
      color: summary.netProfit >= 0 ? 'text-brand-500' : 'text-red-500',
      bgColor: summary.netProfit >= 0 ? 'bg-brand-50' : 'bg-red-50'
    },
    {
      title: 'Outstanding Debt',
      value: formatCurrency(debtorSummary.totalDebt),
      change: debtorSummary.overdueCount > 0 ? `${debtorSummary.overdueCount} overdue` : 'All paid',
      changeType: debtorSummary.overdueCount > 0 ? 'negative' : 'positive',
      icon: Users,
      color: debtorSummary.overdueCount > 0 ? 'text-amber-500' : 'text-success-500',
      bgColor: debtorSummary.overdueCount > 0 ? 'bg-amber-50' : 'bg-success-50'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Dashboard</h1>
          <p className="mt-2 text-lg text-gray-500 font-medium">
            Manage your delivery business with real-time insights
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Period:</span>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="input py-2 pr-10 min-w-[160px] font-bold"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, index) => (
          <div key={index} className="card group">
            <div className="card-body flex flex-col justify-between h-full">
              <div className="flex items-start justify-between">
                <div className={`p-4 rounded-2xl ${card.bgColor} transition-transform group-hover:scale-110 duration-300`}>
                  <card.icon className={`h-7 w-7 ${card.color}`} />
                </div>
                {card.change && (
                  <div className={`flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                    card.changeType === 'positive' ? 'bg-success-50 text-success-600' : 'bg-red-50 text-red-600'
                  }`}>
                    {card.changeType === 'positive' ? (
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                    )}
                    {card.change}
                  </div>
                )}
              </div>
              <div className="mt-6">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{card.title}</p>
                <p className="text-3xl font-extrabold text-gray-900 tabular-nums">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Performance Chart */}
        <div className="lg:col-span-2 card">
          <div className="card-header flex items-center justify-between bg-white">
            <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">Financial Performance</h3>
            <div className="flex items-center gap-4 text-xs font-bold">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-success-500"></span>
                <span className="text-gray-500 uppercase">Income</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-400"></span>
                <span className="text-gray-500 uppercase">Expenses</span>
              </div>
            </div>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={dailyChartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                  tickFormatter={(date) => format(new Date(date), 'MMM dd')}
                  dy={10}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', padding: '12px' }}
                  formatter={(value) => [formatCurrency(value), '']}
                  labelFormatter={(date) => format(new Date(date), 'MMMM dd, yyyy')}
                />
                <Bar dataKey="income" fill="#008489" radius={[6, 6, 0, 0]} barSize={24} />
                <Bar dataKey="expenses" fill="#f87171" radius={[6, 6, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">Expenses</h3>
          </div>
          <div className="card-body flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={expenseChartData}
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {expenseChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={4} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value) => formatCurrency(value)} 
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-6 w-full space-y-3">
              {expenseChartData.slice(0, 4).map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                    <span className="text-sm font-bold text-gray-600 truncate max-w-[120px]">{item.name}</span>
                  </div>
                  <span className="text-sm font-extrabold text-gray-900">{formatCurrency(item.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Profit Trend & Overdue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <div className="card-header bg-white">
            <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">Profit Trend</h3>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={dailyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                  tickFormatter={(date) => format(new Date(date), 'dd MMM')}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value) => formatCurrency(value)}
                />
                <Line 
                  type="monotone" 
                  dataKey="profit" 
                  stroke="#ff385c" 
                  strokeWidth={4}
                  dot={{ r: 4, fill: '#ff385c', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="card-header flex items-center justify-between">
            <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">Overdue Payments</h3>
            {overdueDebtors.length > 0 && (
              <span className="px-3 py-1 bg-red-100 text-red-600 text-xs font-black uppercase rounded-full">
                {overdueDebtors.length} Pending
              </span>
            )}
          </div>
          <div className="card-body p-0">
            {overdueDebtors.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {overdueDebtors.map((debtor) => (
                  <div key={debtor._id} className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 font-bold">
                        {debtor.clientName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 leading-tight">{debtor.clientName}</p>
                        <p className="text-xs font-bold text-red-500 mt-1 uppercase tracking-wider">
                          {debtor.daysOverdue} days overdue
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-gray-900 leading-tight">
                        {formatCurrency(debtor.amount)}
                      </p>
                      <p className="text-xs font-bold text-gray-400 mt-1">
                        Due {format(new Date(debtor.dueDate), 'MMM dd')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 px-6">
                <div className="w-16 h-16 bg-success-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-success-500" />
                </div>
                <h4 className="text-lg font-bold text-gray-900">All clear!</h4>
                <p className="text-sm font-medium text-gray-500 mt-1">No overdue payments to track.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;