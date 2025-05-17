import './ManagerDashboard.css';

export default function Issues({ issues, title, noIssuesMessage, handleIssueStatusUpdate, showActions }) {
  return (
    <div className="issues">
      <h2>{title}</h2>
      {issues.length === 0 ? (
        <p className="no-issues">{noIssuesMessage}</p>
      ) : (
        issues.map(issue => (
          <div key={issue._id} className="issue-card">
            <p><strong>📌 Title:</strong> {issue.title}</p>
            <p><strong>📝 Description:</strong> {issue.description}</p>
            <p><strong>👤 Reported by:</strong> {issue.reporter}</p>
            <p><strong>👷 Assigned to:</strong> {issue.role}</p>
            <p><strong>📅 Created:</strong> {new Date(issue.createdAt).toLocaleDateString()}</p>
            <p><strong>🟡 Status:</strong> {issue.status}</p>
            {showActions && (
              <div className="issue-actions">
                <button
                  className="approve-button"
                  onClick={() => handleIssueStatusUpdate(issue._id, 'Resolved')}
                >
                  Resolve ✅
                </button>
                <button
                  className="reject-button"
                  onClick={() => handleIssueStatusUpdate(issue._id, 'Open')}
                >
                  Reopen 🔄
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}