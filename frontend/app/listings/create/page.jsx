'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import ImageUploader from '@/components/listings/ImageUploader';
import { listings } from '@/lib/api';
import toast from 'react-hot-toast';

const CATEGORIES = ['Electronics', 'Vehicles', 'Real Estate', 'Furniture', 'Tools', 'Sports', 'Other'];

export default function CreateListingPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: CATEGORIES[0],
    condition: 'GOOD',
    transactionType: 'RENT_AND_SALE',
    rentalPriceAmount: '',
    rentalPriceUnit: 'DAY',
    securityDeposit: '',
    salePrice: ''
  });
  
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/listings/create');
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) {
      return toast.error('Please upload at least one image');
    }

    try {
      setSubmitting(true);
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('condition', formData.condition);
      data.append('transactionType', formData.transactionType);

      if (['RENT', 'RENT_AND_SALE'].includes(formData.transactionType)) {
        data.append('rentalPrice[amount]', formData.rentalPriceAmount);
        data.append('rentalPrice[unit]', formData.rentalPriceUnit);
        if (formData.securityDeposit) {
          data.append('securityDeposit', formData.securityDeposit);
        }
      }
      if (['SALE', 'RENT_AND_SALE'].includes(formData.transactionType)) {
        data.append('salePrice', formData.salePrice);
      }

      images.forEach(img => {
        data.append('images', img);
      });

      const res = await listings.create(data);
      toast.success('Listing created successfully!');
      router.push(`/listings/${res.data.data._id || res.data.data.id || ''}`);
    } catch (error) {
      toast.error(error.message || 'Failed to create listing');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
        <div className="mb-8 border-b border-gray-200 pb-5">
          <h1 className="text-2xl font-bold text-gray-900">Post a New Listing</h1>
          <p className="text-gray-500 text-sm mt-1">Fill out the details below to list your item for rent or sale.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
            <Input
              name="title"
              label="Listing Title"
              placeholder="e.g. Sony A7III Camera"
              value={formData.title}
              onChange={handleChange}
              required
            />
            
            <Input
              name="description"
              label="Description"
              textarea
              rows={4}
              placeholder="Describe your item, its features, and any important details..."
              value={formData.description}
              onChange={handleChange}
              required
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  name="category"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.category}
                  onChange={handleChange}
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                <select
                  name="condition"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.condition}
                  onChange={handleChange}
                >
                  <option value="NEW">Brand New</option>
                  <option value="LIKE_NEW">Like New</option>
                  <option value="GOOD">Good</option>
                  <option value="FAIR">Fair</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Transaction Details</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Listing Type</label>
              <div className="flex gap-4">
                {[
                  { value: 'RENT', label: 'Rent Only' },
                  { value: 'SALE', label: 'Sale Only' },
                  { value: 'RENT_AND_SALE', label: 'Both' }
                ].map((type) => (
                  <label key={type.value} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="transactionType"
                      value={type.value}
                      checked={formData.transactionType === type.value}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {['RENT', 'RENT_AND_SALE'].includes(formData.transactionType) && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-indigo-50/50 p-4 rounded-lg border border-indigo-100">
                <Input
                  name="rentalPriceAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  label="Rental Price (৳)"
                  placeholder="0.00"
                  value={formData.rentalPriceAmount}
                  onChange={handleChange}
                  required={formData.transactionType !== 'SALE'}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Per</label>
                  <select
                    name="rentalPriceUnit"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={formData.rentalPriceUnit}
                    onChange={handleChange}
                  >
                    <option value="DAY">Day</option>
                    <option value="WEEK">Week</option>
                    <option value="MONTH">Month</option>
                  </select>
                </div>
                <Input
                  name="securityDeposit"
                  type="number"
                  min="0"
                  step="0.01"
                  label="Security Deposit (৳)"
                  placeholder="0.00"
                  value={formData.securityDeposit}
                  onChange={handleChange}
                />
              </div>
            )}

            {['SALE', 'RENT_AND_SALE'].includes(formData.transactionType) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-purple-50/50 p-4 rounded-lg border border-purple-100">
                <Input
                  name="salePrice"
                  type="number"
                  min="0"
                  step="0.01"
                  label="Sale Price (৳)"
                  placeholder="0.00"
                  value={formData.salePrice}
                  onChange={handleChange}
                  required={formData.transactionType !== 'RENT'}
                />
              </div>
            )}
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Photos</h3>
            <p className="text-sm text-gray-500">Add up to 5 photos of your item. High quality photos attract more views.</p>
            <ImageUploader onImagesChange={setImages} />
          </div>

          <div className="pt-6 border-t border-gray-200 flex justify-end gap-3">
            <Button variant="secondary" type="button" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" loading={submitting}>Post Listing</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

