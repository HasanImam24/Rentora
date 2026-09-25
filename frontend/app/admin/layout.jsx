'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { LayoutDashboard, Users, Package, AlertTriangle } from 'lucide-react';

const adminNavItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Listings', href: '/admin/listings', icon: Package },
  { name: 'Complaints', href: '/admin/complaints', icon: AlertTriangle },
];

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, isAdmin } = useAuth();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push('/');
    }
  }, [user, loading, isAdmin, router]);

  if (loading || !isAdmin) {
    return <div className="min-h-screen flex items-center justify-center">Loading Admin...</div>;
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-gray-50 overflow-hidden">
      <div className="w-64 flex-shrink-0 border-r border-gray-200 bg-white hidden md:block">
        <div className="h-full flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="px-4 mb-4">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Admin Panel</h2>
          </div>
          <nav className="flex-1 px-2 space-y-1">
            {adminNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
