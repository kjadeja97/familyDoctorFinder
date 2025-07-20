import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

// List of specialties for the dropdown
const SPECIALTIES = [
  { value: 'Family Medicine', label: 'Family Medicine' },
  { value: 'General Practice', label: 'General Practice' },
  { value: 'Internal Medicine', label: 'Internal Medicine' },
  { value: 'Pediatrics', label: 'Pediatrics' },
  { value: 'Obstetrics and Gynecology', label: 'Obstetrics and Gynecology' },
  { value: 'Dermatology', label: 'Dermatology' },
  { value: 'Cardiology', label: 'Cardiology' },
  { value: 'Psychiatry', label: 'Psychiatry' },
  { value: 'Neurology', label: 'Neurology' },
  { value: 'General Surgery', label: 'General Surgery' },
  { value: 'Orthopedic Surgery', label: 'Orthopedic Surgery' },
  { value: 'Urology', label: 'Urology' },
  { value: 'Anesthesiology', label: 'Anesthesiology' },
  { value: 'Gastroenterology', label: 'Gastroenterology' },
  { value: 'Endocrinology and Metabolism', label: 'Endocrinology and Metabolism' },
  { value: 'Diagnostic Radiology', label: 'Diagnostic Radiology' },
  { value: 'Medical Oncology', label: 'Medical Oncology' },
  { value: 'Hematology', label: 'Hematology' },
  { value: 'Respirology', label: 'Respirology' },
  { value: 'Rheumatology', label: 'Rheumatology' },
  { value: 'Ophthalmology', label: 'Ophthalmology' },
  { value: 'Otolaryngology – Head and Neck Surgery', label: 'Otolaryngology – Head and Neck Surgery' },
  { value: 'Emergency Medicine', label: 'Emergency Medicine' },
  { value: 'Plastic Surgery', label: 'Plastic Surgery' },
  { value: 'Pathology', label: 'Pathology' },
  { value: 'Infectious Diseases', label: 'Infectious Diseases' },
  { value: 'Nephrology', label: 'Nephrology' },
  { value: 'Physical Medicine and Rehabilitation', label: 'Physical Medicine and Rehabilitation' },
  { value: 'Occupational Medicine', label: 'Occupational Medicine' },
  { value: 'Public Health and Preventive Medicine', label: 'Public Health and Preventive Medicine' },
  { value: 'Geriatric Medicine', label: 'Geriatric Medicine' },
  { value: 'Pain Medicine', label: 'Pain Medicine' },
  { value: 'other', label: 'Other (please specify)' }
];

// Backend server URL
const BACKEND_URL = 'http://localhost:5000';

/**
 * Main application component for the Family Doctor Finder
 * 
 * This component provides a user interface for searching family doctors
 * using web scraping of the CPSO Advanced Search page.
 * 
 * Features:
 * - Form-based search with multiple criteria
 * - Web scraping integration via backend server
 * - Loading states and error handling
 * - Responsive design
 * 
 * @component
 * @returns {JSX.Element} The main application interface
 */
