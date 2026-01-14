import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUserById, getUserActivitiesByUserId, getAllActivityDetails } from '../services/api';
import LoadingSpinner from './LoadingSpinner';

const Dashboard = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [activities, setActivities] = useState([]);
  const [details, setDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboard = useCallback(async () => {
    try {
      const userRes = await getUserById(id);
      setUser(userRes.data);

      const activitiesRes = await getUserActivitiesByUserId(id);
      setActivities(activitiesRes.data);

      const detailsRes = await getAllActivityDetails();
      const allDetails = detailsRes.data;

      const matchedDetails = activitiesRes.data.reduce((acc, act) => {
        const matchingDet = allDetails.find(det => det.activityDetailsId === act.id);
        if (matchingDet) {
          acc[act.id] = matchingDet;
        }
        return acc;
      }, {});

      setDetails(matchedDetails);
    } catch (err) {
      setError('Error loading dashboard');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <LoadingSpinner />;
  
  if (error) return (
    <div className="alert alert-danger m-3">
      <strong>Error:</strong> {error}
    </div>
  );

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div>
            <h1>User Dashboard</h1>
            <p className="subtitle">ID: #{id}</p>
          </div>
          <Link to="/" className="btn btn-outline-light">
            ← Back to Users
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-content">
        {/* User Info Card */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>User Information</h2>
          </div>
          <div className="card-body">
            <div className="user-info-grid">
              <div className="info-item">
                <span className="info-label">Name</span>
                <span className="info-value">{user.name}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Email</span>
                <a href={`mailto:${user.email}`} className="info-value">
                  {user.email}
                </a>
              </div>
              <div className="info-item">
                <span className="info-label">Contact</span>
                <span className="info-value">{user.contactNumber}</span>
              </div>
              <div className="info-item">
                <span className="info-label">User ID</span>
                <span className="info-value">#{user.id}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Created</span>
                <span className="info-value">{formatDate(user.createdAt)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Last Updated</span>
                <span className="info-value">{formatDate(user.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Activities Card */}
        <div className="dashboard-card">
          <div className="card-header">
            <div className="d-flex justify-content-between align-items-center">
              <h2>Activities</h2>
              <span className="badge">{activities.length} total</span>
            </div>
          </div>
          <div className="card-body">
            {activities.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📊</div>
                <h3>No Activities</h3>
                <p>This user hasn't logged any activities yet</p>
              </div>
            ) : (
              <>
                {/* Mobile View - Cards */}
                <div className="mobile-activities">
                  {activities.map(act => {
                    const det = details[act.id] || {};
                    return (
                      <div key={act.id} className="activity-card">
                        <div className="activity-header">
                          <div className="activity-type">{act.activityType}</div>
                          <div className="activity-time">
                            {formatTime(det.activityTimestamp)}
                          </div>
                        </div>
                        <div className="activity-body">
                          <div className="activity-name">{det.activityName || 'N/A'}</div>
                          <div className="activity-desc">
                            {det.activityDescription || 'No description'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Desktop View - Table */}
                <div className="desktop-activities">
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Type</th>
                          <th>Activity</th>
                          <th>Description</th>
                          <th>Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activities.map(act => {
                          const det = details[act.id] || {};
                          return (
                            <tr key={act.id}>
                              <td>
                                <span className="type-badge">
                                  {act.activityType}
                                </span>
                              </td>
                              <td className="fw-medium">
                                {det.activityName || 'N/A'}
                              </td>
                              <td className="text-muted">
                                {det.activityDescription || 'N/A'}
                              </td>
                              <td>
                                <div className="time-cell">
                                  <div>{formatDate(det.activityTimestamp)}</div>
                                  <small>{formatTime(det.activityTimestamp)}</small>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <style jsx>{`
        /* Container */
        .dashboard-container {
          min-height: 100vh;
          background-color: #f8f9fa;
          padding-top: 80px;
        }

        /* Header */
        .dashboard-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background: linear-gradient(135deg, #17252A 0%, #2B7A78 100%);
          color: white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          padding: 1rem 0;
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .dashboard-header h1 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .subtitle {
          margin: 0.25rem 0 0;
          opacity: 0.9;
          font-size: 0.9rem;
        }

        .dashboard-header .btn {
          padding: 0.5rem 1rem;
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.3);
          color: white;
          text-decoration: none;
        }

        .dashboard-header .btn:hover {
          background: rgba(255,255,255,0.25);
        }

        /* Main Content */
        .dashboard-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem;
        }

        /* Cards */
        .dashboard-card {
          background: white;
          border-radius: 8px;
          border: 1px solid #dee2e6;
          margin-bottom: 1.5rem;
          overflow: hidden;
        }

        .card-header {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border-bottom: 1px solid #dee2e6;
          padding: 1rem 1.5rem;
        }

        .card-header h2 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: #17252A;
        }

        .badge {
          background: #3AAFA9;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .card-body {
          padding: 1.5rem;
        }

        /* User Info Grid */
        .user-info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .info-label {
          font-size: 0.875rem;
          color: #6c757d;
          font-weight: 500;
        }

        .info-value {
          color: #17252A;
          font-weight: 500;
        }

        .info-value a {
          color: #2B7A78;
          text-decoration: none;
        }

        .info-value a:hover {
          text-decoration: underline;
        }

        /* Activities */
        .desktop-activities {
          display: block;
        }

        .mobile-activities {
          display: none;
        }

        .desktop-activities .table {
          margin: 0;
        }

        .desktop-activities .table thead th {
          background-color: #f8f9fa;
          border-bottom: 2px solid #dee2e6;
          padding: 1rem;
          font-weight: 600;
          color: #495057;
        }

        .desktop-activities .table tbody td {
          padding: 1rem;
          vertical-align: middle;
          border-bottom: 1px solid #dee2e6;
        }

        .desktop-activities .table tbody tr:hover {
          background-color: #f8f9fa;
        }

        .type-badge {
          background: #DEF2F1;
          color: #2B7A78;
          padding: 0.25rem 0.75rem;
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .time-cell {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .time-cell small {
          color: #6c757d;
        }

        /* Mobile Activities Cards */
        .activity-card {
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1rem;
        }

        .activity-card:last-child {
          margin-bottom: 0;
        }

        .activity-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .activity-type {
          background: #DEF2F1;
          color: #2B7A78;
          padding: 0.25rem 0.75rem;
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .activity-time {
          font-size: 0.875rem;
          color: #6c757d;
        }

        .activity-name {
          font-weight: 600;
          color: #17252A;
          margin-bottom: 0.5rem;
        }

        .activity-desc {
          color: #6c757d;
          font-size: 0.875rem;
          line-height: 1.4;
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 2rem;
        }

        .empty-icon {
          font-size: 2.5rem;
          opacity: 0.5;
          margin-bottom: 1rem;
        }

        .empty-state h3 {
          color: #495057;
          margin-bottom: 0.5rem;
        }

        .empty-state p {
          color: #6c757d;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .dashboard-container {
            padding-top: 70px;
          }

          .header-content {
            padding: 0 0.75rem;
          }

          .dashboard-header h1 {
            font-size: 1.25rem;
          }

          .subtitle {
            font-size: 0.8rem;
          }

          .dashboard-header .btn {
            padding: 0.375rem 0.75rem;
            font-size: 0.875rem;
          }

          .dashboard-content {
            padding: 0.75rem;
          }

          .card-body {
            padding: 1rem;
          }

          .user-info-grid {
            grid-template-columns: 1fr;
            gap: 0.75rem;
          }

          .desktop-activities {
            display: none;
          }

          .mobile-activities {
            display: block;
          }
        }

        @media (max-width: 480px) {
          .dashboard-container {
            padding-top: 60px;
          }

          .card-header {
            padding: 0.75rem 1rem;
          }

          .card-header h2 {
            font-size: 1.1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;