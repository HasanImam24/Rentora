'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { listings as listingsApi, rentals as rentalsApi, orders as ordersApi } from '@/lib/api';
import StatsCard from '@/components/admin/StatsCard';
import { Package, CalendarDays, ShoppingBag, Inbox } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    myListings: 0,
    activeRentals: 0,
    purchases: 0,
    pendingRequests: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [lRes, rRes, oRes, recORes, recRRes] = await Promise.all([
          listingsApi.getMyListings().catch(() => ({ data: { data: { listings: [] } } })),
          rentalsApi.getMyRentals().catch(() => ({ data: { data: [] } })),
          ordersApi.getMyOrders().catch(() => ({ data: { data: [] } })),
          ordersApi.getReceivedOrders().catch(() => ({ data: { data: [] } })),
          rentalsApi.getReceivedRentals().catch(() => ({ data: { data: [] } }))
        ]);
        
        const listingsData = lRes.data.data;
        const listingsArr = Array.isArray(listingsData) ? listingsData : listingsData?.listings || [];
        
        const rentalsData = rRes.data.data;
        const rentalsArr = Array.isArray(rentalsData) ? rentalsData : rentalsData?.rentals || [];
        
        const ordersData = oRes.data.data;
        const ordersArr = Array.isArray(ordersData) ? ordersData : ordersData?.orders || [];

        const recOrdersData = recORes.data.data;
        const recOrdersArr = Array.isArray(recOrdersData) ? recOrdersData : recOrdersData?.orders || [];

        const recRentalsData = recRRes.data.data;
        const recRentalsArr = Array.isArray(recRentalsData) ? recRentalsData : recRentalsData?.rentals || [];

        const pendingReqs = recOrdersArr.filter(o => o.status === 'PENDING').length + recRentalsArr.filter(r => r.status === 'PENDING').length;

        setStats({
          myListings: listingsArr.length,
          activeRentals: rentalsArr.filter(r => r.status === 'ACTIVE' || r.status === 'CONFIRMED').length,
          purchases: ordersArr.length,
          pendingRequests: pendingReqs
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

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          title="My Listings" 
          value={stats.myListings} 
          icon={Package} 
          color="indigo" 
        />
        <StatsCard 
          title="Pending Requests" 
          value={stats.pendingRequests} 
          icon={Inbox} 
          color="yellow" 
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
