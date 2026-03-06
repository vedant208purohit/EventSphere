import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, IndianRupee } from 'lucide-react';
import { Event } from '../types';

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const seatsPercentage = ((event.totalSeats - event.availableSeats) / event.totalSeats) * 100;

  return (
    <Link to={`/events/${event._id}`} className="card group overflow-hidden animate-fade-in">
      {/* Image */}
      <div className="relative overflow-hidden aspect-[16/10]">
        <img
          src={event.image || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800'}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="badge bg-white/90 dark:bg-surface-800/90 text-surface-700 dark:text-surface-200 backdrop-blur-sm">
            {event.category}
          </span>
        </div>

        {/* Featured badge */}
        {event.isFeatured && (
          <div className="absolute top-3 right-3">
            <span className="badge bg-gradient-to-r from-amber-400 to-orange-500 text-white">
              ★ Featured
            </span>
          </div>
        )}

        {/* Price */}
        <div className="absolute bottom-3 right-3">
          <span className="px-3 py-1.5 bg-white/95 dark:bg-surface-800/95 rounded-lg text-sm font-bold text-primary-600 dark:text-primary-400 backdrop-blur-sm flex items-center">
            <IndianRupee className="w-3.5 h-3.5" />
            {event.price.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-surface-900 dark:text-surface-50 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1">
          {event.title}
        </h3>
        
        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2 text-sm text-surface-500 dark:text-surface-400">
            <Calendar className="w-4 h-4 text-primary-500" />
            <span>{formatDate(event.date)} • {event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-surface-500 dark:text-surface-400">
            <MapPin className="w-4 h-4 text-accent-500" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
        </div>

        {/* Seats indicator */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="flex items-center gap-1 text-surface-500">
              <Users className="w-3.5 h-3.5" />
              {event.availableSeats} seats left
            </span>
            <span className="text-surface-400">{Math.round(seatsPercentage)}% booked</span>
          </div>
          <div className="w-full h-1.5 bg-surface-100 dark:bg-surface-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                seatsPercentage > 80 ? 'bg-red-500' : seatsPercentage > 50 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${seatsPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
