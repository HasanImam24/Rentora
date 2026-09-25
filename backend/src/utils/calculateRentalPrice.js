export const calculateRentalPrice = (startDate, endDate, pricePerDay) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return (diffDays === 0 ? 1 : diffDays) * pricePerDay;
};
