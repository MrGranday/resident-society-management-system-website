
// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './ManagerDashboard.css';

// export default function ManagerDashboard() {
//   const [society, setSociety] = useState(null);
//   const [requests, setRequests] = useState([]);
//   const [staff, setStaff] = useState([]);
//   const [openIssues, setOpenIssues] = useState([]);
//   const [underReviewIssues, setUnderReviewIssues] = useState([]);
//   const [resolvedIssues, setResolvedIssues] = useState([]);
//   const [selectedOption, setSelectedOption] = useState('requests');
//   const [showPopup, setShowPopup] = useState({ visible: false, message: '', isError: false });
//   const [staffForm, setStaffForm] = useState({
//     fullName: '',
//     phoneNumber: '',
//     password: '',
//     role: '',
//     startDate: ''
//   });
//   const [formErrors, setFormErrors] = useState({});
//   const [editStaff, setEditStaff] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const societyId = localStorage.getItem('societyId');

//         if (!token || !societyId) {
//           setShowPopup({ visible: true, message: 'Missing token or society ID', isError: true });
//           setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
//           return;
//         }

//         // Fetch society details
//         const societyResponse = await fetch(`http://localhost:5000/api/societies/create/${societyId}`, {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         });

//         if (!societyResponse.ok) {
//           const societyErrorData = await societyResponse.json();
//           setShowPopup({ visible: true, message: societyErrorData.message || 'Error fetching society data', isError: true });
//           setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
//           return;
//         }

//         const societyData = await societyResponse.json();
//         setSociety(societyData);
//         setRequests(societyData.residentRequests.filter(req => req.status === 'Pending'));

//         // Fetch staff members
//         const staffResponse = await fetch(`http://localhost:5000/api/societies/staffcreation/${societyId}/staff`, {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         });

//         if (!staffResponse.ok) {
//           const staffErrorData = await staffResponse.json();
//           setShowPopup({ visible: true, message: staffErrorData.message || 'Error fetching staff', isError: true });
//           setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
//           return;
//         }

//         const staffData = await staffResponse.json();
//         setStaff(staffData);

//         // Fetch issues
//         const [openIssuesResponse, underReviewIssuesResponse, resolvedIssuesResponse] = await Promise.all([
//           fetch(`http://localhost:5000/api/issues/${societyId}?status=Open`, {
//             headers: { 'Authorization': `Bearer ${token}` }
//           }),
//           fetch(`http://localhost:5000/api/issues/${societyId}?status=Under Review`, {
//             headers: { 'Authorization': `Bearer ${token}` }
//           }),
//           fetch(`http://localhost:5000/api/issues/${societyId}?status=Resolved`, {
//             headers: { 'Authorization': `Bearer ${token}` }
//           })
//         ]);

//         if (!openIssuesResponse.ok || !underReviewIssuesResponse.ok || !resolvedIssuesResponse.ok) {
//           const errorData = await Promise.any([
//             openIssuesResponse.json().catch(() => ({})),
//             underReviewIssuesResponse.json().catch(() => ({})),
//             resolvedIssuesResponse.json().catch(() => ({}))
//           ]);
//           setShowPopup({ visible: true, message: errorData.message || 'Error fetching issues', isError: true });
//           setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
//           return;
//         }

//         const openIssuesData = await openIssuesResponse.json();
//         const underReviewIssuesData = await underReviewIssuesResponse.json();
//         const resolvedIssuesData = await resolvedIssuesResponse.json();

//         setOpenIssues(openIssuesData);
//         setUnderReviewIssues(underReviewIssuesData);
//         setResolvedIssues(resolvedIssuesData);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         setShowPopup({ visible: true, message: 'Error fetching data: ' + error.message, isError: true });
//         setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleAction = async (requestId, action) => {
//     try {
//       const token = localStorage.getItem('token');
//       const societyId = localStorage.getItem('societyId');
  
//       if (!societyId || !token) {
//         setShowPopup({ visible: true, message: 'Society ID or token not found', isError: true });
//         setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
//         return;
//       }
  
//       const response = await fetch(`http://localhost:5000/api/societies/${societyId}/resident-request/${requestId}`, {
//         method: 'PATCH',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ action })
//       });
  
//       if (!response.ok) {
//         const errorData = await response.json();
//         setShowPopup({ visible: true, message: errorData.message || 'Error processing request', isError: true });
//         setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
//         return;
//       }
  
//       setRequests(prev => prev.filter(req => req._id !== requestId));
//       const successMessage = action === 'approve' ? '✅ Resident request approved!' : '❌ Resident request rejected!';
//       setShowPopup({ visible: true, message: successMessage, isError: false });
//       setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
//     } catch (error) {
//       console.error('Error processing request:', error);
//       setShowPopup({ visible: true, message: 'Error processing request: ' + error.message, isError: true });
//       setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
//     }
//   };

  

//   const handleIssueStatusUpdate = async (issueId, newStatus) => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         setShowPopup({ visible: true, message: 'No token found, please log in again', isError: true });
//         setTimeout(() => {
//           setShowPopup({ visible: false, message: '', isError: false });
//           navigate('/login');
//         }, 3000);
//         return;
//       }
//       console.log('Sending request to update issue:', issueId, 'to status:', newStatus, 'with token:', token.substring(0, 10) + '...');
//       const response = await fetch(`http://localhost:5000/api/issues/${issueId}/status`, {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ status: newStatus })
//       });
  
//       if (!response.ok) {
//         const errorData = await response.json();
//         console.error('Error response:', errorData);
//         if (errorData.message.includes('Invalid token') || errorData.message.includes('jwt expired')) {
//           setShowPopup({ visible: true, message: 'Session expired, please log in again', isError: true });
//           setTimeout(() => {
//             setShowPopup({ visible: false, message: '', isError: false });
//             localStorage.removeItem('token');
//             localStorage.removeItem('societyId');
//             navigate('/login');
//           }, 3000);
//           return;
//         }
//         setShowPopup({ visible: true, message: errorData.message || 'Error updating issue status', isError: true });
//         setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
//         return;
//       }
  
//       const updatedIssue = await response.json();
//       setUnderReviewIssues(prev => prev.filter(issue => issue._id !== issueId));
//       if (newStatus === 'Resolved') {
//         setResolvedIssues(prev => [...prev, updatedIssue.issue]);
//       } else if (newStatus === 'Open') {
//         setOpenIssues(prev => [...prev, updatedIssue.issue]);
//       }
//       setShowPopup({ visible: true, message: `✅ Issue marked as ${newStatus}!`, isError: false });
//       setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
//     } catch (error) {
//       console.error('Error updating issue status:', error);
//       setShowPopup({ visible: true, message: 'Error updating issue status: ' + error.message, isError: true });
//       setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
//     }
//   };


