import { useQuery } from '@tanstack/react-query';
import { adminService } from '../../services/adminService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { TrendingUp, CalendarDays, IndianRupee, Award } from 'lucide-react';

const AdminAnalytics = () => {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['admin', 'analytics'],
    queryFn: adminService.getAnalytics,
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        {Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-80 rounded-2xl" />)}
      </div>
    );
  }

  if (!analytics) return null;

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const dailyData = analytics.dailyBookings.map((item) => ({
    date: item._id,
    bookings: item.count,
    revenue: item.revenue,
  }));

  const topEvents = analytics.bookingsPerEvent.map((item) => ({
    name: item.eventTitle.length > 20 ? item.eventTitle.substring(0, 20) + '...' : item.eventTitle,
    revenue: item.totalRevenue,
    tickets: item.totalTickets,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-surface-900 dark:text-surface-50">Analytics</h1>
        <p className="text-sm text-surface-500 mt-1">Detailed platform analytics and insights</p>
      </div>

      {/* Daily Booking Stats */}
      <div className="card p-5">
        <h3 className="text-lg font-bold text-surface-900 dark:text-surface-50 mb-4 flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-primary-500" /> Daily Booking Stats (Last 30 Days)
        </h3>
        {dailyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dailyData}>
              <defs>
                <linearGradient id="bookingGr" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5c7cfa" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#5c7cfa" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e9ecef', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="bookings" stroke="#5c7cfa" fillOpacity={1} fill="url(#bookingGr)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center py-10 text-surface-400">No booking data for the last 30 days</p>
        )}
      </div>

      {/* Top Events by Revenue */}
      <div className="card p-5">
        <h3 className="text-lg font-bold text-surface-900 dark:text-surface-50 mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" /> Top Events by Revenue
        </h3>
        {topEvents.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topEvents} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={150} />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e9ecef', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="revenue" fill="#f06595" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center py-10 text-surface-400">No event revenue data yet</p>
        )}
      </div>

      {/* Ticket Sales */}
      <div className="card p-5">
        <h3 className="text-lg font-bold text-surface-900 dark:text-surface-50 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-500" /> Ticket Sales Trends
        </h3>
        {topEvents.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topEvents}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e9ecef', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="tickets" fill="#51cf66" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center py-10 text-surface-400">No ticket sales data yet</p>
        )}
      </div>
    </div>
  );
};

export default AdminAnalytics;
