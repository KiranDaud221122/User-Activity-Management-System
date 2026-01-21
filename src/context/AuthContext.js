import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token')
  });

  const setToken = (token) => {
    localStorage.setItem('token', token);
    setAuthState({
      token,
      isAuthenticated: true
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthState({
      token: null,
      isAuthenticated: false
    });
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{
      token: authState.token,
      isAuthenticated: authState.isAuthenticated,
      setToken,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};