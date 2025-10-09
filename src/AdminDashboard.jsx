import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

const AdminDashboard = () => {
  const [earnings, setEarnings] = useState(0);
  const token = localStorage.getItem('token');

  const fetchEarnings = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/earnings`, { headers: { Authorization: `Bearer ${token}` } });
      setEarnings(res.data.totalEarnings ?? 0);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, []);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <h3>Total Earnings (60% profit from ads): ₹{earnings.toFixed(2)}</h3>
    </div>
  );
};

export default AdminDashboard;
