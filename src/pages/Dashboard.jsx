import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css"; // make sure this exists

export default function Dashboard({ token, logout }) {
  const [ads, setAds] = useState([]);
  const [balance, setBalance] = useState(0);
  const [upi, setUpi] = useState("");
  const [message, setMessage] = useState(null);

  const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    fetchAds();
    fetchBalance();
  }, []);

  const fetchAds = async () => {
    try {
      const res = await axios.get(`${API_URL}/ads`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAds(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBalance = async () => {
    try {
      const res = await axios.get(`${API_URL}/balance`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBalance(res.data.balance ?? 0);
      setUpi(res.data.upi_id ?? "");
    } catch (err) {
      console.error(err);
    }
  };

  const watchAd = async (adId) => {
    try {
      setMessage({ type: "info", text: "Watching ad... please wait 10 seconds" });

      // Simulate ad duration
      setTimeout(async () => {
        try {
          const res = await axios.post(
            `${API_URL}/watch/${adId}/complete`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setBalance((prev) => prev + res.data.reward);
          setMessage({ type: "success", text: `You earned ₹${res.data.reward}` });
        } catch (err) {
          setMessage({ type: "error", text: "Failed to credit reward" });
        }
      }, 10000); // 10 seconds
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to start ad" });
    }
  };

  const handleWithdraw = async () => {
    try {
      const res = await axios.post(
        `${API_URL}/withdraw`,
        { upi_id: upi },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`User share: ₹${res.data.user_share}, Admin share: ₹${res.data.admin_share}`);
      fetchBalance();
    } catch (err) {
      alert(`Withdraw failed: ${err.response?.data?.error || err.message}`);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="wallet-section">
        <h2>Your Wallet: ₹{balance.toFixed(2)}</h2>
        <input
          style={{ width: "300px" }}
          type="text"
          value={upi}
          onChange={(e) => setUpi(e.target.value)}
          placeholder="Enter your UPI ID"
          className="upi-input"
        />
        <button className="btn" onClick={handleWithdraw}>Withdraw</button>
        <button className="btn" onClick={logout}>Logout</button>
      </div>

      {message && <div className={`message ${message.type}`}>{message.text}</div>}

      <h3>Watch Ads & Earn</h3>
      <div className="ads-list">
        {ads.map((ad) => (
          <div key={ad.id} className="ad-card">
            <h4>{ad.title}</h4>
            <p>{ad.description}</p>
            <p>Reward: ₹{ad.reward}</p>
            <button onClick={() => watchAd(ad.id)}>Watch & Earn</button>
          </div>
        ))}
      </div>
    </div>
  );
}
