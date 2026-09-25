'use client';

import React, { useEffect, useState } from 'react';
import { admin } from '@/lib/api';
import StatsCard from '@/components/admin/StatsCard';
import { Users, Package, CalendarDays, ShoppingBag, AlertTriangle } from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await admin.getStats();
        setStats(res.data.data);
      } catch (error) {
        console.error('Failed to load admin stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;
  if (!stats) return <div>Error loading stats</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Platform overview and key metrics.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard title="Total Users" value={stats.totalUsers} icon={Users} color="blue" />
        <StatsCard title="Active Listings" value={stats.activeListings} icon={Package} color="green" />
        <StatsCard title="Total Rentals" value={stats.totalRentals} icon={CalendarDays} color="indigo" />
        <StatsCard title="Total Orders" value={stats.totalOrders} icon={ShoppingBag} color="purple" />
        <StatsCard title="Open Complaints" value={stats.openComplaints} icon={AlertTriangle} color="red" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">System Status</h3>
        <p className="text-gray-600">All systems are operating normally. The database is connected and API endpoints are responsive.</p>
      </div>
    </div>
  );
}
