import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ScanCard from '../components/ScanCard';
import '../styles/Dashboard.css';

function DashboardPage() {
  const [url, setUrl] = useState('');
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchScans();
  }, []);

  const fetchScans = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await axios.get('/api/scans', config);
      setScans(res.data);
    } catch (error) {
      console.error(error);
      // Handle error (e.g., redirect to login if token is invalid)
    }
  };

  const handleScan = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await axios.post('/api/scans/', { url }, config);
      setScans([res.data, ...scans]); // Add new scan to the top
      setUrl('');
    } catch (error) {
      console.error(error);
      alert(error.response.data.message || 'Scan failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteScan = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.delete(`/api/scans/${id}`, config);
      setScans(scans.filter(scan => scan._id !== id));
    } catch (error) {
      console.error(error);
      alert(error.response.data.message || 'Failed to delete scan');
    }
  };

  const handleUpdateNote = async (id, note) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.put(`/api/scans/${id}`, { note }, config);
      setScans(scans.map(scan => (scan._id === id ? { ...scan, note } : scan)));
    } catch (error) {
      console.error(error);
      alert(error.response.data.message || 'Failed to update note');
    }
  };

  return (
    <div className="container animate-fade-in">
      <h2>Dashboard</h2>
      <form onSubmit={handleScan} className="scan-form animate-slide-in">
        <input
          type="text"
          placeholder="Enter website URL to scan"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Scanning...' : 'Scan Website'}
        </button>
      </form>

      <div className="scan-history animate-slide-in">
        <h3>Previous Scans</h3>
        {scans.length > 0 ? (
          scans.map(scan => (
            <ScanCard
              key={scan._id}
              scan={scan}
              onDelete={handleDeleteScan}
              onUpdateNote={handleUpdateNote}
            />
          ))
        ) : (
          <p>No scans yet. Start by entering a URL above!</p>
        )}
      </div>
    </div>
  );
}

export default DashboardPage; 