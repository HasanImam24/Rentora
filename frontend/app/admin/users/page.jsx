'use client';

import React, { useEffect, useState } from 'react';
import { admin } from '@/lib/api';
import AdminTable from '@/components/admin/AdminTable';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { formatDate } from '@/lib/utils';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await admin.getUsers();
      setUsers(res.data.data || []);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (id) => {
    try {
      await admin.toggleUserStatus(id);
      toast.success('User status updated');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const columns = [
    {
      header: 'User',
      accessor: 'name',
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900">{row.name}</div>
          <div className="text-sm text-gray-500">{row.email}</div>
        </div>
      )
    },
    { header: 'Role', accessor: 'role', render: (row) => <Badge status={row.role === 'admin' ? 'active' : 'pending'} label={row.role} /> },
    { header: 'Status', accessor: 'status', render: (row) => <Badge status={row.status} /> },
    { header: 'Joined', accessor: 'createdAt', render: (row) => formatDate(row.createdAt) },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        row.role !== 'admin' && (
          <Button size="sm" variant={row.status === 'active' ? 'danger' : 'primary'} onClick={() => handleToggleStatus(row._id)}>
            {row.status === 'active' ? 'Suspend' : 'Activate'}
          </Button>
        )
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
        <p className="text-gray-500 mt-1">View and manage platform users.</p>
      </div>
      <AdminTable columns={columns} data={users} loading={loading} />
    </div>
  );
}
