import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Header from './Home/Header';
import Footer2 from './Home/Footer2';
import { useApi } from './hooks/useApi';
import { API_BASE } from './config';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { setupIPhoneDetection, isIPhoneSafari, getAuthHeaders } from './utils/iphoneFix';
import './DirectoryListing.css';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const DirectoryListing = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState(null); // { package: 'free'|'pro'|'premium', ... }
  
  // Refs for animations
  const titleRef = useRef(null);
  const formRef = useRef(null);
  const submitButtonRef = useRef(null);
  const errorRef = useRef(null);
  const successRef = useRef(null);
  const iphoneMsgRef = useRef(null);
  
  const [form, setForm] = useState({
    company: '',
    email: '',
    phone: '',
    address: '',
    socialType: '', // new for dropdown
    socialLink: '', // new for input
    industry: '',
    description: '',
    image: null,
    // Location fields for contractor matching
    city: '',
    state: '',
    country: '',
    // Local Contractors specific fields
    contractorType: '',
    customContractorType: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { get, post } = useApi();
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');

  useEffect(() => {
    // Monitor login state changes (same as Header component)
    const checkLogin = () => {
      const loginStatus = localStorage.getItem('isLoggedIn') === 'true';
      console.log('DirectoryListing: Login status check:', loginStatus);
      console.log('DirectoryListing: Raw localStorage value:', localStorage.getItem('isLoggedIn'));
      console.log('DirectoryListing: All localStorage keys:', Object.keys(localStorage));
      console.log('DirectoryListing: localStorage contents:', {
        isLoggedIn: localStorage.getItem('isLoggedIn'),
        isAdmin: localStorage.getItem('isAdmin'),
        isInstructor: localStorage.getItem('isInstructor'),
        userEmail: localStorage.getItem('userEmail'),
        userId: localStorage.getItem('userId'),
        package: localStorage.getItem('package')
      });
      setIsLoggedIn(loginStatus);
    };
    
    // Initial check
    checkLogin();
    
    // Listen for storage changes from other tabs
    window.addEventListener('storage', checkLogin);
    
    // Check for login changes in the same tab every 500ms
    const interval = setInterval(checkLogin, 500);
    
    return () => {
      window.removeEventListener('storage', checkLogin);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    setupIPhoneDetection();
    if (isIPhoneSafari() && iphoneMsgRef.current) {
      gsap.fromTo(iphoneMsgRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' });
    }
    // Auto-detect user location
    detectUserLocation();
  }, []);

  useEffect(() => {
    // Initialize animations
    initializeAnimations();
  }, [user]);

  // Separate useEffect to fetch user data when login status changes
  useEffect(() => {
    if (isLoggedIn) {
      console.log('DirectoryListing: Login status changed to true, fetching user data...');
      fetchUser();
    } else {
      console.log('DirectoryListing: Login status changed to false, clearing user data');
      setUser(null);
    }
  }, [isLoggedIn]);

  const initializeAnimations = () => {
    // Title animation
    if (titleRef.current) {
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 50 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    // Form animation
    if (formRef.current) {
      gsap.fromTo(formRef.current,
        { opacity: 0, x: -50 },
        { 
          opacity: 1, 
          x: 0, 
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: formRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    // Submit button animation
    if (submitButtonRef.current) {
      gsap.fromTo(submitButtonRef.current,
        { opacity: 0, scale: 0.8 },
        { 
          opacity: 1, 
          scale: 1, 
          duration: 0.6,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: submitButtonRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    // Error message animation
    if (errorRef.current) {
      gsap.fromTo(errorRef.current,
        { opacity: 0, scale: 0.8, y: -20 },
        { 
          opacity: 1, 
          scale: 1, 
          y: 0, 
          duration: 0.5, 
          ease: "back.out(1.7)" 
        }
      );
    }

    // Success message animation
    if (successRef.current) {
      gsap.fromTo(successRef.current,
        { opacity: 0, scale: 0.8, y: -20 },
        { 
          opacity: 1, 
          scale: 1, 
          y: 0, 
          duration: 0.5, 
          ease: "back.out(1.7)" 
        }
      );
    }
  };

  const fetchUser = async () => {
    try {
      console.log('DirectoryListing: Attempting to fetch user from:', `${API_BASE}/api/me`);
      const data = await get(`${API_BASE}/api/me`, 'Loading user info...');
      console.log('DirectoryListing: User data received:', data);
      setUser({ ...data, package: (data.package || '').toLowerCase().replace(' plan', '').trim() });
    } catch (err) {
      console.error('DirectoryListing: Error fetching user:', err);
      setUser(null);
    }
  };

  const socialOptions = useMemo(() => {
    return [
      { value: '', label: t('directory.select_platform') },
      { value: 'Facebook', label: t('directory.social_platforms.facebook') },
      { value: 'LinkedIn', label: t('directory.social_platforms.linkedin') },
      { value: 'Twitter', label: t('directory.social_platforms.twitter') },
      { value: 'Instagram', label: t('directory.social_platforms.instagram') },
    ];
  }, [t]);
  
  const industryOptions = useMemo(() => {
    return [
      { value: '', label: t('directory.select_industry') },
      { value: 'Broker', label: t('directory.industries.broker') },
      { value: 'Exchange', label: t('directory.industries.exchange') },
      { value: 'Local Contractors', label: t('directory.industries.local_contractors') },
      { value: 'Project', label: t('directory.industries.project') },
      { value: 'Retail', label: t('directory.industries.retail') },
      { value: 'Wholesaler', label: t('directory.industries.wholesaler') },
    ];
  }, [t]);

  const contractorTypeOptions = useMemo(() => {
    return [
      { value: '', label: t('directory.select_contractor_type') },
      { value: 'plumber', label: t('directory.contractor_types.plumber') },
      { value: 'electrician', label: t('directory.contractor_types.electrician') },
      { value: 'carpenter', label: t('directory.contractor_types.carpenter') },
      { value: 'painter', label: t('directory.contractor_types.painter') },
      { value: 'roofing', label: t('directory.contractor_types.roofing') },
      { value: 'hvac', label: t('directory.contractor_types.hvac') },
      { value: 'landscaping', label: t('directory.contractor_types.landscaping') },
      { value: 'masonry', label: t('directory.contractor_types.masonry') },
      { value: 'flooring', label: t('directory.contractor_types.flooring') },
      { value: 'general_contractor', label: t('directory.contractor_types.general_contractor') },
      { value: 'kitchen_bath', label: t('directory.contractor_types.kitchen_bath') },
      { value: 'windows_doors', label: t('directory.contractor_types.windows_doors') },
      { value: 'siding_gutters', label: t('directory.contractor_types.siding_gutters') },
      { value: 'concrete_asphalt', label: t('directory.contractor_types.concrete_asphalt') },
      { value: 'pest_control', label: t('directory.contractor_types.pest_control') },
      { value: 'cleaning_services', label: t('directory.contractor_types.cleaning_services') },
      { value: 'security_systems', label: t('directory.contractor_types.security_systems') },
      { value: 'pool_spa', label: t('directory.contractor_types.pool_spa') },
      { value: 'fencing', label: t('directory.contractor_types.fencing') },
      { value: 'deck_patio', label: t('directory.contractor_types.deck_patio') },
      { value: 'insulation', label: t('directory.contractor_types.insulation') },
      { value: 'solar_installation', label: t('directory.contractor_types.solar_installation') },
      { value: 'demolition', label: t('directory.contractor_types.demolition') },
      { value: 'other', label: t('directory.contractor_types.other') },
    ];
  }, [t]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setForm(f => ({ ...f, image: files[0] }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
    
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Basic validation
    if (!form.company || !form.email || !form.industry) {
      setError('Please fill in all required fields: Company Name, Email, and Industry');
      return;
    }

    if (!form.city || !form.state || !form.country) {
      setError('Please fill in all required location fields: City, State, and Country');
      return;
    }

    // Validate social platform fields
    if (form.socialType && !form.socialLink) {
      setError('Please provide a URL when selecting a social platform');
      return;
    }

    // For iPhone Safari, show a message to use desktop for submissions
    if (isIPhoneSafari()) {
      setError(t('directory.errors.desktop_required'));
      return;
    }

    if (!user) {
      setError(t('directory.errors.login_required'));
      return;
    }

    // Free and Pro users can submit listings; only Premium can upload images
    // No package gate here

    // Validate Local Contractors specific fields
    if (form.industry === 'Local Contractors') {
      if (!form.contractorType) {
        setError(t('directory.errors.fill_required_fields'));
        return;
      }
      
      // If "Other" is selected, require custom contractor type
      if (form.contractorType === 'other' && !form.customContractorType) {
        setError(t('directory.errors.specify_contractor_type'));
        return;
      }
    }

    try {
      console.log("📝 Form data before submission:", form);
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        // Skip contractor-specific fields for non-Local Contractors
        if ((key === 'contractorType' || key === 'customContractorType') && form.industry !== 'Local Contractors') {
          return;
        }
        
        // Skip image field - it's handled separately
        if (key === 'image') {
          return;
        }
        
        if (key === "city" || key === "state" || key === "country") {
          formData.append(key, form[key] || "");
        } else if (form[key] !== null && form[key] !== undefined && form[key] !== '') {
          formData.append(key, form[key]);
        }
      });
      
      // Handle image file separately
      if (user.package === 'premium' && form.image) {
        formData.append('image', form.image);
      }
      
      // Handle contractor type - if "Other" is selected, use customContractorType
      if (form.industry === 'Local Contractors' && form.contractorType === 'other') {
        formData.set('contractorType', form.customContractorType);
      }
      
      // Add userPackage to the form data
      formData.append('userPackage', user.package);

      console.log("📋 FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(`  ${key}: ${value}`);
      }

      const response = await fetch(`${API_BASE}/api/directory`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Submission failed:', {
          status: response.status,
          statusText: response.statusText,
          errorData: errorData
        });
        throw new Error(errorData.error || errorData.message || t('directory.errors.submission_failed'));
      }

      setSuccess(t('directory.success.listing_submitted'));
      setForm({
        company: '',
        email: '',
        phone: '',
        address: '',
        socialType: '',
        socialLink: '',
        industry: '',
        description: '',
        image: null,
        city: '',
        state: '',
        country: '',
        contractorType: '',
        customContractorType: '',
      });
      // fetchListings(); // Refresh the listings - REMOVED
    } catch (err) {
      setError(err.message || t('directory.errors.submission_failed'));
    }
  };

  // Add back the detectUserLocation function
  const detectUserLocation = async () => {
    try {
      // Try to get location from IP using the backend
      const response = await fetch(`${API_BASE}/api/directory/nearby`, {
        method: 'GET',
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.userLocation && data.userLocation.city !== 'Unknown') {
          setForm(prev => ({
            ...prev,
            city: data.userLocation.city || '',
            state: data.userLocation.state || '',
            country: data.userLocation.country || ''
          }));
          return;
        }
      }
    } catch (error) {
      console.log('Could not auto-detect location from backend:', error);
    }

    // Fallback: try browser geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Use a free reverse geocoding service
            const { latitude, longitude } = position.coords;
            const geoResponse = await fetch(
              `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=YOUR_OPENCAGE_API_KEY`
            );
            if (geoResponse.ok) {
              const geoData = await geoResponse.json();
              if (geoData.results && geoData.results.length > 0) {
                const result = geoData.results[0].components;
                setForm(prev => ({
                  ...prev,
                  city: result.city || result.town || result.village || '',
                  state: result.state || '',
                  country: result.country || ''
                }));
              }
            }
          } catch (geoError) {
            console.log('Geolocation reverse lookup failed:', geoError);
            // Use a simple fallback
            setForm(prev => ({
              ...prev,
              city: 'New York',
              state: 'New York',
              country: 'USA'
            }));
          }
        },
        (error) => {
          console.log('Browser geolocation failed:', error);
          // Use a simple fallback
          setForm(prev => ({
            ...prev,
            city: 'New York',
            state: 'New York',
            country: 'USA'
          }));
        }
      );
    } else {
      // Fallback for browsers without geolocation
      setForm(prev => ({
        ...prev,
        city: 'New York',
        state: 'New York',
        country: 'USA'
      }));
    }
  };

  // filteredListings, selectedLetter, getRowStyle - REMOVED

  return (
    <>
      <Header />
      <div style={{ margin:'120px',background: '#fff', minHeight: '100vh', padding: '180px 0 60px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <h1 ref={titleRef} style={{ textAlign: 'center', marginBottom: 40, color: '#333' }}>{t('directory.page_title')}</h1>
          {isIPhoneSafari() ? (
            <div ref={iphoneMsgRef} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              minHeight: '40vh', background: '#e3f2fd', borderRadius: 12, border: '1px solid #2196f3',
              boxShadow: '0 4px 24px rgba(33,150,243,0.08)', padding: 40, margin: '40px 0',
              animation: 'fadeIn 1s',
            }}>
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: 24 }}>
                <circle cx="12" cy="12" r="12" fill="#2196f3" fillOpacity="0.1"/>
                <path d="M8 17h8M8 13h8M8 9h8" stroke="#2196f3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="6" y="5" width="12" height="14" rx="2" stroke="#2196f3" strokeWidth="2"/>
              </svg>
              <h2 style={{ color: '#1976d2', marginBottom: 16, fontWeight: 700, fontSize: 28 }}>{t('directory.desktop_only')}</h2>
              <p style={{ color: '#1976d2', fontSize: 18, textAlign: 'center', maxWidth: 400 }}>
                {t('directory.desktop_message')}
              </p>
            </div>
          ) : (
            <>
              {isIPhoneSafari() && (
                <div style={{ 
                  background: '#e3f2fd', 
                  padding: '15px', 
                  borderRadius: '8px', 
                  marginBottom: '20px',
                  border: '1px solid #2196f3',
                  textAlign: 'center'
                }}>
                  <p style={{ margin: 0, color: '#1976d2', fontSize: '14px' }}>
                    📱 <strong>{t('directory.mobile_view')}:</strong> {t('directory.mobile_message')}
                  </p>
                </div>
              )}
              
              {!isLoggedIn ? (
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                  <p style={{ color: '#666', fontSize: 18 }}>
                    {t('directory.messages.login_to_view')}
                  </p>
                  <div style={{ marginTop: 20, padding: 15, background: '#f0f0f0', borderRadius: 5, fontFamily: 'monospace' }}>
                    <h4>Debug Info:</h4>
                    <p>isLoggedIn: {String(isLoggedIn)}</p>
                    <p>user: {user ? 'exists' : 'null'}</p>
                    <p>localStorage.isLoggedIn: {localStorage.getItem('isLoggedIn')}</p>
                    <p>localStorage.userEmail: {localStorage.getItem('userEmail')}</p>
                    <p>localStorage.userId: {localStorage.getItem('userId')}</p>
                    <p>localStorage.package: {localStorage.getItem('package')}</p>
                    <p>localStorage.isAdmin: {localStorage.getItem('isAdmin')}</p>
                    <p>localStorage.isInstructor: {localStorage.getItem('isInstructor')}</p>
                    <p>API_BASE: {API_BASE}</p>
                    <button 
                      onClick={() => {
                        localStorage.setItem('isLoggedIn', 'true');
                        setIsLoggedIn(true);
                        console.log('Manual override: Set isLoggedIn to true');
                      }}
                      style={{ 
                        marginTop: 10, 
                        padding: '8px 16px', 
                        background: '#007bff', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: 4,
                        cursor: 'pointer'
                      }}
                    >
                      Force Login State (Debug)
                    </button>
                    <button 
                      onClick={() => {
                        console.log('Current localStorage contents:');
                        Object.keys(localStorage).forEach(key => {
                          console.log(`${key}: ${localStorage.getItem(key)}`);
                        });
                      }}
                      style={{ 
                        marginTop: 10, 
                        marginLeft: 10,
                        padding: '8px 16px', 
                        background: '#28a745', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: 4,
                        cursor: 'pointer'
                      }}
                    >
                      Log localStorage
                    </button>
                    <button 
                      onClick={() => {
                        console.log('Testing login process...');
                        console.log('API_BASE:', API_BASE);
                        console.log('Attempting to fetch user data...');
                        fetch(`${API_BASE}/api/me`, {
                          credentials: 'include'
                        })
                        .then(res => res.json())
                        .then(data => {
                          console.log('API response:', data);
                        })
                        .catch(err => {
                          console.error('API error:', err);
                        });
                      }}
                      style={{ 
                        marginTop: 10, 
                        marginLeft: 10,
                        padding: '8px 16px', 
                        background: '#ffc107', 
                        color: 'black', 
                        border: 'none', 
                        borderRadius: 4,
                        cursor: 'pointer'
                      }}
                    >
                      Test API Call
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {error && <div ref={errorRef} style={{ color: 'red', textAlign: 'center', marginBottom: 20 }}>{error}</div>}
                  {success && <div ref={successRef} style={{ color: 'green', textAlign: 'center', marginBottom: 20 }}>{success}</div>}

                  {user ? (
                    <div ref={formRef} style={{ background: '#f9f9f9', padding: 30, borderRadius: 10, marginBottom: 40 }}>
                      <h2 style={{ marginBottom: 20, color: '#333' }}>{t('directory.form.submit_your_company')}</h2>
                      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 15 }}>
                        <div>
                          <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>{t('directory.form.company_name')} *</label>
                          <input
                            type="text"
                            name="company"
                            value={form.company}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 5 }}
                          />
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
                          <div>
                            <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>{t('directory.form.email')} *</label>
                            <input
                              type="email"
                              name="email"
                              value={form.email}
                              onChange={handleChange}
                              required
                              style={{ width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 5 }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>{t('directory.form.phone')}</label>
                            <input
                              type="tel"
                              name="phone"
                              value={form.phone}
                              onChange={handleChange}
                              style={{ width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 5 }}
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>{t('directory.form.address')}</label>
                          <input
                            type="text"
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            style={{ width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 5 }}
                          />
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
                          <div>
                            <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>{t('directory.form.city')} *</label>
                            <input
                              type="text"
                              name="city"
                              value={form.city}
                              onChange={handleChange}
                              required
                              style={{ width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 5 }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>{t('directory.form.state')} *</label>
                            <input
                              type="text"
                              name="state"
                              value={form.state}
                              onChange={handleChange}
                              required
                              style={{ width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 5 }}
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>{t('directory.form.country')} *</label>
                          <input
                            type="text"
                            name="country"
                            value={form.country}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 5 }}
                          />
                        </div>
                        
                        <div style={{ marginBottom: 20 }}>
                          <button
                            type="button"
                            onClick={detectUserLocation}
                            style={{
                              background: '#2196F3',
                              color: 'white',
                              border: 'none',
                              padding: '8px 16px',
                              borderRadius: 5,
                              cursor: 'pointer',
                              fontSize: 14,
                              marginRight: 10
                            }}
                          >
                            📍 {t('directory.form.auto_detect_location')}
                          </button>
                          <span style={{ fontSize: 12, color: '#666' }}>
                            {t('directory.form.auto_detect_note')}
                          </span>
                        </div>
                        
                        <div>
                          <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>{t('directory.form.website_social_links')}</label>
                          <div style={{ display: 'flex', gap: 10 }}>
                            <select
                              name="socialType"
                              value={form.socialType}
                              onChange={handleChange}
                              style={{ padding: 10, border: '1px solid #ddd', borderRadius: 5 }}
                              required
                            >
                              {socialOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                            <input
                              type="url"
                              name="socialLink"
                              value={form.socialLink}
                              onChange={handleChange}
                              placeholder={t('directory.form.url_placeholder')}
                              style={{ flex: 1, padding: 10, border: '1px solid #ddd', borderRadius: 5 }}
                              required={!!form.socialType}
                              disabled={!form.socialType}
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>{t('directory.form.industry_category')}</label>
                          <select
                            name="industry"
                            value={form.industry}
                            onChange={handleChange}
                            style={{ width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 5 }}
                            required
                          >
                            {industryOptions.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                        </div>
                        
                        {/* Conditional fields for Local Contractors */}
                        {form.industry === 'Local Contractors' && (
                          <>
                            <div>
                              <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>{t('directory.contractor_type')} *</label>
                              <select
                                name="contractorType"
                                value={form.contractorType}
                                onChange={handleChange}
                                style={{ width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 5 }}
                                required
                              >
                                {contractorTypeOptions.map(opt => (
                                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                              </select>
                              <small style={{ color: '#666', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                                {t('directory.other_option_note')}
                              </small>
                            </div>
                            
                            {/* Show text input when "Other" is selected */}
                            {form.contractorType === 'other' && (
                              <div>
                                <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>{t('directory.specify_contractor_type')} *</label>
                                <input
                                  type="text"
                                  name="customContractorType"
                                  value={form.customContractorType || ''}
                                  onChange={handleChange}
                                  placeholder={t('directory.enter_contractor_type')}
                                  style={{ width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 5 }}
                                  required
                                />
                              </div>
                            )}
                          </>
                        )}
                        
                        <div>
                          <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>{t('directory.form.short_description')}</label>
                          <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows="4"
                            style={{ width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 5, resize: 'vertical' }}
                          />
                        </div>
                        
                        {user.package === 'premium' && (
                          <div>
                            <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>{t('directory.form.logo_image')}</label>
                            <input
                              type="file"
                              name="image"
                              onChange={handleChange}
                              accept="image/*"
                              style={{ width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 5 }}
                            />
                          </div>
                        )}
                        
                        <button
                          ref={submitButtonRef}
                          type="submit"
                          style={{
                            background: '#90be55',
                            color: 'white',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: 5,
                            cursor: 'pointer',
                            fontSize: 16,
                            fontWeight: 'bold'
                          }}
                        >
                          {t('directory.form.submit_listing')}
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', marginBottom: 40 }}>
                      <p style={{ color: '#666', fontSize: 18 }}>
                        {!user ? t('directory.messages.login_required_message') : ''}
                      </p>
                    </div>
                  )}

                </>
              )}
            </>
          )}
        </div>
      </div>
      <Footer2 />
    </>
  );
};

export default DirectoryListing; 