import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    // Load user data from sessionStorage on mount
    const storedUser = sessionStorage.getItem('userData');
    if (storedUser) {
      setUserProfile(JSON.parse(storedUser));
    }
  }, []);

  const updateUserProfile = (userData) => {
    setUserProfile(userData);
    sessionStorage.setItem('userData', JSON.stringify(userData));
  };

  const clearUserProfile = () => {
    setUserProfile(null);
    sessionStorage.removeItem('userData');
  };

  return (
    <UserContext.Provider value={{ 
      userProfile, 
      updateUserProfile, 
      clearUserProfile 
    }}>
      {children}
    </UserContext.Provider>
  );
};