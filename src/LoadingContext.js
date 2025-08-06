import React, { createContext, useContext, useState } from 'react';

const LoadingContext = createContext();

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading...');

  const startLoading = (message = 'Loading...') => {
    setLoadingMessage(message);
    setIsLoading(true);
  };

  const stopLoading = () => {
    setIsLoading(false);
    setLoadingMessage('Loading...');
  };

  return (
    <LoadingContext.Provider value={{ 
      isLoading, 
      loadingMessage, 
      startLoading, 
      stopLoading 
    }}>
      {children}
    </LoadingContext.Provider>
  );
}; 