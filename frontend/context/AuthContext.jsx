'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '@/lib/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await auth.getMe();
          setUser(res.data.data.user);
        } catch (error) {
          console.error('Auth initialization failed', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (credentials) => {
    const res = await auth.login(credentials);
    const { user: userData, token } = res.data.data;
    localStorage.setItem('token', token);
    setUser(userData);
    return res.data;
  };

  const register = async (userData) => {
    const res = await auth.register(userData);
    const { user: registeredUser, token } = res.data.data;
    localStorage.setItem('token', token);
    setUser(registeredUser);
    return res.data;
  };

  const logout = async () => {
    try {
      await auth.logout();
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      window.location.href = '/';
    }
  };

  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
