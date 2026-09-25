'use client';

import React, { useEffect, useState } from 'react';
import { admin } from '@/lib/api';
import AdminTable from '@/components/admin/AdminTable';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function AdminListingsPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const res = await admin.getListings();
      setListings(res.data.data || []);
    } catch (error) {
      toast.error('Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await admin.updateListingStatus(id, status);
      toast.success(`Listing ${status}`);
      fetchListings();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const columns = [
    {
      header: 'Listing',
      accessor: 'title',
      render: (row) => (
        <Link href={`/listings/${row._id}`} target="_blank" className="font-medium text-indigo-600 hover:underline">
          {row.title}
        </Link>
      )
    },
    { header: 'Owner', accessor: 'owner', render: (row) => <span className="text-sm">{row.owner?.name}</span> },
    { header: 'Category', accessor: 'category', render: (row) => <span className="text-sm">{row.category}</span> },
    { header: 'Status', accessor: 'status', render: (row) => <Badge status={row.status} /> },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <div className="flex gap-2">
          {row.status === 'active' ? (
            <Button size="sm" variant="danger" onClick={() => handleUpdateStatus(row._id, 'suspended')}>Suspend</Button>
          ) : (
            <Button size="sm" onClick={() => handleUpdateStatus(row._id, 'active')}>Activate</Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manage Listings</h1>
        <p className="text-gray-500 mt-1">Monitor and moderate user listings.</p>
      </div>
      <AdminTable columns={columns} data={listings} loading={loading} />
    </div>
  );
}
