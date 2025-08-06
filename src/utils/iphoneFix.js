// iPhone Safari Fix Utility
// This file contains utilities to handle iPhone Safari specific issues

export const isIPhoneSafari = () => {
  const userAgent = navigator.userAgent;
  const isIPhone = /iPad|iPhone|iPod/.test(userAgent);
  const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
  return isIPhone && isSafari;
};

export const getAuthHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };

  // For iPhone Safari, use Authorization header as fallback
  if (isIPhoneSafari()) {
    const fallbackToken = localStorage.getItem('fallbackToken');
    if (fallbackToken) {
      headers['Authorization'] = `Bearer ${fallbackToken}`;
    }
  }

  return headers;
};

export const createIPhoneSafeRequest = (url, options = {}) => {
  const isIPhone = isIPhoneSafari();
  
  const requestOptions = {
    credentials: 'include',
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  };

  // For iPhone Safari, add additional headers
  if (isIPhone) {
    requestOptions.headers['Cache-Control'] = 'no-cache';
    requestOptions.headers['Pragma'] = 'no-cache';
  }

  return { url, options: requestOptions };
};

export const handleIPhoneError = (error) => {
  if (isIPhoneSafari()) {
    console.log('iPhone Safari error detected:', error);
    
    // If it's an authentication error, try to refresh the token
    if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
      const fallbackToken = localStorage.getItem('fallbackToken');
      if (fallbackToken) {
        console.log('Attempting to use fallback token for iPhone Safari');
        return true; // Indicate that we should retry with fallback
      }
    }
  }
  return false;
};

export const setupIPhoneDetection = () => {
  if (isIPhoneSafari()) {
    console.log('iPhone Safari detected - applying special handling');
    
    // Add meta tag for viewport if not present
    if (!document.querySelector('meta[name="viewport"]')) {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
      document.head.appendChild(meta);
    }
    
    // Only apply input fixes if not on login page
    const isLoginPage = window.location.pathname === '/login';
    if (!isLoginPage) {
      // Disable zoom on input focus for iPhone
      const inputs = document.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        input.addEventListener('focus', () => {
          input.style.fontSize = '16px'; // Prevents zoom on iPhone
        });
      });
    }
  }
}; 