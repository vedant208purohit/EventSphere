import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventService } from '../services/eventService';
import { bookingService } from '../services/bookingService';
import { paymentService } from '../services/paymentService';
import { useAuth } from '../hooks/useAuth';
import BookingModal from '../components/BookingModal';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { Calendar, MapPin, Users, IndianRupee, Clock, Tag, User, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showBooking, setShowBooking] = useState(false);

  const { data: event, isLoading } = useQuery({
    queryKey: ['event', id],
    queryFn: () => eventService.getEventById(id!),
    enabled: !!id,
  });

  const [isPaymentLoading, setIsPaymentLoading] = useState(false);

  const handleBook = async (numberOfTickets: number) => {
    if (!user) {
      navigate('/login');
      return;
    }

    setIsPaymentLoading(true);
    try {
      // Step 1: Create booking (pending status)
      const booking = await bookingService.createBooking({ eventId: id!, numberOfTickets });
      const bookingId = booking._id;

      // Step 2: Create Razorpay order
      const order = await paymentService.createOrder(bookingId);

      // Step 3: Open Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_YourKeyHere',
        amount: order.amount,
        currency: order.currency,
        name: 'EventSphere',
        description: `Tickets for ${event?.title}`,
        order_id: order.orderId,
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          try {
            // Step 4: Verify payment
            await paymentService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId,
            });
            toast.success('Payment successful! Booking confirmed.');
            queryClient.invalidateQueries({ queryKey: ['event', id] });
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
            setShowBooking(false);
            navigate('/my-bookings');
          } catch {
            toast.error('Payment verification failed. Contact support.');
          }
        },
        modal: {
          ondismiss: () => {
            toast.error('Payment was cancelled.');
            setIsPaymentLoading(false);
          },
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: '#5c7cfa',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Booking failed');
    } finally {
      setIsPaymentLoading(false);
    }
  };

  if (isLoading) return <LoadingSkeleton type="detail" />;
  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-50 mb-2">Event not found</h2>
          <button onClick={() => navigate('/')} className="btn-primary mt-4">Go Home</button>
        </div>
      </div>
    );
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const isPast = new Date(event.date) < new Date();
  const seatsPercentage = ((event.totalSeats - event.availableSeats) / event.totalSeats) * 100;

  return (
    <div className="min-h-screen">
      {/* Hero Image */}
      <div className="relative h-[400px] lg:h-[500px]">
        <img
          src={event.image || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200'}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 p-2 bg-white/20 backdrop-blur-sm rounded-xl text-white hover:bg-white/30 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-10">
          <div className="max-w-7xl mx-auto">
            <span className="badge bg-white/20 backdrop-blur-sm text-white mb-4">
              {event.category}
            </span>
            <h1 className="text-3xl lg:text-5xl font-black text-white mb-3">{event.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {formatDate(event.date)}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {event.time}</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {event.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="card p-6">
              <h2 className="text-xl font-bold text-surface-900 dark:text-surface-50 mb-4">About This Event</h2>
              <p className="text-surface-600 dark:text-surface-400 leading-relaxed whitespace-pre-wrap">
                {event.description}
              </p>
            </div>

            <div className="card p-6">
              <h2 className="text-xl font-bold text-surface-900 dark:text-surface-50 mb-4">Event Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: Calendar, label: 'Date', value: formatDate(event.date), color: 'text-primary-500' },
                  { icon: Clock, label: 'Time', value: event.time, color: 'text-emerald-500' },
                  { icon: MapPin, label: 'Location', value: event.location, color: 'text-accent-500' },
                  { icon: Tag, label: 'Category', value: event.category, color: 'text-amber-500' },
                  { icon: User, label: 'Organizer', value: event.organizer, color: 'text-violet-500' },
                  { icon: Users, label: 'Total Capacity', value: `${event.totalSeats} seats`, color: 'text-cyan-500' },
                ].map(({ icon: Icon, label, value, color }) => (
                  <div key={label} className="flex items-start gap-3 p-3 bg-surface-50 dark:bg-surface-800/50 rounded-xl">
                    <Icon className={`w-5 h-5 ${color} mt-0.5`} />
                    <div>
                      <p className="text-xs text-surface-600 dark:text-surface-400 font-medium">{label}</p>
                      <p className="text-sm text-surface-800 dark:text-surface-200 font-medium">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Booking */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-20">
              <div className="text-center mb-6">
                <p className="text-sm text-surface-600 dark:text-surface-400 mb-1 font-medium">Price per ticket</p>
                <div className="flex items-center justify-center gap-1 text-3xl font-black text-primary-600 dark:text-primary-400">
                  <IndianRupee className="w-7 h-7" />
                  {event.price.toLocaleString('en-IN')}
                </div>
              </div>

              {/* Seats */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                    <span className="text-surface-700 dark:text-surface-500">Available Seats</span>
                  <span className="font-semibold text-surface-900 dark:text-surface-50">
                    {event.availableSeats} / {event.totalSeats}
                  </span>
                </div>
                <div className="w-full h-2 bg-surface-100 dark:bg-surface-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      seatsPercentage > 80 ? 'bg-red-500' : seatsPercentage > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${seatsPercentage}%` }}
                  />
                </div>
                {event.availableSeats < 20 && event.availableSeats > 0 && (
                  <p className="text-xs text-red-500 mt-2 font-medium">🔥 Only {event.availableSeats} seats left!</p>
                )}
              </div>

              {isPast ? (
                <div className="text-center py-4 bg-surface-100 dark:bg-surface-800 rounded-xl">
                  <p className="text-surface-500 font-medium">This event has ended</p>
                </div>
              ) : event.availableSeats === 0 ? (
                <div className="text-center py-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
                  <p className="text-red-500 font-medium">Sold Out</p>
                </div>
              ) : (
                <button
                  onClick={() => setShowBooking(true)}
                  className="btn-primary w-full text-lg"
                >
                  Book Now
                </button>
              )}

              <p className="text-xs text-center text-surface-500 dark:text-surface-400 mt-3">
                Free cancellation up to event date
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {event && (
        <BookingModal
          event={event}
          isOpen={showBooking}
          onClose={() => setShowBooking(false)}
          onBook={handleBook}
          isLoading={isPaymentLoading}
        />
      )}
    </div>
  );
};

export default EventDetails;
