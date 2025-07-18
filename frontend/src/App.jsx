import React, { useState, useEffect } from 'react';
import ErrorBoundary from './ErrorBoundary';

function App() {
  const [bugs, setBugs] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBugs = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/bugs');
        if (!response.ok) {
          throw new Error('Failed to fetch bugs');
        }
        const data = await response.json();
        setBugs(data);
      } catch (err) {
        setError(err.message);
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBugs();
  }, []);

  const reportBug = async () => {
    if (!title.trim()) {
      setError('Title cannot be empty');
      return;
    }

    try {
      const response = await fetch('/api/bugs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
      });

      if (!response.ok) {
        throw new Error('Failed to report bug');
      }

      const newBug = await response.json();
      setBugs([newBug, ...bugs]);
      setTitle('');
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Report bug error:', err);
    }
  };

  const updateBugStatus = async (id, status) => {
    try {
      const response = await fetch(`/api/bugs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error('Failed to update bug');
      }

      const updatedBug = await response.json();
      setBugs(bugs.map(bug => 
        bug._id === updatedBug._id ? updatedBug : bug
      ));
    } catch (err) {
      setError(err.message);
      console.error('Update bug error:', err);
    }
  };

  return (
    <ErrorBoundary>
      <div className="app">
        <h1>Zippy Royalty Bugger</h1>
        
        {error && <div className="error">{error}</div>}
        
        <div className="bug-form">
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Enter bug title..."
          />
          <button onClick={reportBug} disabled={loading}>
            {loading ? 'Reporting...' : 'Report Bug'}
          </button>
        </div>
        
        {loading && bugs.length === 0 ? (
          <p>Loading bugs...</p>
        ) : (
          <ul className="bug-list">
            {bugs.map(bug => (
              <li key={bug._id}>
                <span>{bug.title}</span>
                <select
                  value={bug.status}
                  onChange={e => updateBugStatus(bug._id, e.target.value)}
                >
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </li>
            ))}
          </ul>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;