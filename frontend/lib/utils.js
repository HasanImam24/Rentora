import { format } from 'date-fns';

export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (dateString, formatStr = 'MMM dd, yyyy') => {
  if (!dateString) return '';
  return format(new Date(dateString), formatStr);
};

export const getStatusColor = (status) => {
  const s = status?.toLowerCase();
  switch (s) {
    case 'active':
    case 'completed':
    case 'confirmed':
    case 'resolved':
      return 'bg-green-100 text-green-800';
    case 'pending':
    case 'open':
      return 'bg-yellow-100 text-yellow-800';
    case 'suspended':
    case 'cancelled':
    case 'rejected':
    case 'inactive':
      return 'bg-red-100 text-red-800';
    case 'rented':
    case 'sold':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const getConditionLabel = (condition) => {
  const map = {
    new: 'Brand New',
    like_new: 'Like New',
    good: 'Good',
    fair: 'Fair',
    poor: 'Poor'
  };
  return map[condition?.toLowerCase()] || condition;
};
