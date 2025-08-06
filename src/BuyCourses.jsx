import React, { useEffect, useState, useRef } from 'react';
import Header from './Home/Header';
import Footer2 from './Home/Footer2';
import { useApi } from './hooks/useApi';
import { API_BASE, API_BASE_URL } from './config';
import { useTranslation } from 'react-i18next';

const COURSE = {
  title: "Net Zero Carbon Strategy for Business",
  description: "A comprehensive course on decarbonisation, carbon accounting, carbon reduction, and sustainability for businesses. Taught by industry experts. Includes video lectures, downloadable resources, and a certificate.",
  price: 10,
  image: require('./Home/Logo.png'),
  id: 'netzero-carbon-course',
};

const BuyCourses = () => {
  const { t, i18n } = useTranslation();
  const [date, setDate] = useState('');
  const [people, setPeople] = useState(8);
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState(null);
  const [error, setError] = useState('');
  const [stripeLoading, setStripeLoading] = useState(false);
  const [city, setCity] = useState('');
  const [instructors, setInstructors] = useState([]);
  const [selectedInstructor, setSelectedInstructor] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [message, setMessage] = useState('');
  const userPackage = (localStorage.getItem('package') || '').toLowerCase();
  const isEligible = userPackage === 'pro' || userPackage === 'premium';
  const hasCourse = localStorage.getItem('hasCourse') === 'true';
  const [preferredStart, setPreferredStart] = useState('');
  const [preferredEnd, setPreferredEnd] = useState('');
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const { get, post } = useApi();
  const [area, setArea] = useState('');
  const [bookingId, setBookingId] = useState(null);
  const [bookingStatus, setBookingStatus] = useState('');
  const pollingRef = useRef(null);
  const [autofilled, setAutofilled] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  useEffect(() => {
    // Optionally, fetch from backend if you want to check real purchase status
  }, []);

  // Fetch all courses on mount
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/courses`)
      .then(res => res.json())
      .then(data => {
        // Ensure distinct courses by normalizing names
        const courseMap = {};
        data.forEach(course => {
          const normalizedName = course.name.trim().toLowerCase();
          const key = normalizedName + '|' + course.durationWeeks;
          if (!courseMap[key]) {
            courseMap[key] = { 
              name: course.name.trim(),
              durationWeeks: course.durationWeeks 
            };
          }
        });
        setCourses(Object.values(courseMap));
      });
  }, []);

  // Fetch instructors when city or area changes
  useEffect(() => {
    if (city) {
      fetch(`${API_BASE_URL}/api/instructors?city=${encodeURIComponent(city)}`)
        .then(res => res.json())
        .then(data => {
          // First, filter by city and area
          const areaMatches = data.filter(inst =>
            inst.city?.toLowerCase() === city.toLowerCase() &&
            inst.location?.toLowerCase() === area.toLowerCase()
          );
          // If no area matches, show all city matches
          const cityMatches = data.filter(inst =>
            inst.city?.toLowerCase() === city.toLowerCase()
          );
          const filtered = area && areaMatches.length > 0 ? areaMatches : cityMatches;
          setInstructors(filtered);

          // Aggregate unique courses from these instructors
          const courseMap = {};
          filtered.forEach(inst => {
            (inst.subjects || []).forEach(subj => {
              // Normalize course name to handle case variations
              const normalizedName = subj.name.trim().toLowerCase();
              const key = normalizedName + '|' + subj.durationWeeks;
              if (!courseMap[key]) {
                courseMap[key] = { 
                  name: subj.name.trim(), // Keep original case for display
                  durationWeeks: subj.durationWeeks 
                };
              }
            });
          });
          setCourses(Object.values(courseMap));
        })
        .catch(() => {
          setInstructors([]);
          setCourses([]);
        });
    } else {
      setInstructors([]);
      setCourses([]);
    }
    setSelectedInstructor('');
    setAvailableSlots([]);
    setSelectedSlot(null);
    setSelectedCourse(null);
  }, [city, area, date]);

  // Helper to subtract a booking from a slot
  function subtractBooking(slot, booking) {
    // No overlap
    if (booking.end <= slot.start || booking.start >= slot.end) return [slot];
    // Booking covers the whole slot
    if (booking.start <= slot.start && booking.end >= slot.end) return [];
    // Booking overlaps at the start
    if (booking.start <= slot.start && booking.end < slot.end) return [{ start: booking.end, end: slot.end }];
    // Booking overlaps at the end
    if (booking.start > slot.start && booking.end >= slot.end) return [{ start: slot.start, end: booking.start }];
    // Booking is in the middle
    return [
      { start: slot.start, end: booking.start },
      { start: booking.end, end: slot.end }
    ];
  }

  // Helper to convert time to 24-hour format
  function to24Hour(timeStr) {
    if (!timeStr) return '';
    if (timeStr.includes(':') && (timeStr.includes('AM') || timeStr.includes('PM'))) {
      // e.g., '10:14 AM' or '01:09 PM'
      const [time, modifier] = timeStr.split(' ');
      let [hours, minutes] = time.split(':');
      if (modifier === 'PM' && hours !== '12') hours = String(Number(hours) + 12);
      if (modifier === 'AM' && hours === '12') hours = '00';
      return `${hours.padStart(2, '0')}:${minutes}`;
    }
    // Already in 24-hour format
    return timeStr;
  }

  // Fetch available slots for all instructors in city for selected date and preferred time
  useEffect(() => {
    if (instructors.length && date && preferredStart && preferredEnd && selectedCourse) {
      Promise.all(instructors.map(inst =>
        fetch(`${API_BASE_URL}/api/instructors/profile/${inst.email}`)
          .then(res => res.json())
      )).then(profiles => {
        // Filter instructors who offer the selected course
        const filteredProfiles = profiles.filter(inst =>
          (inst.subjects || []).some(subj =>
            subj.name.toLowerCase().trim() === selectedCourse.name.toLowerCase().trim() && 
            String(subj.durationWeeks) === String(selectedCourse.durationWeeks)
          )
        );
        const day = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
        let slots = [];
        filteredProfiles.forEach(inst => {
          const avail = inst.availability?.[day] || [];
          const bookings = (inst.bookings || []).filter(b => b.date === date);
          avail.forEach(slot => {
            let free = [{ ...slot }];
            bookings.forEach(bk => {
              free = free.flatMap(s => subtractBooking(s, bk));
            });
            free.forEach(f => {
              // Only show slots that overlap with preferred time
              if (
                f.start && f.end &&
                f.start <= preferredEnd && f.end >= preferredStart
              ) {
                // Clamp slot to preferred time
                const slotStart = f.start < preferredStart ? preferredStart : f.start;
                const slotEnd = f.end > preferredEnd ? preferredEnd : f.end;
                slots.push({ instructor: inst.email, start: slotStart, end: slotEnd, name: `${inst.firstName} ${inst.lastName}`, location: inst.location });
              }
            });
          });
        });
        setAvailableSlots(slots);
      });
    } else {
      setAvailableSlots([]);
    }
  }, [instructors, date, preferredStart, preferredEnd, selectedCourse]);

  const checkAvailability = async () => {
    setChecking(true);
    setError('');
    setTimeout(() => {
      setAvailable(true);
      setChecking(false);
    }, 700);
  };

  const handleBook = async () => {
    if (!selectedCourse || !date || !city || !area) {
      setError('Please fill all fields.');
      return;
    }
    setStripeLoading(true);
    setError('');
    setMessage('');
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('You must be logged in to book.');
        setStripeLoading(false);
        return;
      }
      // Convert times to 24-hour format
      const start24 = to24Hour(preferredStart);
      const end24 = to24Hour(preferredEnd);
      const response = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          date,
          city,
          area,
          courseName: selectedCourse.name,
          durationWeeks: selectedCourse.durationWeeks,
          start: start24,
          end: end24
        })
      });
      const data = await response.json();
      if (response.status === 201) {
        setMessage('Booking created and instructors notified. Awaiting instructor confirmation.');
        setBookingId(data.bookingId);
        setBookingStatus('on-hold');
        // Start polling for status
        if (pollingRef.current) clearInterval(pollingRef.current);
        pollingRef.current = setInterval(async () => {
          const statusRes = await fetch(`${API_BASE_URL}/api/bookings/${data.bookingId}/status`);
          const statusData = await statusRes.json();
          if (statusData.status === 'confirmed') {
            setBookingStatus('confirmed');
            setMessage('Booking confirmed! You can now proceed to payment.');
            clearInterval(pollingRef.current);
          }
        }, 5000);
      } else {
        setError(data.message || 'Booking failed. Please try another date.');
      }
    } catch (err) {
      setError('Booking error.');
    }
    setStripeLoading(false);
  };

  const handleCheckout = async () => {
    setStripeLoading(true);
    setError('');
    let price = COURSE.price * people;
    if (userPackage === 'premium') price = price * 0.8;
    try {
      const res = await fetch(`${API_BASE}/api/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          cart: [{ name: COURSE.title, price, quantity: 1 }]
        })
      });
      const data = await res.json();
      if (data.url) {
        localStorage.setItem('purchasedPackage', `course:${COURSE.title}`);
        localStorage.setItem('hasCourse', 'true');
        if (bookingId) {
          localStorage.setItem('bookingId', bookingId);
        }
        window.location.href = data.url;
      } else {
        setError('Failed to start checkout.');
      }
    } catch (err) {
      setError('Checkout error.');
    } finally {
      setStripeLoading(false);
    }
  };

  // Autofill form after booking is confirmed
  useEffect(() => {
    if (bookingId && bookingStatus === 'confirmed' && !autofilled) {
      fetch(`${API_BASE_URL}/api/bookings/${bookingId}/status`)
        .then(res => res.json())
        .then(data => {
          if (data && data.status === 'confirmed') {
            // Assume booking details are available in data or fetch full booking if needed
            fetch(`${API_BASE_URL}/api/bookings/user/${localStorage.getItem('userId')}`)
              .then(res => res.json())
              .then(bookings => {
                const booking = bookings.find(b => b._id === bookingId);
                if (booking) {
                  setDate(booking.date);
                  setCity(booking.city);
                  setArea(booking.area);
                  setSelectedCourse({ name: booking.courseName, durationWeeks: booking.durationWeeks });
                  setAutofilled(true);
                }
              });
          }
        });
    }
  }, [bookingId, bookingStatus, autofilled]);

  // On page load, check for pending payment booking
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    fetch(`${API_BASE_URL}/api/bookings/user/${userId}`)
      .then(res => res.json())
      .then(bookings => {
        // Find the latest booking that is confirmed but not paid
        const pending = bookings.find(
          b => b.status === 'confirmed' && !b.paid
        );
        if (pending) {
          setBookingId(pending._id);
          setDate(pending.date);
          setCity(pending.city);
          setArea(pending.area);
          setSelectedCourse({ name: pending.courseName, durationWeeks: pending.durationWeeks });
          setBookingStatus('confirmed');
          setAutofilled(true);
        } else {
          // No pending payment, reset autofill
          setBookingId(null);
          setDate('');
          setCity('');
          setArea('');
          setSelectedCourse(null);
          setBookingStatus('');
          setAutofilled(false);
        }
      });
  }, []);

  // After payment, clear autofill and allow new bookings
  useEffect(() => {
    if (autofilled && bookingStatus === 'confirmed' && hasCourse) {
      setBookingId(null);
      setDate('');
      setCity('');
      setArea('');
      setSelectedCourse(null);
      setBookingStatus('');
      setAutofilled(false);
    }
  }, [hasCourse]);

  // Show booking confirmation after payment
  useEffect(() => {
    const bookingIdLS = localStorage.getItem('bookingId');
    if (hasCourse && bookingIdLS) {
      fetch(`${API_BASE_URL}/api/bookings/${bookingIdLS}/status`)
        .then(res => res.json())
        .then(data => {
          setConfirmedBooking(data);
          localStorage.removeItem('bookingId');
        });
    }
  }, [hasCourse]);

  // Always reset confirmation on mount so form is shown on new visits
  useEffect(() => {
    setConfirmedBooking(null);
  }, []);

  // Reset form after payment is successful (booking is paid)
  useEffect(() => {
    if (bookingStatus === 'confirmed' && confirmedBooking && confirmedBooking.paid) {
      setDate('');
      setCity('');
      setArea('');
      setSelectedCourse(null);
      setPeople(8);
      setPreferredStart('');
      setPreferredEnd('');
      setAvailableSlots([]);
      setSelectedSlot(null);
      setMessage('');
      setError('');
      setBookingId(null);
      setBookingStatus('');
      setAutofilled(false);
      setConfirmedBooking(null);
    }
  }, [bookingStatus, confirmedBooking]);

  useEffect(() => {
    const savedLang = localStorage.getItem('selectedLanguage');
    if (savedLang && savedLang !== i18n.language) {
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);

  return (
    <>
      <Header />
      <div style={{ margin:'200px',background: '#fff', minHeight: '100vh', padding: '120px 0 60px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: 400, background: '#fff', borderRadius: 20, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', overflow: 'hidden', margin: '32px 0', padding: 0 }}>
          <div style={{ height: 180, background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
            <img src={COURSE.image} alt={t('buycourses.course_image_alt')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <span style={{
              position: 'absolute',
              top: 16,
              left: 16,
              background: '#ffb400',
              color: '#fff',
              borderRadius: 8,
              padding: '4px 16px',
              fontWeight: 600,
              fontSize: 16,
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              display: 'inline-block',
            }}>{t('buycourses.featured')}</span>
          </div>
          <div style={{ padding: 28 }}>
            <h2 style={{ fontWeight: 700, fontSize: 24, marginBottom: 8 }}>{t('buycourses.title')}</h2>
            <div style={{ color: '#222', fontSize: 16, marginBottom: 12 }}>{t('buycourses.description')}</div>
            <div style={{ color: '#27ae60', fontWeight: 600, fontSize: 18, marginBottom: 8 }}>
              {t('buycourses.price', { price: COURSE.price })} {userPackage === 'premium' && <span>({t('buycourses.premium_discount')})</span>}
            </div>
            <div style={{ color: '#888', fontSize: 14, marginBottom: 18 }}>{t('buycourses.min_people')}</div>
            {confirmedBooking ? (
              <div style={{ color: 'green', fontWeight: 600, fontSize: 18, margin: '18px 0' }}>
                <h2>{t('buycourses.booking_confirmed')}</h2>
                {confirmedBooking.instructor && (
                  <p>{t('buycourses.instructor')}: {confirmedBooking.instructor.firstName} {confirmedBooking.instructor.lastName} ({confirmedBooking.instructor.email})</p>
                )}
                <p>{t('buycourses.payment_thank_you')}</p>
                <button onClick={() => {
                  setConfirmedBooking(null);
                  setDate('');
                  setCity('');
                  setArea('');
                  setSelectedCourse(null);
                  setPeople(8);
                  setPreferredStart('');
                  setPreferredEnd('');
                  setAvailableSlots([]);
                  setSelectedSlot(null);
                  setMessage('');
                  setError('');
                  setBookingId(null);
                  setBookingStatus('');
                  setAutofilled(false);
                }} style={{marginTop: 16, background: '#90be55', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 24px', fontWeight: 600, fontSize: 16}}>
                  {t('buycourses.book_another')}
                </button>
              </div>
            ) : (
              <>
                {!isEligible && (
                  <div style={{ color: '#e74c3c', fontWeight: 600, fontSize: 18, margin: '18px 0' }}>
                    {t('buycourses.membership_required')}<br />
                    <a href="/pricing" style={{ color: '#ff6b57', textDecoration: 'underline' }}>{t('buycourses.see_membership')}</a>
                  </div>
                )}
                {/* Remove this block so the form is always shown */}
                {/* {hasCourse && (
                  <div style={{ color: '#27ae60', fontWeight: 600, fontSize: 18, margin: '18px 0' }}>
                    You have already purchased this course.<br />
                    <a href="/courses" style={{ color: '#ff6b57', textDecoration: 'underline' }}>Go to Courses</a>
                  </div>
                )} */}
                {/* Always show the booking form. Disable fields and show Pay Now if confirmed and not paid. */}
                <>
                  <ol style={{ marginBottom: 16, color: '#888', fontSize: 15, paddingLeft: 18 }}>
                    <li>{t('buycourses.step1')}</li>
                    <li>{t('buycourses.step2')}</li>
                    <li>{t('buycourses.step3')}</li>
                    <li>{t('buycourses.step4')}</li>
                  </ol>
                  <label style={{ display: 'block', marginBottom: 8 }}>{t('buycourses.people_label')}</label>
                  <input type="number" min={8} value={people} onChange={e => setPeople(Math.max(8, parseInt(e.target.value)||8))} style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 6, border: '1px solid #ccc' }} disabled={bookingStatus === 'confirmed' && autofilled} />
                  <label style={{ display: 'block', marginBottom: 8 }}>{t('buycourses.city_label')}</label>
                  <input type="text" value={city} onChange={e => setCity(e.target.value)} style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 6, border: '1px solid #ccc' }} disabled={bookingStatus === 'confirmed' && autofilled} />
                  <label style={{ display: 'block', marginBottom: 8 }}>{t('buycourses.area_label')}</label>
                  <input type="text" value={area} onChange={e => setArea(e.target.value)} style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 6, border: '1px solid #ccc' }} disabled={bookingStatus === 'confirmed' && autofilled} />
                  <label style={{ display: 'block', marginBottom: 8 }}>{t('buycourses.date_label')}</label>
                  <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 6, border: '1px solid #ccc' }} disabled={bookingStatus === 'confirmed' && autofilled} />
                  <label style={{ display: 'block', marginBottom: 8 }}>{t('buycourses.start_time_label')}</label>
                  <input type="time" value={preferredStart} onChange={e => setPreferredStart(e.target.value)} style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 6, border: '1px solid #ccc' }} disabled={bookingStatus === 'confirmed' && autofilled} />
                  <label style={{ display: 'block', marginBottom: 8 }}>{t('buycourses.end_time_label')}</label>
                  <input type="time" value={preferredEnd} onChange={e => setPreferredEnd(e.target.value)} style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 6, border: '1px solid #ccc' }} disabled={bookingStatus === 'confirmed' && autofilled} />
                  <label style={{ display: 'block', marginBottom: 8 }}>{t('buycourses.select_course_label')}</label>
                  <select value={selectedCourse ? selectedCourse.name + '|' + selectedCourse.durationWeeks : ''} onChange={e => {
                    const [name, durationWeeks] = e.target.value.split('|');
                    setSelectedCourse(courses.find(c => c.name === name && String(c.durationWeeks) === durationWeeks));
                  }} style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 6, border: '1px solid #ccc' }} disabled={bookingStatus === 'confirmed' && autofilled}>
                    <option value="">{t('buycourses.select_course_option')}</option>
                    {courses.map((course, i) => (
                      <option key={i} value={course.name + '|' + course.durationWeeks}>
                        {course.name} ({t('buycourses.duration')}: {course.durationWeeks || '?'})
                      </option>
                    ))}
                  </select>
                  {bookingStatus === 'confirmed' && autofilled ? (
                    <button onClick={handleCheckout} disabled={stripeLoading} style={{ width: '100%', background: '#ff6b57', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 0', fontWeight: 600 }}>
                      {stripeLoading ? t('buycourses.processing_payment') : t('buycourses.pay_now', { price: userPackage === 'premium' ? (COURSE.price*people*0.8).toFixed(2) : (COURSE.price*people).toFixed(2) })}
                    </button>
                  ) : (
                    <button onClick={handleBook} disabled={stripeLoading} style={{ width: '100%', background: '#90be55', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 0', fontWeight: 600, marginBottom: 12 }}>
                      {stripeLoading ? t('buycourses.booking') : t('buycourses.book_now', { price: userPackage === 'premium' ? (COURSE.price*people*0.8).toFixed(2) : (COURSE.price*people).toFixed(2) })}
                    </button>
                  )}

                  {bookingStatus === 'on-hold' && (
                    <div style={{ color: '#888', marginTop: 12 }}>{t('buycourses.waiting_confirmation')}</div>
                  )}
                  {message && <div style={{ color: 'green', marginTop: 8 }}>{t('buycourses.message', { message })}</div>}
                  {error && <div style={{ color: 'red', marginTop: 8 }}>{t('buycourses.error', { error })}</div>}
                </>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer2 />
    </>
  );
};

export default BuyCourses; 