import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';

const AdminPanel = () => {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-8 bg-surface-50 dark:bg-surface-900 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminPanel;
