import React, { useState, useRef, useEffect } from 'react';
import Header from './Home/Header';
import Footer2 from './Home/Footer2';
import { API_BASE } from './config';

const AdminFeaturedListing = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [listings, setListings] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });
  const imageInputRef = useRef();

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    const res = await fetch(`${API_BASE}/api/featured-listings`);
    const data = await res.json();
    setListings(data);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      showMessage('Please select an image.', 'error');
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append('image', image);
    try {
      const res = await fetch(`${API_BASE}/api/featured-listings`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      setImage(null);
      setPreview(null);
      imageInputRef.current.value = '';
      fetchListings();
      showMessage('Image uploaded!');
    } catch (err) {
      showMessage('Upload failed: ' + err.message, 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/featured-listings/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      fetchListings();
      showMessage('Image deleted!');
    } catch (err) {
      showMessage('Delete failed: ' + err.message, 'error');
    }
  };

  return (
    <>
      <Header />
      <div style={{ maxWidth: 700, margin: '340px auto', background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: 32 }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Admin: Featured Listing Images</h2>
        
        {/* Message Display */}
        {message.text && (
          <div style={{
            textAlign: 'center',
            marginBottom: '20px',
            padding: '12px 20px',
            borderRadius: '8px',
            fontWeight: '500',
            backgroundColor: message.type === 'error' ? '#fee' : '#efe',
            color: message.type === 'error' ? '#c33' : '#363',
            border: `1px solid ${message.type === 'error' ? '#fcc' : '#cfc'}`
          }}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <label style={{ fontWeight: 500 }}>Upload Image</label>
          <input type="file" accept="image/*" ref={imageInputRef} onChange={handleImageChange} required style={{ padding: 10, borderRadius: 8, border: '1px solid #ccc' }} />
          {preview && <img src={preview} alt="Preview" style={{ maxWidth: 300, margin: '10px auto', display: 'block', borderRadius: 12 }} />}
          <button type="submit" disabled={uploading} style={{ background: '#90be55', color: 'white', border: 'none', borderRadius: 8, padding: 14, fontWeight: 600, fontSize: 18, marginTop: 10 }}>
            {uploading ? 'Uploading...' : 'Upload Image'}
          </button>
        </form>
        <hr style={{ margin: '32px 0' }} />
        <h3 style={{ textAlign: 'center', marginBottom: 16 }}>All Featured Images</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center' }}>
          {listings.length === 0 && <div style={{ textAlign: 'center', color: '#888' }}>No images uploaded yet.</div>}
          {listings.map(listing => (
            <div key={listing._id} style={{ border: '1px solid #eee', borderRadius: 10, padding: 12, position: 'relative', background: '#fafafa' }}>
              <img src={listing.imageUrl} alt="Featured" style={{ width: 220, height: 120, objectFit: 'contain', borderRadius: 8, background: '#fff' }} />
              <button onClick={() => handleDelete(listing._id)} style={{ position: 'absolute', top: 8, right: 8, background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer', fontWeight: 600 }}>Delete</button>
            </div>
          ))}
        </div>
      </div>
      <Footer2 />
    </>
  );
};

export default AdminFeaturedListing; 