//   const validateStaffForm = (isEdit = false) => {
//     const errors = {};
//     const nameRegex = /^[a-zA-Z\s'-]{2,100}$/;
//     const phoneRegex = /^\d{1,11}$/;
//     const passwordRegex = /^.{6,}$/;
//     const today = new Date().toISOString().split('T')[0];

//     if (!staffForm.fullName) {
//       errors.fullName = 'Full name is required';
//     } else if (!nameRegex.test(staffForm.fullName)) {
//       errors.fullName = 'Name must be 2-100 characters, letters, spaces, hyphens, or apostrophes only';
//     }

//     if (!staffForm.phoneNumber) {
//       errors.phoneNumber = 'Phone number is required';
//     } else if (!phoneRegex.test(staffForm.phoneNumber)) {
//       errors.phoneNumber = 'Phone number must be 1-11 digits';
//     }

//     if (!isEdit && !staffForm.password) {
//       errors.password = 'Password is required';
//     } else if ((isEdit && staffForm.password) || (!isEdit && staffForm.password)) {
//       if (!passwordRegex.test(staffForm.password)) {
//         errors.password = 'Password must be at least 6 characters';
//       }
//     }

//     if (!staffForm.role) {
//       errors.role = 'Role is required';
//     } else if (!['Cleaner', 'Gardener', 'Event Manager', 'Security', 'Maintenance'].includes(staffForm.role)) {
//       errors.role = 'Invalid role selected';
//     }

//     if (!staffForm.startDate) {
//       errors.startDate = 'Start date is required';
//     } else if (staffForm.startDate < today) {
//       errors.startDate = 'Start date cannot be in the past';
//     }

//     return errors;
//   };

//   const handleStaffSubmit = async (e) => {
//     e.preventDefault();
//     const errors = validateStaffForm();

//     if (Object.keys(errors).length > 0) {
//       setFormErrors(errors);
//       setShowPopup({ visible: true, message: 'Please fix form errors', isError: true });
//       setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
//       return;
//     }

//     try {
//       const token = localStorage.getItem('token');
//       const societyId = localStorage.getItem('societyId');

//       if (!societyId || !token) {
//         setShowPopup({ visible: true, message: 'Missing society ID or token', isError: true });
//         setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
//         return;
//       }

//       const response = await fetch(`http://localhost:5000/api/societies/staffcreation/${societyId}/staff`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(staffForm)
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         setShowPopup({ visible: true, message: `❌ ${errorData.message || 'Error creating staff'}`, isError: true });
//         setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
//         setFormErrors({});
//         return;
//       }

//       const newStaff = await response.json();
//       setStaff([...staff, newStaff.staff]);
//       setStaffForm({ fullName: '', phoneNumber: '', password: '', role: '', startDate: '' });
//       setFormErrors({});
//       setShowPopup({ visible: true, message: '✅ Staff member created successfully!', isError: false });
//       setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
//     } catch (error) {
//       console.error('Error creating staff:', error);
//       setShowPopup({ visible: true, message: `❌ Error creating staff: ${error.message}`, isError: true });
//       setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
//       setFormErrors({});
//     }
//   };

//   const handleEditStaff = (member) => {
//     setEditStaff(member);
//     setStaffForm({
//       fullName: member.fullName,
//       phoneNumber: member.phoneNumber,
//       password: '',
//       role: member.role,
//       startDate: new Date(member.startDate).toISOString().split('T')[0]
//     });
//     setFormErrors({});
//   };

//   const handleEditSubmit = async (e) => {
//     e.preventDefault();
//     const errors = validateStaffForm(true);

//     if (Object.keys(errors).length > 0) {
//       setFormErrors(errors);
//       setShowPopup({ visible: true, message: 'Please fix form errors', isError: true });
//       setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
//       return;
//     }

//     try {
//       const token = localStorage.getItem('token');
//       const societyId = localStorage.getItem('societyId');

//       if (!societyId || !token) {
//         setShowPopup({ visible: true, message: 'Missing society ID or token', isError: true });
//         setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
//         return;
//       }

//       const response = await fetch(`http://localhost:5000/api/societies/staffcreation/${societyId}/staff/${editStaff._id}`, {
//         method: 'PATCH',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(staffForm)
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         setShowPopup({ visible: true, message: `❌ ${errorData.message || 'Error updating staff'}`, isError: true });
//         setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
//         setFormErrors({});
//         return;
//       }

//       const updatedStaff = await response.json();
//       setStaff(staff.map(s => s._id === editStaff._id ? updatedStaff.staff : s));
//       setEditStaff(null);
//       setStaffForm({ fullName: '', phoneNumber: '', password: '', role: '', startDate: '' });
//       setFormErrors({});
//       setShowPopup({ visible: true, message: '✅ Staff member updated successfully!', isError: false });
//       setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
//     } catch (error) {
//       console.error('Error updating staff:', error);
//       setShowPopup({ visible: true, message: `❌ Error updating staff: ${error.message}`, isError: true });
//       setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
//       setFormErrors({});
//     }
//   };

//   const handleDeleteStaff = async (staffId) => {
//     if (!window.confirm('Are you sure you want to delete this staff member?')) return;

//     try {
//       const token = localStorage.getItem('token');
//       const societyId = localStorage.getItem('societyId');

//       if (!societyId || !token) {
//         setShowPopup({ visible: true, message: 'Missing society ID or token', isError: true });
//         setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
//         return;
//       }

//       const response = await fetch(`http://localhost:5000/api/societies/staffcreation/${societyId}/staff/${staffId}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         setShowPopup({ visible: true, message: `❌ ${errorData.message || 'Error deleting staff'}`, isError: true });
//         setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
//         return;
//       }

//       setStaff(staff.filter(s => s._id !== staffId));
//       setShowPopup({ visible: true, message: '✅ Staff member deleted successfully!', isError: false });
//       setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
//     } catch (error) {
//       console.error('Error deleting staff:', error);
//       setShowPopup({ visible: true, message: `❌ Error deleting staff: ${error.message}`, isError: true });
//       setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
//     }
//   };

//   const handleStaffInputChange = (e) => {
//     const { name, value } = e.target;
//     setStaffForm(prev => ({ ...prev, [name]: value }));
//     setFormErrors(prev => ({ ...prev, [name]: '' }));
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('societyId');
//     // navigate('/login');
//   };

//   if (!society) {
//     return <div className="loading">Loading society data...</div>;
//   }

