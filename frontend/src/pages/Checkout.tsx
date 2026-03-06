import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId');

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card max-w-md w-full p-8 text-center animate-scale-in">
        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-emerald-500" />
        </div>
        <h1 className="text-2xl font-black text-surface-900 dark:text-surface-50 mb-2">Booking Confirmed!</h1>
        <p className="text-surface-500 mb-6">
          Your tickets have been booked successfully. You can view your tickets and QR codes in My Bookings.
        </p>
        {bookingId && (
          <p className="text-xs text-surface-400 mb-6">Booking ID: {bookingId}</p>
        )}
        <div className="flex gap-3">
          <button onClick={() => navigate('/my-bookings')} className="btn-primary flex-1">
            View My Bookings
          </button>
          <button onClick={() => navigate('/')} className="btn-secondary flex-1">
            Browse Events
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
