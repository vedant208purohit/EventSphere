import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import { useState } from 'react';
import { Menu } from 'lucide-react';

const AdminPanel = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="min-h-screen md:flex">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <AdminSidebar />
      </div>

      {/* Mobile top bar with menu button */}
      <div className="md:hidden bg-white dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700 flex items-center px-4 py-3">
        <button
          className="p-2 rounded-md hover:bg-surface-50 dark:hover:bg-surface-700/50"
          onClick={() => setShowSidebar(true)}
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5 text-surface-900 dark:text-surface-50" />
        </button>
        <h2 className="ml-3 text-lg font-bold">Admin Panel</h2>
      </div>

      {/* Mobile drawer */}
      {showSidebar && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/40" onClick={() => setShowSidebar(false)} />
          <div className="relative w-64 bg-white dark:bg-surface-800 border-r border-surface-200 dark:border-surface-700">
            <AdminSidebar onClose={() => setShowSidebar(false)} />
          </div>
        </div>
      )}

      <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-surface-50 dark:bg-surface-900 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminPanel;
