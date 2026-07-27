import React from "react";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import About from "./components/About/About";
import VisionMission from "./components/VisionMission/VisionMission";
import Ventures from "./components/Ventures/Ventures";
import QuoteBanner from "./components/QuoteBanner/QuoteBanner";
import Contact from "./components/Contact/Contact";
import Footer from "./components/Footer/Footer";
import './index.css';

function App() {
  return(
    <div className="portfolio-app">
      <Navbar />
      <main className="content-area">
        <Hero />
        <About />
        <VisionMission />
        <Ventures />
        <QuoteBanner/>
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;