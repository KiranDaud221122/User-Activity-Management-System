import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getUserById } from '../services/api';
import UserForm from './UserForm';
import ActivityList from './ActivityList';
import ActivityForm from './ActivityForm';
import LoadingSpinner from './LoadingSpinner';
import { Modal, Button } from 'react-bootstrap'; // Import Bootstrap Modal

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
      setError('User not found');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="mt-4">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h2 className="mb-0">User Profile (ID: {user.id})</h2>
        </div>
        <div className="card-body">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Contact:</strong> {user.contactNumber}</p>
          <p><strong>Created:</strong> {user.createdAt}</p>
          <p><strong>Updated:</strong> {user.updatedAt}</p>
          <Button variant="warning" className="mr-2" onClick={() => setShowEditModal(true)}>Edit</Button>
          <Button variant="secondary" onClick={() => navigate('/')}>Back</Button>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <UserForm existingUser={user} onSuccess={() => { setShowEditModal(false); fetchUser(); }} />
        </Modal.Body>
      </Modal>

      <div className="card shadow mt-4">
        <div className="card-header bg-info text-white">
          <h3 className="mb-0">Activities</h3>
        </div>
        <div className="card-body">
          <Button variant="success" className="mb-3" onClick={() => setShowAddActivityModal(true)}>Add Activity</Button>
          <ActivityList userId={id} />
        </div>
      </div>

      {/* Add Activity Modal */}
      <Modal show={showAddActivityModal} onHide={() => setShowAddActivityModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Activity</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ActivityForm userId={id} onSuccess={() => { setShowAddActivityModal(false); fetchUser(); }} />
        </Modal.Body>
      </Modal>

      <Link to={`/dashboard/${id}`} className="btn btn-info btn-lg mt-3">View Dashboard</Link>
    </div>
  );
};

export default UserProfile;