

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [societies, setSocieties] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    date: '',
    uniqueIdCode: '',
    managerName: '',
    managerEmail: '',
    managerPassword: ''
  });
  const [selectedOption, setSelectedOption] = useState('createSociety');
  const [emailError, setEmailError] = useState(''); // State for email validation error
  const [showPopup, setShowPopup] = useState(false); // State to control popup visibility

  // Fetch societies on component mount
  useEffect(() => {
    fetchSocieties();
  }, []);

  // Function to fetch all societies
  const fetchSocieties = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/societies/create', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error fetching societies:', errorData);
        return;
      }

      const data = await response.json();
      setSocieties(data);
    } catch (error) {
      console.error('Error fetching societies:', error);
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the email is valid before submitting
    if (!validateEmail(formData.managerEmail)) {
      setEmailError('Please enter a valid email address.');
      setShowPopup(true); // Show the popup
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/societies/create/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setFormData({
          name: '',
          address: '',
          date: '',
          uniqueIdCode: '',
          managerName: '',
          managerEmail: '',
          managerPassword: ''
        });
        fetchSocieties(); // Refresh the list of societies
        alert('Society and manager created successfully!');
      } else {
        const errorData = await response.json();
        console.error('Error creating society:', errorData);
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error creating society:', error);
      alert('An unexpected error occurred.');
    }
  };

  // Function to handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;

    // Ensure email and password do not have spaces
    if (name === 'managerEmail' || name === 'managerPassword') {
      updatedValue = value.replace(/\s+/g, ''); // Remove all spaces
    }

    setFormData({
      ...formData,
      [name]: updatedValue
    });

    // Validate email in real-time
    if (name === 'managerEmail') {
      if (!validateEmail(updatedValue)) {
        setEmailError('Please enter a valid email address.');
      } else {
        setEmailError('');
      }
    }
  };

  // Function to validate email using regex
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email regex
    return regex.test(email);
  };

  // Function to handle society card click
  const handleSocietyClick = (societyId) => {
    navigate(`/society/${societyId}`);
  };

  // Function to close the popup
  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <h1>Admin Panel</h1>
        <div className="sidebar-options">
          <button
            className={`sidebar-button ${selectedOption === 'createSociety' ? 'active' : ''}`}
            onClick={() => setSelectedOption('createSociety')}
          >
            🏢 Create Society
          </button>
          <button
            className={`sidebar-button ${selectedOption === 'viewSocieties' ? 'active' : ''}`}
            onClick={() => setSelectedOption('viewSocieties')}
          >
            🏘️ View Societies
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {selectedOption === 'createSociety' && (
          <section className="create-society">
            <h2>Create New Society</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Society Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Date of Creation</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Custom Unique Identification Code</label>
                <input
                  type="text"
                  name="uniqueIdCode"
                  value={formData.uniqueIdCode}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Manager Name</label>
                <input
                  type="text"
                  name="managerName"
                  value={formData.managerName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Manager Email</label>
                <input
                  type="email"
                  name="managerEmail"
                  value={formData.managerEmail}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Manager Password</label>
                <input
                  type="password"
                  name="managerPassword"
                  value={formData.managerPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit">Create Society</button>
            </form>
          </section>
        )}

        {selectedOption === 'viewSocieties' && (
          <section className="societies-list">
            <h2>Existing Societies</h2>
            <div className="societies-grid">
              {societies.map((society) => (
                <div
                  key={society._id}
                  className="society-card"
                  onClick={() => handleSocietyClick(society._id)}
                >
                  <h3>{society.name}</h3>
                  <p>{society.address}</p>
                  <p>Manager: {society.manager?.email}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Popup for Error Message */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <p>{emailError}</p>
            <button onClick={closePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}