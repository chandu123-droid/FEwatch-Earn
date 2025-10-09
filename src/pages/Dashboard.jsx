import React, { useEffect, useState } from "react";
import axios from "axios";
<<<<<<< HEAD
import "./Dashboard.css";
=======
>>>>>>> 28f328105fb59a3d837565cc28442659e2c7321d

export default function Dashboard({ token, logout }) {
  const [ads, setAds] = useState([]);
  const [balance, setBalance] = useState(0);
  const [upi, setUpi] = useState("");
<<<<<<< HEAD
  const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
=======
  const [message, setMessage] = useState(null);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
>>>>>>> 28f328105fb59a3d837565cc28442659e2c7321d

  useEffect(() => {
    fetchAds();
    fetchBalance();
  }, []);

  const fetchAds = async () => {
    try {
<<<<<<< HEAD
      const res = await axios.get(`${API_URL}/ads`, {
        headers: { Authorization: `Bearer ${token}` }
=======
      const res = await axios.get(`${BACKEND_URL}/ads`, {
        headers: { Authorization: `Bearer ${token}` },
>>>>>>> 28f328105fb59a3d837565cc28442659e2c7321d
      });
      setAds(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBalance = async () => {
    try {
<<<<<<< HEAD
      const res = await axios.get(`${API_URL}/balance`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBalance(res.data.balance ?? 0);
      setUpi(res.data.upi_id ?? "");
=======
      const res = await axios.get(`${BACKEND_URL}/balance`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBalance(res.data.balance);
      setUpi(res.data.upi_id);
>>>>>>> 28f328105fb59a3d837565cc28442659e2c7321d
    } catch (err) {
      console.error(err);
    }
  };

<<<<<<< HEAD
  const handleVideoEnd = async (ad) => {
    try {
      const res = await axios.post(`${API_URL}/watch/${ad.id}/complete`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(`You earned ₹${res.data.reward}`);
      fetchBalance();
    } catch (err) {
      alert(`Failed to watch ad: ${err.response?.data?.error || err.message}`);
    }
  };

  const handleWithdraw = async () => {
    try {
      const res = await axios.post(`${API_URL}/withdraw`, { upi_id: upi }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(`User share: ₹${res.data.user_share}, Admin share: ₹${res.data.admin_share}`);
      fetchBalance();
    } catch (err) {
      alert(`Withdraw failed: ${err.response?.data?.error || err.message}`);
=======
  const watchAd = async (adId, adReward) => {
    try {
      setMessage({ type: "info", text: "Watching ad... please wait 30 seconds" });
      // Start watching
      await axios.post(`${BACKEND_URL}/watch/${adId}/start`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Simulate ad duration
      setTimeout(async () => {
        const res = await axios.post(`${BACKEND_URL}/watch/${adId}/complete`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBalance(prev => prev + res.data.reward);
        setMessage({ type: "success", text: `You earned ₹${res.data.reward}` });
      }, 30000); // 30 seconds
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to watch ad" });
>>>>>>> 28f328105fb59a3d837565cc28442659e2c7321d
    }
  };

  return (
    <div className="dashboard-container">
<<<<<<< HEAD
      <div className="wallet-section">
        <h2>Your Wallet: ₹{balance.toFixed(2)}</h2>
        <input style={{width: "300px"}}
          type="text" 
          value={upi}
          onChange={(e) => setUpi(e.target.value)}
          placeholder="Enter your UPI ID"
          className="upi-input"
        />
        <button className="btn" onClick={handleWithdraw}>Withdraw</button>
        <button className="btn" onClick={logout}>Logout</button>
      </div>
      <div className="ads-list">
        {ads.map(ad => (
          <div key={ad.id} className="ad-card">
            <h3>{ad.title}</h3>
            <p>{ad.description}</p>
            <video width="320" height="240" controls onEnded={() => handleVideoEnd(ad)}>
              <source src={ad.video_url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <p>Reward: ₹{ad.reward}</p>
          </div>
        ))}
      </div>
=======
      <div className="header">
        <h2>Your Wallet: ₹{balance.toFixed(2)}</h2>
        <button onClick={logout}>Logout</button>
      </div>

      {message && <div className={`message ${message.type}`}>{message.text}</div>}

      <h3>Watch Ads & Earn</h3>
      <div className="ads-list">
        {ads.map(ad => (
          <div key={ad.id} className="ad-box">
            <h4>{ad.title}</h4>
            <p>{ad.description}</p>
            <p>Reward: ₹{ad.reward}</p>
            <button onClick={() => watchAd(ad.id, ad.reward)}>Watch & Earn</button>
          </div>
        ))}
      </div>

      <div className="withdraw-section">
        <h4>Withdraw via Razorpay</h4>
        <p>{upi}</p>
        <button>Withdraw</button>
      </div>
>>>>>>> 28f328105fb59a3d837565cc28442659e2c7321d
    </div>
  );
}
