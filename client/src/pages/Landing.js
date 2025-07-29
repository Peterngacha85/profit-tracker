import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-tr from-blue-500 via-purple-400 to-pink-400 text-white px-4 transition-colors duration-1000">
      <div className="max-w-xl w-full text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">Welcome to Profit Tracker</h1>
        <p className="mb-8 text-lg md:text-xl opacity-90">
          Effortlessly manage your business finances, track debtors, monitor transactions, and generate insightful reports—all in one beautiful dashboard.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link to="/login" className="bg-white text-blue-700 font-semibold px-8 py-3 rounded-lg shadow hover:bg-blue-100 transition">Login</Link>
          <Link to="/login?register=1" className="bg-blue-700 border border-white font-semibold px-8 py-3 rounded-lg shadow hover:bg-blue-800 transition">Register</Link>
        </div>
      </div>
      <footer className="mt-16 text-sm opacity-70">
        &copy; {new Date().getFullYear()} Profit Tracker. All rights reserved.<br />
        Developed by <a href="https://fastweb.co.ke" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-200">Fastweb Technologies</a>
      </footer>
    </div>
  );
};

export default Landing;
