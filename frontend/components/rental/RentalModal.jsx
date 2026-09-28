'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { rentals } from '@/lib/api';
import toast from 'react-hot-toast';
import { differenceInDays, addDays } from 'date-fns';
import { formatCurrency } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function RentalModal({ isOpen, onClose, listing }) {
  const router = useRouter();
  const { user } = useAuth();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookedDates, setBookedDates] = useState([]);

  useEffect(() => {
    if (isOpen && user) {
      setPhoneNumber(user.phone || '');
    }
  }, [isOpen, user]);

  useEffect(() => {
    if (isOpen && listing?._id) {
      const fetchBookedDates = async () => {
        try {
          const res = await rentals.getBookedDates(listing._id);
          const data = res.data.data;
          setBookedDates(Array.isArray(data) ? data : data?.bookedDates || []);
        } catch (error) {
          console.error('Failed to fetch booked dates', error);
        }
      };
      fetchBookedDates();
    }
  }, [isOpen, listing]);

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
    if (!phoneNumber.trim()) return toast.error('Please provide a phone number');
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start < new Date().setHours(0,0,0,0)) return toast.error('Start date cannot be in the past');
    if (end <= start) return toast.error('End date must be after start date');

    const overlap = bookedDates.some(range => {
      const bStart = new Date(range.startDate);
      const bEnd = new Date(range.endDate);
      return (start <= bEnd && end >= bStart);
    });

    if (overlap) return toast.error('Selected dates overlap with an existing booking');

    try {
      setLoading(true);
      await rentals.create({
        listingId: listing._id,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        phoneNumber
      });
      toast.success('Rental request sent! Waiting for owner approval.');
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
        {bookedDates.length > 0 && (
          <div className="bg-yellow-50 text-yellow-800 p-3 rounded-md text-sm border border-yellow-200">
            <strong>Unavailable Dates:</strong>
            <ul className="list-disc pl-5 mt-1">
              {bookedDates.map((range, idx) => (
                <li key={idx}>
                  {new Date(range.startDate).toLocaleDateString()} to {new Date(range.endDate).toLocaleDateString()}
                </li>
              ))}
            </ul>
          </div>
        )}
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

        <Input
          type="tel"
          label="Contact Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="e.g. 01700000000"
          required
        />

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

        {calculatePrice > 0 && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
            <div className="flex items-center p-3 border-2 border-indigo-500 rounded-lg bg-indigo-50">
              <input type="radio" checked readOnly className="h-4 w-4 text-indigo-600" />
              <div className="ml-3">
                <span className="text-sm font-semibold text-gray-900">💵 Cash on Delivery (COD)</span>
                <p className="text-xs text-gray-500">Pay in cash when you receive the item.</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={loading} disabled={calculatePrice <= 0}>Send Rental Request</Button>
        </div>
      </form>
    </Modal>
  );
}
