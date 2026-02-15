import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./index.css";
function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="grow p-4">
        {/* Your page content goes here */}
      </div>
      <Footer />

    </div>
  );
}

export default App;
