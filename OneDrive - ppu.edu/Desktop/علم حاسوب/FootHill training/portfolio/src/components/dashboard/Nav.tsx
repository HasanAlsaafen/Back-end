import { faMoon, faSun, faBell, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";

interface NavProps {
  onBellClick: () => void;
  hasNotifications: boolean;
}

export default function Nav({ onBellClick, hasNotifications }: NavProps) {
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
    <nav className="bg-card border-b border-border h-20 flex items-center justify-between px-8 sticky top-0 z-30">
      <div className="flex items-center flex-1">
        <div className="relative w-full max-w-md hidden md:block">
          <p className="text-text text-3xl">Welcome Again!</p>
        </div>
        <h2 className="text-text font-bold text-xl md:hidden">Dashboard</h2>
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={onBellClick}
          className="p-2 w-10 h-10 rounded-full bg-secondary text-gray-400 hover:text-primary transition-all relative"
          aria-label="Notifications"
        >
          <FontAwesomeIcon icon={faBell} />
          {hasNotifications && (
            <span className="absolute top-2 right-2.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-card animate-pulse"></span>
          )}
        </button>

        <button
          onClick={toggleDarkMode}
          className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-gray-400 hover:text-primary transition-all"
          aria-label="Toggle theme"
        >
          <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />
        </button>

        <div className="flex items-center space-x-3 border-l border-border pl-4 ml-2">
          <div className="hidden text-right md:block">
            <p className="text-sm font-bold text-text">Hasan Al-Saafin</p>
            <p className="text-xs text-gray-500 font-medium">Administrator</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center text-white font-bold ring-2 ring-border shadow-sm">
            HA
          </div>
        </div>
      </div>
    </nav>
  );
}