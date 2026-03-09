import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { adminService } from '../../services/adminService';
import { Shield, ShieldOff, Mail } from 'lucide-react';
import { User } from '../../types';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const queryClient = useQueryClient();

  const { data: users, isLoading, isError } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: adminService.getUsers,
  });

  const toggleBlockMutation = useMutation({
    mutationFn: adminService.toggleBlockUser,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
    onError: () => toast.error('Failed'),
  });

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  // defensive: API may return an array or an object like { users: [...] }
  const allUsers: User[] = Array.isArray(users) ? users : (users && (users as any).users) ? (users as any).users : [];

  const [page, setPage] = useState(1);
  const perPage = 10;
  const total = allUsers.length || 0;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const pagedUsers = allUsers.slice((page - 1) * perPage, page * perPage);

  if (isLoading) {
    return <div className="space-y-3 animate-pulse">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-14 rounded-xl" />)}</div>;
  }

  if (isError) {
    return <div className="p-6">Unable to load users. Please refresh or check server logs.</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-surface-900 dark:text-surface-50">Users</h1>
        <p className="text-sm text-surface-500 mt-1">{total} registered users</p>
      </div>

      <div className="card overflow-hidden">
        {/* Mobile list */}
        <div className="md:hidden space-y-3 p-4">
          {pagedUsers?.map((user: User) => (
            <div key={user._id} className="flex items-center justify-between p-3 bg-surface-50 dark:bg-surface-800/40 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">{user.name.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-surface-900 dark:text-surface-100">{user.name}</p>
                  <p className="text-xs text-surface-400">{user.email}</p>
                </div>
              </div>
              <div className="text-right flex items-center gap-2">
                <span className={user.isBlocked ? 'badge-danger' : 'badge-success'}>{user.isBlocked ? 'Blocked' : 'Active'}</span>
                {user.role !== 'admin' && (
                  <button
                    onClick={() => toggleBlockMutation.mutate(user._id)}
                    className={`p-2 rounded-lg transition-colors ${
                      user.isBlocked
                        ? 'hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-emerald-600'
                        : 'hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500'
                    }`}
                    title={user.isBlocked ? 'Unblock' : 'Block'}
                  >
                    {user.isBlocked ? <Shield className="w-4 h-4" /> : <ShieldOff className="w-4 h-4" />}
                  </button>
                )}
              </div>
            </div>
          ))}
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
                <th className="px-5 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Role</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Joined</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-surface-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100 dark:divide-surface-700">
              {pagedUsers?.map((user: User) => (
                <tr key={user._id} className="hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">{user.name.charAt(0).toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-surface-900 dark:text-surface-100">{user.name}</p>
                        <p className="text-xs text-surface-400 flex items-center gap-1"><Mail className="w-3 h-3" />{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={user.role === 'admin' ? 'badge bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300' : 'badge-primary'}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={user.isBlocked ? 'badge-danger' : 'badge-success'}>
                      {user.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-surface-600 dark:text-surface-400">{formatDate(user.createdAt)}</td>
                  <td className="px-5 py-4 text-right">
                    {user.role !== 'admin' && (
                      <button
                        onClick={() => toggleBlockMutation.mutate(user._id)}
                        className={`p-2 rounded-lg transition-colors ${
                          user.isBlocked
                            ? 'hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-emerald-600'
                            : 'hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500'
                        }`}
                        title={user.isBlocked ? 'Unblock' : 'Block'}
                      >
                        {user.isBlocked ? <Shield className="w-4 h-4" /> : <ShieldOff className="w-4 h-4" />}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
