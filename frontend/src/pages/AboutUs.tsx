import { Link } from 'react-router-dom';
import { Calendar, Users, Globe, Heart, Shield, Zap, Target, Award, ArrowRight } from 'lucide-react';

const values = [
  { icon: Heart, title: 'Passion for Events', desc: 'We believe every event is an opportunity to create lasting memories and meaningful connections.', color: 'text-rose-500', bg: 'bg-rose-100 dark:bg-rose-900/30' },
  { icon: Shield, title: 'Trust & Security', desc: 'Every payment is secured via Razorpay. Your data and transactions are always protected.', color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  { icon: Zap, title: 'Instant Booking', desc: 'Book tickets in seconds with our streamlined checkout. Get your QR tickets instantly.', color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/30' },
  { icon: Globe, title: 'Pan-India Reach', desc: 'Events from 50+ cities across India. Whether it\'s Mumbai or Shillong, we\'ve got you covered.', color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
];

const team = [
  { name: 'Vedant Purohit', role: 'Founder & CEO', initials: 'VP', gradient: 'from-primary-500 to-blue-500' },
  { name: 'Sneha Reddy', role: 'Head of Product', initials: 'SR', gradient: 'from-accent-500 to-pink-500' },
  { name: 'Vikram Singh', role: 'CTO', initials: 'VS', gradient: 'from-emerald-500 to-teal-500' },
  { name: 'Meera Joshi', role: 'Head of Design', initials: 'MJ', gradient: 'from-violet-500 to-purple-500' },
];

const AboutUs = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-accent-700 text-white py-20 lg:py-28">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-20 w-72 h-72 bg-accent-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6">
            About <span className="bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">EventSphere</span>
          </h1>
          <p className="text-lg text-primary-100 max-w-2xl mx-auto leading-relaxed">
            We're on a mission to connect people with extraordinary experiences. EventSphere is India's fastest-growing event discovery and booking platform.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 rounded-full text-sm font-medium text-primary-700 dark:text-primary-300 mb-4">
              <Target className="w-4 h-4" /> Our Mission
            </div>
            <h2 className="text-3xl font-black text-surface-900 dark:text-surface-50 mb-4">Making Events Accessible to Everyone</h2>
            <p className="text-surface-600 dark:text-surface-400 leading-relaxed mb-4">
              EventSphere was founded with a simple idea: everyone deserves access to amazing events. We've built a platform that makes it effortless to discover, book, and attend events across India.
            </p>
            <p className="text-surface-600 dark:text-surface-400 leading-relaxed">
              From intimate art exhibitions to massive music festivals, from tech conferences to wellness retreats — we curate the best events and deliver a seamless booking experience with instant QR code tickets and secure Razorpay payments.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { num: '500+', label: 'Events Hosted', icon: Calendar },
              { num: '25K+', label: 'Happy Users', icon: Users },
              { num: '50+', label: 'Cities Covered', icon: Globe },
              { num: '100K+', label: 'Tickets Sold', icon: Award },
            ].map(({ num, label, icon: Icon }) => (
              <div key={label} className="card p-6 text-center hover:shadow-lg transition-shadow">
                <Icon className="w-8 h-8 text-primary-500 mx-auto mb-2" />
                <div className="text-2xl font-black text-surface-900 dark:text-surface-50">{num}</div>
                <div className="text-sm text-surface-500 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-surface-50 dark:bg-surface-800/50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-surface-900 dark:text-surface-50">Our Values</h2>
            <p className="text-surface-500 mt-2">What drives us every day</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, desc, color, bg }) => (
              <div key={title} className="card p-6 hover:shadow-xl transition-shadow">
                <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <h3 className="font-bold text-surface-900 dark:text-surface-50 mb-2">{title}</h3>
                <p className="text-sm text-surface-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-surface-900 dark:text-surface-50">Meet Our Team</h2>
          <p className="text-surface-500 mt-2">The people behind EventSphere</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map(({ name, role, initials, gradient }) => (
            <div key={name} className="card p-6 text-center hover:shadow-xl transition-shadow group">
              <div className={`w-20 h-20 mx-auto bg-gradient-to-br ${gradient} rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <span className="text-white text-2xl font-bold">{initials}</span>
              </div>
              <h3 className="font-bold text-surface-900 dark:text-surface-50">{name}</h3>
              <p className="text-sm text-surface-500 mt-1">{role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-600 to-accent-600 p-10 lg:p-16 text-center text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <h2 className="text-3xl lg:text-4xl font-black mb-4">Join the EventSphere Community</h2>
            <p className="text-primary-100 max-w-lg mx-auto mb-8">
              Start discovering and booking amazing events today. Your next unforgettable experience awaits.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/events" className="px-8 py-4 bg-white text-primary-700 font-bold rounded-xl hover:bg-primary-50 transition-all shadow-xl flex items-center gap-2">
                Browse Events
              </Link>
              <Link to="/register" className="px-8 py-4 bg-white/10 border border-white/20 font-bold rounded-xl hover:bg-white/20 transition-all flex items-center gap-2">
                Create Account <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