//   return (
//     <div className="manager-dashboard">
//       <div className="sidebar">
//         <div className="society-profile">
//           <h1>{society.name || 'Unnamed Society'}</h1>
//           <h3>System Admin: {society.managerName || 'N/A'}</h3>
//           <p>📍 {society.address || 'No address provided'}</p>
//           <p>📅 Created: {society.dateOfCreation ? new Date(society.dateOfCreation).toLocaleDateString() : 'Unknown'}</p>
//           <p>🆔 Unique ID: {society.uniqueIdCode || 'N/A'}</p>
//         </div>
//         <div className="sidebar-options">
//           <button
//             className={`sidebar-button ${selectedOption === 'requests' ? 'active' : ''}`}
//             onClick={() => setSelectedOption('requests')}
//           >
//             🏠 Resident Requests
//           </button>
//           <button
//             className={`sidebar-button ${selectedOption === 'staff' ? 'active' : ''}`}
//             onClick={() => setSelectedOption('staff')}
//           >
//             👷 Staff Management
//           </button>
//           <button
//             className={`sidebar-button ${selectedOption === 'openIssues' ? 'active' : ''}`}
//             onClick={() => setSelectedOption('openIssues')}
//           >
//             📋 Open Issues
//           </button>
//           <button
//             className={`sidebar-button ${selectedOption === 'underReview' ? 'active' : ''}`}
//             onClick={() => setSelectedOption('underReview')}
//           >
//             🔍 Under Review
//           </button>
//           <button
//             className={`sidebar-button ${selectedOption === 'resolvedIssues' ? 'active' : ''}`}
//             onClick={() => setSelectedOption('resolvedIssues')}
//           >
//             ✅ Resolved Issues
//           </button>
//           <button
//             className="sidebar-button logout-button"
//             onClick={handleLogout}
//           >
//             🚪 Logout
//           </button>
//         </div>
//       </div>

//       <div className="main-content">
//         {selectedOption === 'requests' && (
//           <div className="resident-requests">
//             <h2>Resident Requests</h2>
//             {requests.length === 0 ? (
//               <p className="no-requests">No pending requests at this time.</p>
//             ) : (
//               requests.map(req => (
//                 <div key={req._id} className="request-card">
//                   <div className="request-details">
//                     <p><strong>👤 Name:</strong> {req.name}</p>
//                     <p><strong>📧 Email:</strong> {req.email}</p>
//                     <p><strong>🏠 House Number:</strong> {req.houseNumber}</p>
//                   </div>
//                   <div className="request-actions">
//                     <button className="approve-button" onClick={() => handleAction(req._id, 'approve')}>Approve</button>
//                     <button className="reject-button" onClick={() => handleAction(req._id, 'reject')}>Reject</button>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         )}

//         {selectedOption === 'staff' && (
//           <div className="staff-management">
//             <h2>Create Staff Account</h2>
//             <form className="staff-form" onSubmit={handleStaffSubmit}>
//               <div className="form-group">
//                 <label htmlFor="fullName">Full Name</label>
//                 <input
//                   type="text"
//                   id="fullName"
//                   name="fullName"
//                   value={staffForm.fullName}
//                   onChange={handleStaffInputChange}
//                   required
//                 />
//                 {formErrors.fullName && <span className="error">{formErrors.fullName}</span>}
//               </div>
//               <div className="form-group">
//                 <label htmlFor="phoneNumber">Phone Number</label>
//                 <input
//                   type="tel"
//                   id="phoneNumber"
//                   name="phoneNumber"
//                   value={staffForm.phoneNumber}
//                   onChange={handleStaffInputChange}
//                   required
//                   maxLength="11"
//                 />
//                 {formErrors.phoneNumber && <span className="error">{formErrors.phoneNumber}</span>}
//               </div>
//               <div className="form-group">
//                 <label htmlFor="password">Password</label>
//                 <input
//                   type="password"
//                   id="password"
//                   name="password"
//                   value={staffForm.password}
//                   onChange={handleStaffInputChange}
//                   required
//                 />
//                 {formErrors.password && <span className="error">{formErrors.password}</span>}
//               </div>
//               <div className="form-group">
//                 <label htmlFor="role">Role</label>
//                 <select
//                   id="role"
//                   name="role"
//                   value={staffForm.role}
//                   onChange={handleStaffInputChange}
//                   required
//                 >
//                   <option value="">Select Role</option>
//                   <option value="Cleaner">Cleaner</option>
//                   <option value="Gardener">Gardener</option>
//                   <option value="Event Manager">Event Manager</option>
//                   <option value="Security">Security</option>
//                   <option value="Maintenance">Maintenance</option>
//                 </select>
//                 {formErrors.role && <span className="error">{formErrors.role}</span>}
//               </div>
//               <div className="form-group">
//                 <label htmlFor="startDate">Start Date</label>
//                 <input
//                   type="date"
//                   id="startDate"
//                   name="startDate"
//                   value={staffForm.startDate}
//                   onChange={handleStaffInputChange}
//                   required
//                 />
//                 {formErrors.startDate && <span className="error">{formErrors.startDate}</span>}
//               </div>
//               <button type="submit" className="submit-button">Create Staff</button>
//             </form>

//             <h2>Staff</h2>
//             {staff.length === 0 ? (
//               <p className="no-staff">No staff members at this time.</p>
//             ) : (
//               staff.map(member => (
//                 <div key={member._id} className="staff-card">
//                   <div className="staff-details">
//                     <p><strong>👤 Name:</strong> {

// member.fullName}</p>
//                     <p><strong>📞 Phone:</strong> {member.phoneNumber}</p>
//                     <p><strong>💼 Role:</strong> {member.role}</p>
//                     <p><strong>📅 Start:</strong> {new Date(member.startDate).toLocaleDateString()}</p>
//                   </div>
//                   <div className="staff-actions">
//                     <button className="edit-button" onClick={() => handleEditStaff(member)}>
//                       Edit ✏️
//                     </button>
//                     <button className="delete-button" onClick={() => handleDeleteStaff(member._id)}>
//                       Delete 🗑️
//                     </button>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         )}

//         {selectedOption === 'openIssues' && ( 
//           <div className="issues">
//             <h2>Open Issues</h2>
//             {openIssues.length === 0 ? (
//               <p className="no-issues">No open issues at this time.</p>
//             ) : (
//               openIssues.map(issue => (
//                 <div key={issue._id} className="issue-card">
//                   <p><strong>📌 Title:</strong> {issue.title}</p>
//                   <p><strong>📝 Description:</strong> {issue.description}</p>
//                   <p><strong>👤 Reported by:</strong> {issue.reporter}</p>
//                   <p><strong>👷 Assigned to:</strong> {issue.role}</p>
//                   {/* <p><strong>👷 Assigned to:</strong> {issue.assignedTo?.fullName || 'N/A'}</p> */}
//                   <p><strong>📅 Created:</strong> {new Date(issue.createdAt).toLocaleDateString()}</p>
//                   <p><strong>🟡 Status:</strong> {issue.status}</p>
//                 </div>
//               ))
//             )}
//           </div>
//         )}

