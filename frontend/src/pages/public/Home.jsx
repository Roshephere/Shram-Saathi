import { useState, useEffect, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Star, Shield, Users, ChevronDown, MapPin, Zap, Clock, CheckCircle2, ArrowRight, Hammer, Paintbrush, Plug, Droplets, Home as HomeIcon, Thermometer, HardHat, Brush } from 'lucide-react';
import apiClient from '../../api/client';
import { AuthContext } from '../../context/AuthContext';

const CATEGORY_ICONS = {
  'plumbing-services': Droplets,
  'leak-repair': Droplets,
  'drain-clean': Droplets,
  'electrical-services': Plug,
  'wiring-installation': Zap,
  'painting-services': Paintbrush,
  'home-repair': HomeIcon,
  'water-heater-repair': Thermometer,
  'pipe-installation': Droplets,
  'bathroom-plumbing': Droplets,
  'carpentry-services': Hammer,
  'cleaning-services': Brush,
};

const DEFAULT_ICON = Wrench;

function useCountUp(end, duration = 2000, startOnView = true) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    if (!startOnView) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = Date.now();
          const step = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration, startOnView]);

  return [count, ref];
}

function FadeIn({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${className}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function Home() {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [faqs, setFaqs] = useState([]);
  const [openFaq, setOpenFaq] = useState(null);
  const [categories, setCategories] = useState([]);

  const customerLink = isAuthenticated ? '/customer/browse' : '/auth/customer/register';
  const merchantLink = isAuthenticated ? '/merchant/dashboard' : '/auth/merchant/register';
  const categoryLink = (cat) => isAuthenticated ? `/customer/browse?category=${cat.slug}` : '/auth/customer/register';
  const dashboardLink = isAuthenticated
    ? user?.role === 'merchant' ? '/merchant/dashboard'
    : user?.role === 'admin' ? '/admin/dashboard'
    : '/customer/dashboard'
    : '/auth/choose';
  const [statsWorkers, workersRef] = useCountUp(250, 2000);
  const [statsJobs, jobsRef] = useCountUp(1800, 2000);
  const [statsRating, ratingRef] = useCountUp(48, 1800);
  const [statsDistricts, districtsRef] = useCountUp(77, 2000);

  useEffect(() => {
    apiClient.get('/faqs')
      .then((res) => {
        const body = res.data;
        const list = body.data || body;
        setFaqs(Array.isArray(list) ? list : []);
      })
      .catch(() => {});

    apiClient.get('/service-categories')
      .then((res) => {
        const body = res.data;
        const list = body.data || body;
        setCategories(Array.isArray(list) ? list.slice(0, 8) : []);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link to="/home" className="flex items-center gap-2 text-xl font-bold text-indigo-600">
            <div className="h-9 w-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <Wrench className="h-5 w-5" />
            </div>
            Shram-Saathi
          </Link>
          <nav className="flex items-center gap-3">
            <Link to={dashboardLink} className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
              {isAuthenticated ? 'Dashboard' : 'Login'}
            </Link>
            {!isAuthenticated && (
              <Link to="/auth/customer/register" className="text-sm font-medium px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
                Get Started
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 h-72 w-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-20 h-96 w-96 bg-purple-300 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/90 text-sm font-medium px-4 py-2 rounded-full mb-6">
                <MapPin className="h-4 w-4" />
                Serving all 77 districts of Nepal
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                Find Skilled
                <span className="block text-indigo-200">Workers Near You</span>
              </h1>
              <p className="mt-6 text-lg text-indigo-100 max-w-lg">
                Connect with verified plumbers, electricians, painters, and more. Post your job and get matched with the best workers in minutes.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to={customerLink}
                  className="px-8 py-3.5 bg-white text-indigo-700 font-semibold rounded-xl hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-lg inline-flex items-center gap-2">
                  Find a Worker
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link to={merchantLink}
                  className="px-8 py-3.5 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all text-lg">
                  Join as Provider
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-6 text-sm text-indigo-200">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> Free to join</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> Verified workers</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> Secure platform</span>
              </div>
            </div>
            <div className="hidden md:block relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Droplets, label: 'Plumbing', color: 'bg-blue-500' },
                    { icon: Plug, label: 'Electrical', color: 'bg-yellow-500' },
                    { icon: Paintbrush, label: 'Painting', color: 'bg-pink-500' },
                    { icon: Hammer, label: 'Carpentry', color: 'bg-orange-500' },
                    { icon: HomeIcon, label: 'Home Repair', color: 'bg-green-500' },
                    { icon: Thermometer, label: 'Heating', color: 'bg-red-500' },
                    { icon: HardHat, label: 'Construction', color: 'bg-gray-600' },
                    { icon: Brush, label: 'Cleaning', color: 'bg-teal-500' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3 bg-white/10 rounded-xl p-3 hover:bg-white/20 transition-colors cursor-pointer">
                      <div className={`h-10 w-10 rounded-lg ${item.color} flex items-center justify-center`}>
                        <item.icon className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-sm font-medium text-white">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-xl p-4 animate-bounce" style={{ animationDuration: '3s' }}>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Worker verified</p>
                    <p className="text-sm font-semibold text-gray-900">Ram Kumar</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Verified Workers', value: statsWorkers, suffix: '+', ref: workersRef },
              { label: 'Jobs Completed', value: statsJobs, suffix: '+', ref: jobsRef },
              { label: 'Average Rating', value: (statsRating / 10).toFixed(1), suffix: '/5', ref: ratingRef, icon: Star },
              { label: 'Districts Covered', value: statsDistricts, suffix: '', ref: districtsRef },
            ].map((stat) => (
              <div key={stat.label} ref={stat.ref} className="text-center">
                <div className="text-3xl md:text-4xl font-extrabold text-indigo-600">
                  {stat.value}{stat.suffix}
                  {stat.icon && <stat.icon className="h-5 w-5 text-yellow-400 fill-yellow-400 inline ml-1" />}
                </div>
                <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Browse by Service</h2>
              <p className="mt-3 text-gray-500">Find the right professional for your needs</p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {categories.map((cat, i) => {
              const Icon = CATEGORY_ICONS[cat.slug] || DEFAULT_ICON;
              return (
                <FadeIn key={cat.id} delay={i * 80}>
                  <Link to={categoryLink(cat)}
                    className="group bg-white rounded-xl border p-5 hover:border-indigo-300 hover:shadow-lg transition-all duration-300 text-center block">
                    <div className="mx-auto h-14 w-14 rounded-2xl bg-indigo-50 group-hover:bg-indigo-100 flex items-center justify-center transition-colors">
                      <Icon className="h-7 w-7 text-indigo-600" />
                    </div>
                    <h3 className="mt-3 text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">{cat.name}</h3>
                  </Link>
                </FadeIn>
              );
            })}
          </div>
        </section>
      )}

      {/* Features */}
      <section className="bg-white border-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Why Choose Shram-Saathi?</h2>
              <p className="mt-3 text-gray-500">Built for Nepal's workforce</p>
            </div>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: 'Verified Workers', desc: 'Every service provider goes through admin verification before accepting jobs.', color: 'bg-green-50 text-green-600' },
              { icon: MapPin, title: 'Location Matching', desc: 'Our recommendation engine finds workers near you using geohash-based search.', color: 'bg-blue-50 text-blue-600' },
              { icon: Star, title: 'Real Reviews', desc: 'Read genuine reviews from verified customers to make informed decisions.', color: 'bg-yellow-50 text-yellow-600' },
            ].map((item, i) => (
              <FadeIn key={item.title} delay={i * 150}>
                <div className="relative bg-gray-50 rounded-2xl p-8 hover:bg-gray-100 transition-colors group">
                  <div className={`h-12 w-12 rounded-xl ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-gray-900">{item.title}</h3>
                  <p className="mt-2 text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <FadeIn>
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-3 text-gray-500">Three steps to get your job done</p>
          </div>
        </FadeIn>
        <div className="relative grid md:grid-cols-3 gap-8">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-indigo-200 via-indigo-400 to-indigo-200"></div>
          {[
            { step: '1', title: 'Post Your Request', desc: 'Describe what you need, set your budget, and pick your location.', icon: Clock, color: 'from-indigo-500 to-blue-500' },
            { step: '2', title: 'Get Matched', desc: 'Our system recommends the best nearby workers based on skill, rating, and distance.', icon: Zap, color: 'from-purple-500 to-pink-500' },
            { step: '3', title: 'Hire & Review', desc: 'Select a worker, get the job done, and leave a review to help others.', icon: CheckCircle2, color: 'from-green-500 to-emerald-500' },
          ].map((item, i) => (
            <FadeIn key={item.step} delay={i * 200}>
              <div className="relative text-center">
                <div className={`mx-auto h-24 w-24 rounded-2xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center shadow-lg relative z-10`}>
                  <item.icon className="h-10 w-10" />
                </div>
                <div className="mt-6 text-sm font-bold text-indigo-600 uppercase tracking-wider">Step {item.step}</div>
                <h3 className="mt-2 text-xl font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-500 max-w-xs mx-auto leading-relaxed">{item.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gradient-to-br from-indigo-600 to-purple-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white">What People Say</h2>
              <p className="mt-3 text-indigo-200">Trusted by workers and customers across Nepal</p>
            </div>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Sita Devi', role: 'Customer, Kathmandu', text: 'Found a plumber within 10 minutes. The worker was verified and professional. Highly recommend!', rating: 5 },
              { name: 'Ram Kumar', role: 'Electrician, Lalitpur', text: 'Since joining Shram-Saathi, I get regular jobs from nearby customers. My income has doubled.', rating: 5 },
              { name: 'Hari Prasad', role: 'Customer, Pokhara', text: 'The recommendation system is amazing. It found workers right in my neighborhood.', rating: 4 },
            ].map((t, i) => (
              <FadeIn key={t.name} delay={i * 150}>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-colors">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-white/90 text-sm leading-relaxed">"{t.text}"</p>
                  <div className="mt-5 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{t.name}</p>
                      <p className="text-xs text-indigo-200">{t.role}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <FadeIn>
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 right-0 h-64 w-64 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 h-48 w-48 bg-indigo-300 rounded-full blur-3xl"></div>
            </div>
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-white hover:text-black">Ready to Get Started?</h2>
              <p className="mt-4 text-gray-400 max-w-lg mx-auto">
                Join thousands of workers and customers using Shram-Saathi to connect and get work done.
              </p>
              <div className="mt-8 flex justify-center gap-4 flex-wrap">
                <Link to={customerLink}
                  className="px-8 py-3.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-50 hover:text-slate-500 transition-all shadow-lg text-lg">
                  Find a Worker
                </Link>
                <Link to="/auth/merchant/register"
                  className="px-8 py-3.5 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 hover:text-slate-500 transition-all shadow-lg text-lg">
                  Start Earning
                </Link>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <FadeIn>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
          </div>
        </FadeIn>
        {(faqs.length > 0 ? faqs : [
          { q: 'How do I find a worker?', a: 'Register as a customer, create a service request, and our system will recommend the best workers near you.' },
          { q: 'How do I become a service provider?', a: 'Register as a service provider, complete your profile in 3 steps, and wait for admin verification.' },
          { q: 'Is there a fee to join?', a: 'Joining Shram-Saathi is free for both customers and service providers.' },
          { q: 'How are workers verified?', a: 'All service providers go through an admin verification process before they can accept jobs.' },
          { q: 'How do payments work?', a: 'Payments are handled directly between customers and workers.' },
        ]).map((faq, i) => (
          <FadeIn key={i} delay={i * 80}>
            <div className="bg-white rounded-xl border overflow-hidden mb-3">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors">
                <span className="font-medium text-gray-900">{faq.question || faq.title || faq.q}</span>
                <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-40' : 'max-h-0'}`}>
                <div className="px-6 pb-4 text-sm text-gray-600 leading-relaxed">{faq.answer || faq.description || faq.a}</div>
              </div>
            </div>
          </FadeIn>
        ))}
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Link to="/home" className="flex items-center gap-2 text-xl font-bold text-white">
                <div className="h-8 w-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                  <Wrench className="h-4 w-4" />
                </div>
                Shram-Saathi
              </Link>
              <p className="mt-3 text-sm leading-relaxed">Nepal's trusted local service marketplace connecting skilled workers with customers.</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">For Customers</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to={customerLink} className="hover:text-white transition-colors">Find Workers</Link></li>
                <li><Link to="/auth/customer/login" className="hover:text-white transition-colors">Customer Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">For Workers</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to={merchantLink} className="hover:text-white transition-colors">Join as Provider</Link></li>
                <li><Link to="/auth/merchant/login" className="hover:text-white transition-colors">Provider Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/auth/admin/login" className="hover:text-white transition-colors">Admin</Link></li>
                <li><span className="cursor-default">Support</span></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 pt-8 border-t border-gray-800 text-center text-sm">
            &copy; {new Date().getFullYear()} Shram-Saathi. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
