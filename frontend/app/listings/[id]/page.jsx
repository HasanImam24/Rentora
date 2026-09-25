'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { listings, orders } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency, getConditionLabel, formatDate } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import RentalModal from '@/components/rental/RentalModal';
import toast from 'react-hot-toast';
import { MapPin, Shield, Calendar, User, Clock, CheckCircle } from 'lucide-react';

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [isRentalModalOpen, setIsRentalModalOpen] = useState(false);
  const [buyLoading, setBuyLoading] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await listings.getById(params.id);
        setListing(res.data.data || res.data);
      } catch (error) {
        toast.error('Listing not found');
        router.push('/listings');
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchListing();
  }, [params.id, router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  if (!listing) return null;

  const isOwner = user?._id === listing.ownerId?._id || user?._id === listing.ownerId;

  const handleBuyNow = async () => {
    if (!user) {
      toast.error('Please login to purchase items');
      return router.push(`/login?redirect=/listings/${listing._id}`);
    }
    
    if (window.confirm(`Confirm purchase for ${formatCurrency(listing.salePrice)}?`)) {
      try {
        setBuyLoading(true);
        await orders.create({ listingId: listing._id });
        toast.success('Purchase successful!');
        router.push('/dashboard/purchases');
      } catch (error) {
        toast.error(error.message || 'Failed to complete purchase');
      } finally {
        setBuyLoading(false);
      }
    }
  };

  const images = listing.images?.length > 0 ? listing.images : [{ url: 'https://images.unsplash.com/photo-1513161455079-7dc1de15ef3e?w=800' }];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Left Col - Images */}
        <div className="space-y-4">
          <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
            <Image 
              src={images[activeImage].url} 
              alt={listing.title} 
              fill 
              className="object-cover"
              priority
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${activeImage === idx ? 'border-indigo-600' : 'border-transparent hover:border-gray-300'}`}
                >
                  <Image src={img.url} alt={`Thumbnail ${idx}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Col - Details */}
        <div className="flex flex-col">
          <div className="mb-2 flex gap-2">
            <Badge status={listing.status} />
            <Badge status={listing.category} className="bg-gray-100 text-gray-800" />
            {listing.condition && (
              <Badge status={listing.condition} label={getConditionLabel(listing.condition)} className="bg-blue-50 text-blue-700" />
            )}
          </div>
          
          <h1 className="text-3xl font-extrabold text-gray-900 mt-2 mb-4">{listing.title}</h1>
          
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-200">
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Local Area</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Listed {formatDate(listing.createdAt)}</span>
          </div>

          <div className="space-y-6 flex-grow">
            {/* Pricing Box */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 flex flex-col sm:flex-row gap-6 justify-between">
              {['RENT', 'RENT_AND_SALE'].includes(listing.transactionType) && (
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Rent for</p>
                  <p className="text-3xl font-bold text-indigo-600 mt-1">
                    {formatCurrency(listing.rentalPrice?.amount)} <span className="text-base font-normal text-gray-500">/{listing.rentalPrice?.unit}</span>
                  </p>
                  {listing.securityDeposit > 0 && (
                    <p className="text-xs text-gray-500 mt-2">+ {formatCurrency(listing.securityDeposit)} deposit</p>
                  )}
                  {!isOwner && listing.status === 'ACTIVE' && (
                    <Button 
                      className="w-full mt-4" 
                      onClick={() => user ? setIsRentalModalOpen(true) : router.push(`/login?redirect=/listings/${listing._id}`)}
                    >
                      Request to Rent
                    </Button>
                  )}
                </div>
              )}
              
              {listing.transactionType === 'RENT_AND_SALE' && (
                <div className="hidden sm:block w-px bg-gray-300"></div>
              )}

              {['SALE', 'RENT_AND_SALE'].includes(listing.transactionType) && (
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Buy for</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {formatCurrency(listing.salePrice)}
                  </p>
                  {!isOwner && listing.status === 'ACTIVE' && (
                    <Button 
                      variant={listing.transactionType === 'RENT_AND_SALE' ? 'secondary' : 'primary'} 
                      className="w-full mt-4 bg-purple-600 text-white hover:bg-purple-700 border-none"
                      onClick={handleBuyNow}
                      loading={buyLoading}
                    >
                      Buy Now
                    </Button>
                  )}
                </div>
              )}
            </div>

            {isOwner && (
              <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg flex justify-between items-center">
                <span className="font-medium">This is your listing</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/listings`)}>Manage</Button>
                </div>
              </div>
            )}

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-600 whitespace-pre-line leading-relaxed">{listing.description}</p>
            </div>

            {/* Owner Info */}
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Lender Details</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-xl">
                    {listing.ownerId?.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{listing.ownerId?.name || 'User'}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      <Shield className="w-3 h-3 text-green-500" /> Verified Member
                    </div>
                  </div>
                </div>
                {!isOwner && (
                  <Button variant="outline" size="sm">Contact</Button>
                )}
              </div>
            </div>
            
          </div>
        </div>
      </div>

      <RentalModal 
        isOpen={isRentalModalOpen} 
        onClose={() => setIsRentalModalOpen(false)} 
        listing={listing} 
      />
    </div>
  );
}
