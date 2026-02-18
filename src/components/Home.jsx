import { Users, Briefcase, Star, TrendingUp, Shield, Award, Calendar, MessageSquare } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-700 via-slate-600 to-slate-700">
          {/* Adding padding to prevent content hiding under fixed navbar */}
      <div className="pt-10">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Floating Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 bg-slate-700/30 p-4 rounded-2xl backdrop-blur-sm animate-float">
            <Briefcase className="h-8 w-8 text-orange-400" />
          </div>
          <div className="absolute top-40 right-20 bg-slate-700/30 p-4 rounded-2xl backdrop-blur-sm animate-float-delay-1">
            <Users className="h-8 w-8 text-blue-400" />
          </div>
          <div className="absolute bottom-40 left-20 bg-slate-700/30 p-4 rounded-2xl backdrop-blur-sm animate-float-delay-2">
            <Star className="h-8 w-8 text-red-400" />
          </div>
          <div className="absolute top-60 right-40 bg-slate-700/30 p-4 rounded-2xl backdrop-blur-sm animate-float">
            <Calendar className="h-8 w-8 text-orange-400" />
          </div>
          <div className="absolute bottom-60 right-10 bg-slate-700/30 p-4 rounded-2xl backdrop-blur-sm animate-float-delay-1">
            <Award className="h-8 w-8 text-blue-400" />
          </div>
          <div className="absolute bottom-20 left-1/3 bg-slate-700/30 p-4 rounded-2xl backdrop-blur-sm animate-float-delay-2">
            <MessageSquare className="h-8 w-8 text-red-400" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          {/* Announcement Banner */}
          <div className="flex justify-center mb-8">
            <div className="bg-gradient-to-r from-[#0F2A44]/70 to-blue-600/40 backdrop-blur-sm border border-orange-500/30 rounded-full px-6 py-2 inline-flex items-center space-x-2">
              <span className="text-white text-sm font-semibold">Discover the all New Workers V2.0</span>
              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* Hero Content */}
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              One Platform For Finding
              <br />
              <span className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight bg-clip-text text-transparent">
                The Perfect Worker
              </span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
              ShramSaathi enables you to achieve clarity and significant results on a large scale by
              linking skilled workers with opportunities that match their expertise and career goals
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button className="bg-[#0F2A44] text-white hover:bg-[#FFA77F] px-8 py-4 rounded-xl font-bold text-lg transition duration-200 shadow-2xl hover:shadow-orange-500/50 w-full sm:w-auto">
                Get Started
              </button>
              <button className="text-white hover:text-orange-200 px-8 py-4 font-semibold text-lg transition duration-200 w-full sm:w-auto">
                How It Works
              </button>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-20">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden">
              <div className="bg-gradient-to-r from-slate-700/80 to-slate-600/80 px-6 py-4 border-b border-slate-600">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="flex-1 text-center">
                    <span className="text-slate-300 text-sm font-medium">Worker Dashboard</span>
                  </div>
                </div>
              </div>
              
              {/* Dashboard Content */}
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-orange-600 to-orange-700 p-6 rounded-xl text-white">
                    <TrendingUp className="h-8 w-8 mb-3" />
                    <div className="text-3xl font-bold mb-1">1,247</div>
                    <div className="text-orange-200">Active Workers</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-600 to-green-700 p-6 rounded-xl text-white">
                    <Briefcase className="h-8 w-8 mb-3" />
                    <div className="text-3xl font-bold mb-1">856</div>
                    <div className="text-blue-200">Job Matches</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-xl text-white">
                    <Star className="h-8 w-8 mb-3" />
                    <div className="text-3xl font-bold mb-1">4.8</div>
                    <div className="text-red-200">Avg Rating</div>
                  </div>
                </div>

                {/* Recent Recommendations Section */}
                <div className="py-20 bg-[#1F2937]">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                      <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Recent Recommendations
                      </h2>
                      <p className="text-xl text-slate-300">Top-rated workers ready to help you today</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      
                      {/* Card 1 - Electrician */}
                      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-300 cursor-pointer group">
                        {/* Image Section */}
                        <div className="relative h-64 overflow-hidden">
                          <img 
                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop" 
                            alt="Electrician" 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            98% Match
                          </div>
                        </div>
                        
                        {/* Content Section */}
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors">
                              Rajesh Kumar
                            </h3>
                            <div className="flex items-center space-x-1">
                              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                              </svg>
                              <span className="text-white font-semibold">4.9</span>
                              <span className="text-slate-400 text-sm">(127)</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center text-orange-400 mb-3">
                            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span className="font-semibold">Senior Electrician</span>
                          </div>
                          
                          <p className="text-slate-300 text-sm mb-4">
                            15+ years experience in residential and commercial electrical work. Certified and insured.
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-slate-400 text-sm">
                              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              Kathmandu
                            </div>
                            <div className="text-blue-400 font-bold text-lg">
                              ₹1,200/day
                            </div>
                          </div>
                          
                          <button className="w-full mt-4 bg-gradient-to-r from-orange-600 to-orange-700 text-white py-3 rounded-lg font-semibold hover:from-orange-700 hover:to-orange-800 transition-all duration-200 shadow-lg hover:shadow-orange-500/50">
                            View Profile
                          </button>
                        </div>
                      </div>

                      {/* Card 2 - Plumber */}
                      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 cursor-pointer group">
                        <div className="relative h-64 overflow-hidden">
                          <img 
                            src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop" 
                            alt="Plumber" 
                            className="w-full h-full object-cover group-hover:scale-100 transition-transform duration-500"
                          />
                          <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            95% Match
                          </div>
                        </div>
                        
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                              Amit Sharma
                            </h3>
                            <div className="flex items-center space-x-1">
                              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                              </svg>
                              <span className="text-white font-semibold">4.8</span>
                              <span className="text-slate-400 text-sm">(89)</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center text-blue-400 mb-3">
                            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                            </svg>
                            <span className="font-semibold">Plumbing Specialist</span>
                          </div>
                          
                          <p className="text-slate-300 text-sm mb-4">
                            Expert in pipe installation, leak repair, and bathroom renovations. Fast and reliable service.
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-slate-400 text-sm">
                              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              Lalitpur
                            </div>
                            <div className="text-blue-400 font-bold text-lg">
                              ₹1,000/day
                            </div>
                          </div>
                          
                          <button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-blue-500/50">
                            View Profile
                          </button>
                        </div>
                      </div>

                      {/* Card 3 - Carpenter */}
                      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-300 cursor-pointer group">
                        <div className="relative h-64 overflow-hidden">
                          <img 
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop" 
                            alt="Carpenter" 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            92% Match
                          </div>
                        </div>
                        
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors">
                              Suresh Thapa
                            </h3>
                            <div className="flex items-center space-x-1">
                              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                              </svg>
                              <span className="text-white font-semibold">4.7</span>
                              <span className="text-slate-400 text-sm">(103)</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center text-red-400 mb-3">
                            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                            <span className="font-semibold">Master Carpenter</span>
                          </div>
                          
                          <p className="text-slate-300 text-sm mb-4">
                            Specializing in custom furniture, kitchen cabinets, and interior woodwork. 12 years experience.
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-slate-400 text-sm">
                              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              Bhaktapur
                            </div>
                            <div className="text-blue-400 font-bold text-lg">
                              ₹1,500/day
                            </div>
                          </div>
                          
                          <button className="w-full mt-4 bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-red-500/50">
                            View Profile
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-20 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why Choose ShramSaathi
            </h2>
            <p className="text-xl text-slate-300">Everything you need to find and manage the perfect workforce</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-700/30 backdrop-blur-sm p-8 rounded-2xl border border-slate-600/50 hover:border-orange-500/50 transition duration-300 hover:scale-105 cursor-pointer">
              <div className="bg-gradient-to-br from-blue-600 to-orange-700 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Star className="h-7 w-7 text-white"  />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Smart Matching</h3>
              <p className="text-slate-300 leading-relaxed">
                Our AI-powered algorithm matches workers with jobs based on skills, experience, location, and preferences for optimal results.
              </p>
            </div>

            <div className="bg-slate-700/30 backdrop-blur-sm p-8 rounded-2xl border border-slate-600/50 hover:border-blue-500/50 transition duration-300 hover:scale-105 cursor-pointer">
              <div className="bg-gradient-to-br from-orange-600 to-purple-700 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Verified Profiles</h3>
              <p className="text-slate-300 leading-relaxed">
                All workers are thoroughly vetted with background checks, skill assessments, and verified credentials for your peace of mind.
              </p>
            </div>

            <div className="bg-slate-700/30 backdrop-blur-sm p-8 rounded-2xl border border-slate-600/50 hover:border-red-500/50 transition duration-300 hover:scale-105 cursor-pointer">
              <div className="bg-gradient-to-br from-red-600 to-blue-700 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Real-Time Analytics</h3>
              <p className="text-slate-300 leading-relaxed">
                Track performance metrics, view ratings, and make data-driven decisions with our comprehensive analytics dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delay-1 {
          animation: float 6s ease-in-out infinite;
          animation-delay: 2s;
        }
        
        .animate-float-delay-2 {
          animation: float 6s ease-in-out infinite;
          animation-delay: 4s;
        }
      `}</style>
      </div>
    </div>
  );
}