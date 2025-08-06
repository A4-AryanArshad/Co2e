import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Footer2 from '../Home/Footer2';
import { useTranslation } from 'react-i18next';
import { API_BASE_URL } from '../config';

const RecentPosts = () => {
  const [blogs, setBlogs] = useState([]);
  const { t, i18n } = useTranslation();

  const fetchBlogs = async () => {
    try {
      const selectedLanguage = localStorage.getItem('selectedLanguage') || 'en';
      const res = await axios.get(`${API_BASE_URL}/api/blogs?lang=${selectedLanguage}`);
      setBlogs(res.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  useEffect(() => {
    fetchBlogs();

    const handleLanguageChange = () => {
      i18n.changeLanguage(localStorage.getItem('selectedLanguage') || 'en');
      fetchBlogs();
    };

    window.addEventListener('storage', handleLanguageChange);
    window.addEventListener('languageChanged', handleLanguageChange);

    return () => {
      window.removeEventListener('storage', handleLanguageChange);
      window.removeEventListener('languageChanged', handleLanguageChange);
    };
  }, []);

  const truncate = (text, wordLimit) => {
    if (!text || typeof text !== 'string') return '';
    const words = text.split(' ');
    return words.slice(0, wordLimit).join(' ');
  };

  return (
    <>
      <section className="section recent" aria-label="recent post">
        <div className="container">
          <div className="title-wrapper">
            <h2 className="h2 section-title">
              {t('recent.seeWhat')} <strong className="strong">{t('recent.blogs')}</strong>
            </h2>

            <div className="top-author">
              <ul className="avatar-list">
                {/* Optional author avatars */}
              </ul>
            </div>
          </div>

          <ul className="grid-list">
            {blogs.map((post, index) => {
              const title = post.title || 'Untitled';
              const shortDescription = truncate(post.description, 6);

              return (
                <li key={index}>
                  <div className="blog-card">
                    <figure
                      className="card-banner img-holder"
                      style={{ "--width": "550", "--height": "660" }}
                    >
                      <img
                        src={post.imageUrl}
                        width="550"
                        height="660"
                        loading="lazy"
                        alt={title}
                        className="img-cover"
                      />
                    </figure>

                    <h1 id="titler">{title}</h1>

                    <div className="card-content">
                      <ul className="card-meta-list">
                        {post.tags && post.tags.map((tag, tagIdx) => (
                          <li key={tagIdx}>
                            <span className="card-tag">{tag}</span>
                          </li>
                        ))}
                      </ul>

                      <p className="card-text">{shortDescription}...</p>

                      <Link to={`/blogs/${post._id}`} className="read-more">
                        {t('recent.readMore')} →
                      </Link>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
      <Footer2 />
    </>
  );
};

export default RecentPosts;
