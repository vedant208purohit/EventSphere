import { Link } from 'react-router-dom';
import { Calendar, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-surface-900 dark:bg-surface-900 text-surface-300 border-t border-surface-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">EventSphere</span>
            </div>
            <p className="text-surface-400 text-sm leading-relaxed max-w-md">
              Discover and book amazing events near you. From tech summits to music concerts,
              sports events to art exhibitions — find your next unforgettable experience.
            </p>
            <div className="flex items-center gap-4 mt-4 text-sm text-surface-500">
              <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> hello@eventsphere.com</span>
              <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> +91 98765 43210</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/" className="block text-sm text-surface-400 hover:text-primary-400 transition-colors">Home</Link>
              <Link to="/events" className="block text-sm text-surface-400 hover:text-primary-400 transition-colors">Browse Events</Link>
              <Link to="/about" className="block text-sm text-surface-400 hover:text-primary-400 transition-colors">About Us</Link>
              <Link to="/my-bookings" className="block text-sm text-surface-400 hover:text-primary-400 transition-colors">My Bookings</Link>
              <Link to="/login" className="block text-sm text-surface-400 hover:text-primary-400 transition-colors">Login</Link>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <div className="space-y-2">
              {['Music', 'Sports', 'Technology', 'Art', 'Food', 'Business'].map((cat) => (
                <Link
                  key={cat}
                  to={`/events?category=${cat}`}
                  className="block text-sm text-surface-400 hover:text-primary-400 transition-colors"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-surface-800 mt-10 pt-6 text-center text-xs text-surface-500">
          <p>&copy; {new Date().getFullYear()} EventSphere. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
