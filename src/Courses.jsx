import React, { useEffect, useState } from 'react';
import Header from './Home/Header';
import Footer2 from './Home/Footer2';
import { useApi } from './hooks/useApi';
import { API_BASE } from './config';

const COURSE_TITLE = "Net Zero Carbon Strategy for Business";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [modal, setModal] = useState(null); // { videoUrl, name }
  const [loading, setLoading] = useState(true);
  const [hasCourse, setHasCourse] = useState(false);
  const { get } = useApi();

  useEffect(() => {
    // Check user access from backend
    get(`${API_BASE}/api/me`, 'Checking course access...')
      .then(data => {
        if (Array.isArray(data.courses) && data.courses.includes(COURSE_TITLE)) {
          setHasCourse(true);
          fetchCourses();
        } else {
          setHasCourse(false);
          setLoading(false);
        }
      })
      .catch(() => {
        setHasCourse(false);
        setLoading(false);
      });
  }, []);

  const fetchCourses = async () => {
    const data = await get(`${API_BASE}/api/courses`, 'Loading courses...');
    setCourses(data);
    setLoading(false);
  };

  if (loading) {
    return <div style={{ padding: 100, textAlign: 'center' }}>Loading...</div>;
  }

  if (!hasCourse) {
    return (
      <>
        <Header />
        <div style={{ background: '#fff', minHeight: '100vh', padding: '180px 0 60px 0', textAlign: 'center' }}>
          <h1 style={{ color: '#e74c3c', fontWeight: 700, fontSize: 32 }}>Access Denied</h1>
          <p style={{ fontSize: 18, color: '#888' }}>You must purchase the course to access this page.</p>
          <a href="/buy-courses" style={{ color: '#ff6b57', fontWeight: 600, fontSize: 20, textDecoration: 'underline' }}>Go to Buy Courses</a>
        </div>
        <Footer2 />
      </>
    );
  }

  return (
    <>
      <Header />
      <div style={{ background: '#fff', minHeight: '100vh', padding: '290px 0 60px 0' }}>
        <div style={{ background: '#fff4ee', padding: '48px 0 24px 0', textAlign: 'center' }}>
          <h1 style={{ fontSize: 40, fontWeight: 700, letterSpacing: -1, margin: 0 }}>
            Complete <span style={{ color: '#ff6b57' }}>Course</span>
          </h1>
        </div>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 0', display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'center' }}>
          {courses.length === 0 && <div style={{ textAlign: 'center', color: '#888' }}>No courses available yet.</div>}
          {courses.slice().reverse().map(course => (
            course.videos.slice().reverse().map((v, i) => (
              <div key={course._id + '-' + i} style={{ width: 320, background: '#fff', borderRadius: 20, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s', position: 'relative' }} onClick={() => setModal({ videoUrl: v.url, name: v.name, courseTitle: course.title })}>
                <div style={{ height: 160, background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  <img src={require('./Home/Logo.png')} alt="Course" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span style={{
                    position: 'absolute',
                    top: 12,
                    left: 12,
                    background: '#ffb400',
                    color: '#fff',
                    borderRadius: 8,
                    padding: '2px 12px',
                    fontWeight: 600,
                    fontSize: 14,
                    maxWidth: '80%',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    display: 'inline-block',
                  }}>{v.name}</span>
                </div>
                <div style={{ padding: 20 }}>
                  <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>{v.name}</div>
                  <div style={{ color: '#222', fontSize: 15, marginBottom: 8 }}>{course.title}</div>
                  {/* You can add duration, likes, etc. here if available */}
                  {v.driveLink && (
                    <div style={{ marginTop: 12 }}>
                      <a href={v.driveLink} target="_blank" rel="noopener noreferrer" style={{ background: '#90be55', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 20px', fontWeight: 500, textDecoration: 'none', display: 'inline-block' }}>
                        Download Slides
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))
          ))}
        </div>
        {/* Modal for video playback */}
        {modal && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setModal(null)}>
            <div style={{ position: 'relative', width: '90vw', maxWidth: 900, background: 'transparent', borderRadius: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.25)' }} onClick={e => e.stopPropagation()}>
              <button onClick={() => setModal(null)} style={{ position: 'absolute', top: 12, right: 12, background: '#ff6b57', color: '#fff', border: 'none', borderRadius: '50%', width: 40, height: 40, fontSize: 22, cursor: 'pointer', zIndex: 2 }}>×</button>
              <video src={modal.videoUrl} controls autoPlay style={{ width: '100%', borderRadius: 16, background: '#000' }} />
              <div style={{ color: '#fff', textAlign: 'center', marginTop: 12, fontSize: 20, fontWeight: 600 }}>{modal.name}</div>
              <div style={{ color: '#fff', textAlign: 'center', fontSize: 16 }}>{modal.courseTitle}</div>
            </div>
          </div>
        )}
      </div>
      <Footer2 />
    </>
  );
};

export default Courses; 