import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import { AccessTokenContext } from "../App";
export default function Login() {
  const [username, setUserName] = useState("");
  const {handleSetAccessToken} = useContext(AccessTokenContext);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const URL = import.meta.env.VITE_API_URL;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(`${URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        throw new Error("Invalid username or password");
      }
      const data = await response.json();
      handleSetAccessToken(data.token);
      localStorage.setItem("username", username);
      navigate("/dashboard");
    } catch (error) {
      setError("Invalid username or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[400px] space-y-12"
      >
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-semibold text-text tracking-tight">Welcome back</h1>
          <p className="text-gray-500 text-lg">Enter your credentials to continue</p>
        </div>

        <div className="space-y-8">
          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="px-4 py-3 rounded-xl bg-red-500/5 border border-red-500/10 text-red-500 text-sm text-center font-medium"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500 ml-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-5 py-4 bg-card border border-border rounded-2xl focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all text-text"
                placeholder="Enter your username"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500 ml-1">Password</label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-4 bg-card border border-border rounded-2xl focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all text-text pr-12"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors p-1"
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="text-lg" />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white font-semibold py-4 rounded-2xl hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign in
                  <FontAwesomeIcon icon={faArrowRight} className="text-sm group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center">
            <button 
              onClick={() => navigate("/")}
              className="text-gray-400 hover:text-primary transition-colors text-sm font-medium"
            >
              Back to website
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

