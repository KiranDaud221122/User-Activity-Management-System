import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllUsers, deleteUser } from '../services/api';
import LoadingSpinner from './LoadingSpinner';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterAndSortUsers();
  }, [users, searchTerm, sortConfig]);

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data);
      setFilteredUsers(res.data);
    } catch (err) {
      setError('Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortUsers = () => {
    let result = [...users];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.contactNumber.includes(searchTerm)
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    setFilteredUsers(result);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete user "${name}"? This will remove all associated activities.`)) {
      try {
        await deleteUser(id);
        fetchUsers();
      } catch (err) {
        alert('Error deleting user');
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
    <div className="alert alert-danger">
      <strong>Error:</strong> {error}
    </div>
  );

  return (
    <div className="user-list-container">
      {/* Header */}
      <div className="list-header">
        <div>
          <h2>Users</h2>
          <p className="text-muted mb-0">Manage user accounts</p>
        </div>
        
      </div>

    

      {/* Search */}
      <div className="search-container">
        <div className="input-group">
          <span className="input-group-text">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="table-card">
        {filteredUsers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👤</div>
            <h4>No users found</h4>
            <p className="text-muted">
              {searchTerm ? 'Try a different search term' : 'Create your first user to get started'}
            </p>
            {!searchTerm && (
              <Link to="/create-user" className="btn btn-outline-primary">
                Create User
              </Link>
            )}
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>
                    <button 
                      className="sort-btn"
                      onClick={() => handleSort('id')}
                    >
                      ID
                      {sortConfig.key === 'id' && (
                        <span className="sort-icon">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </button>
                  </th>
                  <th>
                    <button 
                      className="sort-btn"
                      onClick={() => handleSort('name')}
                    >
                      Name
                      {sortConfig.key === 'name' && (
                        <span className="sort-icon">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </button>
                  </th>
                  <th>Email</th>
                  <th>Contact</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td className="text-muted">#{user.id}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="user-avatar me-2">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="fw-medium">{user.name}</span>
                      </div>
                    </td>
                    <td>
                      <a href={`mailto:${user.email}`} className="text-decoration-none">
                        {user.email}
                      </a>
                    </td>
                    <td>{user.contactNumber}</td>
                    <td className="text-muted">{formatDate(user.createdAt)}</td>
                    <td>
                      <div className="d-flex gap-1">
                        <Link 
                          to={`/user/${user.id}`} 
                          className="btn btn-sm btn-outline-primary"
                          title="View Profile"
                        >
                          View
                        </Link>
                        
                        <button 
                          onClick={() => handleDelete(user.id, user.name)} 
                          className="btn btn-sm btn-outline-danger"
                          title="Delete"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Results Info */}
        {filteredUsers.length > 0 && (
          <div className="table-footer">
            <small className="text-muted">
              Showing {filteredUsers.length} of {users.length} users
            </small>
          </div>
        )}
      </div>

      <style jsx>{`
        .user-list-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .list-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e9ecef;
        }
        
        .list-header h2 {
          margin: 0;
          color: #17252A;
          font-weight: 600;
        }
        
        /* Stats Bar */
        .stats-bar {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 8px;
          border: 1px solid #e9ecef;
        }
        
        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 1rem;
        }
        
        .stat-number {
          font-size: 1.5rem;
          font-weight: 600;
          color: #2B7A78;
        }
        
        .stat-label {
          font-size: 0.875rem;
          color: #6c757d;
          margin-top: 0.25rem;
        }
        
        /* Search */
        .search-container {
          margin-bottom: 1.5rem;
        }
        
        .search-container .input-group-text {
          background-color: white;
          border-right: none;
        }
        
        .search-container .form-control {
          border-left: none;
        }
        
        .search-container .form-control:focus {
          border-color: #ced4da;
          box-shadow: none;
        }
        
        /* Table Card */
        .table-card {
          background: white;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        
        .table {
          margin: 0;
          border-collapse: separate;
          border-spacing: 0;
        }
        
        .table thead th {
          background-color: #f8f9fa;
          border-bottom: 2px solid #e9ecef;
          padding: 1rem;
          font-weight: 600;
          color: #495057;
          vertical-align: middle;
        }
        
        .table tbody td {
          padding: 1rem;
          border-bottom: 1px solid #e9ecef;
          vertical-align: middle;
        }
        
        .table tbody tr:hover {
          background-color: #f8f9fa;
        }
        
        /* Sort Button */
        .sort-btn {
          background: none;
          border: none;
          padding: 0;
          font-weight: 600;
          color: inherit;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          cursor: pointer;
        }
        
        .sort-btn:hover {
          color: #2B7A78;
        }
        
        .sort-icon {
          font-size: 0.875rem;
        }
        
        /* User Avatar */
        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: #DEF2F1;
          color: #2B7A78;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.875rem;
        }
        
        /* Empty State */
        .empty-state {
          padding: 3rem;
          text-align: center;
        }
        
        .empty-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }
        
        .empty-state h4 {
          margin-bottom: 0.5rem;
          color: #495057;
        }
        
        /* Table Footer */
        .table-footer {
          padding: 1rem;
          border-top: 1px solid #e9ecef;
          background-color: #f8f9fa;
          text-align: right;
        }
        
        /* Responsive */
        @media (max-width: 768px) {
          .user-list-container {
            padding: 1rem;
          }
          
          .list-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          
          .stats-bar {
            flex-wrap: wrap;
            justify-content: center;
          }
          
          .table td:nth-child(4),
          .table th:nth-child(4),
          .table td:nth-child(5),
          .table th:nth-child(5) {
            display: none;
          }
          
          .d-flex.gap-1 {
            flex-direction: column;
            gap: 0.25rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default UserList;