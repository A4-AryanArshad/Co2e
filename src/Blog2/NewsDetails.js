import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import Header from '../Home/Header';
import Footer from '../Home/Footer';
import Footer2 from '../Home/Footer2';
import { API_BASE_URL } from '../config';

const NewsDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { get } = useApi();

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError(null);
      // Get the selected language from localStorage
      const selectedLanguage = localStorage.getItem('selectedLanguage') || 'en';
      const data = await get(`${API_BASE_URL}/api/news/${id}?lang=${selectedLanguage}`, 'Loading news...');
      setPost(data);
    } catch (err) {
      setError("Failed to load post");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
    // Listen for language changes
    const handleLanguageChange = () => {
      fetchPost();
    };
    window.addEventListener('storage', handleLanguageChange);
    window.addEventListener('languageChanged', handleLanguageChange);
    return () => {
      window.removeEventListener('storage', handleLanguageChange);
      window.removeEventListener('languageChanged', handleLanguageChange);
    };
  }, [id]);

  if (loading) return <div style={{ padding: "2rem", textAlign: "center" }}>Loading...</div>;
  if (error) return <div style={{ padding: "2rem", textAlign: "center", color: "red" }}>{error}</div>;
  if (!post) return <div style={{ padding: "2rem", textAlign: "center" }}>Post not found</div>;

  return (
    <>
      <Header />
      <div id="paddernews" className="container" style={{ padding: "2rem" }}>
        <h2>{post.title || 'Untitled'}</h2>
        {post.imageUrl && (
          <img 
            src={post.imageUrl} 
            alt={post.title || 'News image'} 
            style={{ width: "100%", maxHeight: "400px", objectFit: "cover" }} 
          />
        )}
        <p style={{ marginTop: "1rem" }}>{post.description || 'No description available'}</p>
      </div>
      <Footer2 />
    </>
  );
};

export default NewsDetails;
