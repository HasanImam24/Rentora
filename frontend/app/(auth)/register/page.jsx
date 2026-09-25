'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { User, Mail, Lock, Phone } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    if (formData.password.length < 6) {
      return toast.error('Password must be at least 6 characters long');
    }

    try {
      setLoading(true);
      const { confirmPassword, ...submitData } = formData;
      await register(submitData);
      toast.success('Registration successful');
      router.push('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">Create an account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Log in instead
            </Link>
          </p>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <Input
            id="name"
            name="name"
            type="text"
            label="Full Name"
            icon={User}
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            required
          />
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
            id="phone"
            name="phone"
            type="tel"
            label="Phone Number"
            icon={Phone}
            placeholder="+1 (555) 000-0000"
            value={formData.phone}
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
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="Confirm Password"
            icon={Lock}
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <Button type="submit" fullWidth size="lg" loading={loading} className="mt-6">
            Register
          </Button>
          
          <p className="text-xs text-center text-gray-500 mt-4">
            By registering, you agree to our Terms of Service and Privacy Policy.
          </p>
        </form>
      </div>
    </div>
  );
}
