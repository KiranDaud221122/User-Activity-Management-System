import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './components/Login';
import UserList from './components/UserList';
import UserForm from './components/UserForm';
import UserProfile from './components/UserProfile';
import Dashboard from './components/Dashboard';
import './App.css';

const AppContent = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);

  return (
    <Router>
      <div className="app-container">
        {/* Header */}
        <header className="app-header">
          <nav className="navbar">
            <div className="container-fluid">
              <Link className="navbar-brand" to="/">
                <h1 className="mb-0">User Activity Manager</h1>
              </Link>
              <ul className="navbar-nav">
                {isAuthenticated ? (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/">Users</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/create-user">Create User</Link>
                    </li>
                    <li className="nav-item">
                      <button className="nav-link logout-btn" onClick={logout}>Logout</button>
                    </li>
                  </>
                ) : (
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">Login</Link>
                  </li>
                )}
              </ul>
            </div>
          </nav>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/create-user" element={<UserForm />} />
            <Route path="/" element={
              <PrivateRoute>
                <UserList />
              </PrivateRoute>
            } />
            <Route path="/user/:id" element={
              <PrivateRoute>
                <UserProfile />
              </PrivateRoute>
            } />
            <Route path="/dashboard/:id" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            {/* Redirect to login if no matching route */}
            <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;