//         {selectedOption === 'underReview' && (
//           <div className="issues">
//             <h2>Under Review</h2>
//             {underReviewIssues.length === 0 ? (
//               <p className="no-issues">No issues under review at this time.</p>
//             ) : (
//               underReviewIssues.map(issue => (
//                 <div key={issue._id} className="issue-card">
//                   <p><strong>📌 Title:</strong> {issue.title}</p>
//                   <p><strong>📝 Description:</strong> {issue.description}</p>
//                   <p><strong>👤 Reported by:</strong> {issue.reporter}</p>
//                   <p><strong>👷 Assigned to:</strong> {issue.role}</p>
//                   {/* <p><strong>👷 Assigned to:</strong> {issue.assignedTo?.fullName || 'N/A'}</p> */}
//                   <p><strong>📅 Created:</strong> {new Date(issue.createdAt).toLocaleDateString()}</p>
//                   <p><strong>🔵 Status:</strong> {issue.status}</p>
//                   <div className="issue-actions">
//                     <button
//                       className="approve-button"
//                       onClick={() => handleIssueStatusUpdate(issue._id, 'Resolved')}
//                     >
//                       Resolve ✅
//                     </button>
//                     <button
//                       className="reject-button"
//                       onClick={() => handleIssueStatusUpdate(issue._id, 'Open')}
//                     >
//                       Reopen 🔄
//                     </button>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         )}

//         {selectedOption === 'resolvedIssues' && (
//           <div className="issues">
//             <h2>Resolved Issues</h2>
//             {resolvedIssues.length === 0 ? (
//               <p className="no-issues">No resolved issues at this time.</p>
//             ) : (
//               resolvedIssues.map(issue => (
//                 <div key={issue._id} className="issue-card">
//                   <p><strong>📌 Title:</strong> {issue.title}</p>
//                   <p><strong>📝 Description:</strong> {issue.description}</p>
//                   <p><strong>👤 Reported by:</strong> {issue.reporter}</p>
//                   <p><strong>👷 Assigned to:</strong> {issue.role}</p>
//                   {/* <p><strong>👷 Assigned to:</strong> {issue.assignedTo?.fullName || 'N/A'}</p> */}
//                   <p><strong>📅 Created:</strong> {new Date(issue.createdAt).toLocaleDateString()}</p>
//                   <p><strong>🟢 Status:</strong> {issue.status}</p>
//                 </div>
//               ))
//             )}
//           </div>
//         )}
//       </div>

//       {editStaff && (
//         <div className="modal">
//           <div className="modal-content">
//             <h2>Edit Staff</h2>
//             <form className="staff-form" onSubmit={handleEditSubmit}>
//               <div className="form-group">
//                 <label htmlFor="editFullName">Full Name</label>
//                 <input
//                   type="text"
//                   id="editFullName"
//                   name="fullName"
//                   value={staffForm.fullName}
//                   onChange={handleStaffInputChange}
//                   required
//                 />
//                 {formErrors.fullName && <span className="error">{formErrors.fullName}</span>}
//               </div>
//               <div className="form-group">
//                 <label htmlFor="editPhoneNumber">Phone Number</label>
//                 <input
//                   type="tel"
//                   id="editPhoneNumber"
//                   name="phoneNumber"
//                   value={staffForm.phoneNumber}
//                   onChange={handleStaffInputChange}
//                   required
//                   maxLength="11"
//                 />
//                 {formErrors.phoneNumber && <span className="error">{formErrors.phoneNumber}</span>}
//               </div>
//               <div className="form-group">
//                 <label htmlFor="editPassword">Password (leave blank to keep unchanged)</label>
//                 <input
//                   type="password"
//                   id="editPassword"
//                   name="password"
//                   value={staffForm.password}
//                   onChange={handleStaffInputChange}
//                 />
//                 {formErrors.password && <span className="error">{formErrors.password}</span>}
//               </div>
//               <div className="form-group">
//                 <label htmlFor="editRole">Role</label>
//                 <select
//                   id="editRole"
//                   name="role"
//                   value={staffForm.role}
//                   onChange={handleStaffInputChange}
//                   required
//                 >
//                   <option value="">Select Role</option>
//                   <option value="Cleaner">Cleaner</option>
//                   <option value="Gardener">Gardener</option>
//                   <option value="Event Manager">Event Manager</option>
//                   <option value="Security">Security</option>
//                   <option value="Maintenance">Maintenance</option>
//                 </select>
//                 {formErrors.role && <span className="error">{formErrors.role}</span>}
//               </div>
//               <div className="form-group">
//                 <label htmlFor="editStartDate">Start Date</label>
//                 <input
//                   type="date"
//                   id="editStartDate"
//                   name="startDate"
//                   value={staffForm.startDate}
//                   onChange={handleStaffInputChange}
//                   required
//                 />
//                 {formErrors.startDate && <span className="error">{formErrors.startDate}</span>}
//               </div>
//               <button type="submit" className="submit-button">Update Staff</button>
//               <button
//                 type="button"
//                 className="cancel-button"
//                 onClick={() => {
//                   setEditStaff(null);
//                   setStaffForm({ fullName: '', phoneNumber: '', password: '', role: '', startDate: '' });
//                   setFormErrors({});
//                 }}
//               >
//                 Cancel
//               </button>
//             </form>
//           </div>
//         </div>
//       )}

//       {showPopup.visible && (
//         <div className={`popup ${showPopup.isError ? 'error' : 'success'}`}>
//           <p>{showPopup.message}</p>
//         </div>
//       )}
//     </div>
//   );
// }


// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './ManagerDashboard.css';
// import Sidebar from './Sidebar';
// import ResidentRequests from './ResidentRequests';
// import StaffManagement from './StaffManagement';
// import Issues from './Issues';
// import EditStaffModal from './EditStaffModal';
// import Popup from './Popup';

// export default function ManagerDashboard() {
//   const [society, setSociety] = useState(null);
//   const [requests, setRequests] = useState([]);
//   const [staff, setStaff] = useState([]);
//   const [openIssues, setOpenIssues] = useState([]);
//   const [underReviewIssues, setUnderReviewIssues] = useState([]);
//   const [resolvedIssues, setResolvedIssues] = useState([]);
//   const [selectedOption, setSelectedOption] = useState('requests');
//   const [showPopup, setShowPopup] = useState({ visible: false, message: '', isError: false });
//   const [staffForm, setStaffForm] = useState({
//     fullName: '',
//     phoneNumber: '',
//     password: '',
//     role: ''
//   });
//   const [formErrors, setFormErrors] = useState({});
//   const [editStaff, setEditStaff] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const societyId = localStorage.getItem('societyId');

//         if (!token || !societyId) {
//           setShowPopup({ visible: true, message: 'Missing token or society ID', isError: true });
//           setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
//           return;
//         }

//         // Fetch society details
//         const societyResponse = await fetch(`http://localhost:5000/api/societies/create/${societyId}`, {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         });

//         if (!societyResponse.ok) {
//           const societyErrorData = await societyResponse.json();
//           setShowPopup({ visible: true, message: societyErrorData.message || 'Error fetching society data', isError: true });
//           setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
//           return;
//         }

//         const societyData = await societyResponse.json();
//         setSociety(societyData);
//         setRequests(societyData.residentRequests.filter(req => req.status === 'Pending'));

