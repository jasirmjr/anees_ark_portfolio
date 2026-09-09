import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Footer from "./components/Footer/Footer";
import './index.css';

function App() {
  return(
    <div className="portfolio-app">
      <Navbar />
      <main className="content-area">
        <Hero />
      </main>
      <Footer />
    </div>
  );
}

export default App;