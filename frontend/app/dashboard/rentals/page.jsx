'use client';

import React, { useEffect, useState } from 'react';
import { rentals } from '@/lib/api';
import AdminTable from '@/components/admin/AdminTable';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { formatCurrency, formatDate } from '@/lib/utils';
import Link from 'next/link';

export default function MyRentalsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('renter'); // renter (Items I Rented), owner (Items Rented to Me)

  const fetchRentals = async () => {
    try {
      setLoading(true);
      const res = await rentals.getAll({ role: tab });
      setData(res.data.data || []);
    } catch (error) {
      toast.error('Failed to load rentals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRentals();
  }, [tab]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await rentals.updateStatus(id, newStatus);
      toast.success(`Rental ${newStatus} successfully`);
      fetchRentals();
    } catch (error) {
      toast.error('Failed to update rental status');
    }
  };

  const columns = [
    {
      header: 'Item',
      accessor: 'listing',
      render: (row) => (
        <div className="font-medium text-gray-900">
          <Link href={`/listings/${row.listing?._id}`} className="hover:text-indigo-600">
            {row.listing?.title || 'Unknown Item'}
          </Link>
        </div>
      )
    },
    {
      header: tab === 'renter' ? 'Lender' : 'Renter',
      accessor: 'user',
      render: (row) => (
        <span className="text-gray-500">
          {tab === 'renter' ? row.owner?.name : row.renter?.name}
        </span>
      )
    },
    {
      header: 'Dates',
      accessor: 'dates',
      render: (row) => (
        <div className="text-sm text-gray-900">
          {formatDate(row.startDate)} - {formatDate(row.endDate)}
        </div>
      )
    },
    {
      header: 'Total Price',
      accessor: 'totalPrice',
      render: (row) => <span className="font-semibold text-gray-900">{formatCurrency(row.totalPrice)}</span>
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <Badge status={row.status} />
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => {
        if (tab === 'owner' && row.status === 'pending') {
          return (
            <div className="flex gap-2">
              <Button size="sm" onClick={() => handleUpdateStatus(row._id, 'confirmed')}>Approve</Button>
              <Button size="sm" variant="danger" onClick={() => handleUpdateStatus(row._id, 'cancelled')}>Reject</Button>
            </div>
          );
        }
        if (tab === 'owner' && row.status === 'confirmed') {
          return (
             <Button size="sm" onClick={() => handleUpdateStatus(row._id, 'completed')}>Mark Complete</Button>
          )
        }
        if (tab === 'renter' && row.status === 'pending') {
          return (
            <Button size="sm" variant="danger" onClick={() => handleUpdateStatus(row._id, 'cancelled')}>Cancel Request</Button>
          )
        }
        return <span className="text-xs text-gray-400">No actions</span>;
      }
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Rentals</h1>
        <p className="text-gray-500 mt-1">Manage your rental requests and bookings.</p>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setTab('renter')}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              tab === 'renter'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Items I Rented
          </button>
          <button
            onClick={() => setTab('owner')}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              tab === 'owner'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Items Rented to Me
          </button>
        </nav>
      </div>

      <AdminTable columns={columns} data={data} loading={loading} />
    </div>
  );
}
