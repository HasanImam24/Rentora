'use client';

import React, { useEffect, useState } from 'react';
import { orders, rentals } from '@/lib/api';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { formatCurrency, formatDate } from '@/lib/utils';
import Image from 'next/image';
import CompleteRentalModal from '@/components/rental/CompleteRentalModal';

export default function RequestsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [completeModalRental, setCompleteModalRental] = useState(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const [oRes, rRes] = await Promise.all([
        orders.getReceivedOrders().catch(() => ({ data: { data: [] } })),
        rentals.getReceivedRentals().catch(() => ({ data: { data: [] } }))
      ]);

      const ordersData = oRes.data.data;
      const ordersArr = (Array.isArray(ordersData) ? ordersData : ordersData?.orders || []).map(o => ({ ...o, type: 'PURCHASE' }));
      
      const rentalsData = rRes.data.data;
      const rentalsArr = (Array.isArray(rentalsData) ? rentalsData : rentalsData?.rentals || []).map(r => ({ ...r, type: 'RENTAL' }));

      const combined = [...ordersArr, ...rentalsArr].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setData(combined);
    } catch (error) {
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id, type, actionFn) => {
    try {
      setActionLoading(id);
      await actionFn(id);
      toast.success('Action successful');
      fetchRequests();
    } catch (error) {
      toast.error(error.message || 'Failed to complete action');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Incoming Requests</h1>
        <p className="text-gray-500 mt-1">Manage purchase and rental requests for your items.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p>Loading...</p>
        ) : data.length === 0 ? (
          <p className="text-gray-500">No requests found.</p>
        ) : (
          data.map(item => {
            const isPurchase = item.type === 'PURCHASE';
            const requesterName = isPurchase ? item.buyerId?.name : item.renterId?.name;
            const requesterPhone = item.phoneNumber || (isPurchase ? item.buyerId?.phone : item.renterId?.phone);
            const imageUrl = item.listingId?.images?.[0]?.url || '/no-image.svg';

            return (
              <div key={item._id} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm space-y-4 flex flex-col">
                <div className="flex justify-between items-start">
                  <Badge 
                    status={item.type} 
                    label={isPurchase ? 'Purchase Request' : 'Rental Request'} 
                    className={isPurchase ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}
                  />
                  <Badge status={item.status} />
                </div>
                
                <div className="flex gap-4 items-center mt-2 pb-4 border-b border-gray-100">
                  <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
                    <Image src={imageUrl} alt={item.listingId?.title} fill className="object-cover" />
                  </div>
                  <h3 className="font-bold text-gray-900 line-clamp-2">{item.listingId?.title}</h3>
                </div>
                
                <div className="text-sm space-y-2 flex-grow">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Requester:</span>
                    <span className="font-medium text-gray-900">{requesterName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Phone:</span>
                    <span className="font-medium text-gray-900">{requesterPhone}</span>
                  </div>
                  
                  {isPurchase ? (
                    <>
                      <div className="flex flex-col">
                        <span className="text-gray-500">Delivery Address:</span>
                        <span className="font-medium text-gray-900 bg-gray-50 p-2 rounded mt-1">{item.deliveryAddress}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Period:</span>
                        <span className="font-medium text-gray-900">{formatDate(item.startDate)} → {formatDate(item.endDate)}</span>
                      </div>
                    </>
                  )}

                  <div className="flex justify-between pt-2">
                    <span className="text-gray-500">Amount:</span>
                    <span className="font-bold text-gray-900">{formatCurrency(item.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Payment:</span>
                    <span className="font-medium text-gray-900">COD</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex gap-2 mt-auto">
                  {item.status === 'PENDING' && (
                    <>
                      <Button className="flex-1" size="sm" loading={actionLoading === item._id} onClick={() => handleAction(item._id, item.type, isPurchase ? orders.accept : rentals.accept)}>Accept</Button>
                      <Button variant="danger" className="flex-1" size="sm" loading={actionLoading === item._id} onClick={() => handleAction(item._id, item.type, isPurchase ? orders.reject : rentals.reject)}>Reject</Button>
                    </>
                  )}
                  {(item.status === 'ACCEPTED' || item.status === 'CONFIRMED' || item.status === 'ACTIVE') && (
                    <Button 
                      className="w-full" 
                      size="sm" 
                      loading={actionLoading === item._id} 
                      onClick={() => {
                        if (isPurchase) {
                          handleAction(item._id, item.type, orders.complete);
                        } else {
                          setCompleteModalRental(item);
                        }
                      }}
                    >
                      Mark Complete
                    </Button>
                  )}
                  {item.status !== 'PENDING' && item.status !== 'ACCEPTED' && item.status !== 'CONFIRMED' && item.status !== 'ACTIVE' && (
                    <span className="text-xs text-gray-400 w-full text-center">No actions available</span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <CompleteRentalModal 
        isOpen={!!completeModalRental} 
        onClose={() => setCompleteModalRental(null)} 
        rental={completeModalRental} 
        onComplete={fetchRequests} 
      />
    </div>
  );
}
