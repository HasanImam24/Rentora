'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return toast.error('Please fill in all fields');
    }
    try {
      setLoading(true);
      await login(formData);
      toast.success('Successfully logged in');
      router.push('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
              Register here
            </Link>
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <Input
            id="email"
            name="email"
            type="email"
            label="Email address"
            icon={Mail}
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Input
            id="password"
            name="password"
            type="password"
            label="Password"
            icon={Lock}
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Remember me</label>
            </div>
            <div className="text-sm">
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Forgot password?</a>
            </div>
          </div>

          <Button type="submit" fullWidth size="lg" loading={loading}>
            Sign in
          </Button>
        </form>
      </div>
    </div>
  );
}
