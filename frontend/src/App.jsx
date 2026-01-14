import React, { useState, useEffect } from 'react'
import InputZone from './components/InputZone'
import Dashboard from './components/Dashboard'

function App() {
  const [items, setItems] = useState([]);
  const [apiUrl, setApiUrl] = useState(localStorage.getItem('polymath_api_url') || 'http://localhost:8000');
  const [showSettings, setShowSettings] = useState(false);

  // Common headers for all requests to ensure Ngrok works
  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true'
  });

  const fetchItems = async () => {
    try {
      const res = await fetch(`${apiUrl}/items`, {
        headers: getHeaders()
      });
      if (!res.ok) throw new Error('Network response was not ok');
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
  }, [apiUrl]);

  const saveSettings = (newUrl) => {
    // Remove trailing slash if present
    const cleaned = newUrl.replace(/\/$/, "");
    setApiUrl(cleaned);
    localStorage.setItem('polymath_api_url', cleaned);
    setShowSettings(false);
    // Immediate refresh
    setTimeout(fetchItems, 500);
  };

  const handleInputSubmit = async (content, type) => {
    try {
      await fetch(`${apiUrl}/input`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ content, type })
      });
      fetchItems();
    } catch (e) {
      console.error(e);
      alert("Failed to connect to backend. Check your URL settings.");
    }
  };

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    // Note: FormData request automatically sets Content-Type to multipart/form-data
    // So we only add the custom header
    try {
      await fetch(`${apiUrl}/upload`, {
        method: 'POST',
        headers: {
          'ngrok-skip-browser-warning': 'true'
        },
        body: formData
      });
      fetchItems();
    } catch (e) {
      console.error(e);
      alert("Failed to upload. Check your connection.");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 selection:bg-blue-500/30 font-sans pb-20">
      <div className="max-w-6xl mx-auto px-6 pt-12">
        <header className="mb-12 flex justify-between items-baseline">
          <div className="flex items-baseline gap-4">
            <h1 className="text-4xl font-extrabold text-white tracking-tight">
              The Polymath’s Inbox
            </h1>
            <span className="text-zinc-500 font-mono text-sm">v1.1.1 // {apiUrl.includes('localhost') ? 'LOCAL' : 'REMOTE'}</span>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="text-xs font-mono text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-2"
          >
            <span className={`w-2 h-2 rounded-full ${items.length > 0 ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
            {apiUrl}
          </button>
        </header>

        {showSettings && (
          <div className="mb-8 p-6 bg-zinc-900 border border-zinc-800 rounded-xl relative">
            <h3 className="text-lg font-bold text-zinc-100 mb-4">Connection Settings</h3>
            <p className="text-sm text-zinc-400 mb-4">
              To use this on GitHub Pages, run <code>ngrok http 8000</code> locally and paste the HTTPS URL here.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); saveSettings(e.target.url.value); }} className="flex gap-4">
              <input
                name="url"
                defaultValue={apiUrl}
                className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2 outline-none focus:border-blue-500 transition-colors"
                placeholder="https://..."
              />
              <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium">
                Save
              </button>
            </form>
          </div>
        )}

        <InputZone onInputSubmit={handleInputSubmit} onFileUpload={handleFileUpload} />

        <Dashboard items={items} onRefresh={fetchItems} apiUrl={apiUrl} />
      </div>
    </div>
  )
}

export default App
