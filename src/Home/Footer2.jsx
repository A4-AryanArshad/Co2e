import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import "./Footer2.css";
import { AiOutlineTwitter, AiFillYoutube, AiFillFacebook, AiFillInstagram } from "react-icons/ai";
import { API_BASE } from '../config';

const Footer2 = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setMessage('');
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/newsletter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setMessage('Subscribed successfully!');
        setEmail('');
      } else {
        const data = await res.json();
        setMessage(data.error || 'Subscription failed.');
      }
    } catch (err) {
      setMessage('Subscription failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div id="Footer2">
        <div id="sii">
          <AiOutlineTwitter id="si" />
          <AiFillYoutube id="si" />
          <AiFillFacebook id="si" />
          <AiFillInstagram id="si" />
        </div>

        <h1>{t("footer.subscribe_heading")}</h1>
        {message && (
          <div style={{ color: message.includes('success') ? 'green' : 'red', margin: '8px 0', textAlign: 'center', fontWeight: 500 }}>
            {message}
          </div>
        )}
        <div id="f2b" className="subscribe-container">
          <form onSubmit={handleSubscribe} className="subscribe-form">
            <input
              type="email"
              placeholder={t("footer.subscribe_placeholder")}
              required
              className="subscribe-input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={submitting}
            />
            <button type="submit" className="subscribe-button" disabled={submitting}>
              {submitting ? 'Subscribing...' : t("footer.subscribe_button")}
            </button>
          </form>
        </div>

        <h1>{t("footer.portal_name")}</h1>
        <h2>{t("footer.copyright")}</h2>

        <section className="insta-post">
         
        </section>
      </div>
    </>
  );
};

export default Footer2;
