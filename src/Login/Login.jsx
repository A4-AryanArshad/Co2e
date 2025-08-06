import React, { useState, useEffect } from 'react';
import Header from '../Home/Header';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import "./Login.css";
import Footer2 from '../Home/Footer2';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMsg, setForgotMsg] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [resetPassword, setResetPassword] = useState('');
  const [resetMsg, setResetMsg] = useState('');
  const location = useLocation();

  // Check for reset token in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) setResetToken(token);
  }, [location.search]);

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
    setError('');
    setSuccess('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    // Use direct fetch for login to avoid iPhone Safari interference
    const makeLoginRequest = async (url, data) => {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
      
      return response.json();
    };

    // First, check if instructor
    try {
      const instructorRes = await makeLoginRequest('https://e-back-bice.vercel.app/api/instructor-login', formData);
      if (instructorRes && instructorRes.isInstructor) {
        setSuccess('Instructor login successful!');
        localStorage.setItem('isInstructor', 'true');
        localStorage.setItem('isLoggedIn', 'true');

        localStorage.setItem('instructorEmail', formData.email); // Save instructor email
        localStorage.setItem('userEmail', formData.email); // Save user email for booking
        localStorage.setItem('userId', instructorRes.instructorId); // Store instructorId as userId for slot page
        
        // Store fallback token for iPhone Safari
        if (instructorRes.token) {
          localStorage.setItem('fallbackToken', instructorRes.token);
        }

        localStorage.setItem('instructorEmail', formData.email);
        localStorage.setItem('userEmail', formData.email);
        localStorage.setItem('userId', instructorRes.instructorId);

        setTimeout(() => navigate('/slots'), 1500);
        return;
      }
    } catch (err) {
      // Not an instructor, continue to user/admin login
    }

    try {
      const data = await makeLoginRequest('https://e-back-bice.vercel.app/api/login', formData);

      localStorage.setItem('userId', data.userId); // Store userId for booking

      localStorage.setItem('userId', data.userId);

      const normalizedPackage = (data.package || "free").toLowerCase().replace(" plan", "").trim();
      localStorage.setItem("package", normalizedPackage);
      
      // Store fallback token for iPhone Safari
      if (data.token) {
        localStorage.setItem('fallbackToken', data.token);
      }

      if (formData.email === "admin1234@gmail.com" && formData.password === "admin1234") {
        setSuccess("Admin login successful!");
        localStorage.setItem("isAdmin", "true");
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem('userEmail', formData.email);
        setTimeout(() => navigate('/Articles'), 1500);
      } else {
        localStorage.setItem("isAdmin", "false");
        localStorage.setItem("isLoggedIn", "true");
        setSuccess('Login successful!');
        localStorage.setItem('userEmail', formData.email);
        setTimeout(() => navigate('/'), 1500);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error logging in.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setShowForgotModal(true);
    setForgotMsg('');
  };
const handleForgotSubmit = async (e) => {
  e.preventDefault();
  setForgotMsg('');
  try {
    const res = await fetch('https://e-back-bice.vercel.app/api/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: forgotEmail,
        language: localStorage.getItem('i18nextLng') || 'en'
      })
    });
    const data = await res.json();
    setForgotMsg(data.message || 'Check your email for a reset link.');
  } catch (err) {
    setForgotMsg('Error sending reset email.');
  }
};
const handleResetSubmit = async (e) => {
  e.preventDefault();
  setResetMsg('');
  try {
    const res = await fetch('https://e-back-bice.vercel.app/api/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: resetToken, newPassword: resetPassword })
    });
    const data = await res.json();
    if (res.ok) {
      setResetMsg('Password reset successfully! Redirecting to login...');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } else {
      setResetMsg(data.message || 'Error resetting password.');
    }
  } catch (err) {
    setResetMsg('Error resetting password.');
  }
};

  return (
    <>
      <div id="upperheader">
        <Header />
        <div id="uuy">
          {resetToken ? (
            <form id="form" onSubmit={handleResetSubmit}>
              <h2>{t("login.reset_password_title")}</h2>
              <p style={{ color: '#666', marginBottom: 20, textAlign: 'center' }}>
                {t("login.reset_password_message")}
              </p>
              <div id="ineerf">
                <span>{t("login.new_password")}:</span>
                <input
                  type="password"
                  placeholder={t("login.new_password")}
                  value={resetPassword}
                  onChange={e => setResetPassword(e.target.value)}
                  required
                  minLength="6"
                  autoComplete="off"
                />
              </div>
              <button type="submit" style={{ width: '100%' }}>{t("login.reset_password")}</button>
              {resetMsg && (
                <div style={{ 
                  color: resetMsg.includes('successfully') ? 'green' : 'red', 
                  marginTop: 10, 
                  textAlign: 'center',
                  padding: '10px',
                  borderRadius: '5px',
                  backgroundColor: resetMsg.includes('successfully') ? '#e8f5e8' : '#ffe6e6'
                }}>
                  {resetMsg}
                </div>
              )}
            </form>
          ) : (
            <>
              <form id="form" onSubmit={handleLogin}>
                <h2>{t("login.title")}</h2>
                {error && <div style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>{error}</div>}
                {success && <div style={{ color: 'green', marginBottom: '10px', textAlign: 'center' }}>{success}</div>}
                <div id="ineerf">
                  <span>{t("login.email")} :</span>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required autoComplete="new-password" data-lpignore="true" data-form-type="other" />
                </div>
                <div id="ineerf">
                  <span>{t("login.password")} :</span>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} required autoComplete="new-password" data-lpignore="true" data-form-type="other" />
                </div>
                                <button type="submit" disabled={isLoading}>
                  {isLoading ? 'Logging in...' : t("login.submit")}
                </button>
                <div style={{ textAlign: 'center', marginTop: 24 }}>
                <button type="button" onClick={handleForgotPassword} style={{ background: 'none', border: 'none', color: 'white', fontSize: 16, cursor: 'pointer', marginBottom: 8, textDecoration: 'underline' }}>
                  {t('login.forgot_password')}
                </button>
              </div>
              <div style={{ textAlign: 'center', marginTop: 16 }}>
                <span style={{ color: 'white', fontSize: 16 }}>
                  {t('login.not_member')} {' '}
                  <Link to="/signup" style={{ color: 'white', textDecoration: 'underline', fontWeight: 500 }}>
                    {t('login.sign_up_now')}
                  </Link>
                </span>
              </div>
              </form>
            
           
              
              {showForgotModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ background: '#fff', borderRadius: 8, padding: 32, minWidth: 320, boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}>
                    <h3 style={{ marginBottom: 16 }}>{t('login.forgot_password_title')}</h3>
                    <p style={{ color: '#666', marginBottom: 16, fontSize: 14 }}>{t('login.forgot_password_message')}</p>
                    <form onSubmit={handleForgotSubmit}>
                      <input
                        type="email"
                        placeholder={t('login.email')}
                        value={forgotEmail}
                        onChange={e => setForgotEmail(e.target.value)}
                        required
                        autoComplete="new-password"
                        data-lpignore="true"
                        data-form-type="other"
                        style={{ marginBottom: 16, width: '100%', padding: 10 }}
                      />
                      <button type="submit" style={{ width: '100%' }}>{t('login.submit')}</button>
                    </form>
                    {forgotMsg && <div style={{ color: forgotMsg.includes('sent') ? 'green' : 'red', marginTop: 10, textAlign: 'center' }}>{forgotMsg}</div>}
                    <button onClick={() => setShowForgotModal(false)} style={{ marginTop: 16, background: 'none', border: 'none', color: '#2196f3', cursor: 'pointer' }}>Close</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer2 />
    </>
  );
};

export default Login;
