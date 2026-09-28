'use client';

import React, { useEffect, useState } from 'react';
import { complaints } from '@/lib/api';
import AdminTable from '@/components/admin/AdminTable';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import toast from 'react-hot-toast';
import { formatDate } from '@/lib/utils';
import { PlusCircle } from 'lucide-react';

export default function MyComplaintsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    priority: 'LOW'
  });

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await complaints.getAll();
      setData(res.data.data?.complaints || []);
    } catch (error) {
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.subject || !formData.description) return toast.error('Please fill all fields');
    
    try {
      setSubmitting(true);
      await complaints.create(formData);
      toast.success('Complaint submitted');
      setIsModalOpen(false);
      setFormData({ subject: '', description: '', priority: 'LOW' });
      fetchComplaints();
    } catch (error) {
      toast.error('Failed to submit complaint');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { header: 'Subject', accessor: 'subject', render: (row) => <span className="font-medium">{row.subject}</span> },
    { header: 'Priority', accessor: 'priority', render: (row) => <span className="capitalize">{row.priority}</span> },
    { header: 'Status', accessor: 'status', render: (row) => <Badge status={row.status} /> },
    { header: 'Date', accessor: 'createdAt', render: (row) => formatDate(row.createdAt) },
    { header: 'Admin Response', accessor: 'adminResponse', render: (row) => (
      <div className="max-w-xs truncate text-gray-500">
        {row.adminResponse || 'No response yet'}
      </div>
    )}
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Support & Complaints</h1>
          <p className="text-gray-500 mt-1">Report issues or contact support.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <PlusCircle className="w-4 h-4" /> New Ticket
        </Button>
      </div>

      <AdminTable columns={columns} data={data} loading={loading} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Submit a Ticket">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Subject"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
          <Input
            label="Description"
            textarea
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={submitting}>Submit</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
