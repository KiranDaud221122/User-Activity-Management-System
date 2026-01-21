import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser, updateUser } from '../services/api';

const UserForm = ({ existingUser, onSuccess }) => {
  const [formData, setFormData] = useState(existingUser || { 
    name: '', 
    email: '', 
    contactNumber: '', 
    password: '' 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate required fields
    if (!formData.name.trim() || !formData.email.trim() || !formData.contactNumber.trim()) {
      setError('All fields are required');
      return;
    }

    // For new users, validate password
    if (!existingUser && !formData.password.trim()) {
      setError('Password is required for new users');
      return;
    }

    if (!existingUser && formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      if (existingUser) {
        // Don't send password for updates
        const { password, ...updateData } = formData;
        await updateUser(existingUser.id, updateData);
        onSuccess && onSuccess();
      } else {
        await createUser(formData);
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (existingUser) {
      setFormData(existingUser);
    } else {
      setFormData({ name: '', email: '', contactNumber: '', password: '' });
    }
    setError('');
  };

  const isUpdateMode = !!existingUser;

  return (
    <div className="user-form-container">
      {/* Header */}
      <div className="form-header">
        <h2>{isUpdateMode ? 'Update User' : 'Create Account'}</h2>
        {isUpdateMode && (
          <div className="user-id">ID: #{existingUser.id}</div>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="user-form">
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠</span>
            {error}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="name">
            Full Name <span className="required">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter full name"
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">
            Email Address <span className="required">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email address"
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="contactNumber">
            Contact Number <span className="required">*</span>
          </label>
          <input
            type="tel"
            id="contactNumber"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            placeholder="Enter contact number"
            disabled={loading}
            required
          />
        </div>

        {!isUpdateMode && (
          <div className="form-group">
            <label htmlFor="password">
              Password <span className="required">*</span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password (min 6 characters)"
              disabled={loading}
              required
            />
            <small className="form-hint">Password must be at least 6 characters</small>
          </div>
        )}

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate(isUpdateMode ? `/user/${existingUser.id}` : '/')}
            disabled={loading}
          >
            {isUpdateMode ? 'Cancel' : 'Back'}
          </button>
          <button
            type="button"
            className="btn btn-outline"
            onClick={handleReset}
            disabled={loading}
          >
            Reset
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                {isUpdateMode ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              isUpdateMode ? 'Update User' : 'Create Account'
            )}
          </button>
        </div>

        {!isUpdateMode && (
          <div className="login-link">
            Already have an account?{' '}
            <button
              type="button"
              className="link-btn"
              onClick={() => navigate('/login')}
            >
              Sign In
            </button>
          </div>
        )}
      </form>

      <style jsx>{`
        .user-form-container {
          background: white;
          border-radius: 8px;
          border: 1px solid #dee2e6;
          overflow: hidden;
          max-width: 500px;
          margin: 2rem auto;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        /* Header */
        .form-header {
          background: linear-gradient(135deg, #17252A 0%, #2B7A78 100%);
          color: white;
          padding: 1.5rem;
          text-align: center;
        }

        .form-header h2 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .user-id {
          margin-top: 0.5rem;
          font-size: 0.875rem;
          opacity: 0.9;
        }

        /* Form */
        .user-form {
          padding: 2rem;
        }

        /* Error Message */
        .error-message {
          background: #fee;
          border: 1px solid #fcc;
          color: #c00;
          padding: 0.75rem 1rem;
          border-radius: 4px;
          margin-bottom: 1.5rem;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .error-icon {
          font-size: 1rem;
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
          font-size: 0.95rem;
        }

        .required {
          color: #dc3545;
        }

        .form-group input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ced4da;
          border-radius: 4px;
          font-size: 1rem;
          transition: all 0.2s ease;
        }

        .form-group input:focus {
          outline: none;
          border-color: #3AAFA9;
          box-shadow: 0 0 0 3px rgba(58, 175, 169, 0.15);
        }

        .form-group input:disabled {
          background-color: #f8f9fa;
          cursor: not-allowed;
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
          gap: 1rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e9ecef;
          margin-top: 1rem;
          margin-bottom: 1rem;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 4px;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          flex: 1;
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
          background: #6c757d;
          color: white;
        }

        .btn-secondary:hover:not(:disabled) {
          background: #5a6268;
        }

        .btn-outline {
          background: white;
          color: #495057;
          border: 1px solid #ced4da;
        }

        .btn-outline:hover:not(:disabled) {
          background: #f8f9fa;
        }

        /* Login Link */
        .login-link {
          text-align: center;
          padding-top: 1rem;
          border-top: 1px solid #e9ecef;
          color: #6c757d;
          font-size: 0.95rem;
        }

        .link-btn {
          background: none;
          border: none;
          color: #2B7A78;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
          text-decoration: underline;
        }

        .link-btn:hover {
          color: #3AAFA9;
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
          .user-form-container {
            border-radius: 0;
            border-left: none;
            border-right: none;
            max-width: 100%;
            margin: 0;
          }

          .form-header {
            padding: 1.25rem;
          }

          .form-header h2 {
            font-size: 1.25rem;
          }

          .user-form {
            padding: 1.5rem;
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
            padding: 1rem;
          }

          .user-form {
            padding: 1rem;
          }

          .form-group {
            margin-bottom: 1rem;
          }

          .form-group input {
            padding: 0.625rem;
          }

          .btn {
            padding: 0.625rem 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default UserForm;