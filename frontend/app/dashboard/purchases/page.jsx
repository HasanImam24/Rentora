'use client';

import React, { useEffect, useState } from 'react';
import { orders } from '@/lib/api';
import AdminTable from '@/components/admin/AdminTable';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { formatCurrency, formatDate } from '@/lib/utils';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function MyPurchasesPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [tab, setTab] = useState('buyer');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = tab === 'buyer' ? await orders.getMyOrders() : await orders.getReceivedOrders();
      const responseData = res.data.data;
      setData(Array.isArray(responseData) ? responseData : responseData?.orders || []);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [tab]);

  const handleAction = async (id, actionFn) => {
    try {
      setActionLoading(id);
      await actionFn(id);
      toast.success('Action successful');
      fetchOrders();
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
      header: 'Seller',
      accessor: 'user',
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-gray-900 font-medium">
            {row.sellerId?.name}
          </span>
          <span className="text-xs text-gray-500">{row.sellerId?.phone}</span>
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
            <Button size="sm" variant="danger" loading={actionLoading === row._id} onClick={() => handleAction(row._id, orders.cancel)}>Cancel</Button>
          );
        }
        return <span className="text-gray-400 text-xs">No actions</span>;
      }
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
        <p className="text-gray-500 mt-1">Track your purchases and sales.</p>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setTab('buyer')}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              tab === 'buyer'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My Purchases
          </button>
          <button
            onClick={() => setTab('seller')}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              tab === 'seller'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Incoming Purchase Requests
          </button>
        </nav>
      </div>

      {tab === 'buyer' ? (
        <AdminTable columns={columns} data={data} loading={loading} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <p>Loading...</p>
          ) : data.length === 0 ? (
            <p className="text-gray-500">No requests found.</p>
          ) : (
            data.map(order => (
              <div key={order._id} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-gray-900 line-clamp-1">{order.listingId?.title}</h3>
                  <Badge status={order.status} />
                </div>
                
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Buyer:</span>
                    <span className="font-medium text-gray-900">{order.buyerId?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Phone:</span>
                    <span className="font-medium text-gray-900">{order.phoneNumber || order.buyerId?.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Amount:</span>
                    <span className="font-medium text-gray-900">{formatCurrency(order.totalAmount)}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-500">Delivery Address:</span>
                    <span className="font-medium text-gray-900 bg-gray-50 p-2 rounded mt-1">{order.deliveryAddress}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Payment:</span>
                    <span className="font-medium text-gray-900">COD</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex gap-2">
                  {order.status === 'PENDING' && (
                    <>
                      <Button className="flex-1" size="sm" loading={actionLoading === order._id} onClick={() => handleAction(order._id, orders.accept)}>Accept</Button>
                      <Button variant="danger" className="flex-1" size="sm" loading={actionLoading === order._id} onClick={() => handleAction(order._id, orders.reject)}>Reject</Button>
                    </>
                  )}
                  {order.status === 'ACCEPTED' && (
                    <Button className="w-full" size="sm" loading={actionLoading === order._id} onClick={() => handleAction(order._id, orders.complete)}>Mark Complete</Button>
                  )}
                  {order.status !== 'PENDING' && order.status !== 'ACCEPTED' && (
                    <span className="text-xs text-gray-400 w-full text-center">No actions available</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
