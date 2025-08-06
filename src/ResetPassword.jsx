import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from './Home/Header';
import Footer2 from './Home/Footer2';
import './ResetPassword.css';

const ResetPassword = () => {
  const { t } = useTranslation();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Get token from URL parameters
    const params = new URLSearchParams(location.search);
    const urlToken = params.get('token');
    if (urlToken) {
      setToken(urlToken);
    } else {
      setMessage(t('login.invalid_reset_link'));
    }
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);

    // Validate passwords
    if (newPassword.length < 6) {
      setMessage('Password must be at least 6 characters long.');
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('https://e-back-bice.vercel.app/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,
          newPassword: newPassword
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(t('login.password_reset_success'));
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setMessage(data.message || t('login.password_reset_error'));
      }
    } catch (error) {
      setMessage(t('login.password_reset_error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="reset-password-container">
        <div className="reset-password-card">
          <h1>{t("login.reset_password_title")}</h1>
          
          {!token ? (
            <div className="error-message">
              <p>{message}</p>
                             <button 
                 onClick={() => navigate('/login')}
                 className="back-to-login-btn"
               >
                 {t('login.back_to_login')}
               </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="reset-form">
                           <div className="form-group">
               <label htmlFor="newPassword">{t("login.new_password")}</label>
               <input
                 type="password"
                 id="newPassword"
                 value={newPassword}
                 onChange={(e) => setNewPassword(e.target.value)}
                 placeholder={t("login.new_password")}
                 required
                 minLength="6"
                 autoComplete="new-password"
                 data-lpignore="true"
                 data-form-type="other"
               />
             </div>

             <div className="form-group">
               <label htmlFor="confirmPassword">{t("login.confirm_password")}</label>
               <input
                 type="password"
                 id="confirmPassword"
                 value={confirmPassword}
                 onChange={(e) => setConfirmPassword(e.target.value)}
                 placeholder={t("login.confirm_password")}
                 required
                 minLength="6"
                 autoComplete="new-password"
                 data-lpignore="true"
                 data-form-type="other"
               />
             </div>

              {message && (
                <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
                  {message}
                </div>
              )}

                             <button 
                 type="submit" 
                 className="reset-btn"
                 disabled={isLoading}
               >
                 {isLoading ? t('login.resetting_password') : t('login.reset_password')}
               </button>
            </form>
          )}
        </div>
      </div>
      <Footer2 />
    </>
  );
};

export default ResetPassword; 