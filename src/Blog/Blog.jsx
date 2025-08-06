import React, { useState, useEffect } from 'react';
import Header from '../Home/Header';
import "./Blog.css";
import Footer from '../Home/Footer';
import { API_BASE } from '../config';

const BlogPage = () => {
  const blogData = [
    {
      id: 1,
      title: "What is React?",
      content:
        "React is a JavaScript library for building user interfaces. It makes it painless to create interactive UIs."
    },
    {
      id: 2,
      title: "Why use React?",
      content:
        "React allows developers to build large web applications that can update and render efficiently in response to data changes."
    },
    {
      id: 3,
      title: "React vs Angular",
      content:
        "React is a library focused on UI, while Angular is a full-fledged framework. React is more flexible and easier to learn."
    }
  ];

  const [expandedId, setExpandedId] = useState(null);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const toggleBlog = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

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
    <div id="cover">
    <div id="totalr3">
    <div id="ttq">
    <Header/>
    </div>

    <div id="rrew" className="p-6 max-w-3xl mx-auto">
      <h1 id="bloger" className="text-3xl font-bold mb-6 text-center">News</h1>
      {blogData.map((blog) => (
        <div id="uut" key={blog.id} className="mb-4 border rounded shadow-sm">
          <button
            className="w-full text-left px-4 py-3 bg-gray-100 hover:bg-gray-200 font-semibold"
            id="texw" onClick={() => toggleBlog(blog.id)}
          >
            {blog.title}
          </button>
          {expandedId === blog.id && (
            <div className="p-4 text-gray-700 bg-white border-t">
              {blog.content}
            </div>
          )}
        </div>
      ))}
      {/* Newsletter subscription field */}
      <div style={{ margin: '40px 0', padding: 24, background: '#f9f9f9', borderRadius: 12, maxWidth: 400, marginLeft: 'auto', marginRight: 'auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 12 }}>Stay Updated! Subscribe to Our Newsletter</h2>
        {message && (
          <div style={{ color: message.includes('success') ? 'green' : 'red', margin: '8px 0', textAlign: 'center', fontWeight: 500 }}>
            {message}
          </div>
        )}
        <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input
            type="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={submitting}
            style={{ padding: 10, borderRadius: 6, border: '1px solid #ccc' }}
          />
          <button type="submit" disabled={submitting} style={{ background: '#90be55', color: 'white', border: 'none', borderRadius: 6, padding: '10px 0', fontWeight: 600 }}>
            {submitting ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
      </div>
    </div>

    </div>
    <div id="Blogs">
      
    </div>
  <Footer/>
  </div>
    </>
  );
};

export default BlogPage;
