import React, { useState } from 'react';

const AstroForm = () => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [place, setPlace] = useState('');
  const [chart, setChart] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/chart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ date, time, place })
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        setChart(null);
      } else {
        setChart(data.chart);
        setError('');
      }
    } catch (err) {
      setError('Server not responding.');
      setChart(null);
    }
  };

  return (
    <div>
      <h2>🌟 Generate Astrological Chart</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Date of Birth:
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </label>
        <br />
        <label>
          Time of Birth:
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
        </label>
        <br />
        <label>
          Place of Birth:
          <input type="text" value={place} onChange={(e) => setPlace(e.target.value)} placeholder="e.g., Delhi" required />
        </label>
        <br />
        <button type="submit">Generate Chart</button>
      </form>

      {error && <p style={{ color: 'red' }}>⚠️ {error}</p>}

      {chart && (
        <div>
          <h3>🔭 Planetary Positions</h3>
          <ul>
            {Object.entries(chart).map(([planet, data]) => (
              <li key={planet}>
                {planet}: {data.degree}° → {data.sign}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AstroForm;
