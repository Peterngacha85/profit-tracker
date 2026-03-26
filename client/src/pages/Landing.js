import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, ArrowRight } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 py-12">
      <div className="max-w-3xl w-full text-center">
        <div className="flex justify-center mb-8">
          <div className="h-20 w-20 bg-brand-50 rounded-3xl flex items-center justify-center shadow-xl shadow-brand-100">
            <Truck className="h-10 w-10 text-brand-500" />
          </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter mb-8 leading-[0.9]">
          Manage your profit <br/>
          <span className="text-brand-500">like a pro.</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-500 font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
          The ultimate tracking system for delivery businesses. monitor transactions, manage debtors, and see your growth in real-time.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link 
            to="/login?register=1" 
            className="btn-primary py-5 px-10 text-lg w-full sm:w-auto flex items-center justify-center group"
          >
            Get Started 
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link 
            to="/login" 
            className="btn-outline py-5 px-10 text-lg w-full sm:w-auto flex items-center justify-center"
          >
            Sign In
          </Link>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 text-left">
            <h3 className="text-lg font-black text-gray-900 mb-2 uppercase tracking-wide">Sales Tracking</h3>
            <p className="text-gray-500 font-bold leading-relaxed">Log every transaction with ease and precision.</p>
          </div>
          <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 text-left">
            <h3 className="text-lg font-black text-gray-900 mb-2 uppercase tracking-wide">Debtor Management</h3>
            <p className="text-gray-500 font-bold leading-relaxed">Never lose track of who owes you what.</p>
          </div>
          <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 text-left">
            <h3 className="text-lg font-black text-gray-900 mb-2 uppercase tracking-wide">Real-time Analytics</h3>
            <p className="text-gray-500 font-bold leading-relaxed">Visualize your profits with beautiful charts.</p>
          </div>
        </div>
      </div>

      <footer className="mt-32 text-center">
        <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em]">
          &copy; {new Date().getFullYear()} Profit Tracker. 
          Built by <a href="https://fastweb.co.ke" target="_blank" rel="noopener noreferrer" className="text-gray-900 hover:text-brand-500 transition-colors">Fastweb Technologies</a>
        </p>
      </footer>
    </div>
  );
};

export default Landing;
