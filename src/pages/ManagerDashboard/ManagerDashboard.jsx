


import { useState, useEffect } from 'react';
import './ManagerDashboard.css';

export default function ManagerDashboard() {
  const [society, setSociety] = useState(null);
  const [error, setError] = useState('');
  const [requests, setRequests] = useState([]);
  const [selectedOption, setSelectedOption] = useState('requests'); // Default view
  const [showPopup, setShowPopup] = useState({ visible: false, message: '' });

  useEffect(() => {
    const fetchSocietyAndRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        const societyId = localStorage.getItem('societyId');

        if (!token || !societyId) {
          setError('Missing token or societyId');
          return;
        }

        // Fetch society details
        const societyResponse = await fetch(`http://localhost:5000/api/societies/create/${societyId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!societyResponse.ok) {
          const societyErrorData = await societyResponse.json();
          setError(societyErrorData.message || 'Error fetching society data');
          return;
        }

        const societyData = await societyResponse.json();
        setSociety(societyData);

        // Fetch resident requests (filter by pending status)
        setRequests(societyData.residentRequests.filter(req => req.status === 'Pending'));
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data');
      }
    };

    fetchSocietyAndRequests();
  }, []);

  const handleAction = async (requestId, action) => {
    try {
      const token = localStorage.getItem('token');
      const societyId = localStorage.getItem('societyId');
  
      if (!societyId || !token) {
        setError('Society ID or token not found');
        return;
      }
  
      // Send PATCH request to approve/reject the resident request
      const response = await fetch(`http://localhost:5000/api/societies/${societyId}/resident-request/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action })
      });
  
      // Handle response errors
      if (!response.ok) {
        try {
          const errorData = await response.json();
          setError(errorData.message || 'Error processing request error data');
        } catch (e) {
          setError('Error processing request');
        }
        return;
      }
  
      // Remove the request from local state after the action
      setRequests(prev => prev.filter(req => req._id !== requestId));
  
      // Show popup for success action
      const successMessage =
        action === 'approve'
          ? '✅ Resident request approved successfully!'
          : '❌ Resident request rejected!';
      setShowPopup({ visible: true, message: successMessage });
  
      // Auto-hide popup after 3 seconds
      setTimeout(() => setShowPopup({ visible: false, message: '' }), 3000);
    } catch (error) {
      console.error('Error processing request:', error);
      setError('Error processing request');
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!society) {
    return <div className="loading">Loading society data...</div>;
  }

  return (
    <div className="manager-dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="society-profile">
          <h1>{society.name || 'Unnamed Society'}</h1>
          <h3>Manager: {society.managerName || 'N/A'}</h3>
          <p>📍 {society.address || 'No address provided'}</p>
          <p>📅 Created: {society.dateOfCreation ? new Date(society.dateOfCreation).toLocaleDateString() : 'Unknown'}</p>
          <p>🆔 Unique ID: {society.uniqueIdCode || 'N/A'}</p>
        </div>
        <div className="sidebar-options">
          <button
            className={`sidebar-button ${selectedOption === 'requests' ? 'active' : ''}`}
            onClick={() => setSelectedOption('requests')}
          >
            🏠 Resident Requests
          </button>
          {/* Add more sidebar options here */}
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {selectedOption === 'requests' && (
          <div className="resident-requests">
            <h2>Resident Requests</h2>
            {requests.length === 0 ? (
              <p className="no-requests">No pending requests at this time.</p>
            ) : (
              requests.map(req => (
                <div key={req._id} className="request-card">
                  <div className="request-details">
                    <p><strong>👤 Name:</strong> {req.name}</p>
                    <p><strong>📧 Email:</strong> {req.email}</p>
                    <p><strong>🏠 House Number:</strong> {req.houseNumber}</p>
                  </div>
                  <div className="request-actions">
                    <button className="approve-button" onClick={() => handleAction(req._id, 'approve')}>Approve</button>
                    <button className="reject-button" onClick={() => handleAction(req._id, 'reject')}>Reject</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Popup Notification */}
      {showPopup.visible && (
        <div className="popup">
          <p>{showPopup.message}</p>
        </div>
      )}
    </div>
  );
}
