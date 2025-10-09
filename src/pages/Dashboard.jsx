import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

export default function Dashboard({ token, logout }) {
  const [ads, setAds] = useState([]);
  const [balance, setBalance] = useState(0);
  const [upi, setUpi] = useState("");
  const [message, setMessage] = useState(null);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

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
      setBalance(res.data.balance ?? 0);
      setUpi(res.data.upi_id ?? "");
    } catch (err) {
      console.error(err);
    }
  };

  const handleVideoEnd = async (ad) => {
    try {
      const res = await axios.post(
        `${BACKEND_URL}/watch/${ad.id}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`You earned ₹${res.data.reward}`);
      fetchBalance();
    } catch (err) {
      alert(`Failed to watch ad: ${err.response?.data?.error || err.message}`);
    }
  };

  const handleWithdraw = async () => {
    try {
      const res = await axios.post(
        `${BACKEND_URL}/withdraw`,
        { upi_id: upi },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(
        `Withdraw Successful!\nUser share: ₹${res.data.user_share}\nAdmin share: ₹${res.data.admin_share}`
      );
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
          type="text"
          value={upi}
          onChange={(e) => setUpi(e.target.value)}
          placeholder="Enter your UPI ID"
        />
        <button onClick={handleWithdraw} style={{color:"green"}}>Withdraw</button>
        <button onClick={logout} style={{color:"red"}}>Logout</button>
      </div>

      <div className="ads-list">
        {ads.map((ad) => (
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
    </div>
  );
}
