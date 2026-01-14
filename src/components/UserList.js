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
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.contactNumber.includes(searchTerm)
      );
      setFilteredUsers(filtered);
      setCurrentPage(1);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data);
      setFilteredUsers(res.data);
    } catch (err) {
      setError('Error loading users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete user "${name}"?`)) {
      try {
        await deleteUser(id);
        fetchUsers();
      } catch (err) {
        alert('Error deleting user');
      }
    }
  };

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) return <LoadingSpinner />;
  
  if (error) return (
    <div className="alert alert-danger m-3">
      <strong>Error:</strong> {error}
    </div>
  );

  return (
    <div className="user-list-container">
      {/* Sticky Header */}
      <header className="sticky-header">
        <div className="header-content">
          <div>
            <h1>User Activity Manager</h1>
            <p className="subtitle">Professional Dashboard</p>
          </div>
          <Link to="/create-user" className="btn btn-primary">
            <span className="btn-icon">+</span>
            <span className="btn-text">Add User</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
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

        {/* Users Content */}
        <div className="users-content">
          {currentUsers.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👤</div>
              <h3>No users found</h3>
              <p className="text-muted">
                {searchTerm ? 'Try a different search' : 'Create your first user'}
              </p>
              {!searchTerm && (
                <Link to="/create-user" className="btn btn-primary">
                  Create User
                </Link>
              )}
            </div>
          ) : (
            <>
              {/* Mobile Cards */}
              <div className="mobile-view">
                {currentUsers.map(user => (
                  <div key={user.id} className="user-card">
                    <div className="card-header">
                      <div className="user-avatar">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="user-info">
                        <div className="user-name">{user.name}</div>
                        <div className="user-email">{user.email}</div>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="info-row">
                        <span>Contact: {user.contactNumber}</span>
                        <span>Created: {formatDate(user.createdAt)}</span>
                      </div>
                    </div>
                    <div className="card-actions">
                      <Link to={`/user/${user.id}`} className="btn btn-sm">
                        Create Activity
                      </Link>
                      <Link to={`/dashboard/${user.id}`} className="btn btn-sm">
                        Dashboard
                      </Link>
                      <button 
                        onClick={() => handleDelete(user.id, user.name)} 
                        className="btn btn-sm btn-danger"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table */}
              <div className="desktop-view">
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Contact</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentUsers.map(user => (
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
                              >
                               Create Activity
                              </Link>
                              <Link 
                                to={`/dashboard/${user.id}`} 
                                className="btn btn-sm btn-outline-secondary"
                              >
                                Dashboard
                              </Link>
                              <button 
                                onClick={() => handleDelete(user.id, user.name)} 
                                className="btn btn-sm btn-outline-danger"
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
              </div>
            </>
          )}
        </div>

        {/* Pagination */}
        {filteredUsers.length > usersPerPage && (
          <div className="pagination">
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              ← Previous
            </button>
            
            <div className="page-info">
              Page {currentPage} of {totalPages}
            </div>
            
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next →
            </button>
          </div>
        )}
      </main>

      <style jsx>{`
        /* Container */
        .user-list-container {
          min-height: 100vh;
          background-color: #f8f9fa;
          padding-top: 80px;
        }

        /* Sticky Header */
        .sticky-header {
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

        .sticky-header h1 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .subtitle {
          margin: 0.25rem 0 0;
          opacity: 0.9;
          font-size: 0.9rem;
        }

        .sticky-header .btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.3);
          color: white;
        }

        .sticky-header .btn:hover {
          background: rgba(255,255,255,0.25);
        }

        /* Main Content */
        .main-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem;
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

        /* Users Content */
        .users-content {
          background: white;
          border-radius: 8px;
          border: 1px solid #dee2e6;
          overflow: hidden;
          margin-bottom: 1rem;
        }

        /* Empty State */
        .empty-state {
          padding: 3rem;
          text-align: center;
        }

        .empty-icon {
          font-size: 3rem;
          opacity: 0.5;
          margin-bottom: 1rem;
        }

        .empty-state h3 {
          color: #495057;
          margin-bottom: 0.5rem;
        }

        /* Mobile Cards */
        .mobile-view {
          display: none;
        }

        .user-card {
          padding: 1rem;
          border-bottom: 1px solid #dee2e6;
        }

        .user-card:last-child {
          border-bottom: none;
        }

        .card-header {
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #DEF2F1 0%, #3AAFA9 100%);
          color: #17252A;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          margin-right: 1rem;
        }

        .user-info {
          flex: 1;
        }

        .user-name {
          font-weight: 600;
          color: #17252A;
          margin-bottom: 0.25rem;
        }

        .user-email {
          color: #6c757d;
          font-size: 0.875rem;
        }

        .card-body {
          margin-bottom: 1rem;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.875rem;
          color: #6c757d;
        }

        .card-actions {
          display: flex;
          gap: 0.5rem;
        }

        .card-actions .btn {
          flex: 1;
          padding: 0.375rem;
          font-size: 0.875rem;
        }

        /* Desktop Table */
        .desktop-view {
          display: block;
        }

        .desktop-view .table {
          margin: 0;
        }

        .desktop-view .table thead th {
          background-color: #f8f9fa;
          border-bottom: 2px solid #dee2e6;
          padding: 1rem;
          font-weight: 600;
          color: #495057;
        }

        .desktop-view .table tbody td {
          padding: 1rem;
          vertical-align: middle;
          border-bottom: 1px solid #dee2e6;
        }

        .desktop-view .table tbody tr:hover {
          background-color: #f8f9fa;
        }

        /* Pagination */
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: white;
          border-radius: 8px;
          border: 1px solid #dee2e6;
        }

        .page-info {
          color: #495057;
          font-weight: 500;
        }

        .pagination .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .user-list-container {
            padding-top: 70px;
          }

          .header-content {
            padding: 0 0.75rem;
          }

          .btn-text {
            display: none;
          }

          .sticky-header .btn {
            padding: 0.5rem;
            min-width: 40px;
            justify-content: center;
          }

          .main-content {
            padding: 0.75rem;
          }

          .desktop-view {
            display: none;
          }

          .mobile-view {
            display: block;
          }

          .user-card {
            padding: 0.75rem;
          }

          .info-row {
            flex-direction: column;
            gap: 0.25rem;
          }

          .pagination {
            flex-direction: column;
            gap: 0.5rem;
          }
        }

        @media (max-width: 480px) {
          .user-list-container {
            padding-top: 60px;
          }

          .sticky-header h1 {
            font-size: 1.25rem;
          }

          .subtitle {
            font-size: 0.8rem;
          }

          .card-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default UserList;