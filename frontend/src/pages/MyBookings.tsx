import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingService } from '../services/bookingService';
import TicketCard from '../components/TicketCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { Ticket, CalendarDays, History } from 'lucide-react';
import toast from 'react-hot-toast';
import { Booking, Event } from '../types';

const MyBookings = () => {
  const queryClient = useQueryClient();

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['bookings', 'user'],
    queryFn: bookingService.getUserBookings,
  });

  const cancelMutation = useMutation({
    mutationFn: bookingService.cancelBooking,
    onSuccess: () => {
      toast.success('Booking cancelled successfully');
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    },
  });

  const handleCancel = (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      cancelMutation.mutate(bookingId);
    }
  };

  // Filter out bookings with missing event data (e.g. deleted events)
  const validBookings = bookings?.filter((b: Booking) => b.eventId && typeof b.eventId === 'object') || [];

  const upcomingBookings = validBookings.filter((b: Booking) => {
    const event = b.eventId as Event;
    return new Date(event.date) >= new Date() && b.paymentStatus !== 'refunded';
  });

  const pastBookings = validBookings.filter((b: Booking) => {
    const event = b.eventId as Event;
    return new Date(event.date) < new Date() || b.paymentStatus === 'refunded';
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <LoadingSkeleton type="table" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
          <Ticket className="w-6 h-6 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-surface-900 dark:text-surface-50">My Bookings</h1>
          <p className="text-sm text-surface-500">{bookings?.length || 0} total bookings</p>
        </div>
      </div>

      {!bookings?.length ? (
        <div className="text-center py-20">
          <Ticket className="w-16 h-16 mx-auto text-surface-300 dark:text-surface-600 mb-4" />
          <h3 className="text-xl font-semibold text-surface-500 mb-2">No bookings yet</h3>
          <p className="text-surface-400">Start exploring events and book your first ticket!</p>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Upcoming */}
          {upcomingBookings.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <CalendarDays className="w-5 h-5 text-emerald-500" />
                <h2 className="text-lg font-bold text-surface-900 dark:text-surface-50">Upcoming ({upcomingBookings.length})</h2>
              </div>
              <div className="space-y-4">
                {upcomingBookings.map((booking: Booking) => (
                  <TicketCard key={booking._id} booking={booking} onCancel={handleCancel} />
                ))}
              </div>
            </section>
          )}

          {/* Past */}
          {pastBookings.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <History className="w-5 h-5 text-surface-400" />
                <h2 className="text-lg font-bold text-surface-900 dark:text-surface-50">Past Bookings ({pastBookings.length})</h2>
              </div>
              <div className="space-y-4 opacity-75">
                {pastBookings.map((booking: Booking) => (
                  <TicketCard key={booking._id} booking={booking} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
