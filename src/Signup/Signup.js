import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Header from '../Home/Header';
import Footer2 from '../Home/Footer2';
import { useApi } from '../hooks/useApi';
import '../Login/Login.css';

const Signup = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { post } = useApi();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const data = await post('https://e-back-bice.vercel.app/api/signup', formData, 'Signing up...');
      setSuccess('Signup successful!');
      localStorage.setItem('userEmail', formData.email); // Save user email for booking
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.message || 'Signup failed!');
    }
  };

  return (
    <>
      <div id="upperheader">
        <Header />

        <div id="uuy">
          <form id="form" onSubmit={handleSubmit} autoComplete="off">
            <h2>{t("signup.title")}</h2>
            {error && <div style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>{error}</div>}
            {success && <div style={{ color: 'green', marginBottom: '10px', textAlign: 'center' }}>{success}</div>}
            <div id="ineerf">
              <span>{t("signup.first_name")} :</span>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required autoComplete="off" />
            </div>

            <div id="ineerf">
              <span>{t("signup.last_name")} :</span>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required autoComplete="off" />
            </div>

            <div id="ineerf">
              <span>{t("signup.email")} :</span>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required autoComplete="off" />
            </div>

            <div id="ineerf">
              <span>{t("signup.password")} :</span>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required autoComplete="off" />
            </div>

            <button type="submit">{t("signup.submit")}</button>
            <div style={{ textAlign: 'center', marginTop: 32 }}>
            <span style={{ color: 'white', fontSize: 16 }}>
              {t('signup.already_have_account')} {' '}
              <Link to="/login" style={{ color: 'white', textDecoration: 'underline', fontWeight: 500 }}>
                {t('signup.log_in_now')}
              </Link>
            </span>
          </div>
          </form>
       
        </div>
      </div>
      <Footer2 />
    </>
  );
};

export default Signup;