//         // Fetch staff members
//         const staffResponse = await fetch(`http://localhost:5000/api/societies/staffcreation/${societyId}/staff`, {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         });

//         if (!staffResponse.ok) {
//           const staffErrorData = await staffResponse.json();
//           setShowPopup({ visible: true, message: staffErrorData.message || 'Error fetching staff', isError: true });
//           setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
//           return;
//         }

//         const staffData = await staffResponse.json();
//         setStaff(staffData);

//         // Fetch issues
//         const [openIssuesResponse, underReviewIssuesResponse, resolvedIssuesResponse] = await Promise.all([
//           fetch(`http://localhost:5000/api/issues/${societyId}?status=Open`, {
//             headers: { 'Authorization': `Bearer ${token}` }
//           }),
//           fetch(`http://localhost:5000/api/issues/${societyId}?status=Under Review`, {
//             headers: { 'Authorization': `Bearer ${token}` }
//           }),
//           fetch(`http://localhost:5000/api/issues/${societyId}?status=Resolved`, {
//             headers: { 'Authorization': `Bearer ${token}` }
//           })
//         ]);

//         if (!openIssuesResponse.ok || !underReviewIssuesResponse.ok || !resolvedIssuesResponse.ok) {
//           const errorData = await Promise.any([
//             openIssuesResponse.json().catch(() => ({})),
//             underReviewIssuesResponse.json().catch(() => ({})),
//             resolvedIssuesResponse.json().catch(() => ({}))
//           ]);
//           setShowPopup({ visible: true, message: errorData.message || 'Error fetching issues', isError: true });
//           setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
//           return;
//         }

//         const openIssuesData = await openIssuesResponse.json();
//         const underReviewIssuesData = await underReviewIssuesResponse.json();
//         const resolvedIssuesData = await resolvedIssuesResponse.json();

//         setOpenIssues(openIssuesData);
//         setUnderReviewIssues(underReviewIssuesData);
//         setResolvedIssues(resolvedIssuesData);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         setShowPopup({ visible: true, message: 'Error fetching data: ' + error.message, isError: true });
//         setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleAction = async (requestId, action) => {
//     try {
//       const token = localStorage.getItem('token');
//       const societyId = localStorage.getItem('societyId');

//       if (!societyId || !token) {
//         setShowPopup({ visible: true, message: 'Society ID or token not found', isError: true });
//         setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
//         return;
//       }

//       const response = await fetch(`http://localhost:5000/api/societies/${societyId}/resident-request/${requestId}`, {
//         method: 'PATCH',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ action })
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         setShowPopup({ visible: true, message: errorData.message || 'Error processing request', isError: true });
//         setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
//         return;
//       }

//       setRequests(prev => prev.filter(req => req._id !== requestId));
//       const successMessage = action === 'approve' ? '✅ Resident request approved!' : '❌ Resident request rejected!';
//       setShowPopup({ visible: true, message: successMessage, isError: false });
//       setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
//     } catch (error) {
//       console.error('Error processing request:', error);
//       setShowPopup({ visible: true, message: 'Error processing request: ' + error.message, isError: true });
//       setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
//     }
//   };

//   const handleIssueStatusUpdate = async (issueId, newStatus) => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         setShowPopup({ visible: true, message: 'No token found, please log in again', isError: true });
//         setTimeout(() => {
//           setShowPopup({ visible: false, message: '', isError: false });
//           navigate('/login');
//         }, 3000);
//         return;
//       }
//       console.log('Sending request to update issue:', issueId, 'to status:', newStatus, 'with token:', token.substring(0, 10) + '...');
//       const response = await fetch(`http://localhost:5000/api/issues/${issueId}/status`, {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ status: newStatus })
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         console.error('Error response:', errorData);
//         if (errorData.message.includes('Invalid token') || errorData.message.includes('jwt expired')) {
//           setShowPopup({ visible: true, message: 'Session expired, please log in again', isError: true });
//           setTimeout(() => {
//             setShowPopup({ visible: false, message: '', isError: false });
//             localStorage.removeItem('token');
//             localStorage.removeItem('societyId');
//             navigate('/login');
//           }, 3000);
//           return;
//         }
//         setShowPopup({ visible: true, message: errorData.message || 'Error updating issue status', isError: true });
//         setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
//         return;
//       }

//       const updatedIssue = await response.json();
//       setUnderReviewIssues(prev => prev.filter(issue => issue._id !== issueId));
//       if (newStatus === 'Resolved') {
//         setResolvedIssues(prev => [...prev, updatedIssue.issue]);
//       } else if (newStatus === 'Open') {
//         setOpenIssues(prev => [...prev, updatedIssue.issue]);
//       }
//       setShowPopup({ visible: true, message: `✅ Issue marked as ${newStatus}!`, isError: false });
//       setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
//     } catch (error) {
//       console.error('Error updating issue status:', error);
//       setShowPopup({ visible: true, message: 'Error updating issue status: ' + error.message, isError: true });
//       setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
//     }
//   };

//   const validateStaffForm = (isEdit = false) => {
//     const errors = {};
//     const nameRegex = /^[a-zA-Z\s'-]{2,100}$/;
//     const phoneRegex = /^\d{1,11}$/;
//     const passwordRegex = /^.{6,}$/;

//     if (!staffForm.fullName) {
//       errors.fullName = 'Full name is required';
//     } else if (!nameRegex.test(staffForm.fullName)) {
//       errors.fullName = 'Name must be 2-100 characters, letters, spaces, hyphens, or apostrophes only';
//     }

//     if (!staffForm.phoneNumber) {
//       errors.phoneNumber = 'Phone number is required';
//     } else if (!phoneRegex.test(staffForm.phoneNumber)) {
//       errors.phoneNumber = 'Phone number must be 1-11 digits';
//     }

//     if (!isEdit && !staffForm.password) {
//       errors.password = 'Password is required';
//     } else if ((isEdit && staffForm.password) || (!isEdit && staffForm.password)) {
//       if (!passwordRegex.test(staffForm.password)) {
//         errors.password = 'Password must be at least 6 characters';
//       }
//     }

//     if (!staffForm.role) {
//       errors.role = 'Role is required';
//     } else if (!['Cleaner', 'Gardener', 'Event Manager', 'Security', 'Maintenance'].includes(staffForm.role)) {
//       errors.role = 'Invalid role selected';
//     }

//     if (!isEdit) {
//       const today = new Date().toISOString().split('T')[0];
//       if (!staffForm.startDate) {
//         errors.startDate = 'Start date is required';
//       } else if (staffForm.startDate < today) {
//         errors.startDate = 'Start date cannot be in the past';
//       }
//     }

//     return errors;
//   };

//   const handleStaffSubmit = async (e) => {
//     e.preventDefault();
//     const errors = validateStaffForm();

