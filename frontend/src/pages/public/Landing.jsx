import { Link } from 'react-router-dom';
import { Wrench, Star, Shield, Users } from 'lucide-react';
import PublicLayout from '../../layouts/PublicLayout';

export default function Landing() {
  return (
    <PublicLayout>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 sm:text-6xl">
          Welcome to <span className="text-indigo-600">Shram-Saathi</span>
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
          Your trusted local service marketplace. Find skilled workers for any job, or offer your services to the community.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Link to="/register" className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 text-lg">
            Get Started
          </Link>
          <Link to="/login" className="px-8 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 text-lg">
            Sign In
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid md:grid-cols-3 gap-8">
        {[
          { icon: Wrench, title: 'Find Skilled Workers', desc: 'Browse verified workers near you for any service need.' },
          { icon: Star, title: 'Quality Guaranteed', desc: 'Read reviews and ratings to choose the best worker for the job.' },
          { icon: Shield, title: 'Trusted Platform', desc: 'All workers are verified. Your satisfaction is our priority.' },
        ].map((item) => (
          <div key={item.title} className="text-center p-6">
            <div className="mx-auto h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
              <item.icon className="h-6 w-6 text-indigo-600" />
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
                <div className="mx-auto h-16 w-16 rounded-full bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold">
                  {item.step}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-gray-50 border-t py-8 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Shram-Saathi. All rights reserved.
      </footer>
    </PublicLayout>
  );
}
