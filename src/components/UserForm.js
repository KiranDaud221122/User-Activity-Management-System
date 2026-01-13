import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser, updateUser } from '../services/api';
import { Form, Button } from 'react-bootstrap';

const UserForm = ({ existingUser, onSuccess }) => {
  const [formData, setFormData] = useState(existingUser || { name: '', email: '', contactNumber: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.name || !formData.email || !formData.contactNumber) {
      setError('All fields are required');
      return;
    }

    setLoading(true);
    try {
      if (existingUser) {
        await updateUser(existingUser.id, formData);
      } else {
        await createUser(formData);
        navigate('/');
      }
      onSuccess && onSuccess();
    } catch (err) {
      setError(err.response?.data || 'Error saving user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="classic-card">
      <div className="classic-card-header">
        <h3 className="mb-0">{existingUser ? 'Update User' : 'Create New User'}</h3>
      </div>
      <div className="p-4">
        <Form onSubmit={handleSubmit} className="enhanced-form">
          {error && <div className="alert alert-danger">{error}</div>}
          
          <Form.Group className="mb-4">
            <Form.Label>Full Name</Form.Label>
            <Form.Control 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange}
              placeholder="Enter full name"
              required
            />
          </Form.Group>
          
          <Form.Group className="mb-4">
            <Form.Label>Email Address</Form.Label>
            <Form.Control 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange}
              placeholder="Enter email address"
              required
            />
          </Form.Group>
          
          <Form.Group className="mb-4">
            <Form.Label>Contact Number</Form.Label>
            <Form.Control 
              type="text" 
              name="contactNumber" 
              value={formData.contactNumber} 
              onChange={handleChange}
              placeholder="Enter contact number"
              required
            />
          </Form.Group>
          
          <div className="d-flex justify-content-between pt-3">
            <Button 
              variant="secondary" 
              onClick={() => navigate('/')}
              className="btn-classic"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="btn-classic btn-classic-primary"
            >
              {loading ? 'Saving...' : existingUser ? 'Update User' : 'Create User'}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default UserForm;