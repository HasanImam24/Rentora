'use client';

import React, { useState, useEffect } from 'react';
import { listings as listingsApi } from '@/lib/api';
import ListingGrid from '@/components/listings/ListingGrid';
import Input from '@/components/ui/Input';
import { Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = ['All', 'Electronics', 'Vehicles', 'Real Estate', 'Furniture', 'Tools', 'Sports'];

export default function ListingsPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    transactionType: 'all',
  });

  const fetchListings = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.category !== 'All') params.category = filters.category;
      if (filters.transactionType !== 'all') params.transactionType = filters.transactionType;

      const res = await listingsApi.getAll(params);
      setListings(res.data.data.listings || res.data.data);
    } catch (error) {
      toast.error('Failed to load listings');
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch and on filter change (with simple debounce)
    const timeoutId = setTimeout(() => {
      fetchListings();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Browse Listings</h1>
          <p className="text-gray-500 mt-1">Find what you need, when you need it.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
          <div className="w-full md:w-64">
            <Input
              icon={Search}
              placeholder="Search items..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          
          <div className="flex w-full md:w-auto gap-3">
            <select
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            
            <select
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={filters.transactionType}
              onChange={(e) => setFilters({ ...filters, transactionType: e.target.value })}
            >
              <option value="all">Any Type</option>
              <option value="RENT">For Rent</option>
              <option value="SALE">For Sale</option>
            </select>
          </div>
        </div>
      </div>

      <ListingGrid listings={listings} loading={loading} />
      
      {/* Basic Pagination Structure (mocked for now) */}
      {!loading && listings.length > 0 && (
        <div className="mt-10 flex justify-center">
          <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              Previous
            </a>
            <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-indigo-50 text-sm font-medium text-indigo-600">
              1
            </a>
            <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              Next
            </a>
          </nav>
        </div>
      )}
    </div>
  );
}
