import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from './config';
import Header from './Home/Header';
import Footer2 from './Home/Footer2';
import { useTranslation } from 'react-i18next';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const Slots = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [regions, setRegions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [availability, setAvailability] = useState({});
  const [bookings, setBookings] = useState([]);
  const [pendingBookings, setPendingBookings] = useState([]);
  const [acceptMessage, setAcceptMessage] = useState('');
  const [regionInput, setRegionInput] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [subjectDuration, setSubjectDuration] = useState('');
  const [message, setMessage] = useState('');
  const [city, setCity] = useState('');
  const [location, setLocation] = useState('');
  const instructorId = localStorage.getItem('userId');
  const [assignedBookings, setAssignedBookings] = useState([]);


  // Get instructor email from localStorage (set on login)
  const email = localStorage.getItem('instructorEmail');

  const fetchPendingBookings = useCallback(async () => {
    if (!instructorId) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/api/bookings?notifiedInstructorId=${instructorId}&status=on-hold`);
      setPendingBookings(res.data || []);
    } catch {
      setPendingBookings([]);
    }
  }, [instructorId]);

  useEffect(() => {
    const isInstructor = localStorage.getItem('isInstructor') === 'true';
    if (!isInstructor) {
      navigate('/login');
    }
    // Try to get email from login form if not in localStorage
    if (!email) {
      setMessage('No instructor email found. Please log in again.');
      return;
    }
    fetchProfile();
    fetchBookings();
    fetchPendingBookings();
    const fetchAssignedBookings = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/bookings/assigned/${instructorId}`);
        setAssignedBookings(res.data || []);
      } catch {
        setAssignedBookings([]);
      }
    };
    fetchAssignedBookings();
    const savedLang = localStorage.getItem('selectedLanguage');
    if (savedLang && savedLang !== i18n.language) {
      i18n.changeLanguage(savedLang);
    }
  }, [navigate, email, fetchPendingBookings, instructorId, i18n]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/instructors/profile/${email}`);
      setProfile(res.data);
      setRegions(res.data.regions || []);
      setSubjects(res.data.subjects || []);
      setAvailability(res.data.availability || {});
      setCity(res.data.city || '');
      setLocation(res.data.location || '');
    } catch (err) {
      setMessage('Failed to load profile.');
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/instructors/bookings/${email}`);
      setBookings(res.data);
    } catch (err) {
      setBookings([]);
    }
  };

  const handleAddRegion = async () => {
    if (!regionInput.trim()) return;
    const newRegions = [...regions, regionInput.trim()];
    await updateProfile({ regions: newRegions, subjects });
    setRegionInput('');
  };

  const handleAddSubject = async () => {
    if (!subjectName.trim() || !subjectDuration) return;
    const newSubjects = [...subjects, { name: subjectName.trim(), durationWeeks: Number(subjectDuration) }];
    await updateProfile({ regions, subjects: newSubjects });
    setSubjectName('');
    setSubjectDuration('');
  };

  const handleDeleteSubject = async (idx) => {
    const newSubjects = subjects.filter((_, i) => i !== idx);
    await updateProfile({ regions, subjects: newSubjects });
  };

  const updateProfile = async (data) => {
    try {
      await axios.put(`${API_BASE_URL}/api/instructors/profile/${email}`, data);
      fetchProfile();
      setMessage('Profile updated!');
    } catch {
      setMessage('Failed to update profile.');
    }
  };

  const handleAvailabilityChange = (day, idx, field, value) => {
    setAvailability((prev) => {
      const daySlots = prev[day] ? [...prev[day]] : [{}];
      daySlots[idx] = { ...daySlots[idx], [field]: value };
      return { ...prev, [day]: daySlots };
    });
  };

  const handleAddSlot = (day) => {
    setAvailability((prev) => {
      const daySlots = prev[day] ? [...prev[day], { start: '', end: '' }] : [{ start: '', end: '' }];
      return { ...prev, [day]: daySlots };
    });
  };

  const handleSaveAvailability = async () => {
    try {
      await axios.put(`${API_BASE_URL}/api/instructors/availability/${email}`, { availability });
      setMessage('Availability updated!');
      fetchProfile();
    } catch {
      setMessage('Failed to update availability.');
    }
  };

  const handleEditSlot = async (day, idx, start, end) => {
    // Debug log
    console.log('Edit slot params:', { email, day, idx, start, end });
    if (!email || !day || idx === undefined || start === undefined || end === undefined) {
      setMessage('Invalid slot parameters for editing.');
      return;
    }
    try {
      await axios.put(`${API_BASE_URL}/api/instructors/availability/${email}/${day}/${idx}`, { start, end });
      setMessage('Slot updated!');
      fetchProfile();
    } catch (err) {
      setMessage('Failed to update slot.');
      console.error('Edit slot error:', err);
    }
  };

  const handleDeleteSlot = async (day, idx) => {
    // Debug log
    console.log('Delete slot params:', { email, day, idx });
    if (!email || !day || idx === undefined) {
      setMessage('Invalid slot parameters for deletion.');
      return;
    }
    try {
      await axios.delete(`${API_BASE_URL}/api/instructors/availability/${email}/${day}/${idx}`);
      setMessage('Slot deleted!');
      fetchProfile();
    } catch (err) {
      setMessage('Failed to delete slot.');
      console.error('Delete slot error:', err);
    }
  };

  const handleSaveCityLocation = async () => {
    try {
      await axios.put(`${API_BASE_URL}/api/instructors/profile/${email}`, { city, location });
      setMessage('City/Location updated!');
      fetchProfile();
    } catch {
      setMessage('Failed to update city/location.');
    }
  };

  const handleDeleteBooking = async (idx) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/instructors/booking/${email}/${idx}`);
      setMessage('Booking deleted!');
      fetchBookings();
    } catch {
      setMessage('Failed to delete booking.');
    }
  };

  const handleAcceptBooking = async (bookingId) => {
    if (!instructorId) {
      setAcceptMessage('Instructor ID not found.');
      return;
    }
    try {
      const res = await axios.post(`${API_BASE_URL}/api/bookings/${bookingId}/accept`, { instructorId });
      setAcceptMessage(res.data.message || 'Booking accepted!');
      // Remove accepted booking from pending list
      setPendingBookings(prev => prev.filter(b => b._id !== bookingId));
      fetchBookings(); // Refresh confirmed bookings
    } catch (err) {
      setAcceptMessage(err.response?.data?.message || 'Failed to accept booking.');
    }
  };

  // Calculate free slots by subtracting bookings from availability
  const getFreeSlots = (day) => {
    const slots = (availability[day] || []).map(slot => ({ ...slot }));
    const todayBookings = bookings.filter(b => new Date(b.date).toLocaleDateString('en-US', { weekday: 'long' }) === day);
    todayBookings.forEach(bk => {
      for (let i = 0; i < slots.length; i++) {
        const slot = slots[i];
        if (bk.start >= slot.start && bk.end <= slot.end) {
          // Split slot into before and after booking
          const before = bk.start > slot.start ? { start: slot.start, end: bk.start } : null;
          const after = bk.end < slot.end ? { start: bk.end, end: slot.end } : null;
          slots.splice(i, 1, ...(before && after ? [before, after] : before ? [before] : after ? [after] : []));
          break;
        }
      }
    });
    return slots;
  };

  return (

    <>
    <Header/>
    <div id="insp"style={{ maxWidth: 700, margin: '12rem auto', padding: 20, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee' }}>
      <h2>{t('slots.instructor_profile')}</h2>
      {profile && (
        <div style={{ marginBottom: 20 }}>
          <div><b>{t('slots.full_name')}:</b> {profile.firstName} {profile.lastName}</div>
          <div><b>{t('slots.email')}:</b> {profile.email}</div>
          <div style={{ marginTop: 10 }}>
            <b>{t('slots.city')}:</b> <input value={city} onChange={e => setCity(e.target.value)} placeholder={t('slots.city')} style={{ marginRight: 10 }} />
            <b>{t('slots.location')}:</b> <input value={location} onChange={e => setLocation(e.target.value)} placeholder={t('slots.location')} style={{ marginRight: 10 }} />
            <button id="isave"onClick={handleSaveCityLocation}>{t('slots.save')}</button>
          </div>
        </div>
      )}
      <div style={{ marginBottom: 20 }}>
        <h3>{t('slots.assigned_regions')}</h3>
        <ul>{regions.map((r, i) => <li key={i}>{r}</li>)}</ul>
        <input value={regionInput} onChange={e => setRegionInput(e.target.value)} placeholder={t('slots.add_region')} />
        <button id="isave" onClick={handleAddRegion}>{t('slots.add')}</button>
      </div>
      <div style={{ marginBottom: 20 }}>
        <h3>{t('slots.subjects_courses')}</h3>
        <ul>
          {subjects.map((s, i) => (
            <li key={i}>
              {s.name} ({t('slots.duration')}: {s.durationWeeks} {t('slots.weeks')})
              <button id="idel"onClick={() => handleDeleteSubject(i)} style={{ marginLeft: 10, color: 'red' }}>{t('slots.delete')}</button>
            </li>
          ))}
        </ul>
        <input value={subjectName} onChange={e => setSubjectName(e.target.value)} placeholder={t('slots.add_subject_course')} style={{ marginRight: 8 }} />
        <input type="number" min={1} value={subjectDuration} onChange={e => setSubjectDuration(e.target.value)} placeholder={t('slots.duration_weeks')} style={{ width: 120, marginRight: 8 }} />
        <button id="isave" onClick={handleAddSubject}>{t('slots.add')}</button>
      </div>
      <div style={{ marginBottom: 20 }}>
        <h3>{t('slots.set_available_hours')}</h3>
        {DAYS.map(day => (
          <div key={day} style={{ marginBottom: 10 }}>
            <b>{t(`slots.days.${day.toLowerCase()}`)}:</b>
            {(availability[day] || []).map((slot, idx) => (
              <span key={idx} style={{ marginLeft: 10 }}>
                <input
                  type="time"
                  value={slot.start || ''}
                  onChange={e => handleAvailabilityChange(day, idx, 'start', e.target.value)}
                  style={{ width: 90 }}
                />
                -
                <input
                  type="time"
                  value={slot.end || ''}
                  onChange={e => handleAvailabilityChange(day, idx, 'end', e.target.value)}
                  style={{ width: 90 }}
                />
                <button id="idel"onClick={() => handleDeleteSlot(day, idx)} style={{ marginLeft: 5, color: 'red' }}>{t('slots.delete')}</button>
              </span>
            ))}
            <button onClick={() => handleAddSlot(day)} style={{ marginLeft: 10 }}>{t('slots.add_slot')}</button>
            <div style={{ marginLeft: 20, color: '#888', fontSize: 13 }}>
              {t('slots.free_slots')}: {getFreeSlots(day).map((slot, i) => `${slot.start} - ${slot.end}`).join(', ') || t('slots.none')}
            </div>
          </div>
        ))}
        <button onClick={handleSaveAvailability}>{t('slots.save_availability')}</button>
      </div>
    
      <div style={{ marginBottom: 20 }}>
        <h3>{t('slots.my_confirmed_bookings')}</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              <th>{t('slots.date')}</th>
              <th>{t('slots.time')}</th>
              <th>{t('slots.location')}</th>
              <th>{t('slots.course')}</th>
              <th>{t('slots.action')}</th>
            </tr>
          </thead>
          <tbody>
            {assignedBookings.map((b, i) => (
              <tr id="dids" key={i}>
                <td>{b.date}</td>
                <td>{b.start || '-'} - {b.end || '-'}</td>
                <td>{b.city}, {b.area}</td>
                <td>{b.courseName}</td>
                <td>
                  <button id="dids" onClick={async () => {
                    await axios.delete(`${API_BASE_URL}/api/bookings/${b._id}`);
                    setAssignedBookings(assignedBookings.filter(x => x._id !== b._id));
                  }} style={{ background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 12px' }}>{t('slots.delete')}</button>
                </td>
              </tr>
            ))}
            {assignedBookings.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: 20 }}>{t('slots.no_confirmed_bookings')}</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div style={{ marginBottom: 20 }}>
        <h3>{t('slots.pending_bookings')}</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              <th>{t('slots.date')}</th>
              <th>{t('slots.time')}</th>
              <th>{t('slots.location')}</th>
              <th>{t('slots.course')}</th>
              <th>{t('slots.action')}</th>
            </tr>
          </thead>
          <tbody>
            {pendingBookings.map((b, i) => (
              <tr key={i}>
                <td>{b.date}</td>
                <td>{b.start || '-'} - {b.end || '-'}</td>
                <td>{b.city}, {b.area}</td>
                <td>{b.courseName}</td>
                <td>
                  <button onClick={async () => {
                    await handleAcceptBooking(b._id);
                    window.location.reload(); // Reload the page after accepting
                  }} style={{ background: '#27ae60', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 12px' }}>{t('slots.accept')}</button>
                </td>
              </tr>
            ))}
            {pendingBookings.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: 20 }}>{t('slots.no_pending_bookings')}</td></tr>
            )}
          </tbody>
        </table>
        {acceptMessage && <div style={{ color: 'green', marginTop: 10 }}>{acceptMessage}</div>}
      </div>
      {message && <div style={{ color: 'green', marginTop: 10 }}>{message}</div>}
    </div>
    <Footer2/>
    </>
  );
};

export default Slots; 