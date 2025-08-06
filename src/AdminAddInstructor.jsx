import React, { useState, useEffect } from 'react';
import Header2 from './Home/Header2';
import { API_BASE_URL } from './config';
import axios from 'axios';

const AdminAddInstructor = () => {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [instructors, setInstructors] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchInstructors = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/instructors`);
      setInstructors(res.data);
    } catch (err) {
      setError('Failed to fetch instructors');
    }
  };

  useEffect(() => {
    fetchInstructors();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await axios.post(`${API_BASE_URL}/api/instructors/add`, form);
      setMessage('Instructor added successfully!');
      setForm({ firstName: '', lastName: '', email: '', password: '' });
      fetchInstructors();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add instructor');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this instructor?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/instructors/${id}`);
      setMessage('Instructor deleted successfully!');
      fetchInstructors();
    } catch (err) {
      setError('Failed to delete instructor');
    }
  };

  return (
    <div>
      <Header2 />
      <div id="TTw"style={{ maxWidth: 500, margin: '10rem auto', padding: 20, background: '#fff', borderRadius: 8,boxShadow: '0 2px 8px #eee' }}>
        <h2>Add Instructor</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 10 }}>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={form.firstName}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: 8, marginBottom: 8 }}
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={form.lastName}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: 8, marginBottom: 8 }}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: 8, marginBottom: 8 }}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: 8, marginBottom: 8 }}
            />
          </div>
          <button  id="insb" type="submit" disabled={loading} style={{ width: '100%', padding: 10, background: '#007bff', color: '#fff', border: 'none', borderRadius: 4 }}>
            {loading ? 'Adding...' : 'Add Instructor'}
          </button>
        </form>
        {message && <div style={{ color: 'green', marginTop: 10 }}>{message}</div>}
        {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
      </div>
      <div style={{ maxWidth: 700, margin: '2rem auto', padding: 20, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee' }}>
        <h3>Instructors List</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              <th style={{ padding: 8, border: '1px solid #ddd' }}>Name</th>
              <th style={{ padding: 8, border: '1px solid #ddd' }}>Email</th>
              <th style={{ padding: 8, border: '1px solid #ddd' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {instructors.map((inst) => (
              <tr key={inst._id}>
                <td style={{ padding: 8, border: '1px solid #ddd' }}>{inst.firstName} {inst.lastName}</td>
                <td style={{ padding: 8, border: '1px solid #ddd' }}>{inst.email}</td>
                <td style={{ padding: 8, border: '1px solid #ddd' }}>
                  <button onClick={() => handleDelete(inst._id)} style={{ background: '#dc3545', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 12px' }}>Delete</button>
                </td>
              </tr>
            ))}
            {instructors.length === 0 && (
              <tr><td colSpan={3} style={{ textAlign: 'center', padding: 20 }}>No instructors found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAddInstructor; 