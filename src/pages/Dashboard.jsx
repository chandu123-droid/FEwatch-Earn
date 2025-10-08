import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard({ token, logout }) {
  const [ads, setAds] = useState([]);
  const [balance, setBalance] = useState(0);
  const [upi, setUpi] = useState("");
  const [message, setMessage] = useState(null);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetchAds();
    fetchBalance();
  }, []);

  const fetchAds = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/ads`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAds(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBalance = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/balance`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBalance(res.data.balance);
      setUpi(res.data.upi_id);
    } catch (err) {
      console.error(err);
    }
  };

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
    }
  };

  return (
    <div className="dashboard-container">
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
    </div>
  );
}
