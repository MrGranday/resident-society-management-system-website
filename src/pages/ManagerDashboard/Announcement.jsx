import React, { useState } from 'react';
import PropTypes from 'prop-types';

export default function Announcement({ announcements, setAnnouncements, showPopup, societyId }) {
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    content: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAnnouncementForm({ ...announcementForm, [name]: value });
    setFormErrors({ ...formErrors, [name]: '' });
  };

  const validateForm = () => {
    const errors = {};
    if (!announcementForm.title) errors.title = 'Title is required';
    if (!announcementForm.content) errors.content = 'Content is required';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showPopup('Please fix form errors', true);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token || !societyId) {
        showPopup('Missing token or society ID', true);
        return;
      }

      const requestBody = { ...announcementForm, society: societyId };
      if (editingAnnouncement) {
        const response = await fetch(`http://localhost:5000/api/${societyId}/announcements/${editingAnnouncement._id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to update announcement');
        }
        const updatedAnnouncement = await response.json();
        setAnnouncements(
          announcements.map((ann) =>
            ann._id === editingAnnouncement._id ? updatedAnnouncement : ann
          )
        );
        showPopup('✅ Announcement updated successfully');
      } else {
        const response = await fetch(`http://localhost:5000/api/${societyId}/announcements`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to create announcement');
        }
        const newAnnouncement = await response.json();
        setAnnouncements([newAnnouncement, ...announcements]);
        showPopup('✅ Announcement created successfully');
      }
      setAnnouncementForm({ title: '', content: '' });
      setEditingAnnouncement(null);
      setFormErrors({});
    } catch (error) {
      console.error('Error saving announcement:', error);
      showPopup(`❌ Error saving announcement: ${error.message}`, true);
    }
  };

  const handleEditAnnouncement = (announcement) => {
    setEditingAnnouncement(announcement);
    setAnnouncementForm({
      title: announcement.title,
      content: announcement.content,
    });
    setFormErrors({});
  };

  const handleDeleteAnnouncement = async (announcementId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showPopup('No token found, please log in again', true);
        return;
      }
      const response = await fetch(`http://localhost:5000/api/${societyId}/announcements/${announcementId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete announcement');
      }
      setAnnouncements(announcements.filter((ann) => ann._id !== announcementId));
      showPopup('✅ Announcement deleted successfully');
    } catch (error) {
      console.error('Error deleting announcement:', error);
      showPopup(`❌ Error deleting announcement: ${error.message}`, true);
    }
  };

  return (
    <div className="announcement-management">
      <form className="announcement-form-large" onSubmit={handleSubmit}>
        <h2>{editingAnnouncement ? 'Edit Announcement' : 'Create Announcement'}</h2>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={announcementForm.title}
            onChange={handleInputChange}
            required
          />
          {formErrors.title && <span className="error">{formErrors.title}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            value={announcementForm.content}
            onChange={handleInputChange}
            required
            rows="6"
          />
          {formErrors.content && <span className="error">{formErrors.content}</span>}
        </div>
        <button type="submit" className="submit-button">
          {editingAnnouncement ? 'Update Announcement' : 'Create Announcement'}
        </button>
        {editingAnnouncement && (
          <button
            type="button"
            className="cancel-button"
            onClick={() => {
              setEditingAnnouncement(null);
              setAnnouncementForm({ title: '', content: '' });
              setFormErrors({});
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <div className="announcement-list">
        <h2>Announcements</h2>
        {announcements.length === 0 ? (
          <p className="no-announcements">No announcements at this time.</p>
        ) : (
          announcements.map((announcement) => (
            <div key={announcement._id} className="announcement-card-large">
              <div className="announcement-details">
                {/* <div className="modified-date">{new Date(announcement.updatedAt).toLocaleDateString()}</div> */}
                <div className="announcement-content">
                  <p><strong> Title:</strong> {announcement.title}</p>
                  <p>{announcement.content}</p>
                </div>
                {/* <div className="created-date">{new Date(announcement.createdAt).toLocaleDateString()}</div> */}
              </div>
              <div className="announcement-actions">
                <button
                  className="edit-button"
                  onClick={() => handleEditAnnouncement(announcement)}
                >
                  Edit ✏️
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDeleteAnnouncement(announcement._id)}
                >
                  Delete 🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

Announcement.propTypes = {
  announcements: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      society: PropTypes.string.isRequired,
      manager: PropTypes.string,
      createdAt: PropTypes.string,
      updatedAt: PropTypes.string,
    })
  ).isRequired,
  setAnnouncements: PropTypes.func.isRequired,
  showPopup: PropTypes.func.isRequired,
  societyId: PropTypes.string.isRequired,
};