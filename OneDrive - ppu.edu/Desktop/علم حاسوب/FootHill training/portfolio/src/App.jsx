import "./index.css";
import Dashboard from "./pages/Dashboard";
import Main from "./pages/Main";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { Routes, Route } from "react-router-dom";
import ProtectedRoutes from "./Routes/ProtectedRoutes";
import { useState } from "react";
import { createContext } from "react";
export const AccessTokenContext = createContext({
  accessToken: "",
  handleSetAccessToken: (token) => {}
});

export default function App() {
  const [accessToken, setAccessToken] = useState("");
  const handleSetAccessToken = (token) => {
    console.log(token);
    setAccessToken(token);
  }
  return (
    <AccessTokenContext.Provider value={{accessToken, handleSetAccessToken}}>
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/login" element={<Login  />} />
      <Route path="/dashboard" element={<ProtectedRoutes  />}>
        <Route index element={<Dashboard />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
    </AccessTokenContext.Provider>
  );
}
