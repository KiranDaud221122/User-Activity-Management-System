import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getUserById, getUserActivitiesByUserId, getAllActivityDetails } from '../services/api'; // Added extra imports
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
      // Fetch user info
      const userRes = await getUserById(id);
      setUser(userRes.data);

      // Fetch activities for this user
      const activitiesRes = await getUserActivitiesByUserId(id);
      setActivities(activitiesRes.data);

      // Fetch all details and match locally
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
      setError('Error fetching dashboard');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="mt-4">
      <div className="card shadow">
        <div className="card-header bg-success text-white">
          <h2 className="mb-0">Dashboard for User ID: {user.id}</h2>
        </div>
        <div className="card-body">
          <h3>User Info</h3>
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Contact:</strong> {user.contactNumber}</p>
          <p><strong>Created:</strong> {user.createdAt}</p>
          <p><strong>Updated:</strong> {user.updatedAt}</p>
        </div>
      </div>

      <div className="card shadow mt-4">
        <div className="card-header bg-warning text-white">
          <h3 className="mb-0">Activities</h3>
        </div>
        <div className="card-body">
          {activities.length === 0 ? <p>No activities</p> : (
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Activity Type</th>
                  <th>Activity Name</th>
                  <th>Description</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {activities.map(act => {
                  const det = details[act.id] || {};
                  return (
                    <tr key={act.id}>
                      <td>{act.userId}</td>
                      <td>{act.activityType}</td>
                      <td>{det.activityName || 'N/A'}</td>
                      <td>{det.activityDescription || 'N/A'}</td>
                      <td>{det.activityTimestamp || 'N/A'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;