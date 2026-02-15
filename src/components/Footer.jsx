import logo from "../assets/logo.png";

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-700 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8 md:flex md:justify-between md:items-center">

        {/* Left: Brand */}
        <div className="flex items-center space-x-2 mb-4 md:mb-0">
          <img
            src= {logo} // adjust path
            alt="ShramSaathi"
            className="h-8 w-auto"/>
          <span className="text-xl font-bold text-blue-600">ShramSaathi</span>
        </div>

        {/* Center: Links */}
          <div className="flex flex-col md:flex-col md:justify-center space-y-2 md:space-y-3 md:space-x-98 mb-5 md:mb-0">
            <a href="/" className="hover:text-blue-600">Home</a>
            <a href="/workers" className="hover:text-blue-600">Find Workers</a>
            <a href="/post-job" className="hover:text-blue-600">Post a Job</a>
            <a href="/how-it-works" className="hover:text-blue-600">How It Works</a>
            <a href="/contact" className="hover:text-blue-600">Contact</a>
          </div>

          {/* Right: Social or Copyright */}
        <div className="text-center md:text-right text-sm">
          © {new Date().getFullYear()} This is our Platform ShramSaathi. All rights reserved.
        </div>

      </div>
    </footer>
  );
}
