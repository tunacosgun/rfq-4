// src/context/AdminAuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AdminAuthContext = createContext();

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedAuth = localStorage.getItem('adminAuth');
    if (savedAuth) {
      const auth = JSON.parse(savedAuth);
      setAdmin(auth);
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      await axios.post(`${API}/admin/login`, {
        username,
        password,
      });
      const auth = { username, password };
      setAdmin(auth);
      localStorage.setItem('adminAuth', JSON.stringify(auth));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || 'Giriş başarısız',
      };
    }
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('adminAuth');
  };

  const getAuthHeader = () => {
    if (!admin) return {};
    const token = btoa(`${admin.username}:${admin.password}`);
    return {
      Authorization: `Basic ${token}`,
    };
  };

  // 🔴 Yeni: Admin şifre değiştirme yardımcı fonksiyonu
  const changePassword = async (currentPassword, newPassword) => {
    if (!admin) {
      return { success: false, error: 'Önce giriş yapmanız gerekiyor' };
    }

    try {
      const res = await axios.post(
        `${API}/admin/change-password`,
        {
          current_password: currentPassword,
          new_password: newPassword,
        },
        {
          headers: getAuthHeader(),
        }
      );

      // Backend şifreyi başarıyla güncellediyse, context’teki şifreyi de güncelle
      const updated = { ...admin, password: newPassword };
      setAdmin(updated);
      localStorage.setItem('adminAuth', JSON.stringify(updated));

      return { success: true, message: res.data?.message || 'Şifre güncellendi' };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.detail ||
          error.response?.data?.message ||
          'Şifre güncellenemedi',
      };
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        loading,
        login,
        logout,
        getAuthHeader,
        changePassword,   // 🔴 Burada export ediyoruz
        isAuthenticated: !!admin,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};