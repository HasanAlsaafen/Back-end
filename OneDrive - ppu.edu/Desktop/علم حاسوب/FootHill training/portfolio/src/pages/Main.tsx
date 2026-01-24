import Header from "../components/Header";
import Navbar from "../components/Navbar";
import AboutSection from "../components/AboutSection";
import Projects from "../components/Projects";
import Certificates from "../components/Certificates";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
export default function Main()
{
    const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      return saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  return (
       <div className="min-h-screen bg-secondary text-text font-sans transition-colors duration-300">
         <Header />
         <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
         <main className="p-4 lg:p-8">
           <AboutSection />
           <Projects />
           <Certificates />
           <Contact />
         </main>
         <Footer />
       </div> 
  )
}