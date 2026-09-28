import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { listings, rentals } from '@/lib/api';
import toast from 'react-hot-toast';

export default function CompleteRentalModal({ isOpen, onClose, rental, onComplete }) {
  const [loading, setLoading] = useState(false);

  if (!rental) return null;

  const handleChoice = async (makeAvailable) => {
    try {
      setLoading(true);
      
      // First mark the rental as complete
      await rentals.complete(rental._id);
      
      // Then handle the listing visibility
      if (makeAvailable) {
        await listings.update(rental.listingId._id || rental.listingId, { status: 'ACTIVE' });
      } else {
        await listings.delete(rental.listingId._id || rental.listingId);
      }
      
      toast.success(makeAvailable ? 'Item marked complete and is available again.' : 'Item marked complete and removed from marketplace.');
      onComplete();
      onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to complete rental action');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Complete Rental">
      <div className="space-y-4">
        <p className="text-gray-600">
          The rental period for <strong>{rental.listingId?.title}</strong> is now finished. 
        </p>
        <p className="font-medium text-gray-900">
          Would you like to make this item available again on the marketplace?
        </p>
        
        <div className="pt-4 flex flex-col gap-3">
          <Button 
            className="w-full bg-green-600 hover:bg-green-700" 
            loading={loading}
            onClick={() => handleChoice(true)}
          >
            Yes, make it Available
          </Button>
          
          <Button 
            variant="danger" 
            className="w-full" 
            loading={loading}
            onClick={() => handleChoice(false)}
          >
            No, Delete the listing
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full" 
            disabled={loading}
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
