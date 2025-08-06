import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import Header from '../Home/Header';
import Footer2 from '../Home/Footer2';
import { API_BASE_URL } from '../config';

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { get } = useApi();

  const fetchBlog = async () => {
    try {
      setLoading(true);
      setError(null);
      // Get the selected language from localStorage
      const selectedLanguage = localStorage.getItem('selectedLanguage') || 'en';
      const data = await get(`${API_BASE_URL}/api/blogs/fblogs/${id}?lang=${selectedLanguage}`, 'Loading blog...');
      setBlog(data);
    } catch (err) {
      setError("Failed to load blog");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();
    // Listen for language changes
    const handleLanguageChange = () => {
      fetchBlog();
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
  if (!blog) return <div style={{ padding: "2rem", textAlign: "center" }}>Blog not found</div>;

  return (
    <>
   <Header/>
      <div id="paddernews" className="container" style={{ padding: "2rem" }}>
        <h2>{blog.title || 'Untitled'}</h2>
        {blog.imageUrl && (
          <img
            src={blog.imageUrl}
            alt={blog.title || 'Blog image'}
            style={{ width: "100%", maxHeight: "400px", objectFit: "cover", marginBottom: "1rem" }}
          />
        )}
        <p>{blog.description || 'No description available'}</p>
      </div>
      <Footer2 />
    </>
  );
};

export default BlogDetails;
