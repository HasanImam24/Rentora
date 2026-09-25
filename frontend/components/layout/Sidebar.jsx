'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, CalendarDays, ShoppingBag, AlertTriangle } from 'lucide-react';

const navItems = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'My Listings', href: '/dashboard/listings', icon: Package },
  { name: 'Rentals', href: '/dashboard/rentals', icon: CalendarDays },
  { name: 'Purchases', href: '/dashboard/purchases', icon: ShoppingBag },
  { name: 'Complaints', href: '/dashboard/complaints', icon: AlertTriangle },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 flex-shrink-0 border-r border-gray-200 bg-white hidden md:block">
      <div className="h-full flex flex-col pt-5 pb-4 overflow-y-auto">
        <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon
                  className={`mr-3 flex-shrink-0 h-5 w-5 ${
                    isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
