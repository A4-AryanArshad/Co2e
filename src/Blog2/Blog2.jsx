import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './assets/css/style.css';
import RecentPosts from './RecentPosts';
import Header from '../Home/Header';
import Footer from '../Home/Footer';
import { useTranslation } from 'react-i18next';
import { API_BASE } from '../config';

const Blog2 = () => {
  const [posts, setPosts] = useState([]);
  const { t, i18n } = useTranslation();

  // Newsletter state
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    if (subscribed) {
      const timer = setTimeout(() => setSubscribed(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [subscribed]);

  // Fetch news based on selected language
  const fetchNews = async () => {
    try {
      const selectedLanguage = localStorage.getItem('selectedLanguage') || 'en';
      const res = await axios.get(`${API_BASE}/api/news?lang=${selectedLanguage}`);
      setPosts(res.data);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  useEffect(() => {
    fetchNews();

    const handleLanguageChange = () => {
      i18n.changeLanguage(localStorage.getItem('selectedLanguage') || 'en');
      fetchNews();
    };

    window.addEventListener('storage', handleLanguageChange);
    window.addEventListener('languageChanged', handleLanguageChange);

    return () => {
      window.removeEventListener('storage', handleLanguageChange);
      window.removeEventListener('languageChanged', handleLanguageChange);
    };
  }, []);

  // Truncate description
  const truncate = (text, wordLimit) => {
    if (!text || typeof text !== 'string') return { text: '', isTruncated: false };
    const words = text.split(' ');
    const isTruncated = words.length > wordLimit;
    return { text: words.slice(0, wordLimit).join(' '), isTruncated };
  };

  // Newsletter subscribe handler
  const handleSubscribe = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/newsletter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSubscribed(true);
        setEmail('');
      } else {
        const data = await res.json();
        // Optionally handle error (do nothing for now)
      }
    } catch (err) {
      // Optionally handle error (do nothing for now)
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />

      {/* Subscribe Section */}
      <div id="wwq">
        <div className="subscribe-container">
          <form onSubmit={handleSubscribe} className="subscribe-form">
            {subscribed && (
              <div style={{ color: 'green', marginBottom: 8, textAlign: 'center', fontWeight: 500 }}>
                Subscribed!
              </div>
            )}
            <input
              type="email"
              placeholder={t('footer.subscribe_placeholder')}
              required
              className="subscribe-input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={submitting}
            />
            <button type="submit" className="subscribe-button" disabled={submitting || subscribed}>
              {subscribed ? 'Subscribed' : submitting ? 'Subscribing...' : t('footer.subscribe_button')}
            </button>
          </form>
        </div>
      </div>

      {/* News Section */}
      <section id="tttt" className="section featured" aria-label="featured post">
        <div className="container">
          <h2 className="h2 section-title">
            {t('blog.start')} <strong className="strong">{t('blog.news')}</strong>
          </h2>

          <ul className="has-scrollbar">
            {posts.map((post, index) => {
              const { title = 'Untitled', description = '', imageUrl, tags = [], _id } = post;
              const { text, isTruncated } = truncate(description, 6);

              return (
                <li key={index} className="scrollbar-item">
                  <div className="blog-card">
                    <figure className="card-banner img-holder">
                      <img
                        src={imageUrl}
                        alt={title}
                        className="img-cover"
                        loading="lazy"
                      />
                    </figure>

                    <h1 id="titler">{title}</h1>

                    <div id="tagger" className="card-content">
                      <ul className="card-meta-list">
                        {tags.map((tag, i) => (
                          <li key={i}><span className="card-tag">{tag}</span></li>
                        ))}
                      </ul>

                      <p className="card-text">
                        {text}{isTruncated && '...'}
                      </p>

                      <Link to={`/news/${_id}`} className="read-more">
                        {t('blog.readMore')} →
                      </Link>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <RecentPosts />
      <Footer />
    </>
  );
};

export default Blog2;
