import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Home, 
  Receipt, 
  Users, 
  BarChart3, 
  Settings, 
  Menu, 
  X,
  LogOut,
  User
} from 'lucide-react';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Transactions', href: '/dashboard/transactions', icon: Receipt },
    { name: 'Debtors', href: '/dashboard/debtors', icon: Users },
    { name: 'Reports', href: '/dashboard/reports', icon: BarChart3 },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-900 bg-opacity-40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-4/5 max-w-xs flex-col bg-white overflow-y-auto shadow-2xl transition-transform duration-300">
          <div className="flex h-20 items-center justify-between px-6 border-b border-gray-100">
            <h1 className="text-2xl font-black text-gray-900 tracking-tighter">PROFIT<span className="text-brand-500">.</span></h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-gray-900 p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          <nav className="flex-1 px-4 py-8 space-y-1.5">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-bold rounded-2xl transition-all ${
                    isActive
                      ? 'bg-brand-50 text-brand-500'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <item.icon className="mr-4 h-5 w-5" />
                {item.name}
              </NavLink>
            ))}
          </nav>
          <div className="border-t border-gray-100 p-6">
            <div className="flex items-center mb-6 p-2 rounded-2xl bg-gray-50">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-xl bg-brand-100 flex items-center justify-center">
                  <User className="h-6 w-6 text-brand-600" />
                </div>
              </div>
              <div className="ml-4 truncate">
                <p className="text-sm font-black text-gray-900 truncate">{user?.name}</p>
                <p className="text-xs font-bold text-gray-400 truncate mt-0.5">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex w-full items-center px-4 py-3 text-sm font-bold text-red-500 rounded-2xl hover:bg-red-50 transition-colors"
            >
              <LogOut className="mr-4 h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-100 overflow-y-auto">
          <div className="flex h-24 items-center px-8">
            <h1 className="text-3xl font-black text-gray-900 tracking-tighter">PROFIT<span className="text-brand-500">.</span></h1>
          </div>
          <nav className="flex-1 px-6 py-6 space-y-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center px-5 py-4 text-sm font-bold rounded-2xl transition-all ${
                    isActive
                      ? 'bg-brand-50 text-brand-500 shadow-sm'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <item.icon className="mr-4 h-6 w-6" />
                {item.name}
              </NavLink>
            ))}
          </nav>
          <div className="p-6">
            <div className="p-5 rounded-3xl bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-2xl bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-200">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div className="truncate">
                  <p className="text-sm font-black text-gray-900 truncate">{user?.name}</p>
                  <p className="text-xs font-bold text-gray-400 truncate mt-0.5">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex w-full items-center justify-center px-4 py-3 text-sm font-black text-red-500 border border-red-100 bg-white rounded-2xl hover:bg-red-50 hover:border-red-200 transition-all active:scale-95"
              >
                <LogOut className="mr-3 h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Mobile header */}
        <div className="sticky top-0 z-40 flex h-20 items-center gap-x-4 bg-white/80 backdrop-blur-md px-6 lg:hidden border-b border-gray-100">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-900 hover:bg-gray-100 p-2.5 rounded-xl transition-colors"
          >
            <Menu size={24} />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-black text-gray-900 tracking-tight">PROFIT<span className="text-brand-500">.</span></h1>
          </div>
        </div>

        {/* Page content */}
        <main className="py-8 sm:py-12">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-12">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;