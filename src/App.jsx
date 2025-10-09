import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [token, setToken] = useState(null);

  const logout = () => setToken(null);

  return (
    <Routes>
      <Route
        path="/"
        element={token ? <Navigate to="/dashboard" /> : <AuthPage setToken={setToken} />}
      />
      <Route
        path="/dashboard"
        element={token ? <Dashboard token={token} logout={logout} /> : <Navigate to="/" />}
      />
    </Routes>
  );
}
