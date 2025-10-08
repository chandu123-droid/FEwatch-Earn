import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard({ token, logout }) {
  const [ads, setAds] = useState([]);
  const [balance, setBalance] = useState(0);
  const [upi, setUpi] = useState("");

  useEffect(() => {
    fetchAds();
    fetchBalance();
  }, []);

  const fetchAds = async () => {
    try {
      const res = await axios.get("http://localhost:5000/ads", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAds(res.data);
    } catch (err) {
      console.error("Fetch ads error:", err);
    }
  };

  const fetchBalance = async () => {
    try {
      const res = await axios.get("http://localhost:5000/balance", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBalance(res.data.balance);
      setUpi(res.data.upi_id || "");
    } catch (err) {
      console.error("Fetch balance error:", err);
    }
  };

  const watchAd = async (adId, reward) => {
    try {
      await axios.post(
        `http://localhost:5000/watch/${adId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBalance(balance + reward);
      alert(`You earned ₹${reward}`);
    } catch (err) {
      console.error("Watch ad error:", err);
      alert("Failed to update balance.");
    }
  };

  const withdraw = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/withdraw",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBalance(0);
      alert(res.data.message);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Withdraw failed");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2>Your Wallet: ₹{balance.toFixed(2)}</h2>
          {upi && <p>UPI ID: <strong>{upi}</strong></p>}
        </div>
        <button
          onClick={logout}
          style={{
            padding: "8px 16px",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      <button
        onClick={withdraw}
        style={{
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          padding: "10px 20px",
          margin: "10px 0",
          cursor: "pointer",
          borderRadius: "5px",
        }}
      >
        Withdraw
      </button>

      <h3>Watch Ads & Earn</h3>
      {ads.length === 0 && <p>No ads available</p>}

      <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
        {ads.map((ad) => (
          <div
            key={ad.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "15px",
              width: "300px",
              boxShadow: "2px 2px 5px rgba(0,0,0,0.1)",
            }}
          >
            <h4>{ad.title}</h4>
            <p>{ad.description}</p>

            {/* Video ad - reward added only after video ends */}
            {ad.video_url && (
              <video
                src={ad.video_url}
                controls
                style={{ width: "100%", marginBottom: "10px", borderRadius: "5px" }}
                onEnded={() => watchAd(ad.id, ad.reward)}
              />
            )}

            <p>
              <strong>Reward: ₹{ad.reward}</strong>
            </p>
            {!ad.video_url && (
              <button
                onClick={() => watchAd(ad.id, ad.reward)}
                style={{
                  backgroundColor: "#2196F3",
                  color: "white",
                  border: "none",
                  padding: "8px 15px",
                  cursor: "pointer",
                  borderRadius: "5px",
                }}
              >
                Watch & Earn
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
