'use client';

import React, { useEffect, useState } from 'react';
import { admin } from '@/lib/api';
import AdminTable from '@/components/admin/AdminTable';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import toast from 'react-hot-toast';
import { formatDate } from '@/lib/utils';

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [response, setResponse] = useState('');
  const [status, setStatus] = useState('resolved');
  const [submitting, setSubmitting] = useState(false);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await admin.getComplaints();
      setComplaints(res.data.data?.complaints || []);
    } catch (error) {
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleRespond = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await admin.respondToComplaint(selectedComplaint._id, { adminResponse: response, status });
      toast.success('Complaint updated');
      setSelectedComplaint(null);
      fetchComplaints();
    } catch (error) {
      toast.error('Failed to update complaint');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { header: 'User', accessor: 'user', render: (row) => <span className="font-medium text-sm">{row.userId?.name || 'Unknown'}</span> },
    { header: 'Subject', accessor: 'subject', render: (row) => <span className="text-sm font-semibold">{row.subject}</span> },
    { header: 'Priority', accessor: 'priority', render: (row) => <span className="capitalize">{row.priority}</span> },
    { header: 'Status', accessor: 'status', render: (row) => <Badge status={row.status} /> },
    { header: 'Date', accessor: 'createdAt', render: (row) => formatDate(row.createdAt) },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <Button size="sm" variant="outline" onClick={() => {
          setSelectedComplaint(row);
          setResponse(row.adminResponse || '');
          setStatus(row.status === 'OPEN' ? 'RESOLVED' : row.status);
        }}>
          Respond
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manage Complaints</h1>
        <p className="text-gray-500 mt-1">Review and resolve user issues.</p>
      </div>
      <AdminTable columns={columns} data={complaints} loading={loading} />

      <Modal isOpen={!!selectedComplaint} onClose={() => setSelectedComplaint(null)} title="Respond to Complaint">
        {selectedComplaint && (
          <form onSubmit={handleRespond} className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-700">
              <p><strong>Subject:</strong> {selectedComplaint.subject}</p>
              <p className="mt-2"><strong>Description:</strong> {selectedComplaint.description}</p>
            </div>
            
            <Input
              label="Admin Response"
              textarea
              rows={4}
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              required
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Update Status</label>
              <select
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="OPEN">Open</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="ghost" type="button" onClick={() => setSelectedComplaint(null)}>Cancel</Button>
              <Button type="submit" loading={submitting}>Update Ticket</Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
