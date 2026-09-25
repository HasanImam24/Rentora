import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getConditionLabel, formatCurrency } from '@/lib/utils';
import Badge from '../ui/Badge';

export default function ListingCard({ listing }) {
  const imageUrl = listing.images?.[0]?.url || 'https://images.unsplash.com/photo-1513161455079-7dc1de15ef3e?w=800&q=80';
  
  return (
    <Link href={`/listings/${listing._id}`} className="group block h-full">
      <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm transition-all duration-200 hover:shadow-md hover:border-indigo-300 h-full flex flex-col">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
          <Image 
            src={imageUrl} 
            alt={listing.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
          />
          <div className="absolute top-2 right-2 flex gap-1">
            {['RENT', 'RENT_AND_SALE'].includes(listing.transactionType) ? (
              <Badge status="rented" label="For Rent" className="shadow-sm" />
            ) : null}
            {['SALE', 'RENT_AND_SALE'].includes(listing.transactionType) ? (
              <Badge status="sold" label="For Sale" className="shadow-sm bg-purple-100 text-purple-800" />
            ) : null}
          </div>
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
              {listing.title}
            </h3>
          </div>
          
          <div className="flex items-center gap-2 mb-3 mt-auto">
            <span className="text-xs text-gray-500 uppercase tracking-wider">{listing.category}</span>
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            <span className="text-xs text-gray-500">{getConditionLabel(listing.condition)}</span>
          </div>

          <div className="mt-auto border-t border-gray-100 pt-3 flex flex-col gap-1">
            {['RENT', 'RENT_AND_SALE'].includes(listing.transactionType) && (
              <div className="flex justify-between items-end">
                <span className="text-sm text-gray-500">Rent</span>
                <span className="font-bold text-indigo-600">
                  {formatCurrency(listing.rentalPrice?.amount)} <span className="text-xs text-gray-500 font-normal">/{listing.rentalPrice?.unit}</span>
                </span>
              </div>
            )}
            {['SALE', 'RENT_AND_SALE'].includes(listing.transactionType) && (
              <div className="flex justify-between items-end mt-1">
                <span className="text-sm text-gray-500">Buy</span>
                <span className="font-bold text-gray-900">
                  {formatCurrency(listing.salePrice)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
