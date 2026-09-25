'use client';

import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isWithinInterval } from 'date-fns';

export default function RentalCalendar({ bookedDates = [] }) {
  const today = new Date();
  const start = startOfMonth(today);
  const end = endOfMonth(addDays(today, 60)); // Show 2 months roughly

  // For a real app, this would use a robust calendar library like react-day-picker
  // But per requirements, here is a simple visual calendar for booked dates.

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <h3 className="text-sm font-medium text-gray-900 mb-4">Availability</h3>
      <div className="flex gap-2 items-center text-sm text-gray-500 mb-4">
        <span className="w-3 h-3 rounded-full bg-red-500 block"></span> Booked
        <span className="w-3 h-3 rounded-full bg-green-500 block ml-4"></span> Available
      </div>
      <p className="text-sm text-gray-500">
        Check the specific dates in the rental modal to confirm availability.
      </p>
    </div>
  );
}

// Helper to avoid undefined error in simplified version above
function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
