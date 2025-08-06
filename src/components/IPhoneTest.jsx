import React, { useState, useEffect } from 'react';
import { isIPhoneSafari, getAuthHeaders } from '../utils/iphoneFix';
import { API_BASE } from '../config';

const IPhoneTest = () => {
  const [testResults, setTestResults] = useState({});
  const [isIPhone, setIsIPhone] = useState(false);

  useEffect(() => {
    const iPhone = isIPhoneSafari();
    setIsIPhone(iPhone);
    
    const results = {
      userAgent: navigator.userAgent,
      isIPhoneSafari: iPhone,
      localStorage: typeof localStorage !== 'undefined',
      cookies: document.cookie,
      fallbackToken: localStorage.getItem('fallbackToken'),
      authHeaders: getAuthHeaders(),
    };
    
    setTestResults(results);
  }, []);

  const testAPI = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/directory`, {
        credentials: 'include',
        headers: getAuthHeaders(),
      });
      
      const data = await response.json();
      setTestResults(prev => ({
        ...prev,
        apiTest: {
          success: true,
          status: response.status,
          data: data.length || 'No data'
        }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        apiTest: {
          success: false,
          error: error.message
        }
      }));
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>iPhone Safari Test Page</h2>
      
      <div style={{ 
        background: isIPhone ? '#e8f5e8' : '#fff3cd', 
        padding: '15px', 
        borderRadius: '5px', 
        marginBottom: '20px' 
      }}>
        <strong>Device Detection:</strong> {isIPhone ? 'iPhone Safari Detected' : 'Not iPhone Safari'}
      </div>

      <button 
        onClick={testAPI}
        style={{
          background: '#007bff',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        Test Directory API
      </button>

      <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '5px' }}>
        <h3>Test Results:</h3>
        <pre style={{ whiteSpace: 'pre-wrap', fontSize: '12px' }}>
          {JSON.stringify(testResults, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default IPhoneTest; 