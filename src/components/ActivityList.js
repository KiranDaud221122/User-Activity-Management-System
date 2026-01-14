import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getUserActivitiesByUserId, deleteUserActivity, getAllActivityDetails, deleteActivityDetails } from '../services/api';
import LoadingSpinner from './LoadingSpinner';

const ActivityList = ({ userId }) => {
  const [activities, setActivities] = useState([]);
  const [details, setDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchActivities = useCallback(async () => {
    try {
      const activitiesRes = await getUserActivitiesByUserId(userId);
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
      setError('Error loading activities');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const handleDelete = async (id, activityName) => {
    if (window.confirm(`Delete activity "${activityName}"?`)) {
      try {
        await deleteUserActivity(id);
        if (details[id]) await deleteActivityDetails(details[id].id);
        fetchActivities();
      } catch (err) {
        alert('Error deleting activity');
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading) return <LoadingSpinner />;
  
  if (error) return (
    <div className="alert alert-danger m-3">
      <strong>Error:</strong> {error}
    </div>
  );

  return (
    <div className="activity-list-container">
      {/* Header with Navigation */}
      <div className="activity-header">
        <div className="header-content">
        
        </div>
        <div className="activity-stats">
          <span>{activities.length} activities</span>
        </div>
      </div>

      {/* Activities Content */}
      <div className="activities-content">
        {activities.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <h3>No Activities</h3>
            <p>Start by adding your first activity</p>
          </div>
        ) : (
          <>
            {/* Mobile Cards */}
            <div className="mobile-activities">
              {activities.map(act => {
                const det = details[act.id] || {};
                return (
                  <div key={act.id} className="activity-card">
                    <div className="card-header">
                      <div className="activity-type">{act.activityType}</div>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(act.id, det.activityName)}
                      >
                        ×
                      </button>
                    </div>
                    <div className="card-body">
                      <div className="activity-name">{det.activityName || 'N/A'}</div>
                      <div className="activity-desc">
                        {det.activityDescription || 'No description'}
                      </div>
                      <div className="activity-meta">
                        <span>ID: #{act.id}</span>
                        <span>{formatDate(det.activityTimestamp)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table */}
            <div className="desktop-activities">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Type</th>
                      <th>Activity</th>
                      <th>Description</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activities.map(act => {
                      const det = details[act.id] || {};
                      return (
                        <tr key={act.id}>
                          <td className="text-muted">#{act.id}</td>
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
                          <td>{formatDate(det.activityTimestamp)}</td>
                          <td>
                            <button 
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(act.id, det.activityName)}
                            >
                              Delete
                            </button>
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

      <style jsx>{`
        /* Container */
        .activity-list-container {
          background: white;
          border-radius: 8px;
          border: 1px solid #dee2e6;
          overflow: hidden;
        }

        /* Header */
        .activity-header {
          background: #f8f9fa;
          border-bottom: 1px solid #dee2e6;
          padding: 1rem;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .activity-header h2 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: #17252A;
        }

        .header-actions {
          display: flex;
          gap: 0.5rem;
        }

        .activity-stats {
          text-align: right;
          font-size: 0.875rem;
          color: #6c757d;
        }

        /* Activities Content */
        .activities-content {
          padding: 1rem;
        }

        /* Mobile Cards */
        .mobile-activities {
          display: none;
        }

        .activity-card {
          border: 1px solid #e9ecef;
          border-radius: 6px;
          margin-bottom: 1rem;
          overflow: hidden;
        }

        .activity-card:last-child {
          margin-bottom: 0;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background: #f8f9fa;
          border-bottom: 1px solid #e9ecef;
        }

        .activity-type {
          background: #DEF2F1;
          color: #2B7A78;
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .card-body {
          padding: 0.75rem;
        }

        .activity-name {
          font-weight: 600;
          color: #17252A;
          margin-bottom: 0.5rem;
        }

        .activity-desc {
          color: #6c757d;
          font-size: 0.875rem;
          margin-bottom: 0.75rem;
          line-height: 1.4;
        }

        .activity-meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: #6c757d;
        }

        /* Desktop Table */
        .desktop-activities {
          display: block;
        }

        .desktop-activities .table {
          margin: 0;
        }

        .desktop-activities .table thead th {
          background-color: #f8f9fa;
          border-bottom: 2px solid #dee2e6;
          padding: 0.75rem;
          font-weight: 600;
          color: #495057;
          font-size: 0.875rem;
        }

        .desktop-activities .table tbody td {
          padding: 0.75rem;
          vertical-align: middle;
          border-bottom: 1px solid #dee2e6;
        }

        .desktop-activities .table tbody tr:hover {
          background-color: #f8f9fa;
        }

        .type-badge {
          background: #DEF2F1;
          color: #2B7A78;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.875rem;
          font-weight: 500;
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 2rem;
        }

        .empty-icon {
          font-size: 2rem;
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
          .header-content {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .header-actions {
            width: 100%;
          }

          .header-actions .btn {
            flex: 1;
            text-align: center;
          }

          .desktop-activities {
            display: none;
          }

          .mobile-activities {
            display: block;
          }

          .activity-header {
            padding: 0.75rem;
          }
        }

        @media (max-width: 480px) {
          .header-actions {
            flex-direction: column;
          }

          .activity-card {
            margin-bottom: 0.75rem;
          }

          .card-body {
            padding: 0.5rem;
          }

          .activity-meta {
            flex-direction: column;
            gap: 0.25rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ActivityList;