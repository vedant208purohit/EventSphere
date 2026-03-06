import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Search, Shield, Zap, QrCode, CreditCard, Calendar, MapPin, Users, Star, CheckCircle } from 'lucide-react';

const categories = [
  { name: 'Music', emoji: '🎵', color: 'from-pink-500 to-rose-500' },
  { name: 'Sports', emoji: '⚽', color: 'from-emerald-500 to-green-500' },
  { name: 'Technology', emoji: '💻', color: 'from-blue-500 to-indigo-500' },
  { name: 'Art', emoji: '🎨', color: 'from-purple-500 to-violet-500' },
  { name: 'Food', emoji: '🍕', color: 'from-orange-500 to-amber-500' },
  { name: 'Business', emoji: '💼', color: 'from-slate-500 to-gray-600' },
  { name: 'Health', emoji: '🧘', color: 'from-teal-500 to-cyan-500' },
  { name: 'Education', emoji: '📚', color: 'from-yellow-500 to-orange-500' },
];

const features = [
  { icon: Search, title: 'Discover Events', desc: 'Browse hundreds of events filtered by category, location, date, and price.' },
  { icon: CreditCard, title: 'Secure Payments', desc: 'Pay securely via Razorpay with instant booking confirmation.' },
  { icon: QrCode, title: 'QR Code Tickets', desc: 'Get digital QR code tickets delivered instantly to your bookings.' },
  { icon: Shield, title: 'Verified Events', desc: 'All events are verified by our team for quality and authenticity.' },
];

const steps = [
  { num: '01', title: 'Find an Event', desc: 'Search or browse from our curated collection of events across India.' },
  { num: '02', title: 'Select Tickets', desc: 'Choose the number of tickets you need and review the pricing.' },
  { num: '03', title: 'Make Payment', desc: 'Pay securely through Razorpay with multiple payment options.' },
  { num: '04', title: 'Get Your Ticket', desc: 'Receive your digital QR code ticket instantly after payment.' },
];

const testimonials = [
  { name: 'Priya Sharma', role: 'Music Enthusiast', text: 'EventSphere made it so easy to book tickets for the AR Rahman concert. The QR ticket system was seamless!', rating: 5 },
  { name: 'Rahul Verma', role: 'Tech Professional', text: 'I attend multiple tech summits every year. EventSphere is hands down the best platform for discovering events.', rating: 5 },
  { name: 'Ananya Gupta', role: 'Fitness Coach', text: 'Booked the Yoga Retreat in Rishikesh through EventSphere. Great experience from discovery to check-in!', rating: 5 },
];

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-accent-700 text-white">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm mb-6">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Discover extraordinary experiences</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight">
              Find Your Next <br />
              <span className="bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">
                Unforgettable
              </span>{' '}
              Event
            </h1>
            <p className="mt-6 text-lg text-primary-100 max-w-xl leading-relaxed">
              From tech summits to music concerts, sports events to art exhibitions — explore thousands of events and book your tickets in seconds.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/events"
                className="px-8 py-4 bg-white text-primary-700 font-bold rounded-xl hover:bg-primary-50 transition-all duration-300 shadow-xl hover:shadow-2xl active:scale-[0.98] flex items-center gap-2"
              >
                <Search className="w-5 h-5" /> Browse Events
              </Link>
              <Link
                to="/register"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
              >
                Get Started <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { label: 'Events', value: '500+' },
              { label: 'Cities', value: '50+' },
              { label: 'Tickets Sold', value: '100K+' },
              { label: 'Happy Users', value: '25K+' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-black">{stat.value}</div>
                <div className="text-sm text-primary-200 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-surface-900 dark:text-surface-50">Browse by Category</h2>
          <p className="text-surface-500 mt-2">Explore events across your favorite categories</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/events?category=${cat.name}`}
              className="group relative p-6 rounded-2xl bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 text-center"
            >
              <div className={`w-14 h-14 mx-auto bg-gradient-to-br ${cat.color} rounded-2xl flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform`}>
                {cat.emoji}
              </div>
              <h3 className="font-semibold text-surface-800 dark:text-surface-200">{cat.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-surface-50 dark:bg-surface-800/50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-surface-900 dark:text-surface-50">Why EventSphere?</h2>
            <p className="text-surface-500 mt-2">Everything you need for a seamless event experience</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-6 text-center hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 mx-auto bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mb-4">
                  <Icon className="w-7 h-7 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="font-bold text-surface-900 dark:text-surface-50 mb-2">{title}</h3>
                <p className="text-sm text-surface-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-surface-900 dark:text-surface-50">How It Works</h2>
          <p className="text-surface-500 mt-2">Book your event tickets in 4 simple steps</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map(({ num, title, desc }) => (
            <div key={num} className="relative">
              <div className="text-5xl font-black text-primary-400 dark:text-primary-500 mb-3">{num}</div>
              <h3 className="font-bold text-lg text-surface-900 dark:text-surface-50 mb-2">{title}</h3>
              <p className="text-sm text-surface-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gradient-to-br from-primary-600 to-accent-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black">What Our Users Say</h2>
            <p className="text-primary-100 mt-2">Trusted by thousands of event-goers across India</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-300 text-amber-300" />
                  ))}
                </div>
                <p className="text-primary-50 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div>
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-xs text-primary-200">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-600 to-accent-600 p-10 lg:p-16 text-center text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <h2 className="text-3xl lg:text-4xl font-black mb-4">Ready to Discover Your Next Event?</h2>
            <p className="text-primary-100 max-w-lg mx-auto mb-8">
              Join thousands of users who discover and book amazing events every day on EventSphere.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/events" className="px-8 py-4 bg-white text-primary-700 font-bold rounded-xl hover:bg-primary-50 transition-all shadow-xl flex items-center gap-2">
                <Search className="w-5 h-5" /> Browse Events
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

export default Home;