//     if (Object.keys(errors).length > 0) {
//       setFormErrors(errors);
//       setShowPopup({ visible: true, message: 'Please fix form errors', isError: true });
//       setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
//       return;
//     }

//     try {
//       const token = localStorage.getItem('token');
//       const societyId = localStorage.getItem('societyId');

//       if (!societyId || !token) {
//         setShowPopup({ visible: true, message: 'Missing society ID or token', isError: true });
//         setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
//         return;
//       }

//       const response = await fetch(`http://localhost:5000/api/societies/staffcreation/${societyId}/staff`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(staffForm)
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         setShowPopup({ visible: true, message: `❌ ${errorData.message || 'Error creating staff'}`, isError: true });
//         setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
//         setFormErrors({});
//         return;
//       }

//       const newStaff = await response.json();
//       setStaff([...staff, newStaff.staff]);
//       setStaffForm({ fullName: '', phoneNumber: '', password: '', role: '', startDate: '' });
//       setFormErrors({});
//       setShowPopup({ visible: true, message: '✅ Staff member created successfully!', isError: false });
//       setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
//     } catch (error) {
//       console.error('Error creating staff:', error);
//       setShowPopup({ visible: true, message: `❌ Error creating staff: ${error.message}`, isError: true });
//       setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
//       setFormErrors({});
//     }
//   };

//   const handleEditStaff = (member) => {
//     setEditStaff(member);
//     setStaffForm({
//       fullName: member.fullName,
//       phoneNumber: member.phoneNumber,
//       password: '',
//       role: member.role
//     });
//     setFormErrors({});
//   };

//   const handleEditSubmit = async (updatedStaff) => {
//     try {
//       const token = localStorage.getItem('token');
//       const societyId = localStorage.getItem('societyId');

//       if (!societyId || !token) {
//         setShowPopup({ visible: true, message: 'Missing society ID or token', isError: true });
//         setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
//         return;
//       }

//       const response = await fetch(`http://localhost:5000/api/societies/staffcreation/${societyId}/staff/${editStaff._id}`, {
//         method: 'PATCH',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(updatedStaff)
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         setShowPopup({ visible: true, message: `❌ ${errorData.message || 'Error updating staff'}`, isError: true });
//         setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
//         setFormErrors({});
//         return;
//       }

//       const updatedStaffResponse = await response.json();
//       setStaff(staff.map(s => s._id === editStaff._id ? updatedStaffResponse.staff : s));
//       setEditStaff(null);
//       setStaffForm({ fullName: '', phoneNumber: '', password: '', role: '' });
//       setFormErrors({});
//       setShowPopup({ visible: true, message: '✅ Staff member updated successfully!', isError: false });
//       setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
//     } catch (error) {
//       console.error('Error updating staff:', error);
//       setShowPopup({ visible: true, message: `❌ Error updating staff: ${error.message}`, isError: true });
//       setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
//       setFormErrors({});
//     }
//   };

//   const handleDeleteStaff = async (staffId) => {
//     // if (!window.confirm('Are you sure you want to delete this staff member?')) return;

//     try {
//       const token = localStorage.getItem('token');
//       const societyId = localStorage.getItem('societyId');

//       if (!societyId || !token) {
//         setShowPopup({ visible: true, message: 'Missing society ID or token', isError: true });
//         setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
//         return;
//       }

//       const response = await fetch(`http://localhost:5000/api/societies/staffcreation/${societyId}/staff/${staffId}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         setShowPopup({ visible: true, message: `❌ ${errorData.message || 'Error deleting staff'}`, isError: true });
//         setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
//         return;
//       }

//       setStaff(staff.filter(s => s._id !== staffId));
//       setShowPopup({ visible: true, message: '✅ Staff member deleted successfully!', isError: false });
//       setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
//     } catch (error) {
//       console.error('Error deleting staff:', error);
//       setShowPopup({ visible: true, message: `❌ Error deleting staff: ${error.message}`, isError: true });
//       setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
//     }
//   };

//   const handleStaffInputChange = (e) => {
//     const { name, value } = e.target;
//     setStaffForm(prev => ({ ...prev, [name]: value }));
//     setFormErrors(prev => ({ ...prev, [name]: '' }));
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('societyId');
//     navigate('/login');
//   };

//   if (!society) {
//     return <div className="loading">Loading society data...</div>;
//   }

//   return (
//     <div className="manager-dashboard">
//       <Sidebar
//         society={society}
//         selectedOption={selectedOption}
//         setSelectedOption={setSelectedOption}
//         handleLogout={handleLogout}
//       />

//       <div className="main-content">
//         {selectedOption === 'requests' && (
//           <ResidentRequests
//             requests={requests}
//             handleAction={handleAction}
//           />
//         )}

//         {selectedOption === 'staff' && (
//           <StaffManagement
//             staff={staff}
//             staffForm={staffForm}
//             formErrors={formErrors}
//             handleStaffSubmit={handleStaffSubmit}
//             handleEditStaff={handleEditStaff}
//             handleDeleteStaff={handleDeleteStaff}
//             handleStaffInputChange={handleStaffInputChange}
//           />
//         )}

//         {selectedOption === 'openIssues' && (
//           <Issues
//             issues={openIssues}
//             title="Open Issues"
//             noIssuesMessage="No open issues at this time."
//           />
//         )}

//         {selectedOption === 'underReview' && (
//           <Issues
//             issues={underReviewIssues}
//             title="Under Review"
//             noIssuesMessage="No issues under review at this time."
//             handleIssueStatusUpdate={handleIssueStatusUpdate}
//             showActions={true}
//           />
//         )}

//         {selectedOption === 'resolvedIssues' && (
//           <Issues
//             issues={resolvedIssues}
//             title="Resolved Issues"
//             noIssuesMessage="No resolved issues at this time."
//           />
//         )}
//       </div>

//       {editStaff && (
//         <EditStaffModal
//           staffForm={staffForm}
//           formErrors={formErrors}
//           handleEditSubmit={handleEditSubmit}
//           handleStaffInputChange={handleStaffInputChange}
//           setEditStaff={setEditStaff}
//           setStaffForm={setStaffForm}
//           setFormErrors={setFormErrors}
//         />
//       )}

//       {showPopup.visible && (
//         <Popup
//           message={showPopup.message}
//           isError={showPopup.isError}
//         />
//       )}
//     </div>
//   );
// }

// 



import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ManagerDashboard.css';
import Sidebar from './Sidebar';
import ResidentRequests from './ResidentRequests';
import StaffManagement from './StaffManagement';
import Issues from './Issues';
import EditStaffModal from './EditStaffModal';
import Popup from './Popup';
import Announcement from './Announcement';

