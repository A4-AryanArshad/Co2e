import React, { useState, useRef, useEffect } from 'react';
import Header from './Home/Header';
import Footer2 from './Home/Footer2';
import { API_BASE } from './config';

const AdminCourseUpload = () => {
  const [title, setTitle] = useState('');
  const [videos, setVideos] = useState([]);
  const [driveLinks, setDriveLinks] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [durationWeeks, setDurationWeeks] = useState('');
  const videoInputRef = useRef();

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const res = await fetch(`${API_BASE}/api/courses`);
    const data = await res.json();
    setCourses(data);
  };

  const handleVideoChange = (e) => {
    const files = [...e.target.files];
    setVideos(files);
    setDriveLinks(Array(files.length).fill(''));
  };

  const handleDriveLinkChange = (idx, value) => {
    setDriveLinks(prev => {
      const arr = [...prev];
      arr[idx] = value;
      return arr;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || videos.length === 0) {
      showMessage('Title and at least one video are required.', 'error');
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append('title', title);
    videos.forEach((file) => formData.append('videos', file));
    driveLinks.forEach((link) => formData.append('driveLinks', link));
    formData.append('durationWeeks', durationWeeks);
    try {
      const res = await fetch(`${API_BASE}/api/courses/upload`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      setTitle('');
      setVideos([]);
      setDriveLinks([]);
      videoInputRef.current.value = '';
      fetchCourses();
      showMessage('Course uploaded!');
    } catch (err) {
      showMessage('Upload failed: ' + err.message, 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/courses/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      fetchCourses();
      showMessage('Course deleted!');
    } catch (err) {
      showMessage('Delete failed: ' + err.message, 'error');
    }
  };

  return (
    <>
      <Header />
      <div style={{ maxWidth: 700, margin: '340px auto', background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: 32 }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Admin: Upload Course Videos & Drive Links</h2>
        
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
          <label style={{ fontWeight: 500 }}>Course Title</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} required style={{ padding: 10, borderRadius: 8, border: '1px solid #ccc' }} />
          <label style={{ fontWeight: 500 }}>Course Videos (multiple allowed)</label>
          <input type="file" accept="video/*" multiple ref={videoInputRef} onChange={handleVideoChange} required style={{ padding: 10, borderRadius: 8, border: '1px solid #ccc' }} />
          {videos.length > 0 && (
            <div style={{ marginTop: 10 }}>
              <b>Drive Link for each video (optional):</b>
              {videos.map((file, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '8px 0' }}>
                  <span style={{ flex: 1, fontSize: 15 }}>{file.name}</span>
                  <input
                    type="url"
                    placeholder="Google Drive link for slides"
                    value={driveLinks[idx] || ''}
                    onChange={e => handleDriveLinkChange(idx, e.target.value)}
                    style={{ flex: 2, padding: 6, borderRadius: 6, border: '1px solid #ccc' }}
                  />
                </div>
              ))}
            </div>
          )}
          <div style={{ marginBottom: 16 }}>
            <label>Duration (weeks):</label>
            <input type="number" min={1} value={durationWeeks} onChange={e => setDurationWeeks(e.target.value)} placeholder="e.g. 6" style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
          </div>
          <button type="submit" disabled={uploading} style={{ background: '#90be55', color: 'white', border: 'none', borderRadius: 8, padding: 14, fontWeight: 600, fontSize: 18, marginTop: 10 }}>
            {uploading ? 'Uploading...' : 'Upload Course'}
          </button>
        </form>
        <hr style={{ margin: '32px 0' }} />
        <h3 style={{ textAlign: 'center', marginBottom: 16 }}>Uploaded Courses</h3>
        <div style={{ maxHeight: 350, overflowY: 'auto' }}>
          {courses.length === 0 && <div style={{ textAlign: 'center', color: '#888' }}>No courses uploaded yet.</div>}
          {courses.map(course => (
            <div key={course._id} style={{ border: '1px solid #eee', borderRadius: 10, marginBottom: 18, padding: 18, position: 'relative' }}>
              <h4 style={{ marginBottom: 8 }}>{course.title}</h4>
              <button onClick={() => handleDelete(course._id)} style={{ position: 'absolute', top: 12, right: 12, background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer', fontWeight: 600 }}>Delete</button>
              <div style={{ marginBottom: 8 }}>
                <b>Videos:</b>
                <ul>
                  {course.videos.map((v, i) => (
                    <li key={i} style={{ marginBottom: 6 }}>
                      <a href={v.url} target="_blank" rel="noopener noreferrer">{v.name}</a>
                      {v.driveLink && (
                        <a href={v.driveLink} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 12, color: '#90be55', fontWeight: 500 }}>Drive Link</a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer2 />
    </>
  );
};

export default AdminCourseUpload; 