import React, { useState } from "react";
import axios from "axios";
import "./authpage.css"; // your auth styles

export default function AuthPage({ setToken }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [upi, setUpi] = useState("");
  const [message, setMessage] = useState(null);

  // ✅ Use environment variable for backend base URL
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || (!isLogin && (!name || !upi))) {
      setMessage({ type: "error", text: "All fields are required" });
      return;
    }

    try {
      const url = isLogin
        ? `${backendUrl}/login`
        : `${backendUrl}/register`;

      const body = isLogin
        ? { email, password }
        : { name, email, password, upi_id: upi };

      const res = await axios.post(url, body);

      if (isLogin) {
        setToken(res.data.token);
        setMessage({ type: "success", text: "Logged in successfully!" });
      } else {
        setMessage({
          type: "success",
          text: "Registered successfully! Please login.",
        });
        setIsLogin(true);
        setName("");
        setEmail("");
        setPassword("");
        setUpi("");
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMessage({
        type: "error",
        text: err.response?.data?.error || "Something went wrong",
      });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{isLogin ? "Login" : "Register"}</h2>

        {message && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
              />
              <input
                value={upi}
                onChange={(e) => setUpi(e.target.value)}
                placeholder="UPI ID"
              />
            </>
          )}
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button type="submit">{isLogin ? "Login" : "Register"}</button>
        </form>

        <p
          className="switch-link"
          onClick={() => {
            setIsLogin(!isLogin);
            setMessage(null);
          }}
        >
          {isLogin
            ? "Don't have an account? Register"
            : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
}
