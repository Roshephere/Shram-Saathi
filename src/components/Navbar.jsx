import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "./assets/logo.svg";

export default function Navbar() {
  const { user, logout, isMerchant, isUser } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // Detect scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white ${scrolled ? 'shadow-2xl border-b border-gray-200' : 'mx-4 mt-3 rounded-xl shadow-lg border border-gray-200'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-15">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <img src={logo} alt="ShramSaathi Logo" className="pt-3 h-20 w-20" />
              <span className="text-[#24634e] text-xl font-bold">ShramSaathi</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">

            {/* Features Dropdown */}
            <div className="relative group">
              <button className="text-[#394056] transition duration-200 flex items-center space-x-1">
                <span>Features</span>
                <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute left-0 mt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="bg-white border border-gray-100 rounded-xl shadow-xl py-2">
                  <a href="#smart-recommendations" className="block px-4 py-3 text-gray-700 hover:bg-slate-50 hover:text-[#24634e] hover:scale-105 hover:pl-6 transition-all duration-200">Smart Recommendations</a>
                  <a href="#instant-booking" className="block px-4 py-3 text-gray-700 hover:bg-slate-50 hover:text-[#24634e] hover:scale-105 hover:pl-6 transition-all duration-200">Instant Booking</a>
                  <a href="#in-app-chat" className="block px-4 py-3 text-gray-700 hover:bg-slate-50 hover:text-[#cc8f84] hover:scale-105 hover:pl-6 transition-all duration-200">In-App Chat</a>
                </div>
              </div>
            </div>

            {/* Find Users Dropdown */}
            <div className="relative group">
              <button className="text-[#394056] transition duration-200 flex items-center space-x-1">
                <span>Find Users</span>
                <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute left-0 mt-2 w-72 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="bg-white border border-gray-100 rounded-xl shadow-xl py-2">

                  {/* By Category Section */}
                  <div className="px-4 py-2 text-xs font-bold text-black uppercase">By Category</div>
                  <a href="#electrician" className="block px-4 py-3 text-gray-700 hover:bg-slate-50 hover:text-[#cc8f84] hover:scale-105 hover:pl-6 transition-all duration-200">⚡ Electrician</a>
                  <a href="#plumbers" className="block px-4 py-3 text-gray-700 hover:bg-slate-50 hover:text-[#24634e] hover:scale-105 hover:pl-6 transition-all duration-200">🔧 Plumbers</a>
                  <a href="#carpenters" className="block px-4 py-3 text-gray-700 hover:bg-slate-50 hover:text-[#cc8f84] hover:scale-105 hover:pl-6 transition-all duration-200">🪚 Carpenters</a>
                  <a href="#mechanics" className="block px-4 py-3 text-gray-700 hover:bg-slate-50 hover:text-[#cc8f84] hover:scale-105 hover:pl-6 transition-all duration-200">🔩 Mechanics</a>
                  <div className="border-t border-gray-200 my-2"></div>

                  {/* By Filter Section */}
                  <div className="px-4 py-2 text-xs font-bold text-black uppercase">By Filter</div>
                  <a href="#by-skill" className="block px-4 py-3 text-gray-700 hover:bg-slate-50 hover:text-[#24634e] hover:scale-105 hover:pl-6 transition-all duration-200">📋 By Skill</a>
                  <a href="#by-location" className="block px-4 py-3 text-gray-700 hover:bg-slate-50 hover:text-[#cc8f84] hover:scale-105 hover:pl-6 transition-all duration-200">📍 By Location</a>
                  <a href="#by-price" className="block px-4 py-3 text-gray-700 hover:bg-slate-50 hover:text-[#cc8f84] hover:scale-105 hover:pl-6 transition-all duration-200">💰 By Price Range</a>
                  <a href="#by-rating" className="block px-4 py-3 text-gray-700 hover:bg-slate-50 hover:text-[#24634e] hover:scale-105 hover:pl-6 transition-all duration-200">⭐ By Rating</a>
                </div>
              </div>
            </div>
            <a href="#employers" className="text-[#394056] transition duration-200">For Employers</a>
            {/* About Dropdown */}
            <div className="relative group">
              <button className="text-[#394056] transition duration-200 flex items-center space-x-1">
                <span>About</span>
                <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute left-0 mt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="bg-white border border-gray-100 rounded-xl shadow-xl py-2">
                  <a href="#our-mission" className="block px-4 py-3 text-gray-700 hover:bg-slate-50 hover:text-[#cc8f84] hover:scale-105 hover:pl-6 transition-all duration-200">🎯 Our Mission</a>
                  <a href="#trust-safety" className="block px-4 py-3 text-gray-700 hover:bg-slate-50 hover:text-[#24634e] hover:scale-105 hover:pl-6 transition-all duration-200">🛡️ Trust & Safety</a>
                  <a href="#contact-us" className="block px-4 py-3 text-gray-700 hover:bg-slate-50 hover:text-[#cc8f84] hover:scale-105 hover:pl-6 transition-all duration-200">📧 Contact Us</a>
                  <a href="#faqs" className="block px-4 py-3 text-gray-700 hover:bg-slate-50 hover:text-[#24634e] hover:scale-105 hover:pl-6 transition-all duration-200">❓ FAQs</a>
                </div>
              </div>
            </div>
          </div>

          {/* Authentication Buttons */}
          <div className="hidden md:flex items-center space-x-4 ml-8">
            {user ? (
              <>
                <span className="text-[#394056]/80 text-sm">
                  {user.name} ({isMerchant ? 'Merchant' : 'User'})
                </span>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="text-[#394056] hover:text-[#24634e] transition duration-200 px-4 py-2"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-[#394056] hover:text-[#24634e] transition duration-200 px-4 py-2">
                  Sign In
                </Link>
                <Link to="/register" className="bg-[#24634e] text-white hover:bg-[#1e5341] px-6 py-2 rounded-lg font-semibold transition duration-200 shadow-lg">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-[#394056] p-2"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden pb-4">
          <div className="flex flex-col space-y-3">
            <a href="#features" className="text-[#394056] hover:text-[#24634e] py-2">Features</a>
            <a href="#users" className="text-[#394056] hover:text-[#24634e] py-2">Find Users</a>
            <a href="#employers" className="text-[#394056] hover:text-[#24634e] py-2">For Employers</a>
            <a href="#pricing" className="text-[#394056] hover:text-[#24634e] py-2">Pricing</a>
            <a href="#about" className="text-[#394056] hover:text-[#24634e] py-2">About</a>
            {user ? (
              <>
                <span className="text-[#394056]/80 text-sm py-2">
                  {user.name} ({isMerchant ? 'Merchant' : 'User'})
                </span>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="text-[#394056] hover:text-[#24634e] text-left py-2"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-[#394056] hover:text-[#24634e] text-left py-2">Sign In</Link>
                <Link to="/register" className="bg-[#24634e] text-white px-6 py-2 rounded-lg font-semibold">Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}