import { X, Minus, Plus, Ticket } from 'lucide-react';
import { useState, useEffect } from 'react';
import { enableScrollToClose, disableScrollToClose } from '../utils/overlayManager';
import { Event } from '../types';

interface BookingModalProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
  onBook: (numberOfTickets: number) => void;
  isLoading: boolean;
}

const BookingModal = ({ event, isOpen, onClose, onBook, isLoading }: BookingModalProps) => {
  const [tickets, setTickets] = useState(1);

  useEffect(() => {
    if (isOpen) {
      // close other overlays and lock scroll
      if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('close-all-overlays', { detail: { except: 'bookingModal' } }));
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      enableScrollToClose();
    } else {
      disableScrollToClose();
    }

    return () => {
      if (isOpen) disableScrollToClose();
    };
  }, [isOpen]);

  useEffect(() => {
    function handler(e: Event) {
      const ce = e as CustomEvent;
      const except = ce?.detail?.except;
      if (except !== 'bookingModal') {
        // another overlay opened; close this modal
        if (isOpen) onClose();
      }
    }

    window.addEventListener('close-all-overlays', handler as EventListener);
    return () => window.removeEventListener('close-all-overlays', handler as EventListener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;


  const maxTickets = Math.min(10, event.availableSeats);
  const totalPrice = event.price * tickets;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative card w-full max-w-md p-6 animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
            <Ticket className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-surface-900 dark:text-surface-50">Book Tickets</h3>
            <p className="text-sm text-surface-500 line-clamp-1">{event.title}</p>
          </div>
        </div>

        {/* Ticket selector */}
        <div className="bg-surface-50 dark:bg-surface-800/50 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-surface-600 dark:text-surface-400">Number of Tickets</span>
            <span className="text-xs text-surface-400">{event.availableSeats} available</span>
          </div>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setTickets(Math.max(1, tickets - 1))}
              disabled={tickets <= 1}
              className="w-10 h-10 rounded-full bg-surface-200 dark:bg-surface-700 flex items-center justify-center hover:bg-surface-300 dark:hover:bg-surface-600 transition-colors disabled:opacity-50"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-3xl font-bold text-surface-900 dark:text-surface-50 w-12 text-center">{tickets}</span>
            <button
              onClick={() => setTickets(Math.min(maxTickets, tickets + 1))}
              disabled={tickets >= maxTickets}
              className="w-10 h-10 rounded-full bg-surface-200 dark:bg-surface-700 flex items-center justify-center hover:bg-surface-300 dark:hover:bg-surface-600 transition-colors disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Price breakdown */}
        <div className="space-y-2 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-surface-500">Price per ticket</span>
            <span className="text-surface-700 dark:text-surface-300">₹{event.price.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-surface-500">Quantity</span>
            <span className="text-surface-700 dark:text-surface-300">× {tickets}</span>
          </div>
          <div className="border-t border-surface-200 dark:border-surface-700 pt-2">
            <div className="flex justify-between">
              <span className="font-semibold text-surface-900 dark:text-surface-50">Total</span>
              <span className="font-bold text-xl text-primary-600 dark:text-primary-400">₹{totalPrice.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => onBook(tickets)}
          disabled={isLoading}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Ticket className="w-5 h-5" /> Proceed to Payment
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default BookingModal;
