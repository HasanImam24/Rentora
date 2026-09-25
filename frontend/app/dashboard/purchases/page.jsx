'use client';

import React, { useEffect, useState } from 'react';
import { orders } from '@/lib/api';
import AdminTable from '@/components/admin/AdminTable';
import Badge from '@/components/ui/Badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import Link from 'next/link';

export default function MyPurchasesPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('buyer');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await orders.getAll({ role: tab });
      setData(res.data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [tab]);

  const columns = [
    {
      header: 'Order ID',
      accessor: '_id',
      render: (row) => <span className="text-xs text-gray-500">{row._id.slice(-8).toUpperCase()}</span>
    },
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
      header: tab === 'buyer' ? 'Seller' : 'Buyer',
      accessor: 'user',
      render: (row) => (
        <span className="text-gray-500">
          {tab === 'buyer' ? row.seller?.name : row.buyer?.name}
        </span>
      )
    },
    {
      header: 'Date',
      accessor: 'createdAt',
      render: (row) => formatDate(row.createdAt)
    },
    {
      header: 'Amount',
      accessor: 'amount',
      render: (row) => <span className="font-semibold text-gray-900">{formatCurrency(row.amount)}</span>
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <Badge status={row.status} />
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
            My Sales
          </button>
        </nav>
      </div>

      <AdminTable columns={columns} data={data} loading={loading} />
    </div>
  );
}
