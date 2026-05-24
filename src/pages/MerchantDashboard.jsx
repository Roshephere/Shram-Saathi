import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Wrench,
  Settings,
  Bell,
  TrendingUp,
  Wallet,
  CheckCircle,
  MapPin,
  Clock,
  UserPlus,
  Star,
  Search,
  LogOut
} from 'lucide-react';

const WorkerOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    location: {
      country: '',
      address: '',
      postal_code: '',
      service_radius: 0,
      is_primary: true,
      is_active: true,
    },
    skills: []
  });

  const handleLocationChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [name]: type === 'checkbox' ? checked : value
      }
    }));
  };

  const addSkill = () => {
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, { name: '', slug: '', skill_type: '', proficiency_level: 'Beginner' }]
    }));
  };

  const removeSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const handleSkillChange = (index, e) => {
    const { name, value } = e.target;
    const newSkills = [...formData.skills];
    newSkills[index][name] = value;
    if (name === 'name') {
      newSkills[index].slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    setFormData(prev => ({ ...prev, skills: newSkills }));
  };

  const renderStepIndicator = () => (
    <div className="flex justify-between items-center mb-8 relative">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 -z-10"></div>
      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#24634e] transition-all duration-300 -z-10" style={{ width: `${((currentStep - 1) / 2) * 100}%` }}></div>
      {['Location', 'Skills', 'Review'].map((step, idx) => (
        <div key={step} className={`flex flex-col items-center bg-slate-50 px-2`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${currentStep >= idx + 1 ? 'bg-[#24634e] text-white' : 'bg-gray-200 text-gray-500'}`}>
            {idx + 1}
          </div>
          <span className={`text-xs mt-2 font-semibold ${currentStep >= idx + 1 ? 'text-[#24634e]' : 'text-gray-500'}`}>{step}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold text-[#394056] mb-6">Worker Onboarding</h2>
      {renderStepIndicator()}

      {currentStep === 1 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h3 className="text-lg font-bold text-[#394056] border-b pb-2">Location Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-[#394056] mb-1">Country</label>
              <input type="text" name="country" value={formData.location.country} onChange={handleLocationChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#24634e] outline-none" placeholder="e.g. Nepal" />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#394056] mb-1">Postal Code</label>
              <input type="text" name="postal_code" value={formData.location.postal_code} onChange={handleLocationChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#24634e] outline-none" placeholder="e.g. 44600" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-[#394056] mb-1">Address</label>
              <input type="text" name="address" value={formData.location.address} onChange={handleLocationChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#24634e] outline-none" placeholder="Full address" />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#394056] mb-1">Service Radius (km)</label>
              <input type="number" name="service_radius" value={formData.location.service_radius} onChange={handleLocationChange} min="1" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#24634e] outline-none" />
            </div>
            <div className="flex items-center space-x-6 pt-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" name="is_primary" checked={formData.location.is_primary} onChange={handleLocationChange} className="w-4 h-4 text-[#24634e] rounded focus:ring-[#24634e]" />
                <span className="text-sm font-bold text-[#394056]">Primary Location</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" name="is_active" checked={formData.location.is_active} onChange={handleLocationChange} className="w-4 h-4 text-[#24634e] rounded focus:ring-[#24634e]" />
                <span className="text-sm font-bold text-[#394056]">Active</span>
              </label>
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <button onClick={() => setCurrentStep(2)} disabled={!formData.location.country || !formData.location.address || formData.location.service_radius <= 0} className="bg-[#24634e] text-white px-6 py-2 rounded-xl font-bold hover:bg-[#1e5341] disabled:opacity-50 transition-colors">Next: Skills</button>
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="text-lg font-bold text-[#394056]">Skills & Expertise</h3>
            <button onClick={addSkill} className="text-sm font-bold text-[#24634e] bg-[#24634e]/10 px-3 py-1.5 rounded-lg hover:bg-[#24634e]/20 transition-colors">+ Add Skill</button>
          </div>

          {formData.skills.length === 0 ? (
            <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-gray-300">
              No skills added yet. Click 'Add Skill' to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {formData.skills.map((skill, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-xl bg-slate-50 relative group">
                  <button onClick={() => removeSkill(index)} className="absolute top-4 right-4 text-red-400 hover:text-red-600 font-bold text-sm">Remove</button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mr-16">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Skill Name</label>
                      <input type="text" name="name" value={skill.name} onChange={(e) => handleSkillChange(index, e)} className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-[#24634e] outline-none" placeholder="e.g. Wiring" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Slug (Auto)</label>
                      <input type="text" name="slug" value={skill.slug} readOnly className="w-full border border-gray-200 bg-gray-100 rounded-lg px-3 py-1.5 text-sm text-slate-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Skill Type</label>
                      <select name="skill_type" value={skill.skill_type} onChange={(e) => handleSkillChange(index, e)} className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-[#24634e] outline-none">
                        <option value="">Select Type...</option>
                        <option value="Electrical">Electrical</option>
                        <option value="Plumbing">Plumbing</option>
                        <option value="Carpentry">Carpentry</option>
                        <option value="Cleaning">Cleaning</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Proficiency Level</label>
                      <select name="proficiency_level" value={skill.proficiency_level} onChange={(e) => handleSkillChange(index, e)} className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-[#24634e] outline-none">
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Expert">Expert</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between pt-4">
            <button onClick={() => setCurrentStep(1)} className="text-[#394056] px-6 py-2 rounded-xl font-bold border border-gray-200 hover:bg-slate-50 transition-colors">Back</button>
            <button onClick={() => setCurrentStep(3)} disabled={formData.skills.length === 0 || formData.skills.some(s => !s.name || !s.skill_type)} className="bg-[#24634e] text-white px-6 py-2 rounded-xl font-bold hover:bg-[#1e5341] disabled:opacity-50 transition-colors">Next: Review</button>
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <h3 className="text-lg font-bold text-[#394056] border-b pb-2">Review & Submit</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 p-5 rounded-xl border border-gray-100">
              <h4 className="font-bold text-[#24634e] mb-3 flex items-center"><MapPin className="w-4 h-4 mr-2" /> Location Summary</h4>
              <ul className="space-y-2 text-sm text-[#394056]">
                <li><span className="text-slate-500 font-medium">Country:</span> {formData.location.country}</li>
                <li><span className="text-slate-500 font-medium">Address:</span> {formData.location.address}</li>
                <li><span className="text-slate-500 font-medium">Postal Code:</span> {formData.location.postal_code || 'N/A'}</li>
                <li><span className="text-slate-500 font-medium">Radius:</span> {formData.location.service_radius} km</li>
                <li><span className="text-slate-500 font-medium">Status:</span> {formData.location.is_active ? 'Active' : 'Inactive'}, {formData.location.is_primary ? 'Primary' : 'Secondary'}</li>
              </ul>
            </div>

            <div className="bg-slate-50 p-5 rounded-xl border border-gray-100">
              <h4 className="font-bold text-[#24634e] mb-3 flex items-center"><Wrench className="w-4 h-4 mr-2" /> Skills Summary</h4>
              <ul className="space-y-3 text-sm text-[#394056]">
                {formData.skills.map((skill, idx) => (
                  <li key={idx} className="flex justify-between items-center border-b border-gray-200 last:border-0 pb-2 last:pb-0">
                    <span className="font-bold">{skill.name}</span>
                    <span className="bg-[#cc8f84]/20 text-[#cc8f84] px-2 py-0.5 rounded text-xs font-bold">{skill.proficiency_level}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button onClick={() => setCurrentStep(2)} className="text-[#394056] px-6 py-2 rounded-xl font-bold border border-gray-200 hover:bg-slate-50 transition-colors">Back</button>
            <button onClick={() => { console.log('Submitted', formData); alert('Worker Onboarded Successfully!'); setCurrentStep(1); }} className="bg-[#6f9435] text-white px-6 py-2 rounded-xl font-bold shadow-md hover:bg-[#5a782b] transition-colors">Submit Onboarding</button>
          </div>
        </div>
      )}
    </div>
  );
};


export default function MerchantDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { id: 'requests', label: 'Service Requests', icon: <Briefcase size={20} /> },
    { id: 'team', label: 'Team Management', icon: <Users size={20} /> },
    { id: 'worker_onboarding', label: 'Worker Onboarding', icon: <UserPlus size={20} /> },
    { id: 'services', label: 'Services & Pricing', icon: <Wrench size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  // Dummy Data for Overview
  const metrics = [
    { label: "Active Requests", value: "12", trend: "+3", icon: <Briefcase className="text-[#24634e] w-6 h-6" />, bg: "bg-[#24634e]/10" },
    { label: "Total Workers", value: "24", trend: "Full Team", icon: <Users className="text-[#cc8f84] w-6 h-6" />, bg: "bg-[#cc8f84]/10" },
    { label: "Monthly Revenue", value: "₹1,45,000", trend: "+15%", icon: <Wallet className="text-[#6f9435] w-6 h-6" />, bg: "bg-[#6f9435]/10" },
    { label: "Avg Worker Rating", value: "4.8", trend: "Top 5%", icon: <Star className="text-yellow-500 w-6 h-6" />, bg: "bg-yellow-500/10" },
  ];

  const recentRequests = [
    { id: 101, title: "Full House Wiring", client: "Suresh", location: "Kathmandu", status: "Pending Assignment", budget: "₹15,000", time: "2h ago" },
    { id: 102, title: "Plumbing Overhaul", client: "Anita", location: "Lalitpur", status: "In Progress", budget: "₹8,000", time: "5h ago" },
  ];

  const workers = [
    { id: 1, name: "Ram Bahadur", skill: "Electrician", status: "Available", rating: 4.9, completedJobs: 142 },
    { id: 2, name: "Shiva Shrestha", skill: "Plumber", status: "On Site", rating: 4.7, completedJobs: 89 },
    { id: 3, name: "Hari", skill: "Carpenter", status: "Available", rating: 4.8, completedJobs: 210 },
  ];

  const services = [
    { id: 1, name: "Electrical Wiring (Per Sq Ft)", basePrice: "₹150", active: true },
    { id: 2, name: "Plumbing Inspection & Fix", basePrice: "₹500", active: true },
    { id: 3, name: "Custom Carpentry (Hourly)", basePrice: "₹300", active: true },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      <div className="flex flex-1 pt-0">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-100 hidden md:flex flex-col shadow-sm z-10 sticky top-0 h-screen">
          <div className="p-6">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Merchant Menu</h2>
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
            <div className="bg-gradient-to-br from-[#cc8f84]/10 to-[#cc8f84]/5 rounded-xl p-4 border border-[#cc8f84]/20 m-6 mb-4">
              <h4 className="text-sm font-bold text-[#394056]">Need Help?</h4>
              <p className="text-xs text-slate-500 mt-1 mb-3">Contact priority merchant support.</p>
              <button className="text-xs font-semibold text-[#cc8f84] hover:text-[#b0786e] flex items-center">
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
        <main className="flex-1 p-6 md:p-8 overflow-y-auto w-full max-w-7xl mx-auto">
          {/* Header */}
          <header className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#394056]">
                {tabs.find(t => t.id === activeTab)?.label}
              </h1>
              <p className="text-slate-500 mt-1">
                {activeTab === 'overview' && `Welcome back, ${user?.name || "Merchant"}! Here's what's happening.`}
                {activeTab === 'requests' && "Manage and assign incoming service requests from users."}
                {activeTab === 'team' && "View and manage your workforce and their availability."}
                {activeTab === 'worker_onboarding' && "Add new workers to your team."}
                {activeTab === 'services' && "Configure your service offerings and set base pricing."}
                {activeTab === 'settings' && "Update your organizational information."}
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
                  placeholder="Search requests or team..."
                />
              </div>
              <button className="p-2 bg-white text-slate-500 hover:text-[#24634e] rounded-full border border-gray-200 shadow-sm hover:shadow-md transition">
                <Bell size={20} />
              </button>
            </div>
          </header>

          {/* Dynamic Content Views */}
          <div className="animate-in fade-in duration-300">
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {metrics.map((metric, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-[#cc8f84]/50 transition-colors">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${metric.bg}`}>
                          {metric.icon}
                        </div>
                        <span className={`text-sm font-semibold px-2 py-1 rounded-full ${metric.trend.includes('+') || metric.trend.includes('Top') ? 'bg-green-100 text-green-700' : 'bg-[#cc8f84]/20 text-[#cc8f84]'}`}>
                          {metric.trend}
                        </span>
                      </div>
                      <h3 className="text-slate-500 text-sm font-medium mb-1">{metric.label}</h3>
                      <p className="text-2xl font-bold text-[#394056]">{metric.value}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Recent Operations Widget */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-[#394056]">Needs Attention</h3>
                      <button className="text-sm font-semibold text-[#24634e] hover:underline" onClick={() => setActiveTab('requests')}>View All</button>
                    </div>
                    <div className="space-y-4">
                      {recentRequests.map(req => (
                        <div key={req.id} className="border border-gray-50 rounded-xl p-4 bg-slate-50/50 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                          <div>
                            <h4 className="font-bold text-[#394056]">{req.title}</h4>
                            <div className="flex items-center text-xs text-slate-500 mt-1 space-x-3">
                              <span className="flex items-center"><MapPin size={12} className="mr-1" /> {req.location}</span>
                              <span className="flex items-center"><Clock size={12} className="mr-1" /> {req.time}</span>
                            </div>
                          </div>
                          <div className="flex flex-col sm:items-end gap-2 shrink-0">
                            <span className="font-bold text-[#394056] text-sm">{req.budget}</span>
                            {req.status === 'Pending Assignment' ? (
                              <button className="text-xs bg-[#cc8f84] text-white px-3 py-1.5 rounded-lg font-bold shadow-sm hover:bg-[#b0786e] transition-colors">
                                Assign Worker
                              </button>
                            ) : (
                              <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-2 py-1 rounded-md">
                                {req.status}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Team Status Widget */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-[#394056]">Team Availability</h3>
                      <button className="text-sm font-semibold text-[#24634e] hover:underline" onClick={() => setActiveTab('team')}>Manage Team</button>
                    </div>
                    <div className="space-y-4">
                      {workers.slice(0, 3).map(w => (
                        <div key={w.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-gray-50">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-[#394056]">
                              {w.name.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-bold text-[#394056] text-sm">{w.name}</h4>
                              <p className="text-xs text-slate-500">{w.skill}</p>
                            </div>
                          </div>
                          <div>
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${w.status === 'Available' ? 'bg-green-100 text-green-700 flex items-center' : 'bg-gray-100 text-gray-600 flex items-center'}`}>
                              {w.status === 'Available' && <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>}
                              {w.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* REQUESTS TAB */}
            {activeTab === 'requests' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-slate-50/50">
                  <h3 className="font-bold text-[#394056]">Incoming Service Requests</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {recentRequests.map(req => (
                    <div key={req.id} className="p-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 hover:bg-slate-50 transition-colors">
                      <div className="flex space-x-4">
                        <div className="mt-1 bg-[#24634e]/10 p-3 rounded-xl shrink-0">
                          <Wrench className="text-[#24634e] w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-[#394056] mb-1">{req.title}</h4>
                          <div className="flex flex-wrap items-center text-sm text-slate-500 gap-y-2 mb-2">
                            <span className="flex items-center mr-4">
                              <span className="font-medium mr-1 text-slate-600">Client:</span> {req.client}
                            </span>
                            <span className="flex items-center mr-4">
                              <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" /> {req.location}
                            </span>
                            <span className="flex items-center">
                              <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" /> {req.time}
                            </span>
                          </div>
                          <span className="text-lg font-bold text-[#6f9435]">{req.budget}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 w-full lg:w-auto">
                        {req.status === 'Pending Assignment' ? (
                          <>
                            <select className="flex-1 lg:w-48 bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#394056] focus:outline-none focus:ring-2 focus:ring-[#24634e]">
                              <option value="">Select Worker...</option>
                              {workers.filter(w => w.status === 'Available').map(w => (
                                <option key={w.id} value={w.id}>{w.name} ({w.skill})</option>
                              ))}
                            </select>
                            <button className="bg-[#24634e] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md shadow-[#24634e]/20 hover:bg-[#1e5341] transition-colors whitespace-nowrap">
                              Assign Task
                            </button>
                          </>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-semibold bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200">
                              Assigned to: {workers[1].name}
                            </span>
                            <button className="text-sm font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                              Track Progress
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TEAM TAB */}
            {activeTab === 'team' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">
                  <h3 className="font-bold text-[#394056]">Manage Workforce</h3>
                  <button onClick={() => setActiveTab('worker_onboarding')} className="flex items-center space-x-2 bg-white border border-gray-200 text-[#394056] px-4 py-2 rounded-lg text-sm font-bold hover:border-[#24634e] hover:text-[#24634e] transition-colors shadow-sm">
                    <UserPlus size={16} />
                    <span>Add Worker</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50/50 border-b border-gray-100">
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Worker Name</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Specialty</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Jobs Done</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Rating</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {workers.map(w => (
                        <tr key={w.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-full bg-[#cc8f84]/20 flex items-center justify-center text-[#cc8f84] font-bold text-sm">
                                {w.name.charAt(0)}
                              </div>
                              <span className="font-semibold text-[#394056]">{w.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{w.skill}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${w.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                              }`}>
                              {w.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">{w.completedJobs}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm font-semibold text-[#394056]">
                              <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                              {w.rating}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-[#24634e] hover:text-[#1e5341] mr-3">Edit</button>
                            <button className="text-red-500 hover:text-red-700">Remove</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* WORKER ONBOARDING TAB */}
            {activeTab === 'worker_onboarding' && (
              <div className="animate-in fade-in duration-300">
                <WorkerOnboarding />
              </div>
            )}

            {/* SERVICES TAB */}
            {activeTab === 'services' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">
                  <div>
                    <h3 className="font-bold text-[#394056]">Provided Services</h3>
                    <p className="text-sm text-slate-500 mt-1">Services displayed to customers on your agency profile.</p>
                  </div>
                  <button className="bg-[#24634e] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md shadow-[#24634e]/20 hover:bg-[#1e5341] transition-colors">
                    + Add New Service
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  {services.map(srv => (
                    <div key={srv.id} className="border border-gray-200 rounded-xl p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 group hover:border-[#cc8f84]/50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="bg-slate-100 p-3 rounded-lg text-slate-500 group-hover:text-[#cc8f84] group-hover:bg-[#cc8f84]/10 transition-colors">
                          <Wrench size={24} />
                        </div>
                        <div>
                          <h4 className="font-bold text-[#394056] text-lg">{srv.name}</h4>
                          <span className="text-sm font-bold text-[#6f9435]">{srv.basePrice} <span className="font-normal text-slate-500">base rate</span></span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <label className="flex items-center cursor-pointer">
                          <div className="relative">
                            <input type="checkbox" className="sr-only" defaultChecked={srv.active} />
                            <div className="block bg-green-500 w-10 h-6 rounded-full"></div>
                            <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform translate-x-4"></div>
                          </div>
                          <div className="ml-3 text-sm font-medium text-slate-600">
                            Active
                          </div>
                        </label>
                        <div className="w-px h-6 bg-gray-200 mx-2"></div>
                        <button className="text-[#394056] hover:text-[#24634e] p-2 hover:bg-slate-50 rounded-lg transition-colors font-semibold text-sm">
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SETTINGS TAB */}
            {activeTab === 'settings' && (
              <div className="max-w-2xl">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="font-bold text-[#394056] mb-6 text-xl pb-4 border-b border-gray-100">Organization Settings</h3>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-bold text-[#394056] mb-1">Business Name</label>
                      <input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#24634e] focus:border-transparent transition-shadow" defaultValue="ShramSaathi Trusted Agency" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#394056] mb-1">Business Email</label>
                      <input type="email" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#24634e] focus:border-transparent transition-shadow" defaultValue={user?.email || "merchant@example.com"} />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#394056] mb-1">Contact Phone</label>
                      <input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#24634e] focus:border-transparent transition-shadow" defaultValue="+977 9800000000" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#394056] mb-1">Business Address</label>
                      <textarea className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#24634e] focus:border-transparent transition-shadow" rows="3" defaultValue="Kathmandu, Bagmati, Nepal"></textarea>
                    </div>
                    <div className="pt-4 border-t border-gray-50 flex justify-end">
                      <button className="bg-[#24634e] text-white px-6 py-2.5 rounded-xl font-bold shadow-md shadow-[#24634e]/20 hover:bg-[#1e5341] transition-colors">
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
