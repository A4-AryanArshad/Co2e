import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import "./Plan.css";
import Header from '../Home/Header';
import Footer2 from '../Home/Footer2';
import { useNavigate } from 'react-router-dom';
import { IoBulbOutline, IoRibbonOutline, IoAirplaneOutline } from 'react-icons/io5';
import { API_BASE } from '../config';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const Plan = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const [loading, setLoading] = useState(null); // Track which button is loading
  const [currentPackage, setCurrentPackage] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' }); // For success/error messages

  // Refs for animations
  const messageRef = useRef(null);
  const cardsRef = useRef(null);
  const perksRef = useRef(null);
  const blockchainRef = useRef(null);
  const investmentRef = useRef(null);
  const commitmentRef = useRef(null);

  // Fetch user's current package
  useEffect(() => {
    if (isLoggedIn) {
      fetch(`${API_BASE}/api/me`, {
        credentials: 'include'
      })
      .then(res => res.json())
      .then(data => {
        const packageName = (data.package || '').toLowerCase().replace(' plan', '').trim();
        // If user doesn't have a pro or premium plan, set current package to 'free'
        if (packageName === 'pro' || packageName === 'premium') {
          setCurrentPackage(packageName);
        } else {
          setCurrentPackage('free');
        }
      })
      .catch(() => {
        setCurrentPackage('free');
      });
    } else {
      setCurrentPackage('');
    }
  }, [isLoggedIn]);

  useEffect(() => {
    // Initialize animations
    initializeAnimations();
  }, [currentPackage, message]);

  const initializeAnimations = () => {

    // Message animation
    if (messageRef.current && message.text) {
      gsap.fromTo(messageRef.current,
        { opacity: 0, scale: 0.8, y: -20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(1.7)" }
      );
    }

    // Cards animation
    if (cardsRef.current) {
      const cards = cardsRef.current.querySelectorAll('#Cards1, #Cards, #Cards3');
      gsap.fromTo(cards,
        { opacity: 0, y: 50, scale: 0.9 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    // Perks section animation
    if (perksRef.current) {
      gsap.fromTo(perksRef.current,
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: perksRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    // Blockchain section animation
    if (blockchainRef.current) {
      const elements = blockchainRef.current.querySelectorAll('div, img');
      gsap.fromTo(elements,
        { opacity: 0, x: -50 },
        { 
          opacity: 1, 
          x: 0, 
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: blockchainRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    // Investment section animation
    if (investmentRef.current) {
      const elements = investmentRef.current.querySelectorAll('div, img');
      gsap.fromTo(elements,
        { opacity: 0, x: 50 },
        { 
          opacity: 1, 
          x: 0, 
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: investmentRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    // Commitment section animation
    if (commitmentRef.current) {
      const elements = commitmentRef.current.querySelectorAll('div, img');
      gsap.fromTo(elements,
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: commitmentRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }
  };

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  const handleBuyNow = async (item) => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    // Don't allow purchasing the same package
    if (currentPackage === item.id) {
      showMessage('You already have this package!', 'error');
      return;
    }

    // Handle free plan differently
    if (item.id === 'free') {
      // For free plan, just update the user's package directly
      try {
        const response = await fetch(`${API_BASE}/api/stripe-success`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ packageName: item.name })
        });
        
        if (response.ok) {
          localStorage.setItem('package', 'free');
          showMessage('Free plan activated successfully!');
          navigate('/');
        } else {
          showMessage('Failed to activate free plan. Please try again.', 'error');
        }
      } catch (error) {
        console.error('Error activating free plan:', error);
        showMessage('Error activating free plan. Please try again.', 'error');
      }
      return;
    }

    // For paid plans, proceed with Stripe checkout
    setLoading(item.id);
    try {
      const response = await fetch(`${API_BASE}/api/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          cart: [{ 
            name: item.name, 
            price: item.price, 
            quantity: 1 
          }] 
        })
      });

      const data = await response.json();
      
      if (data.url) {
        localStorage.setItem('purchasedPackage', item.name);
        window.location.href = data.url;
      } else {
        showMessage('Failed to start checkout. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      showMessage('Error connecting to payment gateway. Please try again.', 'error');
    } finally {
      setLoading(null);
    }
  };

  const getCardStyle = (planId) => {
    if (currentPackage === planId) {
      return {
        border: '3px solid #90be55',
        boxShadow: '0 0 20px rgba(144, 190, 85, 0.3)',
        position: 'relative'
      };
    }
    return {};
  };

  const getButtonStyle = (planId) => {
    if (currentPackage === planId) {
      return {
        background: '#90be55',
        color: 'white',
        cursor: 'not-allowed',
        opacity: 0.8
      };
    }
    return {};
  };

  const getButtonText = (planId) => {
    if (currentPackage === planId) {
      return 'Current Package';
    }
    if (planId === 'free') {
      return loading === 'free' ? 'Activating...' : 'Get Started';
    }
    return loading === planId ? 'Redirecting...' : t("plan.buy_now");
  };

  return (
    <>
      <div id="cover">
        <div id="uuq">
          <div id="hederArea">
            <Header />
          </div>

          <div id="innerPlan">
            <div id="innerheading">
              <h1>{t("plan.choose_membership_title")}</h1>
            </div>

            {/* Message Display */}
            {message.text && (
              <div ref={messageRef} style={{
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

            <div id="totalCards" ref={cardsRef}>
              {/* INDIVIDUAL PLAN */}
              <div id="Cards1" style={getCardStyle('free')}>
                {currentPackage === 'free' && (
                  <div style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '-10px',
                    background: '#90be55',
                    color: 'white',
                    padding: '5px 10px',
                    borderRadius: '15px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    zIndex: 10
                  }}>
                    {t("plan.current")}
                  </div>
                )}
                <div id="inCard">
                  <h3>🟢 1. {t("plan.free_plan")}</h3>
                  <h1>{t("plan.free")}</h1>
                  <p>→ {t("plan.free_desc")}</p>
                  <div id="Listing">
                    <p>✅ {t("plan.free_listed_directory")}</p>
                    <p>❌ {t("plan.free_no_courses")}</p>
                    <p>❌ {t("plan.free_no_discounts")}</p>
                    <p>❌ {t("plan.free_no_featured")}</p>
                  </div>
                  <button 
                    onClick={() => handleBuyNow({id: 'free', name: 'Free Plan', price: 0})}
                    disabled={loading === 'free' || currentPackage === 'free'}
                    style={{ 
                      opacity: loading === 'free' ? 0.7 : 1,
                      ...getButtonStyle('free')
                    }}
                  >
                    {loading === 'free' ? t("plan.activating") : t("plan.start_free")}
                  </button>
                </div>
              </div>

              {/* PROFESSIONAL PLAN */}
              <div id="Cards" style={getCardStyle('pro')}>
                {currentPackage === 'pro' && (
                  <div style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '-10px',
                    background: '#90be55',
                    color: 'white',
                    padding: '5px 10px',
                    borderRadius: '15px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    zIndex: 10
                  }}>
                    {t("plan.current")}
                  </div>
                )}
                <div id="inCard">
                  <h3>🔵 2. {t("plan.pro_plan")}</h3>
                  <h1>C$29.99 / {t("plan.month")}</h1>
                  <p>→ {t("plan.pro_desc")}</p>
                  <div id="Listing">
                    <p>✅ {t("plan.pro_listed_directory")}</p>
                    <p style={{ marginLeft: '20px' }}>• {t("plan.pro_bold_text")}</p>
                    <p style={{ marginLeft: '20px' }}>• {t("plan.pro_color")}</p>
                    <p style={{ marginLeft: '20px' }}>• {t("plan.pro_larger_font")}</p>
                    <p>✅ {t("plan.pro_access_courses")}</p>
                    <p>❌ {t("plan.pro_no_discounts")}</p>
                    <p>❌ {t("plan.pro_no_featured")}</p>
                  </div>
                  <button 
                    onClick={() => handleBuyNow({id: 'pro', name: 'Pro Plan', price: 29.99})}
                    disabled={loading === 'pro' || currentPackage === 'pro'}
                    style={{ 
                      opacity: loading === 'pro' ? 0.7 : 1,
                      ...getButtonStyle('pro')
                    }}
                  >
                    {loading === 'pro' ? t("plan.redirecting") : t("plan.upgrade_now")}
                  </button>
                </div>
              </div>

              {/* PREMIUM PLAN */}
              <div id="Cards3" style={getCardStyle('premium')}>
                {currentPackage === 'premium' && (
                  <div style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '-10px',
                    background: '#90be55',
                    color: 'white',
                    padding: '5px 10px',
                    borderRadius: '15px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    zIndex: 10
                  }}>
                    {t("plan.current")}
                  </div>
                )}
                <div id="inCard">
                  <h3>🟣 3. {t("plan.premium_plan")}</h3>
                  <h1>C$49.99 / {t("plan.month")}</h1>
                  <p>→ {t("plan.premium_desc")}</p>
                  <div id="Listing">
                    <p>✅ {t("plan.premium_all_pro_features")}</p>
                    <p>✅ {t("plan.premium_featured_homepage")}</p>
                    <p>✅ {t("plan.premium_discounts_courses")}</p>
                    <p>✅ {t("plan.premium_access_courses")}</p>
                    <p>✅ {t("plan.premium_listed_directory")}</p>
                    <p style={{ marginLeft: '20px' }}>• {t("plan.pro_bold_text")}</p>
                    <p style={{ marginLeft: '20px' }}>• {t("plan.pro_color")}</p>
                    <p style={{ marginLeft: '20px' }}>• {t("plan.pro_larger_font")}</p>
                  </div>
                  <button 
                    onClick={() => handleBuyNow({id: 'premium', name: 'Premium Plan', price: 49.99})}
                    disabled={loading === 'premium' || currentPackage === 'premium'}
                    style={{ 
                      opacity: loading === 'premium' ? 0.7 : 1,
                      ...getButtonStyle('premium')
                    }}
                  >
                    {loading === 'premium' ? t("plan.redirecting") : t("plan.go_premium")}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div id="Perks" ref={perksRef}>
            <h1>{t("plan.membership_perks")}</h1>
            <p>{t("plan.perk1")}</p>
            <p>{t("plan.perk2")}</p>
          </div>

          <div id="iio" ref={blockchainRef}>
            <div id="Blockchain">
              <h1>{t("plan.blockchain_title")}</h1>
              <p>{t("plan.blockchain_text")}</p>
            </div>
            <img id="imager" src="https://static.vecteezy.com/system/resources/previews/055/135/329/non_2x/3d-gold-coin-stacks-with-a-rising-arrow-representing-business-growth-investment-success-and-positive-financial-trends-free-png.png" />
          </div>

          <div id="yyy" ref={investmentRef}>
            <img id="imager2" src="https://www.tunley-environmental.com/hs-fs/hubfs/Website%20Sized%20Images/Graphics/Embodied%20Carbon%20Assessment-03.png?width=500&height=439&name=Embodied%20Carbon%20Assessment-03.png" />
            <div id="Blockchain2">
              <h1>{t("plan.investment_hub_title")}</h1>
              <p>{t("plan.investment_hub_text")}</p>
            </div>
          </div>

          <div id="Laster" ref={commitmentRef}>
            <div id="Blockchain3">
              <h1>{t("plan.commitment_title")}</h1>
              <p>{t("plan.commitment_text")}</p>
            </div>
            <img id="lasterimg" src="https://static.vecteezy.com/system/resources/thumbnails/040/735/326/small/ai-generated-silhouette-two-hand-holding-soil-with-growing-sprout-black-color-only-png.png" />
          </div>
        </div>

        <Footer2 />
      </div>
    </>
  );
};

export default Plan;
