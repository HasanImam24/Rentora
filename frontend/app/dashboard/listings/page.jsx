'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { listings } from '@/lib/api';
import AdminTable from '@/components/admin/AdminTable';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { formatCurrency, formatDate } from '@/lib/utils';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

export default function MyListingsPage() {
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const res = await listings.getMyListings();
      const responseData = res.data.data;
      setMyListings(Array.isArray(responseData) ? responseData : responseData?.listings || []);
    } catch (error) {
      toast.error('Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        await listings.delete(id);
        toast.success('Listing deleted successfully');
        fetchListings();
      } catch (error) {
        toast.error('Failed to delete listing');
      }
    }
  };

  const columns = [
    {
      header: 'Listing',
      accessor: 'title',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden relative">
            <img src={row.images?.[0]?.url || 'https://via.placeholder.com/40'} alt={row.title} className="object-cover w-full h-full" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{row.title}</div>
            <div className="text-xs text-gray-500">{row.category}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Type',
      accessor: 'transactionType',
      render: (row) => <span className="capitalize">{row.transactionType}</span>
    },
    {
      header: 'Pricing',
      accessor: 'price',
      render: (row) => (
        <div className="text-sm">
          {['RENT', 'RENT_AND_SALE'].includes(row.transactionType) ? (
            <div className="text-indigo-600">{formatCurrency(row.rentalPrice?.amount)}/{row.rentalPrice?.unit}</div>
          ) : null}
          {['SALE', 'RENT_AND_SALE'].includes(row.transactionType) ? (
            <div className="text-gray-900">{formatCurrency(row.salePrice)}</div>
          ) : null}
        </div>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <Badge status={row.status} />
    },
    {
      header: 'Created At',
      accessor: 'createdAt',
      render: (row) => formatDate(row.createdAt)
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <div className="flex gap-2">
          <Link href={`/listings/${row._id}`} target="_blank">
            <Button variant="ghost" size="sm" className="text-indigo-600 p-1">View</Button>
          </Link>
          <Button variant="ghost" size="sm" className="text-red-600 p-1" onClick={() => handleDelete(row._id)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Listings</h1>
          <p className="text-gray-500 mt-1">Manage all your rented and sold items.</p>
        </div>
        <Link href="/listings/create">
          <Button className="flex items-center gap-2">
            <PlusCircle className="w-4 h-4" /> Add New
          </Button>
        </Link>
      </div>

      <AdminTable 
        columns={columns} 
        data={myListings} 
        loading={loading} 
      />
    </div>
  );
}
