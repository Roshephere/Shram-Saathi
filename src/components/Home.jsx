import { useState } from 'react';
import { Star, TrendingUp, Shield } from 'lucide-react';
export default function Home() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Adding padding to prevent content hiding under fixed navbar */}
      <div className="pt-10">
        {/* Hero Section */}
        <div className="relative overflow-hidden">


          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10 ">

            {/* Announcement Banner */}
            <div className="flex justify-center mb-8">
              <div className="bg-gradient-to-r from-[#24634e]/20 to-[#6f9435]/10 backdrop-blur-sm border border-[#24634e]/30 rounded-full px-6 py-2 inline-flex items-center space-x-2">
                <span className="text-[#24634e] text-sm font-semibold">Discover the all New Workers V2.0</span>
                <svg className="h-4 w-4 text-[#24634e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* Hero Content */}
            <div className="text-center">
              <h1 className="text-5xl md:text-7xl font-bold text-[#394056] mb-6 leading-tight">
                One Platform For Finding
                <br />
                <span className="text-5xl md:text-7xl font-bold text-[#394056] mb-6 leading-tight">
                  The Perfect Worker
                </span>
              </h1>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed">
                ShramSaathi enables you to achieve clarity and significant results on a large scale by
                linking skilled workers with opportunities that match their expertise and career goals
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <button className="bg-[#24634e] text-white hover:bg-[#1e5341] px-8 py-4 rounded-xl font-bold text-lg transition duration-200 shadow-2xl hover:shadow-[#cc8f84]/50 w-full sm:w-auto"
                >
                  Get Started
                </button>
                <button className="text-[#394056] hover:text-[#24634e] px-8 py-4 font-semibold text-lg transition duration-200 w-full sm:w-auto">
                  How It Works
                </button>
              </div>
            </div>



          </div>
        </div>

        {/* How It Works Section */}
        <div className="relative py-20 border-y border-gray-200 overflow-hidden">
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-[#394056] mb-4">How It Works</h2>
              <p className="text-xl text-slate-600">Your Journey to finding the right skill, simplified.</p>
              <div className="w-24 h-1 bg-[#cc8f84] mx-auto rounded-full mt-6"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              <div className="hidden md:block absolute top-1/4 left-1/6 right-1/6 h-0.5 bg-gray-200/50 z-0"></div>

              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-slate-50 border-4 border-white shadow-xl flex items-center justify-center mb-6 text-2xl font-bold text-[#24634e]">1</div>
                <h3 className="text-2xl font-bold text-[#394056] mb-3">Create Profile</h3>
                <p className="text-slate-600">Sign up and tell us what you need or what skills you offer.</p>
              </div>

              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-slate-50 border-4 border-white shadow-xl flex items-center justify-center mb-6 text-2xl font-bold text-[#cc8f84]">2</div>
                <h3 className="text-2xl font-bold text-[#394056] mb-3">Smart Match</h3>
                <p className="text-slate-600">Our algorithm connects the right worker with the right requirement instantly.</p>
              </div>

              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-slate-50 border-4 border-white shadow-xl flex items-center justify-center mb-6 text-2xl font-bold text-[#6f9435]">3</div>
                <h3 className="text-2xl font-bold text-[#394056] mb-3">Get It Done</h3>
                <p className="text-slate-600">Collaborate securely and leave a review after the work is successfully finished.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-[#394056] mb-4">
                Why Choose ShramSaathi
              </h2>
              <p className="text-xl text-slate-600">Everything you need to find and manage the perfect workforce</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-slate-50 p-6 rounded-2xl hover:border-[#cc8f84]/50 transition duration-300 hover:scale-105 cursor-pointer flex flex-col">
                <div className="w-full h-68 rounded-xl overflow-hidden mb-6 group-hover:scale-[1.02] transition-transform duration-300 shadow-md border border-gray-100 shrink-0">
                  <img src="https://plus.unsplash.com/premium_photo-1771768953155-5200ba8410ae?q=80&w=1142&auto=format&fit=crop&ixlib=rb-4.1.0" alt="Smart Matching" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-2xl font-bold text-[#394056] mb-4">Smart Matching</h3>
                <p className="text-slate-600 leading-relaxed">
                  Our AI-powered algorithm matches workers with jobs based on skills, experience, location, and preferences for optimal results.
                </p>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl hover:border-[#24634e]/50 transition duration-300 hover:scale-105 cursor-pointer">
                <div className="w-full h-68 rounded-xl overflow-hidden mb-6 group-hover:scale-[1.02] transition-transform duration-300 shadow-md border border-gray-100 shrink-0">
                  <img src="https://plus.unsplash.com/premium_photo-1664299941780-e8badc0b1617?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Verified Profiles" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-2xl font-bold text-[#394056] mb-4">Verified Profiles</h3>
                <p className="text-slate-600 leading-relaxed">
                  All workers are thoroughly vetted with background checks, skill assessments, and verified credentials for your peace of mind.
                </p>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl hover:border-[#cc8f84]/50 transition duration-300 hover:scale-105 cursor-pointer">
                <div className="w-full h-68 rounded-xl overflow-hidden mb-6 group-hover:scale-[1.02] transition-transform duration-300 shadow-md border border-gray-100 shrink-0">
                  <img src="https://plus.unsplash.com/premium_photo-1661486971635-b79537d79d97?q=80&w=1266&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Real-Time Analytics" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-2xl font-bold text-[#394056] mb-4">Real-Time Analytics</h3>
                <p className="text-slate-600 leading-relaxed">
                  Track performance metrics, view ratings, and make data-driven decisions with our comprehensive analytics dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-[#394056] mb-4">Frequently Asked Questions</h2>
              <div className="w-24 h-1 bg-[#cc8f84] mx-auto rounded-full"></div>
            </div>
            <div className="space-y-4">
              {[
                {
                  q: "What is ShramSaathi?",
                  a: "ShramSaathi is a modern digital platform designed to connect skilled local workers (like electricians, plumbers, and carpenters) directly with employers and homeowners. Our mission is to bridge the gap between skill and opportunity."
                },
                {
                  q: "How do I register as a worker?",
                  a: "You can sign up by clicking the 'Register' button and selecting the 'Worker' role. You'll need to provide your skills, experience, and contact details to start appearing in search results."
                },
                {
                  q: "Is there a fee for using the platform?",
                  a: "Searching for workers is free. For premium features like instant booking and advanced analytics, we offer affordable subscription plans for both workers and merchants."
                },
                {
                  q: "How do you verify worker profiles?",
                  a: "We implement a multi-step verification process including identity checks, skill assessments, and a community-driven rating system to ensure quality and trust on our platform."
                },
                {
                  q: "Can I chat with a worker before hiring?",
                  a: "Yes! Once you find a suitable profile, you can use our built-in secure messaging system to discuss job details, timing, and pricing before making any commitments."
                },
                {
                  q: "What if I'm not satisfied with the work?",
                  a: "Safety and satisfaction are our priorities. You can leave a review and rating for the worker. In case of serious disputes, our support team is available to mediate and help resolve the issue."
                }
              ].map((faq, index) => (
                <div key={index} className="bg-slate-50 rounded-2xl border border-gray-200 overflow-hidden transition-all duration-300">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full text-left p-6 flex items-center justify-between hover:bg-gray-100 transition-colors"
                  >
                    <h3 className="text-xl font-bold text-[#394056] flex items-center">
                      <span className="bg-[#cc8f84]/20 text-[#cc8f84] w-8 h-8 rounded-lg flex items-center justify-center mr-4 text-sm font-mono ring-1 ring-[#cc8f84]/30">
                        {index + 1}
                      </span>
                      {faq.q}
                    </h3>
                    <svg
                      className={`w-6 h-6 text-[#cc8f84] transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === index ? 'max-h-96 opacity-100 py-6' : 'max-h-0 opacity-0'
                      }`}
                  >
                    <div className="px-6 pt-0 text-slate-600 leading-relaxed pl-18">
                      <div className="pt-4 border-t border-gray-200">
                        {faq.a}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

