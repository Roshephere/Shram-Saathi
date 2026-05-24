import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCircle,
  Clock,
  MapPin,
  MessageSquare,
  MoreVertical,
  Star,
  TrendingUp,
  Briefcase,
  Award,
  Wallet,
  Settings,
  X,
  LayoutDashboard,
  Search,
  Users,
  LogOut
} from 'lucide-react';

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isAvailable, setIsAvailable] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { id: 'find_workers', label: 'Find Workers', icon: <Search size={20} /> },
    { id: 'bookings', label: 'My Bookings', icon: <Briefcase size={20} /> },
    { id: 'messages', label: 'Messages', icon: <MessageSquare size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  // Mock Data
  const metrics = [
    { label: "This Month's Earnings", value: "₹24,500", trend: "+12%", icon: <Wallet className="text-[#24634e] w-6 h-6" />, bg: "bg-[#24634e]/10" },
    { label: "Jobs Completed", value: "34", trend: "+3", icon: <Briefcase className="text-[#cc8f84] w-6 h-6" />, bg: "bg-[#cc8f84]/10" },
    { label: "Average Rating", value: "4.9", trend: "Top 5%", icon: <Star className="text-yellow-500 w-6 h-6" />, bg: "bg-yellow-500/10" },
    { label: "Hours Worked", value: "128h", trend: "-5h", icon: <Clock className="text-[#6f9435] w-6 h-6" />, bg: "bg-[#6f9435]/10" },
  ];

  const activeJobs = [
    {
      id: 1,
      title: "Complete Plumbing System Installation",
      client: "Rahul Sharma",
      location: "Lalitpur City Center",
      date: "Today, 10:00 AM",
      status: "In Progress",
      amount: "₹1,500"
    },
    {
      id: 2,
      title: "Bathroom Pipe Repair",
      client: "Priya Patel",
      location: "Bhaktapur",
      date: "Tomorrow, 02:00 PM",
      status: "Scheduled",
      amount: "₹800"
    }
  ];

  const jobMatches = [
    {
      id: 101,
      title: "Kitchen Sink Fix needed urgently",
      distance: "2.4 km away",
      urgency: "High",
      estPay: "₹600",
      time: "2 hours ago"
    },
    {
      id: 102,
      title: "New water heater installation",
      distance: "4.1 km away",
      urgency: "Normal",
      estPay: "₹1200",
      time: "5 hours ago"
    },
    {
      id: 103,
      title: "Weekly maintenance check",
      distance: "1.2 km away",
      urgency: "Low",
      estPay: "₹500",
      time: "1 day ago"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="flex flex-1 pt-0">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-100 hidden md:flex flex-col shadow-sm z-10 sticky top-0 h-screen">
          <div className="p-6">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">User Menu</h2>
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm ${activeTab === tab.id
                    ? 'bg-[#24634e] text-white shadow-md shadow-[#24634e]/30 font-semibold'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-[#394056] font-medium'
                    }`}
                >
                  <span className={activeTab === tab.id ? 'text-white' : 'text-slate-400'}>
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
          <div className="mt-auto p-0 border-t border-gray-50">
            <div className="bg-gradient-to-br from-[#24634e]/10 to-[#24634e]/5 rounded-xl p-4 border border-[#24634e]/20 m-6 mb-4">
              <h4 className="text-sm font-bold text-[#394056]">Need Help?</h4>
              <p className="text-xs text-slate-500 mt-1 mb-3">Contact support team.</p>
              <button className="text-xs font-semibold text-[#24634e] hover:text-[#1e5341] flex items-center">
                <Bell size={14} className="mr-1" /> Contact Support
              </button>
            </div>
            <div className="px-6 pb-6">
              <button
                onClick={() => {
                  logout();
                  navigate('/register');
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 font-semibold text-sm transition-colors duration-200"
              >
                <LogOut size={20} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto w-full max-w-7xl mx-auto h-screen">
          {/* Header */}
          <header className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#394056]">
                {tabs.find(t => t.id === activeTab)?.label}
              </h1>
              <p className="text-slate-500 mt-1">
                {activeTab === 'overview' && `Welcome back, ${user?.name || "User"}! 👋`}
                {activeTab === 'find_workers' && "Search and find the best workers for your needs."}
                {activeTab === 'bookings' && "Manage your service bookings and history."}
                {activeTab === 'messages' && "Communicate with your hired workers."}
                {activeTab === 'settings' && "Manage your account settings."}
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <div className="relative hidden md:block">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-full leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#24634e] focus:border-transparent sm:text-sm transition-all shadow-sm w-64"
                  placeholder="Search for workers, skills..."
                />
              </div>
              <button className="p-2 bg-white text-slate-500 hover:text-[#24634e] rounded-full border border-gray-200 shadow-sm hover:shadow-md transition">
                <Bell size={20} />
              </button>
            </div>
          </header>

          <div className="animate-in fade-in duration-300">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-[#394056] mb-2">
                      Here is what's happening with your projects today.
                    </h2>
                  </div>

                  <div className="flex items-center space-x-4 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
            <span className="text-sm font-semibold text-slate-700 px-2 flex items-center">
              <span className={`w-2.5 h-2.5 rounded-full mr-2 ${isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></span>
              {isAvailable ? "Available for Work" : "Currently Busy"}
            </span>
            <button
              onClick={() => setIsAvailable(!isAvailable)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${isAvailable ? 'bg-[#24634e]' : 'bg-gray-300'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-300 ${isAvailable ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {metrics.map((metric, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${metric.bg}`}>
                  {metric.icon}
                </div>
                <span className={`text-sm font-semibold px-2 py-1 rounded-full ${metric.trend.startsWith('+') || metric.trend.startsWith('Top') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {metric.trend}
                </span>
              </div>
              <h3 className="text-slate-500 text-sm font-medium mb-1">{metric.label}</h3>
              <p className="text-2xl font-bold text-[#394056]">{metric.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">

            {/* Active Jobs Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-bold text-[#394056]">Active & Upcoming Jobs</h2>
                <button className="text-[#24634e] text-sm font-semibold hover:underline">View All</button>
              </div>
              <div className="divide-y divide-gray-50">
                {activeJobs.map((job) => (
                  <div key={job.id} className="p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">

                      <div className="flex items-start space-x-4">
                        <div className="bg-[#24634e]/10 p-3 rounded-xl mt-1">
                          <CheckCircle className="text-[#24634e] w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-[#394056] mb-1">{job.title}</h4>
                          <div className="flex flex-wrap items-center text-sm text-slate-500 gap-y-2">
                            <span className="flex items-center mr-4">
                              <MessageSquare className="w-4 h-4 mr-1 text-slate-400" /> {job.client}
                            </span>
                            <span className="flex items-center mr-4">
                              <MapPin className="w-4 h-4 mr-1 text-slate-400" /> {job.location}
                            </span>
                            <span className="flex items-center text-[#cc8f84] font-medium">
                              <Clock className="w-4 h-4 mr-1" /> {job.date}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                        <span className="text-lg font-bold text-[#394056] mb-2">{job.amount}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${job.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                          {job.status}
                        </span>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Smart Matches */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-slate-50 to-white">
                <div className="flex items-center space-x-2">
                  <div className="bg-[#cc8f84]/20 p-2 rounded-lg">
                    <Star className="text-[#cc8f84] w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold text-[#394056]">Smart Job Matches</h2>
                </div>
                <span className="bg-[#24634e] text-white text-xs font-bold px-2 py-1 rounded-lg">New</span>
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {jobMatches.map((match) => (
                  <div key={match.id} className="border border-gray-100 rounded-xl p-5 hover:border-[#cc8f84] transition-colors group relative cursor-pointer">
                    {match.urgency === 'High' && (
                      <span className="absolute -top-3 -right-3 bg-red-500 text-white text-[10px] uppercase font-bold px-2 py-1 rounded-full shadow-md animate-pulse">
                        Urgent
                      </span>
                    )}
                    <h4 className="text-md font-bold text-[#394056] mb-2 line-clamp-1 group-hover:text-[#24634e] transition-colors">{match.title}</h4>
                    <div className="flex items-center text-sm text-slate-500 mb-4">
                      <MapPin className="w-4 h-4 mr-1.5" />
                      {match.distance}
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-lg font-bold text-[#24634e]">{match.estPay}</span>
                      <button className="text-sm font-semibold bg-[#24634e]/10 text-[#24634e] px-4 py-2 rounded-lg hover:bg-[#24634e] hover:text-white transition-colors">
                        Quick Apply
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Sidebar */}
          <div className="space-y-8">

            {/* Profile Completion */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-[#394056] mb-1">Profile Strength</h3>
              <p className="text-sm text-slate-500 mb-4">Stand out to employers</p>

              <div className="mb-4">
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span className="text-[#394056]">Intermediate</span>
                  <span className="text-[#24634e]">85%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div className="bg-gradient-to-r from-[#24634e] to-[#6f9435] h-2.5 rounded-full w-[85%]"></div>
                </div>
              </div>

              <ul className="space-y-3 text-sm">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 shrink-0" />
                  <span className="text-slate-600 line-through">Add ID Verification</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 shrink-0" />
                  <span className="text-slate-600 line-through">Upload Profile Photo</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300 mr-2 shrink-0"></div>
                  <span className="text-[#394056] font-medium cursor-pointer hover:text-[#cc8f84] transition-colors">Add 3 more Past Work Photos (+15%)</span>
                </li>
              </ul>
            </div>

            {/* Recent Reviews */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-[#394056]">Recent Reviews</h3>
                <Star className="text-yellow-500 w-5 h-5" />
              </div>

              <div className="space-y-6">
                <div className="border-b border-gray-50 pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-[#394056] text-sm">Sanjay Gupta</span>
                    <div className="flex">
                      <Star className="text-yellow-500 w-3 h-3 fill-current" />
                      <Star className="text-yellow-500 w-3 h-3 fill-current" />
                      <Star className="text-yellow-500 w-3 h-3 fill-current" />
                      <Star className="text-yellow-500 w-3 h-3 fill-current" />
                      <Star className="text-yellow-500 w-3 h-3 fill-current" />
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-2">
                    "Excellent plumbing work! Arrived on time and fixed the leak perfectly without any mess left behind."
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-[#394056] text-sm">Vikram Verma</span>
                    <div className="flex">
                      <Star className="text-yellow-500 w-3 h-3 fill-current" />
                      <Star className="text-yellow-500 w-3 h-3 fill-current" />
                      <Star className="text-yellow-500 w-3 h-3 fill-current" />
                      <Star className="text-yellow-500 w-3 h-3 fill-current" />
                      <Star className="text-gray-300 w-3 h-3 fill-current" />
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-2">
                    "Very skilled at fixture installation. Communicated well about the delays."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
            
            {activeTab === 'find_workers' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-[#394056] mb-4">Find Workers</h3>
                <p className="text-slate-500 text-sm">Use the search bar above to look for available workers, or browse recommended matches in the overview tab.</p>
              </div>
            )}
            
            {activeTab === 'bookings' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-[#394056] mb-4">My Bookings</h3>
                <p className="text-slate-500 text-sm">You have no upcoming bookings.</p>
              </div>
            )}
            
            {activeTab === 'messages' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-[#394056] mb-4">Messages</h3>
                <p className="text-slate-500 text-sm">No new messages.</p>
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-[#394056] mb-4">Settings</h3>
                <p className="text-slate-500 text-sm">Profile settings.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
