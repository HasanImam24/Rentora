'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { LogOut, Menu, User, Shield, LayoutDashboard, PlusCircle, Package } from 'lucide-react';
import { useState } from 'react';
import Button from '../ui/Button';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">RentBuy</span>
            </Link>
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link href="/listings" className="text-gray-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors">
                Browse
              </Link>
              <Link href="/how-it-works" className="text-gray-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors">
                How it Works
              </Link>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {isAdmin && (
                  <Link href="/admin" className="text-gray-500 hover:text-indigo-600 flex items-center gap-1 text-sm font-medium">
                    <Shield className="w-4 h-4" /> Admin Panel
                  </Link>
                )}
                <Link href="/dashboard" className="text-gray-500 hover:text-indigo-600 flex items-center gap-1 text-sm font-medium">
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
                <Link href="/listings/create" className="text-gray-500 hover:text-indigo-600 flex items-center gap-1 text-sm font-medium">
                  <PlusCircle className="w-4 h-4" /> Post
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-full border border-gray-200 transition-colors"
                  >
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">{user.name}</span>
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        My Dashboard
                      </Link>
                      <button
                        onClick={logout}
                        className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary">Register</Button>
                </Link>
              </>
            )}
          </div>
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/listings" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Browse</Link>
            {user ? (
              <>
                <Link href="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Dashboard</Link>
                <Link href="/listings/create" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Post Listing</Link>
                {isAdmin && <Link href="/admin" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Admin Panel</Link>}
                <button onClick={logout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-800 hover:bg-gray-50">Sign out</button>
              </>
            ) : (
              <>
                <Link href="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Login</Link>
                <Link href="/register" className="block px-3 py-2 rounded-md text-base font-medium text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50">Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
