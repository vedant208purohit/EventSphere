import { useQuery } from '@tanstack/react-query';
import { adminService } from '../../services/adminService';
import { Users, Calendar, Ticket, IndianRupee, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#5c7cfa', '#f06595', '#51cf66', '#fcc419', '#845ef7', '#22b8cf', '#ff6b6b', '#20c997'];

const AdminDashboard = () => {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['admin', 'analytics'],
    queryFn: adminService.getAnalytics,
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-28 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="skeleton h-80 rounded-2xl" />
          <div className="skeleton h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  const statCards = [
    { label: 'Total Users', value: analytics.totalUsers, icon: Users, color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Total Events', value: analytics.totalEvents, icon: Calendar, color: 'from-emerald-500 to-emerald-600', bgColor: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { label: 'Total Bookings', value: analytics.totalBookings, icon: Ticket, color: 'from-violet-500 to-violet-600', bgColor: 'bg-violet-50 dark:bg-violet-900/20' },
    { label: 'Total Revenue', value: `₹${analytics.totalRevenue.toLocaleString('en-IN')}`, icon: IndianRupee, color: 'from-amber-500 to-amber-600', bgColor: 'bg-amber-50 dark:bg-amber-900/20' },
  ];

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const revenueChartData = analytics.revenueOverTime.map((item) => ({
    name: `${months[item._id.month - 1]} ${item._id.year}`,
    revenue: item.revenue,
    bookings: item.count,
  }));

  const bookingsChartData = analytics.bookingsPerEvent.slice(0, 8).map((item) => ({
    name: item.eventTitle.length > 15 ? item.eventTitle.substring(0, 15) + '...' : item.eventTitle,
    bookings: item.totalBookings,
    revenue: item.totalRevenue,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-surface-900 dark:text-surface-50">Dashboard</h1>
        <p className="text-sm text-surface-500 mt-1">Overview of your EventSphere platform</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, bgColor }) => (
          <div key={label} className="card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-surface-400 uppercase tracking-wider">{label}</p>
                <p className="text-2xl font-black text-surface-900 dark:text-surface-50 mt-1">{value}</p>
              </div>
              <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center`}>
                <Icon className={`w-6 h-6 bg-gradient-to-br ${color} bg-clip-text text-transparent`} style={{ color: 'inherit' }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Over Time */}
        <div className="card p-5">
          <h3 className="text-lg font-bold text-surface-900 dark:text-surface-50 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-500" /> Revenue Over Time
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={revenueChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e9ecef',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              />
              <Line type="monotone" dataKey="revenue" stroke="#5c7cfa" strokeWidth={3} dot={{ fill: '#5c7cfa', r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bookings Per Event */}
        <div className="card p-5">
          <h3 className="text-lg font-bold text-surface-900 dark:text-surface-50 mb-4 flex items-center gap-2">
            <Ticket className="w-5 h-5 text-accent-500" /> Bookings Per Event
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={bookingsChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e9ecef',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              />
              <Bar dataKey="bookings" fill="#f06595" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* User Growth */}
      {analytics.userGrowth.length > 0 && (
        <div className="card p-5">
          <h3 className="text-lg font-bold text-surface-900 dark:text-surface-50 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-500" /> User Growth
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={analytics.userGrowth.map((item) => ({
                name: `${months[item._id.month - 1]} ${item._id.year}`,
                users: item.count,
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e9ecef',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              />
              <Bar dataKey="users" fill="#51cf66" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
