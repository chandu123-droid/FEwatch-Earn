import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard({ token, logout }) {
  const [ads, setAds] = useState([]);
  const [balance, setBalance] = useState(0);
  const [upi, setUpi] = useState("");
  const [message, setMessage] = useState("");

  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchAds();
    fetchBalance();
  }, []);

  const fetchAds = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/ads`, config);
      setAds(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBalance = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/balance`, config);
      setBalance(res.data.balance);
      setUpi(res.data.upi_id);
    } catch (err) {
      console.error(err);
    }
  };

  const watchAd = async (adId) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/watch/${adId}`, {}, config);
      setMessage(`You earned ₹${res.data.reward}`);
      fetchBalance();
    } catch (err) {
      setMessage(err.response?.data?.error || "Error watching ad");
    }
  };

  const withdraw = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/withdraw`,
        { upi_id: upi },
        config
      );
      setMessage(
        `Withdrawn! Your share: ₹${res.data.user_share}, Admin share: ₹${res.data.admin_share}`
      );
      fetchBalance();
    } catch (err) {
      setMessage(err.response?.data?.error || "Error withdrawing");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Your Wallet: ₹{balance.toFixed(2)}</h2>
      <button onClick={logout} style={{ marginBottom: "10px" }}>Logout</button>

      {message && <p style={{ color: "green" }}>{message}</p>}

      <h3>Watch Ads & Earn</h3>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {ads.map((ad) => (
          <div key={ad.id} style={{ border: "1px solid #ccc", padding: "10px", width: "200px" }}>
            <h4>{ad.name}</h4>
            <p>{ad.description}</p>
            <p>Reward: ₹{ad.reward}</p>
            <button onClick={() => watchAd(ad.id)}>Watch & Earn</button>
          </div>
        ))}
      </div>

      <h3>Withdraw via UPI</h3>
      <p>UPI: {upi}</p>
      <button onClick={withdraw}>Withdraw</button>
    </div>
  );
}