export default function ManagerDashboard() {
  const [society, setSociety] = useState(null);
  const [requests, setRequests] = useState([]);
  const [staff, setStaff] = useState([]);
  const [openIssues, setOpenIssues] = useState([]);
  const [underReviewIssues, setUnderReviewIssues] = useState([]);
  const [resolvedIssues, setResolvedIssues] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [selectedOption, setSelectedOption] = useState('requests');
  const [showPopup, setShowPopup] = useState({ visible: false, message: '', isError: false });
  const [staffForm, setStaffForm] = useState({
    fullName: '',
    phoneNumber: '',
    password: '',
    role: '',
    startDate: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [editStaff, setEditStaff] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const societyId = localStorage.getItem('societyId');

        console.log('Fetching data with token:', token?.substring(0, 10), 'societyId:', societyId);

        if (!token || !societyId) {
          setShowPopup({ visible: true, message: 'Missing token or society ID', isError: true });
          setTimeout(() => {
            setShowPopup({ visible: false, message: '', isError: false });
            navigate('/login');
          }, 3000);
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
          setShowPopup({ visible: true, message: societyErrorData.message || 'Error fetching society data', isError: true });
          setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
          return;
        }

        const societyData = await societyResponse.json();
        setSociety(societyData);
        setRequests(societyData.residentRequests.filter(req => req.status === 'Pending'));

        // Fetch staff members
        const staffResponse = await fetch(`http://localhost:5000/api/societies/staffcreation/${societyId}/staff`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!staffResponse.ok) {
          const staffErrorData = await staffResponse.json();
          setShowPopup({ visible: true, message: staffErrorData.message || 'Error fetching staff', isError: true });
          setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
          return;
        }

        const staffData = await staffResponse.json();
        setStaff(staffData);

        // Fetch issues
        const [openIssuesResponse, underReviewIssuesResponse, resolvedIssuesResponse] = await Promise.all([
          fetch(`http://localhost:5000/api/issues/${societyId}?status=Open`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`http://localhost:5000/api/issues/${societyId}?status=Under Review`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`http://localhost:5000/api/issues/${societyId}?status=Resolved`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        if (!openIssuesResponse.ok || !underReviewIssuesResponse.ok || !resolvedIssuesResponse.ok) {
          const errorData = await Promise.any([
            openIssuesResponse.json().catch(() => ({})),
            underReviewIssuesResponse.json().catch(() => ({})),
            resolvedIssuesResponse.json().catch(() => ({}))
          ]);
          setShowPopup({ visible: true, message: errorData.message || 'Error fetching issues', isError: true });
          setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
          return;
        }

        const openIssuesData = await openIssuesResponse.json();
        const underReviewIssuesData = await underReviewIssuesResponse.json();
        const resolvedIssuesData = await resolvedIssuesResponse.json();

        setOpenIssues(openIssuesData);
        setUnderReviewIssues(underReviewIssuesData);
        setResolvedIssues(resolvedIssuesData);

        // Fetch announcements
        console.log('Fetching announcements for societyId:', societyId);
        const announcementsResponse = await fetch(`http://localhost:5000/api/${societyId}/announcements`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!announcementsResponse.ok) {
          const announcementsErrorData = await announcementsResponse.json();
          setShowPopup({ visible: true, message: announcementsErrorData.message || 'Error fetching announcements', isError: true });
          setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
          return;
        }

        const announcementsData = await announcementsResponse.json();
        setAnnouncements(announcementsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setShowPopup({ visible: true, message: `Error fetching data: ${error.message}`, isError: true });
        setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
      }
    };

    fetchData();
  }, []);

  const handleAction = async (requestId, action) => {
    try {
      const token = localStorage.getItem('token');
      const societyId = localStorage.getItem('societyId');

      if (!societyId || !token) {
        setShowPopup({ visible: true, message: 'Society ID or token not found', isError: true });
        setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
        return;
      }

      const response = await fetch(`http://localhost:5000/api/societies/${societyId}/resident-request/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action })
      });

      if (!response.ok) {
        const errorData = await response.json();
        setShowPopup({ visible: true, message: errorData.message || 'Error processing request', isError: true });
        setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
        return;
      }

      setRequests(prev => prev.filter(req => req._id !== requestId));
      const successMessage = action === 'approve' ? '✅ Resident request approved!' : '❌ Resident request rejected!';
      setShowPopup({ visible: true, message: successMessage, isError: false });
      setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
    } catch (error) {
      console.error('Error processing request:', error);
      setShowPopup({ visible: true, message: `Error processing request: ${error.message}`, isError: true });
      setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
    }
  };

  const handleIssueStatusUpdate = async (issueId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setShowPopup({ visible: true, message: 'No token found, please log in again', isError: true });
        setTimeout(() => {
          setShowPopup({ visible: false, message: '', isError: false });
          navigate('/login');
        }, 3000);
        return;
      }
      console.log('Sending request to update issue:', issueId, 'to status:', newStatus, 'with token:', token.substring(0, 10) + '...');
      const response = await fetch(`http://localhost:5000/api/issues/${issueId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        if (errorData.message.includes('Invalid token') || errorData.message.includes('jwt expired')) {
          setShowPopup({ visible: true, message: 'Session expired, please log in again', isError: true });
          setTimeout(() => {
            setShowPopup({ visible: false, message: '', isError: false });
            localStorage.removeItem('token');
            localStorage.removeItem('societyId');
            navigate('/login');
          }, 3000);
          return;
        }
        setShowPopup({ visible: true, message: errorData.message || 'Error updating issue status', isError: true });
        setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
        return;
      }

      const updatedIssue = await response.json();
      setUnderReviewIssues(prev => prev.filter(issue => issue._id !== issueId));
      if (newStatus === 'Resolved') {
        setResolvedIssues(prev => [...prev, updatedIssue.issue]);
      } else if (newStatus === 'Open') {
        setOpenIssues(prev => [...prev, updatedIssue.issue]);
      }
      setShowPopup({ visible: true, message: `✅ Issue marked as ${newStatus}!`, isError: false });
      setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
    } catch (error) {
      console.error('Error updating issue status:', error);
      setShowPopup({ visible: true, message: `Error updating issue status: ${error.message}`, isError: true });
      setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
    }
  };

  const validateStaffForm = (isEdit = false) => {
    const errors = {};
    const nameRegex = /^[a-zA-Z\s'-]{2,100}$/;
    const phoneRegex = /^\d{1,11}$/;
    const passwordRegex = /^.{6,}$/;

    if (!staffForm.fullName) {
      errors.fullName = 'Full name is required';
    } else if (!nameRegex.test(staffForm.fullName)) {
      errors.fullName = 'Name must be 2-100 characters, letters, spaces, hyphens, or apostrophes only';
    }

    if (!staffForm.phoneNumber) {
      errors.phoneNumber = 'Phone number is required';
    } else if (!phoneRegex.test(staffForm.phoneNumber)) {
      errors.phoneNumber = 'Phone number must be 1-11 digits';
    }

    if (!isEdit && !staffForm.password) {
      errors.password = 'Password is required';
    } else if ((isEdit && staffForm.password) || (!isEdit && staffForm.password)) {
      if (!passwordRegex.test(staffForm.password)) {
        errors.password = 'Password must be at least 6 characters';
      }
    }

    if (!staffForm.role) {
      errors.role = 'Role is required';
    } else if (!['Cleaner', 'Gardener', 'Event Manager', 'Security', 'Maintenance'].includes(staffForm.role)) {
      errors.role = 'Invalid role selected';
    }

    if (!isEdit) {
      const today = new Date().toISOString().split('T')[0];
      if (!staffForm.startDate) {
        errors.startDate = 'Start date is required';
      } else if (staffForm.startDate < today) {
        errors.startDate = 'Start date cannot be in the past';
      }
    }

    return errors;
  };

  const handleStaffSubmit = async (e) => {
    e.preventDefault();
    const errors = validateStaffForm();

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setShowPopup({ visible: true, message: 'Please fix form errors', isError: true });
      setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const societyId = localStorage.getItem('societyId');

      if (!societyId || !token) {
        setShowPopup({ visible: true, message: 'Missing society ID or token', isError: true });
        setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
        return;
      }

      const response = await fetch(`http://localhost:5000/api/societies/staffcreation/${societyId}/staff`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(staffForm)
      });

      if (!response.ok) {
        const errorData = await response.json();
        setShowPopup({ visible: true, message: `❌ ${errorData.message || 'Error creating staff'}`, isError: true });
        setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
        setFormErrors({});
        return;
      }

      const newStaff = await response.json();
      setStaff([...staff, newStaff.staff]);
      setStaffForm({ fullName: '', phoneNumber: '', password: '', role: '', startDate: '' });
      setFormErrors({});
      setShowPopup({ visible: true, message: '✅ Staff member created successfully!', isError: false });
      setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
    } catch (error) {
      console.error('Error creating staff:', error);
      setShowPopup({ visible: true, message: `❌ Error creating staff: ${error.message}`, isError: true });
      setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
      setFormErrors({});
    }
  };

  const handleEditStaff = (member) => {
    setEditStaff(member);
    setStaffForm({
      fullName: member.fullName,
      phoneNumber: member.phoneNumber,
      password: '',
      role: member.role,
      startDate: member.startDate || ''
    });
    setFormErrors({});
  };

  const handleEditSubmit = async (updatedStaff) => {
    try {
      const token = localStorage.getItem('token');
      const societyId = localStorage.getItem('societyId');

      if (!societyId || !token) {
        setShowPopup({ visible: true, message: 'Missing society ID or token', isError: true });
        setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
        return;
      }

      const response = await fetch(`http://localhost:5000/api/societies/staffcreation/${societyId}/staff/${editStaff._id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedStaff)
      });

      if (!response.ok) {
        const errorData = await response.json();
        setShowPopup({ visible: true, message: `❌ ${errorData.message || 'Error updating staff'}`, isError: true });
        setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
        setFormErrors({});
        return;
      }

      const updatedStaffResponse = await response.json();
      setStaff(staff.map(s => s._id === editStaff._id ? updatedStaffResponse.staff : s));
      setEditStaff(null);
      setStaffForm({ fullName: '', phoneNumber: '', password: '', role: '', startDate: '' });
      setFormErrors({});
      setShowPopup({ visible: true, message: '✅ Staff member updated successfully!', isError: false });
      setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
    } catch (error) {
      console.error('Error updating staff:', error);
      setShowPopup({ visible: true, message: `❌ Error updating staff: ${error.message}`, isError: true });
      setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
      setFormErrors({});
    }
  };

  const handleDeleteStaff = async (staffId) => {
    try {
      const token = localStorage.getItem('token');
      const societyId = localStorage.getItem('societyId');

      if (!societyId || !token) {
        setShowPopup({ visible: true, message: 'Missing society ID or token', isError: true });
        setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
        return;
      }

      const response = await fetch(`http://localhost:5000/api/societies/staffcreation/${societyId}/staff/${staffId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        setShowPopup({ visible: true, message: `❌ ${errorData.message || 'Error deleting staff'}`, isError: true });
        setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
        return;
      }

      setStaff(staff.filter(s => s._id !== staffId));
      setShowPopup({ visible: true, message: '✅ Staff member deleted successfully!', isError: false });
      setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
    } catch (error) {
      console.error('Error deleting staff:', error);
      setShowPopup({ visible: true, message: `❌ Error deleting staff: ${error.message}`, isError: true });
      setTimeout(() => setShowPopup({ visible: false, message: '', isError: false }), 3000);
    }
  };

  const handleStaffInputChange = (e) => {
    const { name, value } = e.target;
    setStaffForm(prev => ({ ...prev, [name]: value }));
    setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('societyId');
    navigate('/login');
  };

  if (!society) {
    return <div className="loading">Loading society data...</div>;
  }

  return (
    <div className="manager-dashboard">
      <Sidebar
        society={society}
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
        handleLogout={handleLogout}
      />

      <div className="main-content">
        {selectedOption === 'requests' && (
          <ResidentRequests
            requests={requests}
            handleAction={handleAction}
          />
        )}

        {selectedOption === 'staff' && (
          <StaffManagement
            staff={staff}
            staffForm={staffForm}
            formErrors={formErrors}
            handleStaffSubmit={handleStaffSubmit}
            handleEditStaff={handleEditStaff}
            handleDeleteStaff={handleDeleteStaff}
            handleStaffInputChange={handleStaffInputChange}
          />
        )}

        {selectedOption === 'openIssues' && (
          <Issues
            issues={openIssues}
            title="Open Issues"
            noIssuesMessage="No open issues at this time."
          />
        )}

        {selectedOption === 'underReview' && (
          <Issues
            issues={underReviewIssues}
            title="Under Review"
            noIssuesMessage="No issues under review at this time."
            handleIssueStatusUpdate={handleIssueStatusUpdate}
            showActions={true}
          />
        )}

        {selectedOption === 'resolvedIssues' && (
          <Issues
            issues={resolvedIssues}
            title="Resolved Issues"
            noIssuesMessage="No resolved issues at this time."
          />
        )}

        {selectedOption === 'announcements' && (
          <Announcement
            announcements={announcements}
            setAnnouncements={setAnnouncements}
            showPopup={(message, isError) => setShowPopup({ visible: true, message, isError })}
            societyId={society._id || localStorage.getItem('societyId')}
          />
        )}
      </div>

      {editStaff && (
        <EditStaffModal
          staffForm={staffForm}
          formErrors={formErrors}
          handleEditSubmit={handleEditSubmit}
          handleStaffInputChange={handleStaffInputChange}
          setEditStaff={setEditStaff}
          setStaffForm={setStaffForm}
          setFormErrors={setFormErrors}
        />
      )}

      {showPopup.visible && (
        <Popup
          message={showPopup.message}
          isError={showPopup.isError}
        />
      )}
    </div>
  );
}