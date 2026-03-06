import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { Sun, Moon, Menu, X, Calendar, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 card-glass border-b border-surface-200/50 dark:border-surface-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">EventSphere</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-surface-600 dark:text-surface-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">
              Home
            </Link>
            <Link to="/events" className="text-surface-600 dark:text-surface-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">
              Events
            </Link>
            <Link to="/about" className="text-surface-600 dark:text-surface-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">
              About Us
            </Link>
            {user && (
              <Link to="/my-bookings" className="text-surface-600 dark:text-surface-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">
                My Bookings
              </Link>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-surface-600" />}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">{user.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-surface-700 dark:text-surface-300">{user.name}</span>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 card py-2 animate-slide-down">
                    <div className="px-4 py-2 border-b border-surface-100 dark:border-surface-700">
                      <p className="text-sm font-semibold text-surface-900 dark:text-surface-100">{user.name}</p>
                      <p className="text-xs text-surface-500">{user.email}</p>
                    </div>
                    <Link
                      to="/my-bookings"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700/50"
                    >
                      <Calendar className="w-4 h-4" /> My Bookings
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700/50"
                      >
                        <LayoutDashboard className="w-4 h-4" /> Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/login" className="btn-secondary text-sm !py-2 !px-4">Login</Link>
                <Link to="/register" className="btn-primary text-sm !py-2 !px-4">Sign Up</Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-surface-200 dark:border-surface-700 animate-slide-down">
          <div className="px-4 py-3 space-y-2">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-lg text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800">Home</Link>
            <Link to="/events" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-lg text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800">Events</Link>
            <Link to="/about" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-lg text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800">About Us</Link>
            {user && (
              <Link to="/my-bookings" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-lg text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800">My Bookings</Link>
            )}
            {!user && (
              <div className="flex gap-2 pt-2">
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="btn-secondary text-sm !py-2 flex-1 text-center">Login</Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)} className="btn-primary text-sm !py-2 flex-1 text-center">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
