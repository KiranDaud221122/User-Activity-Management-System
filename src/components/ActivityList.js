import React, { useState, useEffect, useCallback } from 'react';
import { getUserActivitiesByUserId, deleteUserActivity, getAllActivityDetails, deleteActivityDetails } from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import { Button } from 'react-bootstrap';

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

      // Match ActivityDetails where activityDetailsId === UserActivity.id
      const matchedDetails = activitiesRes.data.reduce((acc, act) => {
        const matchingDet = allDetails.find(det => det.activityDetailsId === act.id);
        if (matchingDet) {
          acc[act.id] = matchingDet;
        }
        return acc;
      }, {});

      setDetails(matchedDetails);
    } catch (err) {
      setError('Error fetching activities');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const handleDelete = async (id, detailsId) => {
    if (window.confirm('Delete activity?')) {
      try {
        await deleteUserActivity(id);
        if (detailsId) await deleteActivityDetails(detailsId); // Use matched details.id
        fetchActivities();
      } catch (err) {
        alert('Error deleting');
      }
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      {activities.length === 0 ? <p>No activities</p> : (
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Name</th>
              <th>Description</th>
              <th>Timestamp</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {activities.map(act => {
              const det = details[act.id] || {};
              return (
                <tr key={act.id}>
                  <td>{act.id}</td>
                  <td>{act.activityType}</td>
                  <td>{det.activityName || 'N/A'}</td>
                  <td>{det.activityDescription || 'N/A'}</td>
                  <td>{det.activityTimestamp || 'N/A'}</td>
                  <td>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(act.id, det.id)}>Delete</Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ActivityList;