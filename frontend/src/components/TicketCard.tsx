import { Calendar, MapPin, Ticket, IndianRupee, QrCode } from 'lucide-react';
import { Booking, Event } from '../types';
import { QRCodeSVG } from 'qrcode.react';

interface TicketCardProps {
  booking: Booking;
  onCancel?: (bookingId: string) => void;
}

const TicketCard = ({ booking, onCancel }: TicketCardProps) => {
  const event = booking.eventId as Event;
  const isPast = new Date(event.date) < new Date();

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const statusColors: Record<string, string> = {
    completed: 'badge-success',
    pending: 'badge-warning',
    failed: 'badge-danger',
    refunded: 'badge-danger',
  };

  return (
    <div className="card overflow-hidden animate-fade-in">
      <div className="flex flex-col sm:flex-row">
        {/* Event image */}
        <div className="sm:w-48 h-40 sm:h-auto flex-shrink-0">
          <img
            src={event.image || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400'}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Details */}
        <div className="flex-1 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-surface-900 dark:text-surface-50">{event.title}</h3>
              <div className="mt-2 space-y-1.5">
                <div className="flex items-center gap-2 text-sm text-surface-500">
                  <Calendar className="w-4 h-4 text-primary-500" />
                  {formatDate(event.date)} • {event.time}
                </div>
                <div className="flex items-center gap-2 text-sm text-surface-500">
                  <MapPin className="w-4 h-4 text-accent-500" />
                  {event.location}
                </div>
              </div>
            </div>
            <span className={statusColors[booking.paymentStatus] || 'badge-primary'}>
              {booking.paymentStatus}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-surface-100 dark:border-surface-700">
            <div className="flex items-center gap-1.5 text-sm">
              <Ticket className="w-4 h-4 text-primary-500" />
              <span className="text-surface-600 dark:text-surface-400">{booking.numberOfTickets} ticket(s)</span>
            </div>
            <div className="flex items-center gap-1 text-sm font-semibold text-primary-600 dark:text-primary-400">
              <IndianRupee className="w-4 h-4" />
              {booking.totalPrice.toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-surface-400">
              Booked on {formatDate(booking.bookingDate)}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 mt-4">
            {booking.paymentStatus === 'completed' && (
              <div className="flex items-center gap-2">
                {booking.ticketQRCode?.startsWith('data:image/') ? (
                   <img 
                    src={booking.ticketQRCode} 
                    alt="Ticket QR Code" 
                    className="w-12 h-12 rounded object-contain border border-surface-200"
                  />
                ) : (
                  <QRCodeSVG
                    value={booking.ticketQRCode || JSON.stringify({ bookingId: booking._id, event: event.title })}
                    size={48}
                    className="rounded"
                  />
                )}
              </div>
            )}
            {!isPast && booking.paymentStatus !== 'refunded' && booking.paymentStatus !== 'failed' && onCancel && (
              <button
                onClick={() => onCancel(booking._id)}
                className="ml-auto btn-danger text-sm"
              >
                Cancel Booking
              </button>
            )}
            {isPast && (
              <span className="ml-auto text-xs text-surface-400 italic">Event ended</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
