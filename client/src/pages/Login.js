import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { Truck, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const location = useLocation();
  // Show registration form if ?register=1 is in the URL
  const [isLogin, setIsLogin] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get('register') !== '1';
  });
  // If the user navigates to /login?register=1 after initial mount, update the form
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setIsLogin(params.get('register') !== '1');
  }, [location.search]);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, register, user, logout } = useAuth();
  const navigate = useNavigate();
 

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    
    try {
      let result;
      if (isLogin) {
        result = await login(data.email, data.password);
      } else {
        result = await register(data.name, data.email, data.password);
      }
      
      if (result.success) {
        navigate('/');
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-2 sm:px-6 lg:px-8 w-full">
        <div className="max-w-md w-full text-center bg-white p-8 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4 text-primary-700">You are already logged in</h2>
          <p className="mb-6 text-gray-600">You are currently signed in. If you want to use a different account, please log out first.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
            >
              Home
            </button>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8 w-full">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-2xl bg-brand-50 mb-6">
            <Truck className="h-8 w-8 text-brand-500" />
          </div>
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            {isLogin ? 'Welcome back' : 'Create an account'}
          </h2>
          <p className="mt-4 text-lg text-gray-500 font-medium">
            {isLogin ? (
              <>
                New here?{' '}
                <button
                  onClick={() => setIsLogin(false)}
                  className="text-brand-500 hover:text-brand-600 font-bold underline underline-offset-4"
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have one?{' '}
                <button
                  onClick={() => setIsLogin(true)}
                  className="text-brand-500 hover:text-brand-600 font-bold underline underline-offset-4"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
        
        <div className="bg-white p-8 border border-gray-200 rounded-3xl shadow-sm">
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              {!isLogin && (
                <div>
                  <label htmlFor="name" className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 ml-1">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    {...registerField('name', {
                      required: !isLogin && 'Name is required',
                      minLength: {
                        value: 2,
                        message: 'Name must be at least 2 characters'
                      }
                    })}
                    className="input"
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500 font-medium">{errors.name.message}</p>
                  )}
                </div>
              )}
              
              <div>
                <label htmlFor="email" className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 ml-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  {...registerField('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className="input"
                  placeholder="name@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500 font-medium">{errors.email.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="password" className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 ml-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    {...registerField('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    })}
                    className="input pr-12"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500 font-medium">{errors.password.message}</p>
                )}
              </div>
              
              {!isLogin && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 ml-1">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    {...registerField('confirmPassword', {
                      required: !isLogin && 'Please confirm your password',
                      validate: (val) => {
                        if (watch('password') !== val) {
                          return "Passwords don't match";
                        }
                      }
                    })}
                    className="input"
                    placeholder="••••••••"
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500 font-medium">{errors.confirmPassword.message}</p>
                  )}
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full py-4 text-base"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                ) : (
                  isLogin ? 'Sign In' : 'Create Account'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;