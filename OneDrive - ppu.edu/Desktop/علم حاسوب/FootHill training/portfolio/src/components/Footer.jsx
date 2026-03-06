import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhone, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border pt-20 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-2xl font-bold tracking-tighter text-primary">
              HASAN<span className="text-gray-400 font-light ml-1">AL-SAAFIN</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-sm">
              Focusing on high-performance web development and scalable 
              digital solutions. Passionate about clean code, performance, 
              and user-centric design.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/HasanAlsaafen"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-gray-50 dark:bg-slate-800 flex items-center justify-center text-gray-400 hover:text-primary hover:bg-primary/5 transition-all shadow-sm"
              >
                <FontAwesomeIcon icon={faGithub} />
              </a>
              <a
                href="https://linkedin.com/in/hasan-saafen-9ba5902b5"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-gray-50 dark:bg-slate-800 flex items-center justify-center text-gray-400 hover:text-primary hover:bg-primary/5 transition-all shadow-sm"
              >
                <FontAwesomeIcon icon={faLinkedin} />
              </a>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-text border-l-2 border-primary pl-3">
              Get in Touch
            </h3>
            <div className="space-y-4">
              <a
                href="mailto:hasansaafen1234@gmail.com"
                className="flex items-center gap-3 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-primary transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <FontAwesomeIcon icon={faEnvelope} className="text-xs" />
                </div>
                hasansaafen1234@gmail.com
              </a>
              <a
                href="tel:+972568973379"
                className="flex items-center gap-3 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-primary transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <FontAwesomeIcon icon={faPhone} className="text-xs" />
                </div>
                +972 568973379
              </a>
              <div className="flex items-center gap-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                  <FontAwesomeIcon icon={faLocationDot} className="text-xs" />
                </div>
                Hebron, Palestine
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-text border-l-2 border-primary pl-3">
              Explore
            </h3>
            <ul className="space-y-3">
              {["About", "Projects", "Certificates", "Contact"].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase()}`}
                    className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-200 dark:bg-slate-700 group-hover:bg-primary transition-colors" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-50 dark:border-slate-800 flex flex-col md:flex-row justify-center items-center gap-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
          <p>&copy; {currentYear} Hasan Al-Saafin</p>
          <div className="flex items-center gap-6">
            <span>Built with Love 💗</span>
        
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
