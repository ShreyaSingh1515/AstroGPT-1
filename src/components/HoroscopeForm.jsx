// Example component using the API
import React, { useState } from 'react';
import { getPrediction } from '../services/api';

const HoroscopeForm = () => {
  const [userData, setUserData] = useState({
    name: '',
    birthDate: '',
    birthTime: '',
    location: '',
    query: ''
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const result = await getPrediction(userData);
      setPrediction(result.prediction);
    } catch (err) {
      setError('Failed to get prediction. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="horoscope-form">
      <h2>Your Personalized Horoscope</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input 
            type="text" 
            name="name" 
            value={userData.name} 
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label>Birth Date</label>
          <input 
            type="date" 
            name="birthDate" 
            value={userData.birthDate} 
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Birth Time (optional)</label>
          <input 
            type="time" 
            name="birthTime" 
            value={userData.birthTime} 
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label>Birth Location (optional)</label>
          <input 
            type="text" 
            name="location" 
            value={userData.location} 
            onChange={handleChange}
            placeholder="City, Country"
          />
        </div>
        
        <div className="form-group">
          <label>Specific Question (optional)</label>
          <textarea 
            name="query" 
            value={userData.query} 
            onChange={handleChange}
            placeholder="E.g., How will my love life be this month?"
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Getting prediction...' : 'Get My Horoscope'}
        </button>
      </form>
      
      {error && <div className="error-message">{error}</div>}
      
      {prediction && (
        <div className="prediction-result">
          <h3>Your Horoscope</h3>
          <p>{prediction}</p>
        </div>
      )}
    </div>
  );
};

export default HoroscopeForm;