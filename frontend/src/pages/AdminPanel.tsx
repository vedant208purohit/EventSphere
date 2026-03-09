import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { enableScrollToClose, disableScrollToClose } from '../utils/overlayManager';

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
          onClick={() => {
            // Close other overlays and open sidebar
            if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('close-all-overlays', { detail: { except: 'sidebar' } }));
            setShowSidebar(true);
          }}
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

      {/* prevent background scroll when sidebar is open and listen for global overlay-close events */}
      <>
        <EffectWrapper showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      </>

      <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-surface-50 dark:bg-surface-900 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

const EffectWrapper = ({ showSidebar, setShowSidebar }: { showSidebar: boolean; setShowSidebar: (v: boolean) => void }) => {
  useEffect(() => {
    if (showSidebar) enableScrollToClose();
    else disableScrollToClose();

    return () => {
      if (showSidebar) disableScrollToClose();
    };
  }, [showSidebar]);

  useEffect(() => {
    function handler(e: Event) {
      const ce = e as CustomEvent;
      const except = ce?.detail?.except;
      if (except !== 'sidebar') {
        setShowSidebar(false);
      }
    }

    window.addEventListener('close-all-overlays', handler as EventListener);
    return () => window.removeEventListener('close-all-overlays', handler as EventListener);
  }, [setShowSidebar]);

  return null;
};

export default AdminPanel;
