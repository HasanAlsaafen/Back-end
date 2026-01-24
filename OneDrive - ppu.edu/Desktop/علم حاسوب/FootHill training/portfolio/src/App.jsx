import "./index.css";
import Dashboard from "./pages/Dashboard";
import Main from "./pages/Main";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
