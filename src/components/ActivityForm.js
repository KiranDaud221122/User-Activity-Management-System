import React, { useState } from 'react';
import { createUserActivity, createActivityDetails } from '../services/api';

const ActivityForm = ({ userId, onSuccess }) => {
  const [activityType, setActivityType] = useState('');
  const [activityName, setActivityName] = useState('');
  const [activityDescription, setActivityDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!activityType.trim() || !activityName.trim() || !activityDescription.trim()) {
      setError('All fields are required');
      return;
    }
    
    setLoading(true);
    
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
      setError('Error creating activity. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setActivityType('');
    setActivityName('');
    setActivityDescription('');
    setError('');
  };

  return (
    <div className="activity-form-container">
      <div className="form-header">
        <h3>Add New Activity</h3>
        <div className="user-badge">User ID: #{userId}</div>
      </div>

      <form onSubmit={handleSubmit} className="activity-form">
        {error && (
          <div className="alert error-alert">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="form-group">
          <label>
            Activity Type <span className="required">*</span>
          </label>
          <input 
            type="text" 
            value={activityType} 
            onChange={(e) => setActivityType(e.target.value)} 
            className="form-control"
            placeholder="e.g., Workout, Meeting, Task"
            disabled={loading}
            required
          />
          <small className="form-hint">Categorize the activity (Work, Personal, Health, etc.)</small>
        </div>

        <div className="form-group">
          <label>
            Activity Name <span className="required">*</span>
          </label>
          <input 
            type="text" 
            value={activityName} 
            onChange={(e) => setActivityName(e.target.value)} 
            className="form-control"
            placeholder="Enter activity name"
            disabled={loading}
            required
          />
          <small className="form-hint">Give a clear name for this activity</small>
        </div>

        <div className="form-group">
          <label>
            Description <span className="required">*</span>
          </label>
          <textarea 
            value={activityDescription} 
            onChange={(e) => setActivityDescription(e.target.value)} 
            className="form-control"
            rows="4"
            placeholder="Describe the activity in detail..."
            disabled={loading}
            required
          />
          <small className="form-hint">Provide details about what this activity involves</small>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={handleReset}
            disabled={loading}
          >
            Clear Form
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Creating...
              </>
            ) : 'Create Activity'}
          </button>
        </div>
      </form>

      <style jsx>{`
        /* Container */
        .activity-form-container {
          background: white;
          border-radius: 8px;
          border: 1px solid #dee2e6;
          overflow: hidden;
          max-width: 600px;
          margin: 0 auto;
        }

        /* Header */
        .form-header {
          background: linear-gradient(135deg, #17252A 0%, #2B7A78 100%);
          color: white;
          padding: 1rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .form-header h3 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .user-badge {
          background: rgba(255, 255, 255, 0.2);
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 500;
        }

        /* Form */
        .activity-form {
          padding: 1.5rem;
        }

        /* Error Alert */
        .error-alert {
          background: #f8d7da;
          border: 1px solid #f5c6cb;
          color: #721c24;
          padding: 0.75rem 1rem;
          border-radius: 4px;
          margin-bottom: 1rem;
          font-size: 0.875rem;
        }

        /* Form Groups */
        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #17252A;
        }

        .required {
          color: #dc3545;
        }

        .form-control {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ced4da;
          border-radius: 4px;
          font-size: 0.95rem;
          transition: all 0.2s ease;
        }

        .form-control:focus {
          outline: none;
          border-color: #3AAFA9;
          box-shadow: 0 0 0 3px rgba(58, 175, 169, 0.15);
        }

        .form-control:disabled {
          background-color: #e9ecef;
          cursor: not-allowed;
        }

        textarea.form-control {
          resize: vertical;
          min-height: 100px;
        }

        .form-hint {
          display: block;
          margin-top: 0.25rem;
          color: #6c757d;
          font-size: 0.875rem;
        }

        /* Form Actions */
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #e9ecef;
          margin-top: 1rem;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 4px;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          min-width: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-primary {
          background: linear-gradient(135deg, #2B7A78 0%, #3AAFA9 100%);
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: linear-gradient(135deg, #3AAFA9 0%, #2B7A78 100%);
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(58, 175, 169, 0.3);
        }

        .btn-secondary {
          background: #e9ecef;
          color: #495057;
          border: 1px solid #ced4da;
        }

        .btn-secondary:hover:not(:disabled) {
          background: #dee2e6;
        }

        /* Loading Spinner */
        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .activity-form-container {
            border-radius: 0;
            border-left: none;
            border-right: none;
          }

          .form-header {
            padding: 1rem;
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .form-header h3 {
            font-size: 1.1rem;
          }

          .activity-form {
            padding: 1rem;
          }

          .form-actions {
            flex-direction: column;
          }

          .btn {
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .form-header {
            text-align: center;
          }

          .user-badge {
            align-self: center;
          }

          .form-control {
            padding: 0.625rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ActivityForm;