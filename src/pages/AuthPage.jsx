import React, { useState } from "react";
import axios from "axios";
<<<<<<< HEAD
import "./authpage.css";
=======
import "./authpage.css"; // make sure this exists
>>>>>>> 28f328105fb59a3d837565cc28442659e2c7321d

export default function AuthPage({ setToken }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [upi, setUpi] = useState("");
  const [message, setMessage] = useState(null);

<<<<<<< HEAD
  const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

=======
>>>>>>> 28f328105fb59a3d837565cc28442659e2c7321d
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && (!name || !upi))) {
      setMessage({ type: "error", text: "All fields are required" });
      return;
    }
<<<<<<< HEAD
    try {
      const url = isLogin ? `${API_URL}/login` : `${API_URL}/register`;
      const body = isLogin ? { email, password } : { name, email, password, upi_id: upi };
      const res = await axios.post(url, body);
=======

    try {
      const url = isLogin
        ? `${import.meta.env.VITE_BACKEND_URL}/login`
        : `${import.meta.env.VITE_BACKEND_URL}/register`;
      const body = isLogin
        ? { email, password }
        : { name, email, password, upi_id: upi };

      const res = await axios.post(url, body);

>>>>>>> 28f328105fb59a3d837565cc28442659e2c7321d
      if (isLogin) {
        setToken(res.data.token);
        setMessage({ type: "success", text: "Logged in successfully!" });
      } else {
        setMessage({ type: "success", text: "Registered successfully! Please login." });
        setIsLogin(true);
<<<<<<< HEAD
        setName(""); setEmail(""); setPassword(""); setUpi("");
      }
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.error || "Something went wrong" });
=======
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
>>>>>>> 28f328105fb59a3d837565cc28442659e2c7321d
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{isLogin ? "Login" : "Register"}</h2>
<<<<<<< HEAD
        {message && <div className={`message ${message.type}`}>{message.text}</div>}
        <form onSubmit={handleSubmit}>
          {!isLogin && <>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name"/>
            <input value={upi} onChange={(e) => setUpi(e.target.value)} placeholder="UPI ID" />
          </>}
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
          <button type="submit">{isLogin ? "Login" : "Register"}</button>
        </form>
        <p className="switch-link" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
=======

        {message && <div className={`message ${message.type}`}>{message.text}</div>}

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

        <p className="switch-link" onClick={() => setIsLogin(!isLogin)}>
          {isLogin
            ? "Don't have an account? Register"
            : "Already have an account? Login"}
>>>>>>> 28f328105fb59a3d837565cc28442659e2c7321d
        </p>
      </div>
    </div>
  );
}
