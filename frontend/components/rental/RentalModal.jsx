'use client';

import React, { useState, useMemo } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { rentals } from '@/lib/api';
import toast from 'react-hot-toast';
import { differenceInDays, addDays } from 'date-fns';
import { formatCurrency } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function RentalModal({ isOpen, onClose, listing }) {
  const router = useRouter();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);

  const calculatePrice = useMemo(() => {
    if (!startDate || !endDate || !listing) return 0;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = differenceInDays(end, start);
    
    if (days <= 0) return 0;

    const priceAmount = listing.rentalPrice?.amount || 0;
    const unit = listing.rentalPrice?.unit || 'DAY';

    let multiplier = 0;
    switch(unit) {
      case 'DAY': multiplier = days; break;
      case 'WEEK': multiplier = Math.ceil(days / 7); break;
      case 'MONTH': multiplier = Math.ceil(days / 30); break;
      default: multiplier = days;
    }

    return (multiplier * priceAmount) + (listing.securityDeposit || 0);
  }, [startDate, endDate, listing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate) return toast.error('Please select both dates');
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start < new Date().setHours(0,0,0,0)) return toast.error('Start date cannot be in the past');
    if (end <= start) return toast.error('End date must be after start date');

    try {
      setLoading(true);
      await rentals.create({
        listingId: listing._id,
        startDate: start.toISOString(),
        endDate: end.toISOString()
      });
      toast.success('Rental request submitted!');
      onClose();
      router.push('/dashboard/rentals');
    } catch (error) {
      toast.error(error.message || 'Failed to submit rental request');
    } finally {
      setLoading(false);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Rent ${listing?.title}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="date"
            label="Start Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            min={todayStr}
            required
          />
          <Input
            type="date"
            label="End Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate || todayStr}
            required
          />
        </div>

        {calculatePrice > 0 && (
          <div className="bg-gray-50 p-4 rounded-md mt-4 space-y-2">
            <h4 className="text-sm font-medium text-gray-900">Price Breakdown</h4>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Rental Fee</span>
              <span>{formatCurrency(calculatePrice - (listing.securityDeposit || 0))}</span>
            </div>
            {listing.securityDeposit > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Security Deposit (Refundable)</span>
                <span>{formatCurrency(listing.securityDeposit)}</span>
              </div>
            )}
            <div className="pt-2 border-t border-gray-200 flex justify-between font-bold">
              <span>Total Estimated</span>
              <span className="text-indigo-600">{formatCurrency(calculatePrice)}</span>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={loading} disabled={calculatePrice <= 0}>Confirm Request</Button>
        </div>
      </form>
    </Modal>
  );
}
