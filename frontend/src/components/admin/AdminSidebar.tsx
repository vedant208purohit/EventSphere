import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Calendar, Users, Ticket, BarChart3, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const links = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/events', icon: Calendar, label: 'Events', end: false },
  { to: '/admin/users', icon: Users, label: 'Users', end: false },
  { to: '/admin/bookings', icon: Ticket, label: 'Bookings', end: false },
  { to: '/admin/analytics', icon: BarChart3, label: 'Analytics', end: false },
];

const AdminSidebar = () => {
  return (
    <aside className="w-64 bg-white dark:bg-surface-800 border-r border-surface-200 dark:border-surface-700 min-h-screen flex flex-col">
      <div className="p-5 border-b border-surface-200 dark:border-surface-700">
        <h2 className="text-lg font-bold gradient-text">Admin Panel</h2>
        <p className="text-xs text-surface-400 mt-1">Manage EventSphere</p>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {links.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                  : 'text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-700/50'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-surface-200 dark:border-surface-700">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Site
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
