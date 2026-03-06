import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import fs1 from "../assets/images/F.S.png"
import cv from "../assets/CV.pdf"
import { 
  faDownload, 
  faCode, 
  faCloud, 
  faRocket,
  faBriefcase,
  faKeyboard,
  faLayerGroup,
  faTerminal
} from "@fortawesome/free-solid-svg-icons";
import {
  faReact,
  faJs,
  faHtml5,
  faCss3Alt,
  faNodeJs,
  faGithub,
  faLinkedin
} from "@fortawesome/free-brands-svg-icons";
import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const iconMap = {
  Code2: faCode,
  Rocket: faRocket,
  Cloud: faCloud,
  Briefcase: faBriefcase,
  Keyboard: faKeyboard,
  LayerGroup: faLayerGroup,
  Terminal: faTerminal,
  React: faReact,
  JS: faJs,
  HTML: faHtml5,
  CSS: faCss3Alt,
  Node: faNodeJs,
  Github: faGithub,
  Linkedin: faLinkedin
};

const SkillBadge = ({ icon, label }) => (
  <div className="flex items-center gap-2 px-4 py-2 bg-card shadow-sm border border-border rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300">
    <FontAwesomeIcon icon={iconMap[icon] || faCode} className="text-primary" />
    {label}
  </div>
);

const FALLBACK_HERO_DATA = {
  heading: "A Full-Stack Fromt-End Developer\nBuilding Digital Excellence",
  subheading: "I specialize in creating high-performance web applications with modern technologies. Focused on clean code and user experiences.",
  cards: [
    { icon: "Code2", title: "Full-stack Dev" },
    { icon: "Terminal", title: "Clean Code" },
    { icon: "Rocket", title: "Performance" }
  ],
  CV: cv,
  ctaText: "Get in touch",
  backgroundImage: fs1 
};

const AboutSection = () => {
  const [heroData, setHeroData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const response = await fetch(`${API_URL}/herosections/69725fab64d15d80a13ea473`);
        if (response.ok) {
          const data = await response.json();
          if (data) {
            setHeroData(data);
          } else {
            setError(true);
          }
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Failed to fetch hero data", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchHero();
  }, []);

  if (loading) {
    return (
      <div className="py-24 flex items-center justify-center" aria-live="polite" aria-busy="true">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <span className="sr-only">Loading hero section...</span>
      </div>
    );
  }

  const displayData = heroData || FALLBACK_HERO_DATA;

  return (
    <section 
      className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      aria-labelledby="about-heading"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
        <div className="lg:col-span-7 space-y-8">
          <header>
            <h2
              className="text-primary text-[10px] font-bold uppercase tracking-[0.3em] mb-4 flex items-center gap-3 before:content-[''] before:w-8 before:h-[1px] before:bg-primary/30"
              id="about-heading"
            >
              Full-Stack front-end developer
            </h2>
            <h3 className="text-4xl lg:text-5xl font-extrabold text-text leading-[1.1] mb-6 whitespace-pre-line">
              {displayData.heading}
            </h3>
            <p className="text-lg text-text leading-relaxed font-medium max-w-2xl whitespace-pre-line">
              {displayData.subheading}
            </p>
          </header>

          <div className="flex flex-wrap gap-3" role="list" aria-label="Key skills">
            {displayData.cards.map((card, index) => (
              <div role="listitem" key={index}>
                <SkillBadge icon={card.icon} label={card.title} />
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-4">
            {displayData.CV && displayData.CV !== "#" && (
              <a
                href={displayData.CV}
                className="px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-3 focus:ring-2 focus:ring-primary focus:ring-offset-2 outline-none"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Download CV as PDF"
              >
                Download My CV <FontAwesomeIcon icon={faDownload} />
              </a>
            )}
            <a 
              href="#contact" 
              className="text-text font-bold hover:text-primary transition-colors flex items-center gap-2 group focus:ring-2 focus:ring-primary rounded-lg p-1 outline-none"
            >
              {displayData.ctaText || "Let's talk"} <span className="group-hover:translate-x-1 transition-transform" aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        <div className="lg:col-span-5 relative" aria-hidden="true">
          <div className="relative z-10">
            <div className="absolute inset-0 bg-primary/5 rounded-[3rem] -rotate-6 scale-105" />
            <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 rounded-[3rem] rotate-3 scale-105" />
            
            <div className="relative bg-card p-4 rounded-[3rem] shadow-2xl border border-border ring-1 ring-gray-900/5">
              <img
                className="w-full aspect-square object-cover rounded-[2.5rem] shadow-inner"
                src={fs1}
                alt={"Professional profile photo"}
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default AboutSection;