import React, { createContext, useContext, useState, useEffect } from 'react';

const CustomerAuthContext = createContext();

export const useCustomerAuth = () => {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error('useCustomerAuth must be used within CustomerAuthProvider');
  }
  return context;
};

export const CustomerAuthProvider = ({ children }) => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage on mount
    const storedCustomer = localStorage.getItem('customer');
    if (storedCustomer) {
      try {
        setCustomer(JSON.parse(storedCustomer));
      } catch (error) {
        localStorage.removeItem('customer');
      }
    }
    setLoading(false);
  }, []);

  const login = (customerData) => {
    setCustomer(customerData);
    localStorage.setItem('customer', JSON.stringify(customerData));
  };

  const logout = () => {
    setCustomer(null);
    localStorage.removeItem('customer');
  };

  const updateCustomer = (updatedData) => {
    const updatedCustomer = { ...customer, ...updatedData };
    setCustomer(updatedCustomer);
    localStorage.setItem('customer', JSON.stringify(updatedCustomer));
  };

  const isAuthenticated = !!customer;

  return (
    <CustomerAuthContext.Provider
      value={{
        customer,
        login,
        logout,
        updateCustomer,
        isAuthenticated,
        loading,
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
};
