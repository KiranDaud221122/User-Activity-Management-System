import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { login } from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email.trim() || !password) {
      setError('Email and password are required');
      return;
    }

    setLoading(true);
    try {
      console.log('Sending login request...');
      const res = await login({ email, password });
      console.log('Login response:', res);
      
      if (res.data && res.data.token) {
        console.log('Token received, storing...');
        setToken(res.data.token);
        navigate('/');
      } else if (res.data && res.data.accessToken) {
        console.log('Access token received, storing...');
        setToken(res.data.accessToken);
        navigate('/');
      } else {
        console.error('No token in response:', res.data);
        setError('Invalid response from server. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      console.error('Error response:', err.response);
      
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (err.response.status === 401) {
          setError('Invalid email or password');
        } else if (err.response.status === 400) {
          setError('Bad request. Please check your input.');
        } else if (err.response.status >= 500) {
          setError('Server error. Please try again later.');
        } else {
          setError(err.response.data?.message || 'Login failed');
        }
      } else if (err.request) {
        // The request was made but no response was received
        console.error('No response received:', err.request);
        setError('No response from server. Check your connection.');
      } else {
        // Something happened in setting up the request
        console.error('Request setup error:', err.message);
        setError('Error setting up request: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTestLogin = () => {
    setEmail('test@example.com');
    setPassword('password123');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Welcome Back</h2>
          <p>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠</span>
              <div>
                <strong>Error:</strong> {error}
                <div style={{ fontSize: '0.8rem', marginTop: '0.25rem', opacity: 0.7 }}>
                  Invalid Credential 
                </div>
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">
              Email Address <span className="required">*</span>
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Password <span className="required">*</span>
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={loading}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Signing In...
              </>
            ) : 'Sign In'}
          </button>

          <div style={{ marginTop: '1rem', textAlign: 'center' }}>

          </div>

          <div className="login-footer">
            <p className="text-center">
              Don't have an account?{' '}
              <Link to="/create-user" className="register-link">
                Create Account
              </Link>
            </p>
          </div>
        </form>
      </div>

      <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #17252A 0%, #2B7A78 100%);
          padding: 1rem;
        }

        .login-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
          width: 100%;
          max-width: 400px;
          overflow: hidden;
        }

        .login-header {
          background: linear-gradient(135deg, #17252A 0%, #2B7A78 100%);
          color: white;
          padding: 2rem;
          text-align: center;
        }

        .login-header h2 {
          margin: 0;
          font-size: 1.75rem;
          font-weight: 600;
        }

        .login-header p {
          margin: 0.5rem 0 0;
          opacity: 0.9;
        }

        .login-form {
          padding: 2rem;
        }

        /* Error Message */
        .error-message {
          background: #fee;
          border: 1px solid #fcc;
          color: #c00;
          padding: 0.75rem 1rem;
          border-radius: 6px;
          margin-bottom: 1.5rem;
          font-size: 0.875rem;
        }

        .error-icon {
          font-size: 1rem;
          margin-right: 0.5rem;
          float: left;
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
          border-radius: 6px;
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

        /* Button */
        .btn {
          width: 100%;
          padding: 0.75rem;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
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
          box-shadow: 0 4px 12px rgba(58, 175, 169, 0.3);
        }

        .btn-outline-secondary {
          background: transparent;
          color: #6c757d;
          border: 1px solid #6c757d;
        }

        .btn-outline-secondary:hover:not(:disabled) {
          background: #6c757d;
          color: white;
        }

        /* Spinner */
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

        /* Footer */
        .login-footer {
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid #e9ecef;
        }

        .register-link {
          color: #2B7A78;
          text-decoration: none;
          font-weight: 600;
        }

        .register-link:hover {
          text-decoration: underline;
        }

        /* Responsive */
        @media (max-width: 480px) {
          .login-header {
            padding: 1.5rem;
          }

          .login-header h2 {
            font-size: 1.5rem;
          }

          .login-form {
            padding: 1.5rem;
          }

          .form-group {
            margin-bottom: 1rem;
          }

          .form-group input {
            padding: 0.625rem;
          }

          .btn {
            padding: 0.625rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;