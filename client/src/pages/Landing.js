import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, ArrowRight } from 'lucide-react';

const Landing = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("/landing-bg.png")' }}
      ></div>
      <div className="absolute inset-0 z-10 bg-white/80 backdrop-blur-[2px]"></div>

      <div className="relative z-20 max-w-4xl w-full text-center px-6 py-12">
        <div className="flex justify-center mb-10">
          <div className="h-24 w-24 bg-brand-50 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-brand-100/50 transform -rotate-6">
            <Truck className="h-12 w-12 text-brand-500" />
          </div>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter mb-8 leading-[0.85] animate-fade-in">
          Deliver <br/>
          <span className="text-brand-500">More Profit.</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-600 font-bold mb-14 max-w-2xl mx-auto leading-relaxed">
          The premium tracking platform for modern logistics. Real-time analytics, debtor management, and absolute growth.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link 
            to="/login?register=1" 
            className="btn-primary py-6 px-12 text-xl w-full sm:w-auto flex items-center justify-center group shadow-xl shadow-brand-200"
          >
            Start Growing 
            <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link 
            to="/login" 
            className="btn-outline py-6 px-12 text-xl w-full sm:w-auto flex items-center justify-center bg-white/50 backdrop-blur-md"
          >
            Sign In
          </Link>
        </div>

        <div className="mt-28 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Sales Tracking', desc: 'Precision logging for every trip.' },
            { title: 'Smart Debtors', desc: 'Automated overdue payment tracking.' },
            { title: 'Analytics', desc: 'Visual insights for smarter decisions.' }
          ].map((feature, i) => (
            <div key={i} className="p-8 rounded-[2rem] bg-white/70 backdrop-blur-md border border-white/50 text-left shadow-lg shadow-gray-200/50 transition-all hover:-translate-y-2">
              <h3 className="text-sm font-black text-gray-900 mb-2 uppercase tracking-[0.2em]">{feature.title}</h3>
              <p className="text-gray-500 font-bold leading-tight">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <footer className="relative z-20 mt-20 text-center pb-12">
        <p className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">
          &copy; {new Date().getFullYear()} Profit Tracker. 
          Powered by <a href="https://fastweb.co.ke" target="_blank" rel="noopener noreferrer" className="text-gray-900 hover:text-brand-500 transition-colors">Fastweb</a>
        </p>
      </footer>
    </div>
  );
};

export default Landing;
