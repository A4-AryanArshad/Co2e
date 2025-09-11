import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../Home/Header';
import Footer2 from '../Home/Footer2';
import './Services.css';
import { useApi } from '../hooks/useApi';
import { API_BASE } from '../config';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const Services = () => {
  const { t, i18n } = useTranslation();

  const [directoryListings, setDirectoryListings] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState('A');
  const [user, setUser] = useState(null);
  const [uploadingId, setUploadingId] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [viewMode, setViewMode] = useState('alphabetical'); // 'alphabetical' or 'category'
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Local Contractors'); // Default to Local Contractors
  const [showSubCategories, setShowSubCategories] = useState(false);
  const [subCategories, setSubCategories] = useState([]);
  const [serviceImages, setServiceImages] = useState([]);
  const [featuredListings, setFeaturedListings] = useState([]);
  
  // Debug: Log when categories change
  useEffect(() => {
    console.log('Categories state changed:', categories);
  }, [categories]);
  const { get } = useApi();

  // Refs for animations
  const titleRef = useRef(null);
  const alphabetRef = useRef(null);
  const tableRef = useRef(null);
  const descriptionRef = useRef(null);
  const courseButtonRef = useRef(null);
  const serviceCardsRef = useRef(null);
  const bottomCardsRef = useRef(null);

  useEffect(() => {
    // Don't auto-clear location - let the backend API detect it properly
    console.log('Services component mounted, fetching data...');
    

    fetchDirectoryListings();
    fetchCategories();
    fetchServiceImages();
    fetchFeaturedListings();
    fetchUser();
  }, [i18n]);

  useEffect(() => {
    // Initialize animations
    initializeAnimations();
  }, [directoryListings]);



  const initializeAnimations = () => {
    // Title animation
    if (titleRef.current) {
      gsap.fromTo(titleRef.current, 
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
      );
    }

    // Alphabet filter animation
    if (alphabetRef.current) {
      const letters = alphabetRef.current.querySelectorAll('span');
      gsap.fromTo(letters,
        { opacity: 0, scale: 0.8 },
        { 
          opacity: 1, 
          scale: 1, 
          duration: 0.5, 
          stagger: 0.05,
          ease: "back.out(1.7)"
        }
      );
    }

    // Table animation - appear immediately without scroll trigger
    if (tableRef.current) {
      gsap.fromTo(tableRef.current,
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          delay: 0.3,
          ease: "power2.out"
        }
      );
    }





    // Description animation
    if (descriptionRef.current) {
      gsap.fromTo(descriptionRef.current,
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: descriptionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    // Course button animation
    if (courseButtonRef.current) {
      gsap.fromTo(courseButtonRef.current,
        { opacity: 0, scale: 0.8 },
        { 
          opacity: 1, 
          scale: 1, 
          duration: 0.6,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: courseButtonRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    // Service cards animation
    if (serviceCardsRef.current) {
      const cards = serviceCardsRef.current.querySelectorAll('#scard');
      gsap.fromTo(cards,
        { opacity: 0, y: 50, rotation: -3 },
        { 
          opacity: 1, 
          y: 0, 
          rotation: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: serviceCardsRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    // Bottom cards animation
    if (bottomCardsRef.current) {
      const cards = bottomCardsRef.current.querySelectorAll('div');
      gsap.fromTo(cards,
        { opacity: 0, x: -50 },
        { 
          opacity: 1, 
          x: 0, 
          duration: 0.8,
          stagger: 0.3,
          ease: "power2.out",
          scrollTrigger: {
            trigger: bottomCardsRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }
  };

  const fetchUser = async () => {
    try {
      const data = await get(`${API_BASE}/api/me`, 'Loading user info...');
      setUser({ ...data, package: (data.package || '').toLowerCase().replace(' plan', '').trim() });
    } catch {
      setUser(null);
    }
  };



  const fetchDirectoryListings = async () => {
    try {
      // Try direct fetch first
      try {
        const response = await fetch(`${API_BASE}/api/directory`);
        if (response.ok) {
          const data = await response.json();
          console.log('Services: Fetched directory listings:', data.length, 'entries');
          console.log('Sample entries:', data.slice(0, 3));
          setDirectoryListings(data);
          return;
        }
      } catch (directError) {
        console.error('Direct fetch failed:', directError);
        // Fallback to useApi
      }
      
      // Fallback to useApi
      const data = await get(`${API_BASE}/api/directory`, 'Loading directory listings...');
      console.log('Services: Fetched directory listings via useApi:', data.length, 'entries');
      setDirectoryListings(data);
    } catch (err) {
      console.error('Services: Failed to fetch directory listings:', err);
      setDirectoryListings([]);
    }
  };

  const fetchCategories = async () => {
    try {
      // First, get the actual unique industries from the database
      const response = await fetch(`${API_BASE}/api/directory`);
      if (response.ok) {
        const listings = await response.json();
        
        // Extract unique industries and display categories from database
        const uniqueIndustries = [...new Set(listings.map(l => l.industry).filter(Boolean))];
        const uniqueDisplayCategories = [...new Set(listings.map(l => l.displayCategory).filter(Boolean))];
        console.log('Unique industries from database:', uniqueIndustries);
        console.log('Unique display categories from database:', uniqueDisplayCategories);
        
        // Create a mapping from database industries to display categories
        const industryToCategory = {
          'Broker': 'Broker',
          'Exchange': 'Exchange',
          'Local Contractors': 'Local Contractors',
          'Project': 'Project',
          'Retail': 'Retail',
          'Wholesaler': 'Wholesaler',
          // Map other industries to appropriate categories
          'Construction': 'Project',
          'Technology': 'Project',
          'Finance': 'Project',
          'Wholesale': 'Wholesaler'
        };
        
        // Create display categories based on actual data
        const displayCategories = [];
        
        // First, add display categories from the database
        uniqueDisplayCategories.forEach(displayCategory => {
          if (!displayCategories.includes(displayCategory)) {
            displayCategories.push(displayCategory);
          }
        });
        
        // Then, map any remaining industries to categories
        uniqueIndustries.forEach(industry => {
          const category = industryToCategory[industry] || industry;
          if (!displayCategories.includes(category)) {
            displayCategories.push(category);
          }
        });
        
        console.log('Display categories:', displayCategories);
        console.log('Categories state being set to:', displayCategories);
        setCategories(displayCategories);
      } else {
        // Fallback to predefined categories (including Local Contractors)
        const fallbackCategories = [
          'Local Contractors',
          'Broker',
          'Exchange', 
          'Project',
          'Retail',
          'Wholesaler'
        ];
        setCategories(fallbackCategories);
      }
      
      // Fetch Local Contractor subcategories for potential future use
      try {
        const contractorResponse = await fetch(`${API_BASE}/api/directory/local-contractor-categories`);
        if (contractorResponse.ok) {
          const contractorCategories = await contractorResponse.json();
          setSubCategories(contractorCategories);
          console.log('Local contractor subcategories loaded:', contractorCategories);
        } else {
          setSubCategories([]);
        }
      } catch (contractorError) {
        console.error('Error fetching contractor categories:', contractorError);
        setSubCategories([]);
      }
    } catch (err) {
      console.error('Services: Failed to set categories:', err);
      
      // Fallback to hardcoded categories (including Local Contractors)
      const fallbackCategories = [
        'Local Contractors',
        'Broker',
        'Exchange', 
        'Project',
        'Retail',
        'Wholesaler'
      ];
      
      setCategories(fallbackCategories);
      setSubCategories([]);
    }
  };

  const fetchServiceImages = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/service-images`);
      if (response.ok) {
        const data = await response.json();
        setServiceImages(data);
        console.log('Service images loaded:', data.length);
      } else {
        console.error('Failed to fetch service images');
      }
    } catch (error) {
      console.error('Error fetching service images:', error);
    }
  };

  const fetchFeaturedListings = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/featured-listings`);
      if (response.ok) {
        const data = await response.json();
        setFeaturedListings(data);
        console.log('Featured listings loaded:', data.length);
      } else {
        console.error('Failed to fetch featured listings');
      }
    } catch (error) {
      console.error('Error fetching featured listings:', error);
    }
  };

  const handleImageUpload = async (listingId, file) => {
    setUploadingId(listingId);
    setUploadError('');
    try {
      const formData = new FormData();
      formData.append('image', file);
      // PATCH endpoint to update directory listing with image
      const res = await fetch(`${API_BASE}/api/directory/${listingId}/image`, {
        method: 'PATCH',
        body: formData,
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to upload image');
      await fetchDirectoryListings();
    } catch (err) {
      setUploadError('Image upload failed.');
    } finally {
      setUploadingId(null);
    }
  };

  const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
  
  // Detect and store user's location


  // Determine filtered listings based on view mode
  const getFilteredListings = () => {
    console.log('getFilteredListings called with:', {
      viewMode,
      selectedCategory,
      totalListings: directoryListings.length,
      sampleIndustries: directoryListings.slice(0, 5).map(l => l.industry)
    });
    
    if (viewMode === 'category') {
      if (selectedCategory) {
        // If no category is selected, show Local Contractors by default
        if (!selectedCategory) {
          console.log('No category selected, showing Local Contractors by default');
          return directoryListings.filter(listing => 
            listing.displayCategory === 'Local Contractors' || 
            listing.industry === 'Local Contractors'
          );
        }
        
        // Special handling for Local Contractors - show all local contractors without location filtering
        if (selectedCategory === 'Local Contractors') {
          const localContractors = directoryListings.filter(l => {
            // Check displayCategory first, then fallback to industry
            const isLocalContractor = (l.displayCategory === selectedCategory) || (l.industry === selectedCategory);
            console.log('Checking listing:', l.company, {
              displayCategory: l.displayCategory,
              industry: l.industry,
              isLocalContractor: isLocalContractor
            });
            return isLocalContractor;
          });
          console.log('Local Contractors found:', localContractors.length, 'out of', directoryListings.length, 'total listings');
          return localContractors;
        }
        
        // Remove contractor category filtering - we now show all local contractors mixed together
        // No longer filter by specific contractor types (Finance, Technology, etc.)
        // The contractor type will be displayed in the category column but not used for filtering
        
        // Handle industry mapping for Project category
        if (selectedCategory === 'Project') {
          const projectListings = directoryListings.filter(l => {
            // Use displayCategory if available, otherwise fall back to industry mapping
            if (l.displayCategory === 'Project') return true;
            
            // Fallback: Map database industries to Project category
            const projectIndustries = ['Construction', 'Technology', 'Finance'];
            return projectIndustries.includes(l.industry);
          });
          console.log('Project category filtering:', {
            selectedCategory,
            totalListings: directoryListings.length,
            projectListings: projectListings.length,
            projectIndustries: ['Construction', 'Technology', 'Finance'],
            foundIndustries: [...new Set(projectListings.map(l => l.industry))]
          });
          return projectListings;
        }
        
        // Handle industry mapping for Wholesaler category
        if (selectedCategory === 'Wholesaler') {
          return directoryListings.filter(l => {
            // Use displayCategory if available, otherwise fall back to industry mapping
            if (l.displayCategory === 'Wholesaler') return true;
            
            // Fallback: Map database industries to Wholesaler category
            const wholesalerIndustries = ['Wholesale'];
            return wholesalerIndustries.includes(l.industry);
          });
        }
        
        // For other categories, do exact matching (check both displayCategory and industry)
        return directoryListings.filter(l => {
          // First check displayCategory if available
          if (l.displayCategory === selectedCategory) return true;
          // Fallback to industry matching
          return l.industry === selectedCategory;
        });
      } else {
        return directoryListings; // Show all listings when no category is selected
      }
    } else {
      // In alphabetical view, show all listings that start with selected letter
      // But for Local Contractors, also apply location filtering if user location exists
      
      return directoryListings.filter(l => {
        // Ensure company name exists and filter by first letter
        const companyName = l.company || l.Company || '';
        const matchesLetter = companyName.toUpperCase().startsWith(selectedLetter);
        
        // For all entries, just filter by letter (no location filtering)
        return matchesLetter;
      });
    }
  };
  
  const filteredListings = getFilteredListings();

  return (
    <>
      <div id="cover">
        <div id="totalr">
          <div id="Hederarea">
            <Header />
          </div>

          <div id="directory-listing" style={{ maxWidth: '100%', overflow: 'hidden' }}>
            <div id="Listingg" style={{ 
              paddingTop: '20px',
              paddingLeft: 'clamp(20px, 5vw, 220px)',
              paddingRight: 'clamp(20px, 5vw, 220px)',
              textAlign: 'center'
            }}>
              <h1 ref={titleRef} style={{ 
                position: 'relative',
                fontSize: 'clamp(32px, 8vw, 50px)',
                lineHeight: '1.2',
                marginBottom: '15px', marginTop: '100px'
              }}>
                {/* Anchor div for navbar navigation - ensures heading appears from start */}
                <div id="directory-listing-anchor" style={{ position: 'absolute', top: '-100px', visibility: 'hidden', height: '0', width: '0' }}></div>
                {t("services.directoryListing.title")}
              </h1>
              
              {/* Sorting Buttons - Positioned above the category section */}
              <div id="barea1" style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                gap: '16px', 
                margin: '10px auto',
                maxWidth: '800px',
                flexWrap: 'wrap',
                overflowX: 'auto !important',
                whiteSpace: 'nowrap !important',
                padding: '0 20px',
                width: '100%',
                textAlign: 'center'
              }}>
                <button
                  onClick={() => {
                    setViewMode('alphabetical');
                    setSelectedLetter('A');
                    setSelectedCategory('Local Contractors');
                  }}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '8px',
                    background: viewMode === 'alphabetical' ? '#90be55' : '#f0f0f0',
                    color: viewMode === 'alphabetical' ? 'white' : '#333',
                    border: 'none',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontSize: '16px',
                    textAlign: 'center',
                    display: 'inline-block',
                    margin: '0'
                  }}
                >
                  {t("services.sortByAlphabet")}
                </button>
                <button
                  onClick={() => {
                    setViewMode('category');
                    setSelectedCategory('Local Contractors'); // Show Local Contractors by default
                    setShowSubCategories(false); // Show all local contractors without subcategory filter
                  }}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '8px',
                    background: viewMode === 'category' ? '#90be55' : '#f0f0f0',
                    color: viewMode === 'category' ? 'white' : '#333',
                    border: 'none',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontSize: '16px',
                    textAlign: 'center',
                    display: 'inline-block',
                    margin: '0'
                  }}
                >
                  {t("services.sortByCategory")}
                </button>
              </div>
              
              {/* Category Filter Row - Only show when in category mode - MOVED HERE */}
              {viewMode === 'category' && (
                <div  className="category-filter-container" style={{ 
                  margin: '10px auto 10px auto', 
                  width: '100%', 
                  maxWidth: '1200px',
                  padding: '0 20px',
                  display: 'flex',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center'
                }}>
                  <div className="category-scroll-wrapper" style={{
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    whiteSpace: 'nowrap',
                    maxWidth: '100%',
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#90be55 #f0f0f0',
                    WebkitOverflowScrolling: 'touch',
                    padding: '10px 0',
                    textAlign: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%'
                  }}>
                    <div className="category-list" style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontSize: 'clamp(14px, 3vw, 24px)',
                      fontWeight: '500',
                      width: '100%',
                      textAlign: 'center',
                      minHeight: '44px',
                      flexWrap: 'wrap',
                      margin: '0 auto',
                      padding: '0'
                    }}>
                      {categories.map((category, idx) => (
                        <span id="" className="category-item"
                          key={category}
                          onClick={() => {
                            setSelectedCategory(category);
                            setShowSubCategories(false); // Never show subcategories, show all local contractors
                          }}
                          style={{
                            cursor: 'pointer',
                            fontWeight: selectedCategory === category ? 700 : 400,
                            color: selectedCategory === category ? '#90be55' : '#222',
                            textDecoration: selectedCategory === category ? 'underline' : 'none',
                            fontSize: 'clamp(14px, 3vw, 24px)',
                            transition: 'all 0.2s ease',
                            padding: '4px 12px',
                            borderRadius: '4px',
                            whiteSpace: 'nowrap',
                            minWidth: 'fit-content',
                            width: 'auto',
                            textAlign: 'center'
                          }}
                        >
                          {t(`services.categories.${category.toLowerCase().replace(/\s+/g, '')}`)}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* No subcategory display - show all local contractors mixed together */}
                </div>
              )}
              
              {/* Directory A-Z Filter Row - Only show when in alphabetical mode */}
              {viewMode === 'alphabetical' && (
                <div id="uppa" style={{ padding: '0 20px' }}>
                <div id="ppa">
              <div id="parenta" ref={alphabetRef} style={{ 
                fontSize: 'clamp(20px, 6vw, 32px)', 
                margin: '8px auto', 
                textAlign: 'center', 
                whiteSpace: 'nowrap', 
                overflowX: 'auto', 
                width: '100%',
                maxWidth: '1200px',
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'thin'
              }}>
                {alphabet.map((letter, idx) => (
                  <span id="iparent" key={letter}>
                    <span
                      onClick={() => {
                        setSelectedLetter(letter);
                      }}
                      style={{
                        cursor: 'pointer',
                        fontWeight: selectedLetter === letter ? 700 : 400,
                        color: selectedLetter === letter ? '#90be55' : '#222',
                        textDecoration: selectedLetter === letter ? 'underline' : 'none',
                        fontSize: selectedLetter === letter ? 40 : 32,
                        transition: 'all 0.2s',
                      }}
                    >
                      {letter}
                    </span>
                    {idx < alphabet.length - 1 && <span>, </span>}
                  </span>
                ))}
              </div>
              </div>
              </div>
              )}
              
              {/* Location indicator for alphabetical view when Local Contractors are filtered - REMOVED */}

              {/* Directory Table */}
  


              <div id="kjk1" ref={tableRef} style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                width: '100%',
                padding: '0 20px',
                marginTop: '10px', position: 'relative', top: selectedCategory === 'Broker' ? '-900px' : '0px'
              }}>
              {filteredListings.length > 0 ? (
                <div className="table-responsive-container" style={{ 
                  maxWidth: '1200px', 
                  width: '100%',
                  margin: '0 auto', 
                  background: '#fff', 
                  borderRadius: 'clamp(16px, 3vw, 24px)', 
                  boxShadow: '0 6px 32px rgba(0,0,0,0.10)', 
                  padding: 0, 
                  marginTop: 0,
                  overflow: 'visible'
                }}>
                  <div className="table-wrapper" style={{ 
                    width: '100%',
                    overflowX: 'auto',
                    overflowY: 'visible',
                    WebkitOverflowScrolling: 'touch',
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#ccc transparent'
                  }}>
                    <table className="responsive-table" style={{ 
                      width: '100%', 
                      minWidth: '1000px',
                      maxWidth: '100%',
                      borderCollapse: 'separate', 
                      borderSpacing: 0, 
                      fontSize: '14px',
                      margin: '0 auto',
                      tableLayout: 'auto'
                    }}>
                                              <thead>
                          <tr style={{ background: '#f7f7f7', fontWeight: 800 }}>
                            <th style={{ 
                              padding: '12px 8px', 
                              border: 'none', 
                              textAlign: 'center', 
                              letterSpacing: 1, 
                              fontSize: '14px',
                              width: '120px',
                              minWidth: '120px',
                              verticalAlign: 'middle'
                            }}>IMAGE</th>
                            <th style={{ 
                              padding: '12px 8px', 
                              border: 'none', 
                              textAlign: 'center', 
                              letterSpacing: 1, 
                              fontSize: '14px',
                              width: '200px',
                              minWidth: '200px',
                              verticalAlign: 'middle'
                            }}>COMPANY</th>
                          <th style={{ 
                            padding: '12px 8px', 
                            border: 'none', 
                            textAlign: 'center', 
                            letterSpacing: 1, 
                            fontSize: '14px',
                            width: '150px',
                            minWidth: '150px',
                            verticalAlign: 'middle'
                          }}>SOCIAL LINK</th>
                          <th style={{ 
                            padding: '12px 8px', 
                            border: 'none', 
                            textAlign: 'center', 
                            letterSpacing: 1, 
                            fontSize: '14px',
                            width: '180px',
                            minWidth: '180px',
                            verticalAlign: 'middle'
                          }}>EMAIL</th>
                          <th style={{ 
                            padding: '12px 8px', 
                            border: 'none', 
                            textAlign: 'center', 
                            letterSpacing: 1, 
                            fontSize: '14px',
                            width: '140px',
                            minWidth: '140px',
                            verticalAlign: 'middle'
                          }}>PHONE NUMBER</th>
                          <th style={{ 
                            padding: '12px 8px', 
                            border: 'none', 
                            textAlign: 'center', 
                            letterSpacing: 1, 
                            fontSize: '14px',
                            width: '130px',
                            minWidth: '130px',
                            verticalAlign: 'middle'
                          }}>CATEGORY</th>
                        </tr>
                      </thead>
                      <tbody>

                        {filteredListings.length === 0 && (
                          <tr>
                            <td colSpan={6} style={{ textAlign: 'center', color: '#888' }}>
                              {viewMode === 'category' 
                                ? (selectedCategory ? `No listings for category "${selectedCategory}".` : 'No listings in the directory yet.')
                                : `No listings for letter "${selectedLetter}".`
                              }
                            </td>
                          </tr>
                        )}
                        {filteredListings.map((l, i) => {
                          // Determine package: use listing.package, but if current user matches and has upgraded, use user.package
                          let effectivePackage = l.package;
                          if (user && user.email === l.email && user.package && user.package !== l.package) {
                            effectivePackage = user.package;
                          }
                          
                          // Base style for all entries
                          let style = { 
                            textAlign: 'center', 
                            background: i % 2 === 0 ? '#fff' : '#fafbfc',
                            color: '#000000' // All text is black
                          };
                          
                          // Free members: Normal text
                          if (!effectivePackage || effectivePackage === 'free') {
                            style = { 
                              ...style, 
                              fontWeight: 400, 
                              fontSize: '14px' 
                            };
                          }
                          
                          // Pro members: Bold text, slightly bigger font
                          if (effectivePackage === 'pro') {
                            style = { 
                              ...style, 
                              fontWeight: 700, 
                              fontSize: '14px' 
                            };
                          }
                          
                          // Premium members: Same as Pro + images (handled separately)
                          if (effectivePackage === 'premium') {
                            style = { 
                              ...style, 
                              fontWeight: 700, 
                              fontSize: '14px' 
                            };
                          }
                          return (
                            <tr key={i}>
                              {/* Image column - shows image only for premium users based on USER column data */}
                              <td style={{ 
                                ...style, 
                                padding: '12px 8px', 
                                border: 'none',
                                textAlign: 'center',
                                verticalAlign: 'middle',
                                width: '120px',
                                minWidth: '120px'
                              }}>
                                {l.package === 'premium' && l.imageUrl ? (
                                  <img 
                                    src={l.imageUrl} 
                                    alt={l.company} 
                                    style={{ 
                                      width: '60px', 
                                      height: '60px', 
                                      objectFit: 'cover', 
                                      borderRadius: '8px',
                                      border: '2px solid #000000',
                                      display: 'block',
                                      margin: '0 auto'
                                    }}
                                    onError={(e) => {
                                      console.error('Image failed to load:', l.imageUrl, e);
                                    }}
                                    onLoad={() => {
                                      console.log('Image loaded successfully:', l.imageUrl);
                                    }}
                                  />
                                ) : (
                                  <span style={{ fontSize: '12px', color: '#888' }}>
                                    {l.package === 'premium' ? 'Premium' : (l.package === 'pro' ? 'Pro' : 'Free')}
                                  </span>
                                )}
                              </td>
                              
                              <td style={{ 
                                ...style, 
                                padding: '12px 8px', 
                                border: 'none', 
                                wordBreak: 'break-word',
                                textAlign: 'center',
                                verticalAlign: 'middle',
                                wordWrap: 'break-word',
                                whiteSpace: 'normal',
                                width: '200px',
                                minWidth: '200px'
                              }}>{l.company}</td>
                              
                              <td style={{ 
                                ...style, 
                                padding: '12px 8px', 
                                border: 'none',
                                textAlign: 'center',
                                verticalAlign: 'middle',
                                width: '150px',
                                minWidth: '150px'
                              }}>
                                {l.socialType && l.socialLink ? (
                                  <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: '100%'
                                  }}>
                                    <a href={l.socialLink} target="_blank" rel="noopener noreferrer" style={{
                                      textDecoration: 'none'
                                    }}>
                                      <button id="tb" style={{ 
                                        padding: '4px 6px', 
                                        borderRadius: '4px', 
                                        background: 'transparent', 
                                        color: style.color, 
                                        border: `1px solid ${style.color}`, 
                                        fontWeight: (l.package === 'pro' || l.package === 'premium') ? 'bold' : '500', 
                                        fontSize: 'clamp(8px, 2vw, 10px)', 
                                        cursor: 'pointer', 
                                        textTransform: 'capitalize',
                                        opacity: 1,
                                        height: '26px',
                                        minWidth: '50px',
                                        width: 'auto',
                                        maxWidth: '80px',
                                        display: 'block',
                                        lineHeight: '1.2',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        marginRight: '8px',
                                        boxSizing: 'border-box'
                                      }}>{l.socialType}</button>
                                    </a>
                                  </div>
                                ) : ''}
                              </td>
                              <td style={{ 
                                ...style, 
                                padding: '12px 8px', 
                                border: 'none', 
                                wordBreak: 'break-all',
                                textAlign: 'center',
                                verticalAlign: 'middle',
                                wordWrap: 'break-word',
                                whiteSpace: 'normal',
                                width: '180px',
                                minWidth: '180px'
                              }}>{l.email}</td>
                              <td style={{ 
                                ...style, 
                                padding: '12px 8px', 
                                border: 'none', 
                                wordBreak: 'break-word',
                                textAlign: 'center',
                                verticalAlign: 'middle',
                                wordWrap: 'break-word',
                                whiteSpace: 'normal',
                                width: '140px',
                                minWidth: '140px'
                              }}>{l.phone}</td>
                              <td style={{ 
                                ...style, 
                                padding: '12px 8px', 
                                border: 'none', 
                                wordBreak: 'break-word',
                                textAlign: 'center',
                                verticalAlign: 'middle',
                                wordWrap: 'break-word',
                                whiteSpace: 'normal',
                                width: '130px',
                                minWidth: '130px'
                              }}>{l.contractorType || l.industry}</td>

                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : directoryListings.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#aaa', fontSize: 18, marginTop: 40 }}>No companies in the directory yet.</div>
              ) : null}
            </div>
            </div>
          </div>

          {/* Service Images Section */}
          {serviceImages.length > 0 && (
            <div style={{
              padding: '60px 20px',
              background: '#f8f9fa',
              marginTop: '40px'
            }}>
              <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                textAlign: 'center'
              }}>
                <h2 style={{
                  fontSize: 'clamp(28px, 4vw, 36px)',
                  fontWeight: '700',
                  color: '#333',
                  marginBottom: '40px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  Service <span style={{ color: '#90be55' }}>Gallery</span>
                </h2>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '20px',
                  alignItems: 'start'
                }}>
                  {serviceImages.map((image, index) => (
                    <div
                      key={image._id}
                      style={{
                        background: '#fff',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        transition: 'all 0.3s ease',
                        transform: 'translateY(0)',
                        animation: `fadeInUp 0.6s ease forwards ${index * 0.1}s`,
                        opacity: 0
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
                      }}
                    >
                      <img
                        src={image.imageUrl}
                        alt="Service"
                        style={{
                          width: '100%',
                          height: '200px',
                          objectFit: 'cover',
                          transition: 'transform 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'scale(1)';
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Featured Listings Section */}
          {featuredListings.length > 0 && (
            <div style={{
              padding: '40px 20px',
              background: '#ffffff',
              marginTop: '30px'
            }}>
              <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                textAlign: 'center'
              }}>
                <h2 style={{
                  fontSize: 'clamp(24px, 3.5vw, 30px)',
                  fontWeight: '700',
                  color: '#333',
                  marginBottom: '30px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  {t("services.featuredListings").split(' ').map((word, index, array) => (
                    index === array.length - 1 ? 
                      <span key={index} style={{ color: '#90be55' }}>{word}</span> : 
                      <span key={index}>{word} </span>
                  ))}
                </h2>
                
                <div style={{
                  display: 'flex',
                  gap: '20px',
                  overflowX: 'auto',
                  paddingBottom: '10px',
                  scrollbarWidth: 'thin',
                  WebkitOverflowScrolling: 'touch',
                  justifyContent: 'center'
                }}>
                  {featuredListings.map((listing, index) => (
                    <div
                      key={listing._id}
                      style={{
                        background: '#fff',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        transition: 'all 0.3s ease',
                        transform: 'translateY(0)',
                        animation: `fadeInUp 0.6s ease forwards ${index * 0.05}s`,
                        opacity: 0,
                        border: '2px solid #f0f0f0',
                        minWidth: '300px',
                        maxWidth: '300px',
                        flexShrink: 0
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-8px)';
                        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.2)';
                        e.currentTarget.style.borderColor = '#90be55';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
                        e.currentTarget.style.borderColor = '#f0f0f0';
                      }}
                    >
                      <img
                        src={listing.imageUrl}
                        alt="Featured Listing"
                        style={{
                          width: '100%',
                          height: '180px',
                          objectFit: 'cover',
                          transition: 'transform 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'scale(1)';
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <style jsx>{`
            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translateY(30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            
            /* Custom scrollbar for featured listings */
            div::-webkit-scrollbar {
              height: 8px;
            }
            
            div::-webkit-scrollbar-track {
              background: #f1f1f1;
              border-radius: 4px;
            }
            
            div::-webkit-scrollbar-thumb {
              background: #90be55;
              border-radius: 4px;
            }
            
            div::-webkit-scrollbar-thumb:hover {
              background: #7ba848;
            }
          `}</style>

          <div id="des" ref={descriptionRef}>
            <div id="innerdes">
              <p>{t("services.description")}</p>
            </div>
          </div>

          {/* Course Cards Section - Anchor for Corporate Training Courses navigation */}
          <div id="utotalscard" ref={serviceCardsRef} style={{ position: 'relative' }}>
            {/* Anchor div for navbar navigation - ensures course cards appear from start */}
            <div id="fcourse-anchor" style={{ position: 'absolute', top: '-100px', visibility: 'hidden', height: '0', width: '0' }}></div>
            <div id="totalscard">
              {[1, 2, 3, 4].map((_, i) => (
                <div id="scard" key={i}>
                  <img src={`./s${i+1}.png`} />
                  <h1>{t(`services.cards.${i}.title`)}</h1>
                  <p>{t(`services.cards.${i}.desc`)}</p>
                  <div id="innerh1s">
                    <h1>{t("services.professor")}</h1>
                    <p>Marie Curie</p>
                  </div>
                  <div id="innerh1ss">
                    <h1>{t("services.commencing")}</h1>
                    <p>01/01/2024</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div id="ubottomtexter">
            <div id="bottomtexter">
              <p>{t("services.trainingSummary")}</p>
            </div>
          </div>

          <div id="bottomone" ref={bottomCardsRef}>
            <div id="bcard1">
              <h1>{t("services.course1.title")}</h1>
              <p>{t("services.course1.line1")}</p>
              <p>{t("services.course1.line2")}</p>
              <p>{t("services.course1.line3")}</p>
              <p>{t("services.course1.line4")}</p>
              <h1>⭐ 4.3 ★★★★★ (990 students)</h1>
              <p>{t("services.createdBy")}</p>
            </div>
            <div id="bcard11">
              <h1>{t("services.course2.title")}</h1>
              <p>{t("services.course2.desc")}</p>
              <h1>⭐ 4.4 ★★★★★ (4,576 students)</h1>
              <p>{t("services.createdBy")}</p>
            </div>
          </div>
        </div>
        <Footer2 />
      </div>
    </>
  );
};

export default Services;
