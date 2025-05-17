

import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

export default function StaffManagement({
  staff,
  staffForm,
  formErrors,
  handleStaffSubmit,
  handleEditStaff,
  handleDeleteStaff,
  handleStaffInputChange
}) {
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState(null);
  const popupRef = useRef(null);
  const yesButtonRef = useRef(null);

  const handleDeleteClick = (memberId) => {
    console.log('Delete button clicked for staff ID:', memberId);
    setStaffToDelete(memberId);
    setShowDeletePopup(true);
  };

  const handleConfirmDelete = () => {
    if (staffToDelete) {
      console.log('Confirming delete for staff ID:', staffToDelete);
      handleDeleteStaff(staffToDelete);
      setShowDeletePopup(false);
      setStaffToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    console.log('Canceling delete');
    setShowDeletePopup(false);
    setStaffToDelete(null);
  };

  // Trap focus within the popup and prevent background scrolling
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!showDeletePopup) return;

      const popup = popupRef.current;
      if (!popup) {
        console.warn('Popup ref is null');
        return;
      }

      const focusableElements = popup.querySelectorAll('button');
      if (focusableElements.length === 0) {
        console.warn('No focusable elements found in popup');
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }

      if (e.key === 'Escape') {
        console.log('Escape key pressed, closing popup');
        handleCancelDelete();
      }
    };

    if (showDeletePopup) {
      console.log('Opening delete popup, setting body overflow to hidden');
      document.body.style.overflow = 'hidden';
      // Focus the "Yes" button when the popup opens
      if (yesButtonRef.current) {
        yesButtonRef.current.focus();
      } else {
        console.warn('Yes button ref is null');
      }
      document.addEventListener('keydown', handleKeyDown);
    } else {
      console.log('Closing delete popup, restoring body overflow');
      document.body.style.overflow = 'auto';
    }

    return () => {
      console.log('Cleaning up useEffect, restoring body overflow');
      document.body.style.overflow = 'auto';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showDeletePopup]);

  return (
    <div className="staff-management">
      <form className="staff-form" onSubmit={handleStaffSubmit}>
        <h2>Create Staff Account</h2>
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={staffForm.fullName}
            onChange={handleStaffInputChange}
            required
          />
          {formErrors.fullName && <span className="error">{formErrors.fullName}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={staffForm.phoneNumber}
            onChange={handleStaffInputChange}
            required
            maxLength="11"
          />
          {formErrors.phoneNumber && <span className="error">{formErrors.phoneNumber}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={staffForm.password}
            onChange={handleStaffInputChange}
            required
          />
          {formErrors.password && <span className="error">{formErrors.password}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="role">Role</label>
          <select
            id="role"
            name="role"
            value={staffForm.role}
            onChange={handleStaffInputChange}
            required
          >
            <option value="">Select Role</option>
            <option value="Cleaner">Cleaner</option>
            <option value="Gardener">Gardener</option>
            <option value="Event Manager">Event Manager</option>
            <option value="Security">Security</option>
            <option value="Maintenance">Maintenance</option>
          </select>
          {formErrors.role && <span className="error">{formErrors.role}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="startDate">Start Date</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={staffForm.startDate}
            onChange={handleStaffInputChange}
            required
          />
          {formErrors.startDate && <span className="error">{formErrors.startDate}</span>}
        </div>
        <button type="submit" className="submit-button">Create Staff</button>
      </form>

      <div className="staff-list">
        <h2>Staff</h2>
        {staff.length === 0 ? (
          <p className="no-staff">No staff members at this time.</p>
        ) : (
          staff.map(member => (
            <div key={member._id} className="staff-card">
              <div className="staff-details">
                <p><strong>👤 Name:</strong> {member.fullName}</p>
                <p><strong>📞 Phone:</strong> {member.phoneNumber}</p>
                <p><strong>💼 Role:</strong> {member.role}</p>
                <p><strong>📅 Start:</strong> {new Date(member.startDate).toLocaleDateString()}</p>
              </div>
              <div className="staff-actions">
                <button className="edit-button" onClick={() => handleEditStaff(member)}>
                  Edit ✏️
                </button>
                <button className="delete-button" onClick={() => handleDeleteClick(member._id)}>
                  Delete 🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showDeletePopup && (
        <div className="popup-backdrop">
          <div className="popup delete-popup" ref={popupRef} role="dialog" aria-modal="true">
            <p>Are you sure you want to delete this staff member?</p>
            <div className="popup-actions">
              <button
                className="approve-button"
                onClick={handleConfirmDelete}
                ref={yesButtonRef}
              >
                Yes
              </button>
              <button className="cancel-button" onClick={handleCancelDelete}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

StaffManagement.propTypes = {
  staff: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      fullName: PropTypes.string.isRequired,
      phoneNumber: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
      startDate: PropTypes.string.isRequired
    })
  ).isRequired,
  staffForm: PropTypes.shape({
    fullName: PropTypes.string.isRequired,
    phoneNumber: PropTypes.string.isRequired,
    password: PropTypes.string,
    role: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired
  }).isRequired,
  formErrors: PropTypes.shape({
    fullName: PropTypes.string,
    phoneNumber: PropTypes.string,
    password: PropTypes.string,
    role: PropTypes.string,
    startDate: PropTypes.string
  }).isRequired,
  handleStaffSubmit: PropTypes.func.isRequired,
  handleEditStaff: PropTypes.func.isRequired,
  handleDeleteStaff: PropTypes.func.isRequired,
  handleStaffInputChange: PropTypes.func.isRequired
};