function App() {
  // Initial form state with default values
  const [formData, setFormData] = useState({
    FirstName: '',
    LastName: '',
    City: 'Ottawa',
    PostalCode: '',
    Gender: '',
    Language: '',
    Specialty: 'Family Medicine'
  });
  // State for custom specialty input
  const [customSpecialty, setCustomSpecialty] = useState('');

  // Application state management
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  /**
   * Handles input changes for all form fields
   * 
   * @param {Event} e - The input change event
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Reset custom specialty if specialty dropdown is changed
    if (name === 'Specialty' && value !== 'other') {
      setCustomSpecialty('');
    }
  };

  /**
   * Submits the search form and calls the backend scraping API
   * 
   * API Endpoint: http://localhost:5000/api/search
   * Method: POST
   * Headers: Content-Type: application/json
   * 
   * @param {Event} e - The form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResults([]);

    // Use custom specialty if 'other' is selected
    const specialtyToSend = formData.Specialty === 'other' ? customSpecialty : formData.Specialty;
    const payload = { ...formData, Specialty: specialtyToSend };

    try {
      // Make API call to backend scraping server
      const response = await axios.post(`${BACKEND_URL}/api/search`, payload, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 60000 // 60 second timeout for scraping
      });

      // Update results with API response
      setResults(response.data || []);
    } catch (err) {
      console.error('Error fetching doctors:', err);
      
      // Handle different types of errors
      if (err.response) {
        // Server responded with error status
        setError(`Server error: ${err.response.data.error || err.response.statusText}`);
      } else if (err.request) {
        // Network error - backend server might not be running
        setError('Cannot connect to server. Please ensure the backend server is running on port 5000.');
      } else {
        // Other error
        setError('Failed to fetch doctors. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Resets the form to initial state and clears results
   */
  const clearForm = () => {
    setFormData({
      FirstName: '',
      LastName: '',
      City: 'Ottawa',
      PostalCode: '',
      Gender: '',
      Language: '',
      Specialty: 'Family Medicine'
    });
    setCustomSpecialty('');
    setResults([]);
    setError('');
  };

  return (
    <div className="App">
      <div className="container">
        {/* Search Form Section */}
        <div className="card">
          <h1>🏥 Family Doctor Finder</h1>
          <p>Search for family doctors in Ontario using web scraping</p>
          
          <form onSubmit={handleSubmit}>
            {/* Form Grid Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              {/* First Name Input */}
              <div className="input-group">
                <label htmlFor="FirstName">First Name</label>
                <input
                  type="text"
                  id="FirstName"
                  name="FirstName"
                  value={formData.FirstName}
                  onChange={handleInputChange}
                  placeholder="Enter first name"
                />
              </div>

              {/* Last Name Input */}
              <div className="input-group">
                <label htmlFor="LastName">Last Name</label>
                <input
                  type="text"
                  id="LastName"
                  name="LastName"
                  value={formData.LastName}
                  onChange={handleInputChange}
                  placeholder="Enter last name"
                />
              </div>

              {/* City Input */}
              <div className="input-group">
                <label htmlFor="City">City</label>
                <input
                  type="text"
                  id="City"
                  name="City"
                  value={formData.City}
                  onChange={handleInputChange}
                  placeholder="Enter city"
                />
              </div>

              {/* Postal Code Input */}
              <div className="input-group">
                <label htmlFor="PostalCode">Postal Code</label>
                <input
                  type="text"
                  id="PostalCode"
                  name="PostalCode"
                  value={formData.PostalCode}
                  onChange={handleInputChange}
                  placeholder="Enter postal code"
                />
              </div>

              {/* Gender Selection */}
              <div className="input-group">
                <label htmlFor="Gender">Gender</label>
                <select
                  id="Gender"
                  name="Gender"
                  value={formData.Gender}
                  onChange={handleInputChange}
                >
                  <option value="">Any Gender</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
              </div>

              {/* Language Input */}
              <div className="input-group">
                <label htmlFor="Language">Language</label>
                <input
                  type="text"
                  id="Language"
                  name="Language"
                  value={formData.Language}
                  onChange={handleInputChange}
                  placeholder="Enter language"
                />
              </div>

              {/* Specialty Dropdown */}
              <div className="input-group">
                <label htmlFor="Specialty">Specialty</label>
                <select
                  id="Specialty"
                  name="Specialty"
                  value={formData.Specialty}
                  onChange={handleInputChange}
                >
                  {SPECIALTIES.map((spec) => (
                    <option key={spec.value} value={spec.value}>{spec.label}</option>
                  ))}
                </select>
                {/* Show custom specialty input if 'Other' is selected */}
                {formData.Specialty === 'other' && (
                  <input
                    type="text"
                    id="CustomSpecialty"
                    name="CustomSpecialty"
                    value={customSpecialty}
                    onChange={e => setCustomSpecialty(e.target.value)}
                    placeholder="Please specify specialty"
                    style={{ marginTop: '10px' }}
                    required
                  />
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button type="submit" className="btn" disabled={loading || (formData.Specialty === 'other' && !customSpecialty)}>
                {loading ? 'Searching...' : '🔍 Search Doctors'}
              </button>
              <button type="button" className="btn" onClick={clearForm} style={{ background: '#6c757d' }}>
                🗑️ Clear Form
              </button>
            </div>
          </form>
        </div>

        {/* Error Display */}
        {error && (
          <div className="card">
            <div className="error">{error}</div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="card">
            <div className="loading">
              <div>🔍 Searching for doctors...</div>
              <div style={{ fontSize: '14px', marginTop: '10px', color: '#888' }}>
                This may take a few moments as we search the CPSO database
              </div>
            </div>
          </div>
        )}

        {/* Search Results */}
        {results.length > 0 && (
          <div className="card">
            <h2>📋 Search Results ({results.length} doctors found)</h2>
            <div className="results">
              {results.map((doctor, index) => (
                <div key={index} className="doctor-card">
                  <div className="doctor-name">
                    {doctor.FirstName} {doctor.LastName}
                  </div>
                  {doctor.City && (
                    <div className="doctor-info">📍 {doctor.City}</div>
                  )}
                  {doctor.PostalCode && (
                    <div className="doctor-info">📮 {doctor.PostalCode}</div>
                  )}
                  {doctor.Gender && (
                    <div className="doctor-info">👤 {doctor.Gender === 'M' ? 'Male' : 'Female'}</div>
                  )}
                  {doctor.Language && (
                    <div className="doctor-info">🗣️ {doctor.Language}</div>
                  )}
                  {doctor.Specialty && (
                    <div className="doctor-info">🏥 {doctor.Specialty}</div>
                  )}
                  {doctor.RawData && (
                    <div className="doctor-info" style={{ fontSize: '12px', color: '#999' }}>
                      📄 {doctor.RawData.substring(0, 100)}...
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && results.length === 0 && !error && (
          <div className="card">
            <div className="no-results">
              Enter search criteria above to find family doctors
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App; 