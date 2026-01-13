import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import UserList from './components/UserList';
import UserForm from './components/UserForm';
import UserProfile from './components/UserProfile';
import Dashboard from './components/Dashboard';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Header with new color scheme */}
        <header className="app-header">
          <nav className="navbar navbar-expand-lg">
            <div className="container-fluid">
              <Link className="navbar-brand" to="/">
                <div className="brand-wrapper">
                  <h1 className="mb-0">User Activity Manager</h1>
                  <span className="brand-subtitle">Professional Dashboard</span>
                </div>
              </Link>
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ms-auto">
                  <li className="nav-item">
                    <Link className="nav-link nav-item-icon" to="/">
                      <svg className="nav-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                      </svg>
                      <span>Users</span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link nav-item-icon btn-create-user" to="/create-user">
                      <svg className="nav-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                      </svg>
                      <span>Create User</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </header>

        <main className="app-main container-fluid">
          <div className="row justify-content-center">
            <div className="col-xxl-10 col-xl-11 col-lg-12">
              <Routes>
                <Route path="/" element={<UserList />} />
                <Route path="/create-user" element={<UserForm />} />
                <Route path="/user/:id" element={<UserProfile />} />
                <Route path="/dashboard/:id" element={<Dashboard />} />
              </Routes>
            </div>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;