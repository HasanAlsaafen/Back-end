import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark, faEnvelope, faPhone, faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";

export default function Navbar({ isDarkMode, toggleDarkMode }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#about", label: "About" },
    { href: "#projects", label: "Projects" },
    { href: "#certificates", label: "Certificates" },
    { href: "#contact", label: "Contact" },
  ];

  const socialLinks = [
    { href: "https://www.linkedin.com/in/hasan-saafen-9ba5902b5", icon: faLinkedin, label: "LinkedIn" },
    { href: "https://github.com/HasanAlsaafen", icon: faGithub, label: "GitHub" },
  ];

  const contactInfo = [
    { href: "mailto:hasansaafen1234@gmail.com", icon: faEnvelope, label: "Email" },
    { href: "tel:+972568973379", icon: faPhone, label: "Phone" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled 
            ? "py-4 bg-card backdrop-blur-lg shadow-lg border-b border-border" 
            : "py-6 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold tracking-tighter text-primary">
              <a href="#top">HASAN<span className="text-gray-400 font-light ml-1">AL-SAAFIN</span></a>
            </h1>
          </div>

          <ul className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  className="text-sm font-semibold text-gray-600 hover:text-primary transition-colors relative group py-2"
                  href={link.href}
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden lg:flex items-center gap-6 border-l border-border ml-8 pl-8">
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-400 hover:text-primary transition-colors text-lg"
                  aria-label={social.label}
                >
                  <FontAwesomeIcon icon={social.icon} />
                </a>
              ))}
            </div>
            <div className="flex items-center gap-4">
              {contactInfo.map((info) => (
                <a
                  key={info.label}
                  href={info.href}
                  className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                  aria-label={info.label}
                >
                  <FontAwesomeIcon icon={info.icon} className="text-sm" />
                </a>
              ))}
            </div>

            <button
              onClick={toggleDarkMode}
              className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-sm ml-2"
              aria-label="Toggle theme"
            >
              <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} className="text-sm" />
            </button>
          </div>

          <div className="flex items-center gap-4 lg:hidden">
            <button
              onClick={toggleDarkMode}
              className="text-xl text-primary focus:outline-none"
              aria-label="Toggle theme"
            >
              <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />
            </button>
            <button
              className="text-2xl text-gray-900 dark:text-gray-100 focus:outline-none"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              <FontAwesomeIcon icon={open ? faXmark : faBars} />
            </button>
          </div>
        </div>
      </nav>

      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="absolute top-0 right-0 h-full w-[280px] bg-white dark:bg-slate-900 shadow-2xl p-8 animate-slide-left flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-xl font-bold text-primary">Menu</h2>
                <button 
                  onClick={() => setOpen(false)}
                  className="text-2xl text-gray-400 hover:text-primary transition-colors"
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              </div>
              <ul className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      className="text-lg font-semibold text-gray-600 hover:text-primary transition-colors flex items-center justify-between group"
                      href={link.href}
                      onClick={() => setOpen(false)}
                    >
                      {link.label}
                      <FontAwesomeIcon icon={faXmark} className="text-xs opacity-0 group-hover:opacity-100 -rotate-45 transition-all" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mobile Footer Info */}
            <div className="space-y-6 pt-8 border-t border-border">
              <div className="flex items-center gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-primary hover:bg-primary/5 transition-all"
                  >
                    <FontAwesomeIcon icon={social.icon} className="text-xl" />
                  </a>
                ))}
              </div>
              <div className="space-y-3">
                {contactInfo.map((info) => (
                  <a
                    key={info.label}
                    href={info.href}
                    className="flex items-center gap-3 text-sm font-medium text-gray-500 hover:text-primary transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                      <FontAwesomeIcon icon={info.icon} className="text-xs" />
                    </div>
                    {info.label === "Email" ? "hasansaafen1234@gmail.com" : "+972 568973379"}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-left {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-left {
          animation: slide-left 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Spacer for fixed nav */}
      <div className="h-24" />
    </>
  );
}
