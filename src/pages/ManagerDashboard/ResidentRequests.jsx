import React from 'react';

export default function ResidentRequests({ requests, handleAction }) {
  return (
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
  );
}
