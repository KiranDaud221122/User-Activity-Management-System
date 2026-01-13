import React, { useState } from 'react';
import { createUserActivity, createActivityDetails } from '../services/api';

const ActivityForm = ({ userId, onSuccess }) => {
  const [activityType, setActivityType] = useState('');
  const [activityName, setActivityName] = useState('');
  const [activityDescription, setActivityDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!activityType || !activityName || !activityDescription) {
      setError('All fields required');
      return;
    }
    try {
      const activityRes = await createUserActivity({ userId, activityType });
      const activityId = activityRes.data.id;

      await createActivityDetails({
        activityDetailsId: activityId,
        activityName,
        activityDescription,
      });

      onSuccess && onSuccess();
      setActivityType('');
      setActivityName('');
      setActivityDescription('');
    } catch (err) {
      setError('Error creating activity');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2">
      <h4>Add Activity for User {userId}</h4>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="form-group">
        <label>Activity Type</label>
        <input type="text" value={activityType} onChange={(e) => setActivityType(e.target.value)} className="form-control" />
      </div>
      <div className="form-group">
        <label>Activity Name</label>
        <input type="text" value={activityName} onChange={(e) => setActivityName(e.target.value)} className="form-control" />
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea value={activityDescription} onChange={(e) => setActivityDescription(e.target.value)} className="form-control" />
      </div>
      <button type="submit" className="btn btn-primary">Create</button>
    </form>
  );
};

export default ActivityForm;