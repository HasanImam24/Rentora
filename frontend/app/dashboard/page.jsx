'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { listings as listingsApi, rentals as rentalsApi, orders as ordersApi } from '@/lib/api';
import StatsCard from '@/components/admin/StatsCard';
import { Package, CalendarDays, ShoppingBag, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    myListings: 0,
    activeRentals: 0,
    purchases: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [lRes, rRes, oRes] = await Promise.all([
          listingsApi.getMyListings().catch(() => ({ data: { data: [] } })),
          rentalsApi.getAll({ role: 'renter' }).catch(() => ({ data: { data: [] } })),
          ordersApi.getAll().catch(() => ({ data: { data: [] } }))
        ]);
        
        setStats({
          myListings: lRes.data.data?.length || 0,
          activeRentals: rRes.data.data?.filter(r => r.status === 'active' || r.status === 'confirmed').length || 0,
          purchases: oRes.data.data?.length || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
          <p className="text-gray-500 mt-1">Here is what's happening with your account today.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard 
          title="My Listings" 
          value={stats.myListings} 
          icon={Package} 
          color="indigo" 
        />
        <StatsCard 
          title="Active Rentals" 
          value={stats.activeRentals} 
          icon={CalendarDays} 
          color="green" 
        />
        <StatsCard 
          title="My Purchases" 
          value={stats.purchases} 
          icon={ShoppingBag} 
          color="purple" 
        />
      </div>

      <div className="bg-white shadow-sm border border-gray-200 rounded-xl mt-8 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Quick Actions</h3>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/listings/create" className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:shadow-sm transition-all group">
            <div className="bg-indigo-50 p-3 rounded-full group-hover:bg-indigo-100 text-indigo-600 mr-4">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-semibold text-gray-900 group-hover:text-indigo-600">Post a New Listing</h4>
              <p className="text-sm text-gray-500">Rent or sell your idle items.</p>
            </div>
          </Link>
          <Link href="/dashboard/rentals" className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:shadow-sm transition-all group">
            <div className="bg-blue-50 p-3 rounded-full group-hover:bg-blue-100 text-blue-600 mr-4">
              <CalendarDays className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-semibold text-gray-900 group-hover:text-blue-600">Manage Rentals</h4>
              <p className="text-sm text-gray-500">View upcoming and active rentals.</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
