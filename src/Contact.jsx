import React, { useState } from 'react';
import Header from './Home/Header';
import Footer2 from './Home/Footer2';
import { API_BASE } from './config';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSuccess('Your message has been sent!');
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setError('Failed to send message. Please try again.');
      }
    } catch {
      setError('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <div style={{margin:"170px", background: '#f7fafc', minHeight: '100vh', padding: '120px 0 60px 0' }}>
        <div style={{ maxWidth: 500, margin: '0 auto', background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: 32 }}>
          <h1 style={{ textAlign: 'center', fontSize: 32, fontWeight: 700, marginBottom: 24, color: '#222' }}>Contact Us</h1>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: 32 }}>We'd love to hear from you! Fill out the form below and we'll get back to you as soon as possible.</p>
          {success && <div style={{ color: 'green', marginBottom: 16, textAlign: 'center', fontWeight: 500 }}>{success}</div>}
          {error && <div style={{ color: 'red', marginBottom: 16, textAlign: 'center', fontWeight: 500 }}>{error}</div>}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              required
              style={{ padding: 14, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }}
              disabled={submitting}
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              required
              style={{ padding: 14, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }}
              disabled={submitting}
            />
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={form.subject}
              onChange={handleChange}
              required
              style={{ padding: 14, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }}
              disabled={submitting}
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={form.message}
              onChange={handleChange}
              required
              rows={6}
              style={{ padding: 14, borderRadius: 8, border: '1px solid #ccc', fontSize: 16, resize: 'vertical' }}
              disabled={submitting}
            />
            <button
              type="submit"
              style={{ background: '#90be55', color: 'white', border: 'none', borderRadius: 8, padding: 16, fontWeight: 600, fontSize: 18, cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1 }}
              disabled={submitting}
            >
              {submitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
      <Footer2 />
    </>
  );
};

export default Contact; 