import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getUserById } from '../services/api';
import UserForm from './UserForm';
import ActivityList from './ActivityList';
import ActivityForm from './ActivityForm';
import LoadingSpinner from './LoadingSpinner';

const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const navigate = useNavigate();

  const fetchUser = useCallback(async () => {
    try {
      const res = await getUserById(id);
      setUser(res.data);
    } catch (err) {
      setError('User not found or error loading profile');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
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
    <div className="user-profile-container">
      {/* Sticky Header */}
      <header className="profile-header">
        <div className="header-content">
          <div>
            <h1>User Profile</h1>
            <p className="subtitle">ID: #{id}</p>
          </div>
          <Link to="/" className="btn btn-outline-light">
            ← All Users
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="profile-content">
        {/* User Info Card */}
        <div className="profile-card">
          <div className="card-header">
            <h2>Personal Information</h2>
            <button 
              className="btn btn-outline-primary btn-sm"
              onClick={() => setShowEditModal(true)}
            >
              Edit Profile
            </button>
          </div>
          <div className="card-body">
            <div className="info-grid">
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
                <span className="info-label">Account Created</span>
                <span className="info-value">{formatDate(user.createdAt)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Last Updated</span>
                <span className="info-value">{formatDate(user.updatedAt)}</span>
              </div>
            </div>
            
            <div className="action-buttons">
              <Link to={`/dashboard/${id}`} className="btn btn-primary">
                View Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Activities Section */}
        <div className="activities-section">
          <div className="section-header">
            <h2>Activities</h2>
            <button 
              className="btn btn-primary"
              onClick={() => setShowAddActivityModal(true)}
            >
              + Add Activity
            </button>
          </div>
          <ActivityList userId={id} />
        </div>
      </main>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit User</h3>
              <button 
                className="close-btn"
                onClick={() => setShowEditModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <UserForm 
                existingUser={user} 
                onSuccess={() => { 
                  setShowEditModal(false); 
                  fetchUser(); 
                }} 
              />
            </div>
          </div>
        </div>
      )}

      {/* Add Activity Modal */}
      {showAddActivityModal && (
        <div className="modal-overlay" onClick={() => setShowAddActivityModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Activity</h3>
              <button 
                className="close-btn"
                onClick={() => setShowAddActivityModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <ActivityForm 
                userId={id} 
                onSuccess={() => { 
                  setShowAddActivityModal(false); 
                  fetchUser(); 
                }} 
              />
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        /* Container */
        .user-profile-container {
          min-height: 100vh;
          background-color: #f8f9fa;
          padding-top: 80px;
        }

        /* Header */
        .profile-header {
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

        .profile-header h1 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .subtitle {
          margin: 0.25rem 0 0;
          opacity: 0.9;
          font-size: 0.9rem;
        }

        .profile-header .btn {
          padding: 0.5rem 1rem;
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.3);
          color: white;
          text-decoration: none;
        }

        .profile-header .btn:hover {
          background: rgba(255,255,255,0.25);
        }

        /* Main Content */
        .profile-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem;
        }

        /* Profile Card */
        .profile-card {
          background: white;
          border-radius: 8px;
          border: 1px solid #dee2e6;
          margin-bottom: 1.5rem;
          overflow: hidden;
        }

        .profile-card .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border-bottom: 1px solid #dee2e6;
        }

        .profile-card .card-header h2 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: #17252A;
        }

        .profile-card .card-body {
          padding: 1.5rem;
        }

        /* Info Grid */
        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 1.5rem;
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
          font-size: 1rem;
        }

        .info-value a {
          color: #2B7A78;
          text-decoration: none;
        }

        .info-value a:hover {
          text-decoration: underline;
        }

        /* Action Buttons */
        .action-buttons {
          display: flex;
          gap: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #e9ecef;
        }

        .action-buttons .btn {
          padding: 0.75rem 1.5rem;
        }

        /* Activities Section */
        .activities-section {
          background: white;
          border-radius: 8px;
          border: 1px solid #dee2e6;
          overflow: hidden;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border-bottom: 1px solid #dee2e6;
        }

        .section-header h2 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: #17252A;
        }

        .section-header .btn {
          padding: 0.5rem 1rem;
        }

        /* Modals */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .modal-content {
          background: white;
          border-radius: 8px;
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          background: linear-gradient(135deg, #17252A 0%, #2B7A78 100%);
          color: white;
        }

        .modal-header h3 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .close-btn {
          background: none;
          border: none;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-btn:hover {
          opacity: 0.8;
        }

        .modal-body {
          padding: 1.5rem;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .user-profile-container {
            padding-top: 70px;
          }

          .header-content {
            padding: 0 0.75rem;
          }

          .profile-header h1 {
            font-size: 1.25rem;
          }

          .subtitle {
            font-size: 0.8rem;
          }

          .profile-header .btn {
            padding: 0.375rem 0.75rem;
            font-size: 0.875rem;
          }

          .profile-content {
            padding: 0.75rem;
          }

          .profile-card .card-body {
            padding: 1rem;
          }

          .info-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .section-header {
            padding: 1rem;
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .section-header .btn {
            width: 100%;
          }

          .modal-content {
            max-width: 100%;
          }
        }

        @media (max-width: 480px) {
          .user-profile-container {
            padding-top: 60px;
          }

          .action-buttons {
            flex-direction: column;
          }

          .action-buttons .btn {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default UserProfile;