import React from 'react';
import ListingCard from './ListingCard';
import { PackageX } from 'lucide-react';

export default function ListingGrid({ listings, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse bg-white rounded-xl overflow-hidden border border-gray-100 h-80 flex flex-col">
            <div className="bg-gray-200 h-48 w-full"></div>
            <div className="p-4 flex flex-col gap-3 flex-grow">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="mt-auto h-8 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!listings || listings.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">
        <PackageX className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">No listings found</h3>
        <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {listings.map((listing) => (
        <ListingCard key={listing._id} listing={listing} />
      ))}
    </div>
  );
}
