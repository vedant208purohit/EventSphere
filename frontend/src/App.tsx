import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import MyBookings from './pages/MyBookings';
import Checkout from './pages/Checkout';
import AboutUs from './pages/AboutUs';
import AdminPanel from './pages/AdminPanel';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminEvents from './components/admin/AdminEvents';
import AdminUsers from './components/admin/AdminUsers';
import AdminBookings from './components/admin/AdminBookings';
import AdminAnalytics from './components/admin/AdminAnalytics';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Routes>
        {/* Admin routes (no Navbar/Footer) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminPanel />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="analytics" element={<AdminAnalytics />} />
        </Route>

        {/* Auth routes (no Navbar/Footer) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Public and user routes with Navbar/Footer */}
        <Route
          path="*"
          element={
            <>
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/events/:id" element={<EventDetails />} />
                  <Route path="/about" element={<AboutUs />} />
                  <Route
                    path="/my-bookings"
                    element={
                      <ProtectedRoute>
                        <MyBookings />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/checkout"
                    element={
                      <ProtectedRoute>
                        <Checkout />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </main>
              <Footer />
            </>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
