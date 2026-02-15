import { useState } from "react";
import logo from "../assets/logo.png";
export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">

          {/* Logo and Text */}
          <div className="flex items-center space-x-3">
            <img src={logo} alt="ShramSaathi" className="h-15 w-22" />
            <div className="text-2xl font-bold text-blue-600">
              ShramSaathi
            </div>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-8 items-center">
            <a href="/" className="nav-link">Home</a>
            <a href="/workers" className="nav-link">Find Workers</a>
            <a href="/post-job" className="nav-link">Post a Job</a>
            <a href="/how-it-works" className="nav-link">How It Works</a>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex space-x-4">
            <a
              href="/login"
              className="text-gray-600 hover:text-blue-600 px-4 py-2">
              Login
            </a>
            <a
              href="/register"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Register
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-2xl" >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t">
          <a href="/" className="mobile-link">Home</a>
          <a href="/workers" className="mobile-link">Find Workers</a>
          <a href="/post-job" className="mobile-link">Post a Job</a>
          <a href="/how-it-works" className="mobile-link">How It Works</a>
          <a href="/login" className="mobile-link">Login</a>
          <a href="/register" className="mobile-link font-semibold text-blue-600">
            Register
          </a>
        </div>
      )}
    </nav>
  );
}
