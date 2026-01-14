import React, { useState, useEffect } from 'react'
import InputZone from './components/InputZone'
import Dashboard from './components/Dashboard'

const API_URL = 'http://localhost:8000';

function App() {
  const [items, setItems] = useState([]);

  const fetchItems = async () => {
    try {
      const res = await fetch(`${API_URL}/items`);
      const data = await res.json();
      setItems(data);
    } catch (e) {
      console.error("Failed to fetch items", e);
    }
  };

  useEffect(() => {
    fetchItems();
    const interval = setInterval(fetchItems, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, []);

  const handleInputSubmit = async (content, type) => {
    try {
      await fetch(`${API_URL}/input`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, type })
      });
      fetchItems();
    } catch (e) {
      console.error(e);
    }
  };

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData
      });
      fetchItems();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 selection:bg-blue-500/30 font-sans pb-20">
      <div className="max-w-6xl mx-auto px-6 pt-12">
        <header className="mb-12 flex items-baseline gap-4">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            The Polymath’s Inbox
          </h1>
          <span className="text-zinc-500 font-mono text-sm">v1.0.0 // LOCAL MODE</span>
        </header>

        <InputZone onInputSubmit={handleInputSubmit} onFileUpload={handleFileUpload} />

        <Dashboard items={items} onRefresh={fetchItems} />
      </div>
    </div>
  )
}

export default App
