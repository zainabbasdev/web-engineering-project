import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../app/slices/authSlice';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, Loader } from '../components/ui/Card';
import apiClient from '../services/apiClient';

/**
 * LoginPage - User authentication page
 */
export const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiClient.post('/auth/login', formData);

      if (response.data?.data) {
        const { user, token } = response.data.data;
        dispatch(setCredentials({ user, token }));
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-50 p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-lg border border-neutral-200 shadow-lg overflow-hidden">
          <div className="p-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mb-4 mx-auto">
                <span className="text-xl font-bold text-primary-600">PP</span>
              </div>
              <h1 className="text-2xl font-bold text-center text-neutral-900">Petrol Pump</h1>
              <p className="text-center text-sm text-neutral-600 mt-1">Management System</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-danger-50 border border-danger-200 rounded-lg text-xs font-medium text-danger-700">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Email Address</label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@example.com"
                  required
                  disabled={loading}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Password</label>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                  className="w-full"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={loading}
                className="mt-6 h-10 text-sm font-medium"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-xs">
              <p className="font-medium text-neutral-700 mb-2">Demo Credentials:</p>
              <p className="text-neutral-600">
                <span className="font-mono text-neutral-700">zainabbas@gmail.com</span>
              </p>
              <p className="text-neutral-600">
                <span className="font-mono text-neutral-700">Zain@12345</span>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 bg-neutral-50 border-t border-neutral-200">
            <p className="text-xs text-center text-neutral-600">
              © 2026 PPMS. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
