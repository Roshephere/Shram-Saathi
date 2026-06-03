import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Star, Shield, Users, ChevronDown } from 'lucide-react';
import apiClient from '../../api/client';

export default function Home() {
  const [faqs, setFaqs] = useState([]);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    apiClient.get('/faqs')
      .then((res) => {
        const body = res.data;
        const list = body.data || body;
        setFaqs(Array.isArray(list) ? list : []);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link to="/home" className="flex items-center gap-2 text-xl font-bold text-blue-600">
            <Wrench className="h-6 w-6" />
            Shram-Saathi
          </Link>
          <nav className="flex items-center gap-4">
            <Link to="/auth/choose" className="text-sm font-medium text-gray-600 hover:text-gray-900">Login</Link>
            <Link to="/auth/customer/register" className="text-sm font-medium px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Get Started</Link>
          </nav>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 sm:text-6xl">
          Welcome to <span className="text-blue-600">Shram-Saathi</span>
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
          Your trusted local service marketplace. Find skilled workers for any job, or offer your services to the community.
        </p>
        <div className="mt-10 flex justify-center gap-4 flex-wrap">
          <Link to="/auth/customer/register" className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 text-lg">
            Find a Worker
          </Link>
          <Link to="/auth/merchant/register" className="px-8 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 text-lg">
            Join as Service Provider
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid md:grid-cols-3 gap-8">
        {[
          { icon: Wrench, title: 'Find Skilled Workers', desc: 'Browse verified workers near you for any service need.' },
          { icon: Star, title: 'Quality Guaranteed', desc: 'Read reviews and ratings to choose the best worker for the job.' },
          { icon: Shield, title: 'Trusted Platform', desc: 'All workers are verified. Your satisfaction is our priority.' },
        ].map((item) => (
          <div key={item.title} className="text-center p-6 bg-white rounded-2xl shadow-sm border hover:shadow-md transition-shadow">
            <div className="mx-auto h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center">
              <item.icon className="h-7 w-7 text-blue-600" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">{item.title}</h3>
            <p className="mt-2 text-sm text-gray-500">{item.desc}</p>
          </div>
        ))}
      </section>

      <section className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
          <div className="mt-10 grid md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Post a Request', desc: 'Describe the service you need and set your budget.' },
              { step: '2', title: 'Get Recommendations', desc: 'Our system matches you with the best nearby workers.' },
              { step: '3', title: 'Hire & Review', desc: 'Choose your worker, get the job done, and leave a review.' },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="mx-auto h-16 w-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">
                  {item.step}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">Frequently Asked Questions</h2>
        {faqs.length === 0 ? (
          <div className="space-y-3">
            {[
              { q: 'How do I find a worker?', a: 'Register as a customer, create a service request, and our system will recommend the best workers near you.' },
              { q: 'How do I become a service provider?', a: 'Register as a service provider, complete your profile in 3 steps, and wait for admin verification.' },
              { q: 'Is there a fee to join?', a: 'Joining Shram-Saathi is free for both customers and service providers.' },
              { q: 'How are workers verified?', a: 'All service providers go through an admin verification process before they can accept jobs.' },
              { q: 'How do payments work?', a: 'Payments are handled between customers and workers. Platform commission tracking is coming soon.' },
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors">
                  <span className="font-medium text-gray-900">{faq.q}</span>
                  <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-sm text-gray-600">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={faq.id || i} className="bg-white rounded-xl border overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors">
                  <span className="font-medium text-gray-900">{faq.question || faq.title || faq.q}</span>
                  <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-sm text-gray-600">{faq.answer || faq.description || faq.a}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <footer className="bg-gray-50 border-t py-8 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Shram-Saathi. All rights reserved.
      </footer>
    </div>
  );
}
