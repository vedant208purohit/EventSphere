import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { bookingService } from '../../services/bookingService';
import { Booking, User, Event } from '../../types';
import { Ticket, IndianRupee, X } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminBookings = () => {
  const queryClient = useQueryClient();

  const { data: bookings, isLoading, isError } = useQuery({
    queryKey: ['admin', 'bookings'],
    queryFn: bookingService.getAllBookings,
  });

  const cancelMutation = useMutation({
    mutationFn: bookingService.cancelBooking,
    onSuccess: () => {
      toast.success('Booking cancelled');
      queryClient.invalidateQueries({ queryKey: ['admin', 'bookings'] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed'),
  });

  const handleCancel = (id: string) => {
    if (window.confirm('Cancel this booking?')) cancelMutation.mutate(id);
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const statusColors: Record<string, string> = {
    completed: 'badge-success',
    pending: 'badge-warning',
    failed: 'badge-danger',
    refunded: 'badge-danger',
  };
  // normalize response shape (array or { bookings: [] })
  const allBookings: Booking[] = Array.isArray(bookings) ? bookings : (bookings && (bookings as any).bookings) ? (bookings as any).bookings : [];

  const [page, setPage] = useState(1);
  const perPage = 10;
  const total = allBookings.length || 0;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const pagedBookings = allBookings.slice((page - 1) * perPage, page * perPage);

  if (isLoading) {
    return <div className="space-y-3 animate-pulse">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-14 rounded-xl" />)}</div>;
  }

  if (isError) {
    return <div className="p-6">Unable to load bookings. Please refresh or check server logs.</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-surface-900 dark:text-surface-50">Bookings</h1>
        <p className="text-sm text-surface-500 mt-1">{total} total bookings</p>
      </div>

      <div className="card overflow-hidden">
        {/* Mobile list */}
        <div className="md:hidden p-4 space-y-3">
          {pagedBookings?.map((booking: Booking) => {
            const user = booking.userId as User;
            const event = booking.eventId as Event;
            return (
              <div key={booking._id} className="p-3 bg-surface-50 dark:bg-surface-800/40 rounded-xl flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-surface-900 dark:text-surface-100">{event?.title || 'N/A'}</p>
                  <p className="text-xs text-surface-400">{user?.name || 'N/A'} • {booking.numberOfTickets} tickets</p>
                  <p className="text-sm font-semibold mt-2">₹{booking.totalPrice.toLocaleString('en-IN')}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={statusColors[booking.paymentStatus]}>{booking.paymentStatus}</span>
                  {booking.paymentStatus !== 'refunded' && booking.paymentStatus !== 'failed' && (
                    <button
                      onClick={() => handleCancel(booking._id)}
                      className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors"
                      title="Cancel Booking"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="p-4 flex items-center justify-between">
          <div className="text-sm text-surface-500">Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, total)} of {total}</div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 rounded-lg border hover:bg-surface-100 dark:hover:bg-surface-800/20 disabled:opacity-50"
            >
              Prev
            </button>
            <div className="text-sm">{page} / {totalPages}</div>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 rounded-lg border hover:bg-surface-100 dark:hover:bg-surface-800/20 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-surface-50 dark:bg-surface-800/50 border-b border-surface-200 dark:border-surface-700">
                <th className="px-5 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">User</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Event</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Tickets</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Amount</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Date</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-surface-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100 dark:divide-surface-700">
              {pagedBookings?.map((booking: Booking) => {
                const user = booking.userId as User;
                const event = booking.eventId as Event;
                return (
                  <tr key={booking._id} className="hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors">
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-surface-900 dark:text-surface-100">{user?.name || 'N/A'}</p>
                      <p className="text-xs text-surface-400">{user?.email || ''}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-surface-600 dark:text-surface-400 max-w-[200px] truncate">
                      {event?.title || 'N/A'}
                    </td>
                    <td className="px-5 py-4 text-sm text-surface-700 dark:text-surface-300 flex items-center gap-1">
                      <Ticket className="w-3.5 h-3.5" /> {booking.numberOfTickets}
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-surface-900 dark:text-surface-100 flex items-center gap-0.5">
                      <IndianRupee className="w-3.5 h-3.5" />{booking.totalPrice.toLocaleString('en-IN')}
                    </td>
                    <td className="px-5 py-4">
                      <span className={statusColors[booking.paymentStatus]}>{booking.paymentStatus}</span>
                    </td>
                    <td className="px-5 py-4 text-sm text-surface-600 dark:text-surface-400">{formatDate(booking.bookingDate)}</td>
                    <td className="px-5 py-4 text-right">
                      {booking.paymentStatus !== 'refunded' && booking.paymentStatus !== 'failed' && (
                        <button
                          onClick={() => handleCancel(booking._id)}
                          className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors"
                          title="Cancel Booking"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminBookings;
