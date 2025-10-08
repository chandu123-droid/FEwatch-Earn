import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard({ token, logout }) {
  const [ads, setAds] = useState([]);
  const [balance, setBalance] = useState(0);
  const [upi, setUpi] = useState("");
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchAds();
    fetchBalance();
  }, []);

  const fetchAds = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/ads`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAds(res.data);
    } catch (err) {
      console.error("Fetch ads error:", err);
    }
  };

  const fetchBalance = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/balance`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBalance(res.data.balance);
      setUpi(res.data.upi_id);
    } catch (err) {
      console.error("Fetch balance error:", err);
    }
  };

  const watchAd = async (adId) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/watch/${adId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage({ type: "success", text: `You earned ₹${res.data.reward}` });
      fetchBalance();
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: err.response?.data?.error || "Something went wrong" });
    }
  };

  const withdraw = async () => {
    if (balance < 1) {
      setMessage({ type: "error", text: "Minimum withdrawal ₹1" });
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/withdraw`,
        { upi_id: upi },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage({ type: "success", text: res.data.message });
      fetchBalance();
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: err.response?.data?.error || "Withdrawal failed" });
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
        {ads.map((ad) => (
          <div key={ad.id} className="ad-card">
            <h4>{ad.title}</h4>
            <p>{ad.description}</p>
            <p>Reward: ₹{ad.reward}</p>
            <button onClick={() => watchAd(ad.id)}>Watch & Earn</button>
          </div>
        ))}
      </div>

      <div className="withdraw-section">
        <h3>Withdraw via Razorpay</h3>
        <input
          value={upi}
          onChange={(e) => setUpi(e.target.value)}
          placeholder="Your UPI ID"
        />
        <button onClick={withdraw}>Withdraw</button>
      </div>
    </div>
  );
}
