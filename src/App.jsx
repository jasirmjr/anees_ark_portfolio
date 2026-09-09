import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import './index.css';

function App() {
  return(
    <div className="portfolio-app min-h-screen bg-[#fafafa]">
      <Navbar />
      <main className="content-area">
        <Hero />
      </main>
    </div>
  );
}

export default App;