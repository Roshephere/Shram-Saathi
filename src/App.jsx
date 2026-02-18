import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import "./index.css";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />
      <main>
      <Home />
      </main>
      <Footer />
    </div>
  );
}
