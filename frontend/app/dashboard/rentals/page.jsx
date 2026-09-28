'use client';

import React, { useEffect, useState } from 'react';
import { rentals } from '@/lib/api';
import AdminTable from '@/components/admin/AdminTable';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { formatCurrency, formatDate } from '@/lib/utils';
import Link from 'next/link';
import CompleteRentalModal from '@/components/rental/CompleteRentalModal';

export default function MyRentalsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [tab, setTab] = useState('renter');
  const [completeModalRental, setCompleteModalRental] = useState(null);

  const fetchRentals = async () => {
    try {
      setLoading(true);
      const res = tab === 'renter' ? await rentals.getMyRentals() : await rentals.getReceivedRentals();
      const responseData = res.data.data;
      setData(Array.isArray(responseData) ? responseData : responseData?.rentals || []);
    } catch (error) {
      toast.error('Failed to load rentals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRentals();
  }, [tab]);

  const handleAction = async (id, actionFn) => {
    try {
      setActionLoading(id);
      await actionFn(id);
      toast.success('Action successful');
      fetchRentals();
    } catch (error) {
      toast.error(error.message || 'Failed to complete action');
    } finally {
      setActionLoading(null);
    }
  };

  const columns = [
    {
      header: 'Item',
      accessor: 'listing',
      render: (row) => (
        <div className="font-medium text-gray-900">
          <Link href={`/listings/${row.listingId?._id}`} className="hover:text-indigo-600">
            {row.listingId?.title || 'Unknown Item'}
          </Link>
        </div>
      )
    },
    {
      header: 'Owner',
      accessor: 'owner',
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-gray-900 font-medium">
            {row.ownerId?.name}
          </span>
          <span className="text-xs text-gray-500">{row.ownerId?.phone}</span>
        </div>
      )
    },
    {
      header: 'Period',
      accessor: 'dates',
      render: (row) => (
        <div className="text-sm text-gray-900">
          {formatDate(row.startDate)} → {formatDate(row.endDate)}
        </div>
      )
    },
    {
      header: 'Amount',
      accessor: 'totalAmount',
      render: (row) => <span className="font-semibold text-gray-900">{formatCurrency(row.totalAmount)}</span>
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
        if (row.status === 'PENDING') {
          return (
            <Button size="sm" variant="danger" loading={actionLoading === row._id} onClick={() => handleAction(row._id, rentals.cancel)}>Cancel</Button>
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
            My Rentals
          </button>
          <button
            onClick={() => setTab('owner')}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              tab === 'owner'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Incoming Rental Requests
          </button>
        </nav>
      </div>

      {tab === 'renter' ? (
        <AdminTable columns={columns} data={data} loading={loading} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <p>Loading...</p>
          ) : data.length === 0 ? (
            <p className="text-gray-500">No requests found.</p>
          ) : (
            data.map(rental => (
              <div key={rental._id} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-gray-900 line-clamp-1">{rental.listingId?.title}</h3>
                  <Badge status={rental.status} />
                </div>
                
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Renter:</span>
                    <span className="font-medium text-gray-900">{rental.renterId?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Phone:</span>
                    <span className="font-medium text-gray-900">{rental.phoneNumber || rental.renterId?.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Period:</span>
                    <span className="font-medium text-gray-900">{formatDate(rental.startDate)} → {formatDate(rental.endDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Amount:</span>
                    <span className="font-medium text-gray-900">{formatCurrency(rental.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Payment:</span>
                    <span className="font-medium text-gray-900">COD</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex gap-2">
                  {rental.status === 'PENDING' && (
                    <>
                      <Button className="flex-1" size="sm" loading={actionLoading === rental._id} onClick={() => handleAction(rental._id, rentals.accept)}>Accept</Button>
                      <Button variant="danger" className="flex-1" size="sm" loading={actionLoading === rental._id} onClick={() => handleAction(rental._id, rentals.reject)}>Reject</Button>
                    </>
                  )}
                  {(rental.status === 'CONFIRMED' || rental.status === 'ACTIVE') && (
                    <Button 
                      className="w-full" 
                      size="sm" 
                      loading={actionLoading === rental._id} 
                      onClick={() => setCompleteModalRental(rental)}
                    >
                      Mark Complete
                    </Button>
                  )}
                  {rental.status !== 'PENDING' && rental.status !== 'CONFIRMED' && rental.status !== 'ACTIVE' && (
                    <span className="text-xs text-gray-400 w-full text-center">No actions available</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
      <CompleteRentalModal 
        isOpen={!!completeModalRental} 
        onClose={() => setCompleteModalRental(null)} 
        rental={completeModalRental} 
        onComplete={fetchRentals} 
      />
    </div>
  );
}
